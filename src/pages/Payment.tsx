import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUpdatePaymentStatus, Booking } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Smartphone, 
  Loader2, 
  CheckCircle, 
  Ticket,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";

type PaymentMethod = "debit" | "credit" | "upi";

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const updatePayment = useUpdatePaymentStatus();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("debit");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI form state
  const [upiId, setUpiId] = useState("");

  // Fetch booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          showtime:showtimes(
            *,
            movie:movies(id, title, poster, duration_minutes, genres),
            theater:theaters(id, name, location, city)
          )
        `)
        .eq("id", bookingId)
        .single();

      if (error) throw error;
      return data as Booking & {
        showtime: Booking["showtime"] & {
          movie: { duration_minutes: number; genres: string[] };
          theater: { city: string };
        };
      };
    },
    enabled: !!bookingId && !!user,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ").slice(0, 19) : "";
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    // Basic validation
    if (paymentMethod === "debit" || paymentMethod === "credit") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return;
      }
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId || !upiId.includes("@")) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., name@upi)",
          variant: "destructive",
        });
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      await updatePayment.mutateAsync({
        bookingId: bookingId!,
        status: "paid",
      });

      setProcessing(false);
      setPaymentSuccess(true);

      toast({
        title: "✅ Payment Successful!",
        description: "Your booking has been confirmed. Enjoy your movie!",
      });
    } catch (error) {
      setProcessing(false);
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Booking not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-8">
                Your booking has been confirmed. Check your email for the ticket details.
              </p>

              {/* Booking Receipt */}
              <div className="bg-secondary/50 rounded-lg p-6 text-left mb-8">
                <h2 className="font-semibold text-lg mb-4 text-center">Booking Receipt</h2>
                <div className="flex gap-4">
                  <img
                    src={booking.showtime?.movie?.poster}
                    alt={booking.showtime?.movie?.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-lg">{booking.showtime?.movie?.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.showtime?.theater?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {booking.showtime?.show_date && 
                          format(new Date(booking.showtime.show_date), "EEE, MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{booking.showtime?.show_time?.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ticket className="w-4 h-4" />
                      <span>Seats: {booking.seat_numbers?.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Paid</span>
                  <span className="text-xl font-bold text-primary">₹{booking.total_amount}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Booking ID: {booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/my-bookings")}>
                  View My Bookings
                </Button>
                <Button onClick={() => navigate("/")}>
                  Book Another Movie
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Complete Payment</h1>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Debit Card</p>
                        <p className="text-sm text-muted-foreground">Pay using your debit card</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex accepted</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-muted-foreground">GPay, PhonePe, Paytm, etc.</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {paymentMethod === "upi" ? "Enter UPI Details" : "Enter Card Details"}
                </CardTitle>
                <CardDescription>
                  {paymentMethod === "upi" 
                    ? "Enter your UPI ID to complete payment"
                    : "Your card information is secure and encrypted"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(paymentMethod === "debit" || paymentMethod === "credit") && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You will receive a payment request on your UPI app
                    </p>
                  </div>
                )}

                <Button
                  className="w-full mt-6 gap-2"
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay ₹{booking.total_amount}
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  This is a mock payment. No real transaction will occur.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={booking.showtime?.movie?.poster}
                    alt={booking.showtime?.movie?.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{booking.showtime?.movie?.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.showtime?.theater?.name}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>
                      {booking.showtime?.show_date && 
                        format(new Date(booking.showtime.show_date), "EEE, MMM d")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{booking.showtime?.show_time?.slice(0, 5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span>{booking.seat_numbers?.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tickets</span>
                    <span>{booking.seats} × ₹{booking.showtime?.price}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{booking.total_amount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;

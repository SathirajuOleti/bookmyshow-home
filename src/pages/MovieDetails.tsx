import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovie } from "@/hooks/useMovies";
import { useShowtimes, Showtime } from "@/hooks/useShowtimes";
import { useCreateBooking, useUpdatePaymentStatus } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Star, Clock, Calendar, MapPin, Ticket, Loader2, CreditCard, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: movie, isLoading: movieLoading } = useMovie(id || "");
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(id || "");
  const createBooking = useCreateBooking();
  const updatePayment = useUpdatePaymentStatus();

  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState(1);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Group showtimes by date
  const showtimesByDate = showtimes?.reduce((acc, showtime) => {
    const date = showtime.show_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>) || {};

  const handleSelectShowtime = (showtime: Showtime) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book tickets",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setSelectedShowtime(showtime);
    setSeats(1);
    setBookingDialogOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedShowtime) return;

    const totalAmount = selectedShowtime.price * seats;

    try {
      const booking = await createBooking.mutateAsync({
        showtimeId: selectedShowtime.id,
        seats,
        totalAmount,
      });

      setCurrentBookingId(booking.id);
      setBookingDialogOpen(false);
      setPaymentDialogOpen(true);

      // Mock email notification - show toast
      toast({
        title: "📧 Booking Confirmed!",
        description: `Email notification sent for ${movie?.title} - ${seats} ticket(s)`,
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleMockPayment = async () => {
    if (!currentBookingId) return;

    setPaymentProcessing(true);

    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await updatePayment.mutateAsync({
        bookingId: currentBookingId,
        status: "paid",
      });

      setPaymentProcessing(false);
      setPaymentDialogOpen(false);

      // Mock payment confirmation notification
      toast({
        title: "✅ Payment Successful!",
        description: "Your booking has been confirmed. Enjoy your movie!",
      });

      navigate("/my-bookings");
    } catch (error) {
      setPaymentProcessing(false);
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </section>

      {/* Movie Info */}
      <main className="container mx-auto px-4 -mt-40 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-6 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="text-foreground font-semibold">{movie.rating}/10</span>
                <span className="text-sm">({movie.votes} votes)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{movie.duration_minutes} mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{movie.release_date ? format(new Date(movie.release_date), "MMM d, yyyy") : "TBA"}</span>
              </div>
              <span className="px-2 py-1 bg-secondary text-foreground text-sm rounded">
                {movie.language}
              </span>
            </div>

            {movie.description && (
              <p className="text-muted-foreground mb-8 max-w-2xl">{movie.description}</p>
            )}

            {movie.status === "now_showing" && (
              <Button size="lg" className="gap-2" onClick={() => document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth" })}>
                <Ticket className="w-5 h-5" />
                Book Tickets
              </Button>
            )}

            {movie.status === "coming_soon" && (
              <Button size="lg" variant="secondary" disabled>
                Coming Soon
              </Button>
            )}
          </div>
        </div>

        {/* Showtimes Section */}
        {movie.status === "now_showing" && (
          <section id="showtimes" className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Select Showtime</h2>

            {showtimesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : Object.keys(showtimesByDate).length === 0 ? (
              <Card className="bg-secondary/50">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No showtimes available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(showtimesByDate).map(([date, shows]) => (
                  <Card key={date} className="bg-card border-border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {format(new Date(date), "EEEE, MMMM d, yyyy")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Group by theater */}
                      {Object.entries(
                        shows.reduce((acc, show) => {
                          const theaterId = show.theater?.id || "unknown";
                          if (!acc[theaterId]) acc[theaterId] = { theater: show.theater, shows: [] };
                          acc[theaterId].shows.push(show);
                          return acc;
                        }, {} as Record<string, { theater: Showtime["theater"]; shows: Showtime[] }>)
                      ).map(([theaterId, { theater, shows: theaterShows }]) => (
                        <div key={theaterId} className="mb-4 last:mb-0">
                          <div className="flex items-start gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-primary mt-1" />
                            <div>
                              <p className="font-medium text-foreground">{theater?.name || "Unknown Theater"}</p>
                              <p className="text-sm text-muted-foreground">{theater?.location}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-6">
                            {theaterShows.map((show) => (
                              <Button
                                key={show.id}
                                variant="outline"
                                size="sm"
                                disabled={show.available_seats === 0}
                                onClick={() => handleSelectShowtime(show)}
                                className="min-w-[80px]"
                              >
                                <div className="text-center">
                                  <p className="font-medium">{show.show_time.slice(0, 5)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ₹{show.price} • {show.available_seats} left
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Tickets</DialogTitle>
            <DialogDescription>
              {movie.title} at {selectedShowtime?.theater?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium">
                {selectedShowtime && format(new Date(selectedShowtime.show_date), "MMM d")} at {selectedShowtime?.show_time.slice(0, 5)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price per ticket</span>
              <span className="font-medium">₹{selectedShowtime?.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Number of seats</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center font-medium">{seats}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.min(selectedShowtime?.available_seats || 10, seats + 1))}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-primary">
                ₹{(selectedShowtime?.price || 0) * seats}
              </span>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleBooking}
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Ticket className="w-4 h-4" />
              )}
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Mock payment for your booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!paymentProcessing ? (
              <>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Amount to pay</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{(selectedShowtime?.price || 0) * seats}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  This is a mock payment. Click below to simulate a successful payment.
                </p>
                <Button className="w-full gap-2" onClick={handleMockPayment}>
                  <CreditCard className="w-4 h-4" />
                  Pay Now (Mock)
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Processing payment...</p>
                <p className="text-sm text-muted-foreground">Please wait</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MovieDetails;

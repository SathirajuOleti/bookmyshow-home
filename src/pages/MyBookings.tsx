import { useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Ticket, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading } = useBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Bookings</h1>

        {bookings?.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring movies and book your first tickets!
              </p>
              <Button onClick={() => navigate("/")}>Browse Movies</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings?.map((booking) => (
              <Card key={booking.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Movie Poster */}
                    <div className="sm:w-32 h-48 sm:h-auto flex-shrink-0">
                      <img
                        src={booking.showtime?.movie?.poster || "/placeholder.svg"}
                        alt={booking.showtime?.movie?.title || "Movie"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          {booking.showtime?.movie?.title || "Unknown Movie"}
                        </h3>
                        <div className="flex gap-2">
                          <Badge
                            variant={booking.payment_status === "paid" ? "default" : "secondary"}
                            className={booking.payment_status === "paid" ? "bg-green-600" : ""}
                          >
                            {booking.payment_status}
                          </Badge>
                          <Badge variant="outline">{booking.booking_status}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {booking.showtime?.show_date
                              ? format(new Date(booking.showtime.show_date), "EEE, MMM d, yyyy")
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{booking.showtime?.show_time?.slice(0, 5) || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.showtime?.theater?.name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Ticket className="w-4 h-4" />
                          <span>{booking.seats} ticket(s)</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-primary">₹{booking.total_amount}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Booked on {format(new Date(booking.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;

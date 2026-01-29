import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovie } from "@/hooks/useMovies";
import { useShowtimes, Showtime } from "@/hooks/useShowtimes";
import { useCreateBooking } from "@/hooks/useBookings";
import { useBookedSeats } from "@/hooks/useBookedSeats";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeatSelector from "@/components/SeatSelector";
import DateSelector from "@/components/DateSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Star, Clock, Calendar, MapPin, Ticket, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: movie, isLoading: movieLoading } = useMovie(id || "");
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(id || "");
  const createBooking = useCreateBooking();

  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [seats, setSeats] = useState(1);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [bookingStep, setBookingStep] = useState<"tickets" | "seats">("tickets");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Get unique dates from showtimes
  const availableDates = useMemo(() => {
    if (!showtimes || showtimes.length === 0) return [];
    
    const uniqueDates = [...new Set(showtimes.map((s) => s.show_date))];
    return uniqueDates
      .map((d) => parseISO(d))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [showtimes]);

  // Auto-select first date when showtimes load
  useMemo(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Filter showtimes by selected date
  const filteredShowtimes = useMemo(() => {
    if (!showtimes || !selectedDate) return [];
    return showtimes.filter((s) => isSameDay(parseISO(s.show_date), selectedDate));
  }, [showtimes, selectedDate]);

  // Fetch booked seats for selected showtime
  const { data: bookedSeats = [], isLoading: bookedSeatsLoading } = useBookedSeats(selectedShowtime?.id || "");
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
    setSelectedSeatNumbers([]);
    setBookingStep("tickets");
    setBookingDialogOpen(true);
  };

  const handleSeatSelectionChange = useCallback((selected: string[]) => {
    setSelectedSeatNumbers(selected);
  }, []);

  const handleProceedToSeats = () => {
    setBookingStep("seats");
  };

  const handleBackToTickets = () => {
    setBookingStep("tickets");
    setSelectedSeatNumbers([]);
  };

  const handleBooking = async () => {
    if (!selectedShowtime || selectedSeatNumbers.length !== seats) {
      toast({
        title: "Select seats",
        description: `Please select exactly ${seats} seat(s)`,
        variant: "destructive",
      });
      return;
    }

    const totalAmount = selectedShowtime.price * seats;

    try {
      const booking = await createBooking.mutateAsync({
        showtimeId: selectedShowtime.id,
        seats,
        seatNumbers: selectedSeatNumbers,
        totalAmount,
      });

      setBookingDialogOpen(false);

      // Mock email notification - show toast
      toast({
        title: "📧 Booking Created!",
        description: `Redirecting to payment for ${movie?.title} - ${seats} ticket(s)`,
      });

      // Navigate to payment page
      navigate(`/payment/${booking.id}`);
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "An error occurred",
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

        {/* Theaters & Showtimes Section */}
        {movie.status === "now_showing" && (
          <section id="showtimes" className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Theaters Showing {movie.title}
            </h2>

            {showtimesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !showtimes || showtimes.length === 0 ? (
              <Card className="bg-secondary/50">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No theaters showing this movie at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Date Selector */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Date
                  </h3>
                  <DateSelector
                    dates={availableDates}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>

                {/* Selected date info */}
                {selectedDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-4">
                    <span>Showing theaters for</span>
                    <span className="font-semibold text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                )}

                {/* Theaters grouped by ID for selected date */}
                {filteredShowtimes.length === 0 ? (
                  <Card className="bg-secondary/50">
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No showtimes available for this date.</p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(
                    filteredShowtimes.reduce((acc, show) => {
                      const theaterId = show.theater?.id || "unknown";
                      if (!acc[theaterId]) {
                        acc[theaterId] = { theater: show.theater, shows: [] };
                      }
                      acc[theaterId].shows.push(show);
                      return acc;
                    }, {} as Record<string, { theater: Showtime["theater"]; shows: Showtime[] }>)
                  ).map(([theaterId, { theater, shows }]) => (
                    <Card key={theaterId} className="bg-card border-border">
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <CardTitle className="text-lg">{theater?.name || "Unknown Theater"}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{theater?.location}, {theater?.city}</p>
                            {theater?.facilities && theater.facilities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {theater.facilities.map((facility) => (
                                  <span
                                    key={facility}
                                    className="px-2 py-0.5 text-xs bg-secondary text-muted-foreground rounded"
                                  >
                                    {facility}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {shows
                            .sort((a, b) => a.show_time.localeCompare(b.show_time))
                            .map((show) => (
                              <Button
                                key={show.id}
                                variant="outline"
                                size="sm"
                                disabled={show.available_seats === 0}
                                onClick={() => handleSelectShowtime(show)}
                                className="min-w-[100px] h-auto py-2"
                              >
                                <div className="text-center">
                                  <p className="font-semibold">{show.show_time.slice(0, 5)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ₹{show.price} • {show.available_seats} seats
                                  </p>
                                </div>
                              </Button>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={(open) => {
        setBookingDialogOpen(open);
        if (!open) {
          setBookingStep("tickets");
          setSelectedSeatNumbers([]);
        }
      }}>
        <DialogContent className={bookingStep === "seats" ? "max-w-2xl" : ""}>
          <DialogHeader>
            <DialogTitle>
              {bookingStep === "tickets" ? "Book Tickets" : "Select Your Seats"}
            </DialogTitle>
            <DialogDescription>
              {movie.title} at {selectedShowtime?.theater?.name}
              {bookingStep === "seats" && (
                <span className="block mt-1">
                  {selectedShowtime && format(new Date(selectedShowtime.show_date), "MMM d")} at {selectedShowtime?.show_time.slice(0, 5)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {bookingStep === "tickets" ? (
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
                onClick={handleProceedToSeats}
              >
                Select Seats
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {bookedSeatsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <SeatSelector
                  totalSeats={selectedShowtime?.total_seats || 100}
                  bookedSeats={bookedSeats}
                  maxSelectable={seats}
                  onSelectionChange={handleSeatSelectionChange}
                />
              )}

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ₹{(selectedShowtime?.price || 0) * seats}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleBackToTickets}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleBooking}
                  disabled={createBooking.isPending || selectedSeatNumbers.length !== seats}
                >
                  {createBooking.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Ticket className="w-4 h-4" />
                  )}
                  Confirm Booking ({selectedSeatNumbers.length}/{seats} seats)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


      <Footer />
    </div>
  );
};

export default MovieDetails;

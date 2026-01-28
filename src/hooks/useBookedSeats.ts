import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBookedSeats = (showtimeId: string) => {
  return useQuery({
    queryKey: ["booked-seats", showtimeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("seat_numbers")
        .eq("showtime_id", showtimeId)
        .neq("booking_status", "cancelled");

      if (error) throw error;

      // Flatten all booked seat numbers into a single array
      const bookedSeats = data?.flatMap((booking) => booking.seat_numbers || []) || [];
      return bookedSeats;
    },
    enabled: !!showtimeId,
  });
};

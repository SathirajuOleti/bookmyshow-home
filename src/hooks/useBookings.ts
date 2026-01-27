import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  seats: number;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  created_at: string;
  showtime?: {
    id: string;
    show_date: string;
    show_time: string;
    price: number;
    movie?: {
      id: string;
      title: string;
      poster: string;
    };
    theater?: {
      id: string;
      name: string;
      location: string;
    };
  };
}

export const useBookings = () => {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          showtime:showtimes(
            *,
            movie:movies(id, title, poster),
            theater:theaters(id, name, location)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });

  // Real-time updates for bookings
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`bookings-${user.id}`)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "bookings",
          filter: `user_id=eq.${user.id}`
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, query]);

  return query;
};

interface CreateBookingParams {
  showtimeId: string;
  seats: number;
  totalAmount: number;
}

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ showtimeId, seats, totalAmount }: CreateBookingParams) => {
      if (!user) throw new Error("Must be logged in to book");

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          showtime_id: showtimeId,
          seats,
          total_amount: totalAmount,
          payment_status: "pending",
          booking_status: "confirmed",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update available seats directly
      const { data: showtime } = await supabase
        .from("showtimes")
        .select("available_seats")
        .eq("id", showtimeId)
        .single();

      if (showtime) {
        await supabase
          .from("showtimes")
          .update({ available_seats: showtime.available_seats - seats })
          .eq("id", showtimeId);
      }
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

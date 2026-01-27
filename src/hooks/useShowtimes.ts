import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
  available_seats: number;
  total_seats: number;
  theater?: {
    id: string;
    name: string;
    location: string;
    city: string;
    facilities: string[];
  };
}

export const useShowtimes = (movieId: string) => {
  const query = useQuery({
    queryKey: ["showtimes", movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("showtimes")
        .select(`
          *,
          theater:theaters(*)
        `)
        .eq("movie_id", movieId)
        .gte("show_date", new Date().toISOString().split("T")[0])
        .order("show_date", { ascending: true })
        .order("show_time", { ascending: true });
      
      if (error) throw error;
      return data as Showtime[];
    },
    enabled: !!movieId,
  });

  // Real-time updates for showtimes
  useEffect(() => {
    if (!movieId) return;

    const channel = supabase
      .channel(`showtimes-${movieId}`)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "showtimes",
          filter: `movie_id=eq.${movieId}`
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [movieId, query]);

  return query;
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string | null;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  duration_minutes: number;
  release_date: string | null;
  description: string | null;
  status: string;
}

export const useMovies = (status?: string) => {
  const query = useQuery({
    queryKey: ["movies", status],
    queryFn: async () => {
      let q = supabase.from("movies").select("*");
      
      if (status) {
        q = q.eq("status", status);
      }
      
      const { data, error } = await q.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Movie[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("movies-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "movies" },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!id,
  });
};

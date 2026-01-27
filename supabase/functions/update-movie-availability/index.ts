import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toTimeString().split(" ")[0];

    // Delete past showtimes (shows that have already happened)
    const { error: deleteError } = await supabase
      .from("showtimes")
      .delete()
      .or(`show_date.lt.${today},and(show_date.eq.${today},show_time.lt.${now})`);

    if (deleteError) {
      console.error("Error deleting past showtimes:", deleteError);
    }

    // Archive movies with no upcoming showtimes and release date > 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: moviesWithNoShows, error: moviesError } = await supabase
      .from("movies")
      .select("id, title, release_date")
      .eq("status", "now_showing")
      .lt("release_date", threeMonthsAgo.toISOString().split("T")[0]);

    if (moviesError) {
      console.error("Error fetching old movies:", moviesError);
    } else if (moviesWithNoShows && moviesWithNoShows.length > 0) {
      for (const movie of moviesWithNoShows) {
        // Check if movie has any upcoming showtimes
        const { data: showtimes } = await supabase
          .from("showtimes")
          .select("id")
          .eq("movie_id", movie.id)
          .limit(1);

        if (!showtimes || showtimes.length === 0) {
          // Archive the movie
          await supabase
            .from("movies")
            .update({ status: "archived", updated_at: new Date().toISOString() })
            .eq("id", movie.id);
          
          console.log(`Archived movie: ${movie.title}`);
        }
      }
    }

    // Update coming_soon movies to now_showing if release date has passed
    const { error: updateError } = await supabase
      .from("movies")
      .update({ status: "now_showing", updated_at: new Date().toISOString() })
      .eq("status", "coming_soon")
      .lte("release_date", today);

    if (updateError) {
      console.error("Error updating movie status:", updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Movie availability updated",
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in update-movie-availability:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

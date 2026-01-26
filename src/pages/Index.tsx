import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import { recommendedMovies, newReleases, upcomingMovies } from "@/data/movies";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Featured Movies */}
      <HeroCarousel />

      {/* Movie Sections */}
      <main>
        {/* Recommended Movies */}
        <MovieSection
          title="Recommended Movies"
          subtitle="Based on your interests"
          movies={recommendedMovies}
        />

        {/* New Releases */}
        <MovieSection
          title="New Releases"
          subtitle="Fresh in cinemas now"
          movies={newReleases}
        />

        {/* Upcoming Movies */}
        <MovieSection
          title="Upcoming Movies"
          subtitle="Get notified when tickets are available"
          movies={upcomingMovies}
        />

        {/* Genre Quick Links */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Browse by Genre
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                "Action",
                "Comedy",
                "Drama",
                "Horror",
                "Romance",
                "Thriller",
                "Sci-Fi",
                "Adventure",
                "Animation",
                "Documentary",
              ].map((genre) => (
                <button
                  key={genre}
                  className="px-5 py-2.5 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border hover:border-primary"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20">
              <div className="p-8 sm:p-12">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/20 rounded-full mb-4">
                    Limited Time Offer
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                    Get 20% Off on Your First Booking
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Sign up today and enjoy exclusive discounts on movie tickets, events, and more!
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                    Sign Up Now
                  </button>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

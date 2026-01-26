import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedMovie {
  id: number;
  title: string;
  tagline: string;
  backdrop: string;
  rating: number;
  genres: string[];
  releaseDate: string;
}

const featuredMovies: FeaturedMovie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    tagline: "The rule of the wild begins",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    rating: 9.1,
    genres: ["Action", "Drama", "Thriller"],
    releaseDate: "December 2024",
  },
  {
    id: 2,
    title: "Kalki 2898 AD",
    tagline: "A new era awaits",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&q=80",
    rating: 8.7,
    genres: ["Sci-Fi", "Action", "Adventure"],
    releaseDate: "June 2024",
  },
  {
    id: 3,
    title: "Fighter",
    tagline: "Feel the thunder",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80",
    rating: 8.3,
    genres: ["Action", "Drama"],
    releaseDate: "January 2024",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredMovies.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const movie = featuredMovies[currentSlide];

  return (
    <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      {featuredMovies.map((m, index) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={m.backdrop}
            alt={m.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl animate-fade-in" key={currentSlide}>
            {/* Genres */}
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

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-3">
              {movie.title}
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-6">
              {movie.tagline}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">
                  ★ {movie.rating}
                </span>
                <span className="text-muted-foreground">/10</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{movie.releaseDate}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                <Play className="w-5 h-5 fill-current" />
                Book Tickets
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary"
              >
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

import { ChevronRight, Loader2 } from "lucide-react";
import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
}

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isLoading?: boolean;
}

const MovieSection = ({ title, subtitle, movies, isLoading }: MovieSectionProps) => {
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Movie Cards - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster}
              rating={movie.rating}
              votes={movie.votes}
              genres={movie.genres}
              language={movie.language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;

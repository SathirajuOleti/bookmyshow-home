import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
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
}

const MovieSection = ({ title, subtitle, movies }: MovieSectionProps) => {
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

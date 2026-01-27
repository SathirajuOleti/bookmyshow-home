import { Star, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
}

const MovieCard = ({ id, title, poster, rating, votes, genres, language }: MovieCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="group relative flex-shrink-0 w-[180px] sm:w-[200px] cursor-pointer"
      onClick={() => navigate(`/movie/${id}`)}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/90 px-2 py-1 rounded-md">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs font-semibold text-foreground">{rating}/10</span>
          <span className="text-xs text-muted-foreground">{votes}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {genres.join("/")}
        </p>
        <p className="text-xs text-muted-foreground">
          {language}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;

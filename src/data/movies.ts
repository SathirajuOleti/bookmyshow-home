export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
}

export const recommendedMovies: Movie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 9.1,
    votes: "123.5K",
    genres: ["Action", "Drama", "Thriller"],
    language: "Telugu",
  },
  {
    id: 2,
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
    rating: 8.7,
    votes: "98.2K",
    genres: ["Sci-Fi", "Action"],
    language: "Hindi",
  },
  {
    id: 3,
    title: "Fighter",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    rating: 8.3,
    votes: "85.1K",
    genres: ["Action", "Drama"],
    language: "Hindi",
  },
  {
    id: 4,
    title: "Dunki",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 8.5,
    votes: "112K",
    genres: ["Comedy", "Drama"],
    language: "Hindi",
  },
  {
    id: 5,
    title: "Animal",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    rating: 8.9,
    votes: "145K",
    genres: ["Action", "Crime", "Drama"],
    language: "Hindi",
  },
  {
    id: 6,
    title: "Jawan",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80",
    rating: 9.0,
    votes: "200K",
    genres: ["Action", "Thriller"],
    language: "Hindi",
  },
];

export const newReleases: Movie[] = [
  {
    id: 7,
    title: "Crew",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    rating: 7.8,
    votes: "45K",
    genres: ["Comedy", "Crime"],
    language: "Hindi",
  },
  {
    id: 8,
    title: "Shaitaan",
    poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=400&q=80",
    rating: 8.2,
    votes: "67K",
    genres: ["Horror", "Thriller"],
    language: "Hindi",
  },
  {
    id: 9,
    title: "Article 370",
    poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80",
    rating: 8.4,
    votes: "52K",
    genres: ["Drama", "Thriller"],
    language: "Hindi",
  },
  {
    id: 10,
    title: "Teri Baaton Mein Aisa Uljha Jiya",
    poster: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80",
    rating: 7.5,
    votes: "38K",
    genres: ["Romance", "Comedy"],
    language: "Hindi",
  },
  {
    id: 11,
    title: "Bade Miyan Chote Miyan",
    poster: "https://images.unsplash.com/photo-1559583109-3e7968136c99?w=400&q=80",
    rating: 7.2,
    votes: "42K",
    genres: ["Action", "Comedy"],
    language: "Hindi",
  },
  {
    id: 12,
    title: "Madgaon Express",
    poster: "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=400&q=80",
    rating: 8.0,
    votes: "28K",
    genres: ["Comedy"],
    language: "Hindi",
  },
];

export const upcomingMovies: Movie[] = [
  {
    id: 13,
    title: "War 2",
    poster: "https://images.unsplash.com/photo-1547700055-b61cacebece9?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Thriller"],
    language: "Hindi",
  },
  {
    id: 14,
    title: "Pathaan 2",
    poster: "https://images.unsplash.com/photo-1579566346927-c68383817a25?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Spy"],
    language: "Hindi",
  },
  {
    id: 15,
    title: "Salaar 2",
    poster: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Drama"],
    language: "Telugu",
  },
  {
    id: 16,
    title: "Spirit",
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Drama"],
    language: "Hindi",
  },
  {
    id: 17,
    title: "Dhoom 4",
    poster: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Thriller"],
    language: "Hindi",
  },
  {
    id: 18,
    title: "NTR 31",
    poster: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action"],
    language: "Telugu",
  },
];

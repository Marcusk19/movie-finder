// OMDb API Response Types
export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search: OmdbSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Application Types
export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  director: string;
  actors: string[];
  plot: string;
  imdbRating: number;
  runtime: number; // in minutes
}

export interface SimilarityScore {
  genreScore: number;
  directorScore: number;
  actorScore: number;
  yearScore: number;
  totalScore: number;
}

export interface RecommendationResult {
  movie: Movie;
  similarityScore: SimilarityScore;
  explanation: string;
}

export interface MovieSelectionState {
  selectedMovies: Movie[];
  recommendation: RecommendationResult | null;
  isLoading: boolean;
  error: string | null;
}

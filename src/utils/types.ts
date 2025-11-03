// TMDB API Response Types
export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCast {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: string | null;
}

export interface TmdbCrew {
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: string | null;
}

export interface TmdbCredits {
  cast: TmdbCast[];
  crew: TmdbCrew[];
}

export interface TmdbMovie {
  adult: boolean;
  backdrop_path: string | null;
  budget: number;
  genres: TmdbGenre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits?: TmdbCredits;
}

export interface TmdbSearchResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchResult[];
  total_pages: number;
  total_results: number;
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

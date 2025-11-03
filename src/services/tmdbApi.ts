import { TmdbMovie, TmdbSearchResponse, Movie } from '../utils/types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('TMDB API key not set. Please add VITE_TMDB_API_KEY to your .env file');
}

// Genre name to TMDB genre ID mapping
const GENRE_MAP: Record<string, number> = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'science fiction': 878,
  'sci-fi': 878,
  'tv movie': 10770,
  'thriller': 53,
  'war': 10752,
  'western': 37,
};

/**
 * Make authenticated request to TMDB API
 */
async function tmdbFetch(endpoint: string): Promise<any> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search for movies by title
 */
export async function searchMovies(query: string): Promise<TmdbSearchResponse> {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  try {
    const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}`);
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
}

/**
 * Get detailed movie information by TMDB movie ID
 */
export async function getMovieDetails(movieId: number | string): Promise<TmdbMovie> {
  try {
    const data = await tmdbFetch(`/movie/${movieId}?append_to_response=credits`);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Convert TMDB movie data to our internal Movie type
 */
export function convertTmdbToMovie(tmdbMovie: TmdbMovie): Movie {
  // Extract director from crew
  const director = tmdbMovie.credits?.crew.find(person => person.job === 'Director')?.name || 'Unknown';

  // Extract top actors from cast (first 5)
  const actors = tmdbMovie.credits?.cast.slice(0, 5).map(person => person.name) || [];

  // Parse year from release_date
  const year = tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.split('-')[0]) : 0;

  // Construct poster URL
  const poster = tmdbMovie.poster_path
    ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}`
    : '/placeholder-poster.png';

  // Extract genre names
  const genres = tmdbMovie.genres.map(genre => genre.name);

  return {
    id: tmdbMovie.imdb_id || tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    year,
    poster,
    genres,
    director,
    actors,
    plot: tmdbMovie.overview || 'No plot available',
    imdbRating: tmdbMovie.vote_average || 0,
    runtime: tmdbMovie.runtime || 0,
  };
}

/**
 * Get genre ID from genre name
 */
function getGenreId(genreName: string): number | null {
  const normalized = genreName.toLowerCase().trim();
  return GENRE_MAP[normalized] || null;
}

/**
 * Search for movies by genre using TMDB discover endpoint
 */
export async function searchMoviesByGenre(genre: string, page: number = 1): Promise<TmdbSearchResponse> {
  try {
    // Try to map genre name to ID
    const genreId = getGenreId(genre);

    if (genreId) {
      // Use discover endpoint with genre filter
      const data = await tmdbFetch(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
      return data;
    } else {
      // Fall back to search by keyword if genre not in our map
      const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(genre)}&page=${page}`);
      return data;
    }
  } catch (error) {
    console.error('Error searching movies by genre:', error);
    throw new Error('Failed to search movies by genre');
  }
}

/**
 * Get multiple movie details in parallel
 */
export async function getMultipleMovieDetails(movieIds: (number | string)[]): Promise<Movie[]> {
  try {
    const promises = movieIds.map(id => getMovieDetails(id));
    const results = await Promise.all(promises);
    return results.map(convertTmdbToMovie);
  } catch (error) {
    console.error('Error fetching multiple movie details:', error);
    throw error;
  }
}

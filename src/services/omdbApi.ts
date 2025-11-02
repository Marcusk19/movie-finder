import { OmdbMovie, OmdbSearchResponse, Movie } from '../utils/types';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('OMDb API key not set. Please add VITE_OMDB_API_KEY to your .env file');
}

/**
 * Search for movies by title
 */
export async function searchMovies(query: string): Promise<OmdbSearchResponse> {
  if (!query.trim()) {
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
}

/**
 * Get detailed movie information by IMDb ID
 */
export async function getMovieDetails(imdbId: string): Promise<OmdbMovie> {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`
    );
    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Convert OMDb movie data to our internal Movie type
 */
export function convertOmdbToMovie(omdbMovie: OmdbMovie): Movie {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title,
    year: parseInt(omdbMovie.Year.split('–')[0]) || 0, // Handle year ranges like "2019–2020"
    poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder-poster.png',
    genres: omdbMovie.Genre !== 'N/A' ? omdbMovie.Genre.split(', ') : [],
    director: omdbMovie.Director !== 'N/A' ? omdbMovie.Director : 'Unknown',
    actors: omdbMovie.Actors !== 'N/A' ? omdbMovie.Actors.split(', ') : [],
    plot: omdbMovie.Plot !== 'N/A' ? omdbMovie.Plot : 'No plot available',
    imdbRating: parseFloat(omdbMovie.imdbRating) || 0,
    runtime: parseInt(omdbMovie.Runtime) || 0,
  };
}

/**
 * Search for movies by genre
 */
export async function searchMoviesByGenre(genre: string, page: number = 1): Promise<OmdbSearchResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(genre)}&type=movie&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies by genre:', error);
    throw new Error('Failed to search movies by genre');
  }
}

/**
 * Get multiple movie details in parallel
 */
export async function getMultipleMovieDetails(imdbIds: string[]): Promise<Movie[]> {
  try {
    const promises = imdbIds.map(id => getMovieDetails(id));
    const results = await Promise.all(promises);
    return results.map(convertOmdbToMovie);
  } catch (error) {
    console.error('Error fetching multiple movie details:', error);
    throw error;
  }
}

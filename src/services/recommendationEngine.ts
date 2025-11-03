import { Movie, RecommendationResult } from '../utils/types';
import { searchMoviesByGenre, getMovieDetails, convertTmdbToMovie } from './tmdbApi';
import { calculateAverageSimilarity, generateExplanation } from '../utils/movieSimilarity';

/**
 * Get unique genres from multiple movies
 */
function extractUniqueGenres(movies: Movie[]): string[] {
  const allGenres = movies.flatMap(movie => movie.genres);
  return [...new Set(allGenres)];
}

/**
 * Get unique directors from multiple movies
 */
function extractDirectors(movies: Movie[]): string[] {
  const directors = movies.map(movie => movie.director);
  return [...new Set(directors)];
}

/**
 * Search for candidate movies based on input movies
 */
async function findCandidateMovies(inputMovies: Movie[]): Promise<Movie[]> {
  const genres = extractUniqueGenres(inputMovies);
  const directors = extractDirectors(inputMovies);

  // Search by genres (primary search)
  const genreSearchPromises = genres.slice(0, 3).map(genre =>
    searchMoviesByGenre(genre, 5).catch(() => ({ page: 1, results: [], total_pages: 0, total_results: 0 }))
  );

  // Search by directors (secondary search)
  const directorSearchPromises = directors.slice(0, 2).map(director =>
    searchMoviesByGenre(director, 5).catch(() => ({ page: 1, results: [], total_pages: 0, total_results: 0 }))
  );

  // Execute all searches in parallel
  const searchResults = await Promise.all([...genreSearchPromises, ...directorSearchPromises]);

  // Collect all unique movie IDs
  const movieIds = new Set<number>();
  searchResults.forEach(result => {
    if (result.results) {
      result.results.forEach(movie => {
        // Exclude input movies (compare by both TMDB ID and IMDb ID if available)
        const movieIdStr = movie.id.toString();
        if (!inputMovies.some(inputMovie => inputMovie.id === movieIdStr || inputMovie.id === movie.id.toString())) {
          movieIds.add(movie.id);
        }
      });
    }
  });

  // Limit to 50 candidates to avoid API rate limits
  const candidateIds = Array.from(movieIds).slice(0, 50);

  // Fetch detailed information for candidates
  const candidateDetailsPromises = candidateIds.map(id =>
    getMovieDetails(id)
      .then(convertTmdbToMovie)
      .catch(() => null) // Ignore failed requests
  );

  const candidates = await Promise.all(candidateDetailsPromises);

  // Filter out null values (failed requests)
  return candidates.filter((movie): movie is Movie => movie !== null);
}

/**
 * Rank candidate movies based on similarity to input movies
 */
function rankCandidates(candidates: Movie[], inputMovies: Movie[]): RecommendationResult[] {
  const rankedResults: RecommendationResult[] = candidates.map(candidate => {
    const similarityScore = calculateAverageSimilarity(candidate, inputMovies);
    const explanation = generateExplanation(candidate, inputMovies, similarityScore);

    return {
      movie: candidate,
      similarityScore,
      explanation,
    };
  });

  // Sort by total similarity score (highest first)
  rankedResults.sort((a, b) => b.similarityScore.totalScore - a.similarityScore.totalScore);

  return rankedResults;
}

/**
 * Get a movie recommendation based on input movies
 */
export async function getRecommendation(inputMovies: Movie[]): Promise<RecommendationResult | null> {
  if (inputMovies.length === 0) {
    throw new Error('At least one movie is required for recommendation');
  }

  if (inputMovies.length > 3) {
    throw new Error('Maximum of 3 movies allowed for recommendation');
  }

  try {
    // Find candidate movies
    const candidates = await findCandidateMovies(inputMovies);

    if (candidates.length === 0) {
      return null;
    }

    // Rank candidates by similarity
    const rankedResults = rankCandidates(candidates, inputMovies);

    // Return the top recommendation
    return rankedResults[0] || null;
  } catch (error) {
    console.error('Error getting recommendation:', error);
    throw error;
  }
}

/**
 * Get multiple recommendations (top N)
 */
export async function getMultipleRecommendations(
  inputMovies: Movie[],
  count: number = 5
): Promise<RecommendationResult[]> {
  if (inputMovies.length === 0) {
    throw new Error('At least one movie is required for recommendation');
  }

  if (inputMovies.length > 3) {
    throw new Error('Maximum of 3 movies allowed for recommendation');
  }

  try {
    // Find candidate movies
    const candidates = await findCandidateMovies(inputMovies);

    if (candidates.length === 0) {
      return [];
    }

    // Rank candidates by similarity
    const rankedResults = rankCandidates(candidates, inputMovies);

    // Return top N recommendations
    return rankedResults.slice(0, count);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

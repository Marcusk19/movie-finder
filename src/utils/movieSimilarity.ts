import { Movie, SimilarityScore } from './types';

/**
 * Calculate Jaccard Similarity between two sets
 * Formula: J(A,B) = |A ∩ B| / |A ∪ B|
 */
export function jaccardSimilarity(set1: string[], set2: string[]): number {
  if (set1.length === 0 && set2.length === 0) return 0;
  if (set1.length === 0 || set2.length === 0) return 0;

  // Normalize strings for comparison (case-insensitive)
  const normalizedSet1 = set1.map(s => s.toLowerCase().trim());
  const normalizedSet2 = set2.map(s => s.toLowerCase().trim());

  // Calculate intersection
  const intersection = normalizedSet1.filter(item =>
    normalizedSet2.includes(item)
  );

  // Calculate union (remove duplicates)
  const union = [...new Set([...normalizedSet1, ...normalizedSet2])];

  return intersection.length / union.length;
}

/**
 * Calculate year similarity (1.0 if within 5 years, decays linearly)
 */
export function yearSimilarity(year1: number, year2: number): number {
  const difference = Math.abs(year1 - year2);

  // Perfect match if within 5 years
  if (difference <= 5) return 1.0;
  // Linear decay over 50 years
  const similarity = Math.max(0, 1 - (difference / 50));
  return similarity;
}

/**
 * Calculate director similarity (binary: 1 if same, 0 if different)
 */
export function directorSimilarity(director1: string, director2: string): number {
  const normalized1 = director1.toLowerCase().trim();
  const normalized2 = director2.toLowerCase().trim();

  return normalized1 === normalized2 ? 1.0 : 0.0;
}

/**
 * Calculate overall similarity score between two movies
 * Weights: Genre (40%), Director (25%), Actors (20%), Year (15%)
 */
export function calculateMovieSimilarity(movie1: Movie, movie2: Movie): SimilarityScore {
  const genreScore = jaccardSimilarity(movie1.genres, movie2.genres);
  const directorScore = directorSimilarity(movie1.director, movie2.director);
  const actorScore = jaccardSimilarity(movie1.actors, movie2.actors);
  const yearScore = yearSimilarity(movie1.year, movie2.year);

  // Weighted total score
  const totalScore = (
    genreScore * 0.40 +
    directorScore * 0.25 +
    actorScore * 0.20 +
    yearScore * 0.15
  );

  return {
    genreScore,
    directorScore,
    actorScore,
    yearScore,
    totalScore,
  };
}

/**
 * Calculate average similarity between a candidate movie and multiple input movies
 */
export function calculateAverageSimilarity(
  candidate: Movie,
  inputMovies: Movie[]
): SimilarityScore {
  if (inputMovies.length === 0) {
    return {
      genreScore: 0,
      directorScore: 0,
      actorScore: 0,
      yearScore: 0,
      totalScore: 0,
    };
  }

  // Calculate similarity with each input movie
  const similarities = inputMovies.map(movie =>
    calculateMovieSimilarity(candidate, movie)
  );

  // Average all scores
  const avgGenreScore = similarities.reduce((sum, s) => sum + s.genreScore, 0) / similarities.length;
  const avgDirectorScore = similarities.reduce((sum, s) => sum + s.directorScore, 0) / similarities.length;
  const avgActorScore = similarities.reduce((sum, s) => sum + s.actorScore, 0) / similarities.length;
  const avgYearScore = similarities.reduce((sum, s) => sum + s.yearScore, 0) / similarities.length;
  const avgTotalScore = similarities.reduce((sum, s) => sum + s.totalScore, 0) / similarities.length;

  return {
    genreScore: avgGenreScore,
    directorScore: avgDirectorScore,
    actorScore: avgActorScore,
    yearScore: avgYearScore,
    totalScore: avgTotalScore,
  };
}

/**
 * Generate a human-readable explanation of why a movie was recommended
 */
export function generateExplanation(
  recommendedMovie: Movie,
  inputMovies: Movie[],
  similarityScore: SimilarityScore
): string {
  const explanations: string[] = [];

  // Genre explanation
  if (similarityScore.genreScore > 0.5) {
    const commonGenres = recommendedMovie.genres.filter(genre =>
      inputMovies.some(movie =>
        movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    );
    if (commonGenres.length > 0) {
      explanations.push(`Shares ${commonGenres.slice(0, 2).join(' and ')} genre${commonGenres.length > 1 ? 's' : ''}`);
    }
  }

  // Director explanation
  if (similarityScore.directorScore > 0) {
    const matchingDirector = inputMovies.find(
      movie => movie.director.toLowerCase() === recommendedMovie.director.toLowerCase()
    );
    if (matchingDirector) {
      explanations.push(`Same director as "${matchingDirector.title}" (${recommendedMovie.director})`);
    }
  }

  // Actor explanation
  if (similarityScore.actorScore > 0.3) {
    const commonActors = recommendedMovie.actors.filter(actor =>
      inputMovies.some(movie =>
        movie.actors.some(a => a.toLowerCase() === actor.toLowerCase())
      )
    );
    if (commonActors.length > 0) {
      explanations.push(`Features ${commonActors.slice(0, 2).join(' and ')}`);
    }
  }

  // Year explanation
  const avgYear = Math.round(
    inputMovies.reduce((sum, movie) => sum + movie.year, 0) / inputMovies.length
  );
  if (Math.abs(recommendedMovie.year - avgYear) <= 5) {
    explanations.push(`Released around the same time (${recommendedMovie.year})`);
  }

  // Overall similarity
  const scorePercentage = Math.round(similarityScore.totalScore * 100);

  if (explanations.length === 0) {
    return `This movie has a ${scorePercentage}% similarity match based on your selections.`;
  }

  return `${explanations.join('. ')}. Overall ${scorePercentage}% match.`;
}

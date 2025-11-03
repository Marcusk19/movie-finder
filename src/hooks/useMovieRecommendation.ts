import { useState } from 'react';
import { Movie, RecommendationResult } from '../utils/types';
import { getRecommendation } from '../services/recommendationEngine';
import { getMultipleRecommendations } from '../services/recommendationEngine';

export function useMovieRecommendation() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [additionalRecommendations, setAdditionalRecommendations] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMovie = (movie: Movie) => {
    if (selectedMovies.length >= 3) {
      setError('Maximum of 3 movies allowed');
      return;
    }

    // Check if movie is already selected
    if (selectedMovies.some(m => m.id === movie.id)) {
      setError('This movie is already selected');
      return;
    }

    setSelectedMovies([...selectedMovies, movie]);
    setError(null);
  };

  const removeMovie = (movieId: string) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
    setError(null);
  };

  const clearMovies = () => {
    setSelectedMovies([]);
    setRecommendation(null);
    setError(null);
  };

  const getRecommendationForSelectedMovies = async () => {
    if (selectedMovies.length === 0) {
      setError('Please select at least one movie');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getRecommendation(selectedMovies);
      const additionalResults = await getMultipleRecommendations(selectedMovies, 5);

      if (!result) {
        setError('No recommendations found. Try selecting different movies.');
        setRecommendation(null);
      } else {
        setRecommendation(result);
      }
      if (additionalResults.length > 1) {
        setAdditionalRecommendations(additionalResults)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedMovies([]);
    setRecommendation(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    selectedMovies,
    recommendation,
    additionalRecommendations,
    isLoading,
    error,
    addMovie,
    removeMovie,
    clearMovies,
    getRecommendation: getRecommendationForSelectedMovies,
    reset,
  };
}

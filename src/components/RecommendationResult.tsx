import { RecommendationResult } from '../utils/types';
import MovieCard from './MovieCard';

interface RecommendationResultProps {
  result: RecommendationResult;
  onReset: () => void;
}

export default function RecommendationResultComponent({ result, onReset }: RecommendationResultProps) {
  const { movie, similarityScore, explanation } = result;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            We Found Your Perfect Match!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Based on your selections, we recommend:
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Movie Card */}
          <div className="w-full md:w-80 flex-shrink-0">
            <MovieCard movie={movie} />
          </div>

          {/* Details and Explanation */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Why This Movie?
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {explanation}
              </p>

              {/* Similarity Breakdown */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Genre Match
                    </span>
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {Math.round(similarityScore.genreScore * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${similarityScore.genreScore * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Director Match
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(similarityScore.directorScore * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${similarityScore.directorScore * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Actor Match
                    </span>
                    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                      {Math.round(similarityScore.actorScore * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${similarityScore.actorScore * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Year Similarity
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {Math.round(similarityScore.yearScore * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${similarityScore.yearScore * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Overall Match
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {Math.round(similarityScore.totalScore * 100)}%
                  </span>
                </div>
              </div>

              {/* Movie Details */}
              {movie.plot && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Plot
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {movie.plot}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={onReset}
                className="btn-primary flex-1"
              >
                Try Again
              </button>
              <a
                href={`https://www.imdb.com/title/${movie.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center"
              >
                View on IMDb
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

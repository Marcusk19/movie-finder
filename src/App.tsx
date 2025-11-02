import { useMovieRecommendation } from './hooks/useMovieRecommendation';
import MovieSearch from './components/MovieSearch';
import MovieCard from './components/MovieCard';
import LoadingSpinner from './components/LoadingSpinner';
import RecommendationResultComponent from './components/RecommendationResult';

function App() {
  const {
    selectedMovies,
    recommendation,
    isLoading,
    error,
    addMovie,
    removeMovie,
    getRecommendation,
    reset,
  } = useMovieRecommendation();

  const canGetRecommendation = selectedMovies.length > 0 && selectedMovies.length <= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎬 Movie Finder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover your next favorite movie based on what you love
          </p>
        </header>

        {/* Show recommendation if available */}
        {recommendation ? (
          <RecommendationResultComponent result={recommendation} onReset={reset} />
        ) : (
          <>
            {/* Instructions */}
            <div className="max-w-2xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                How It Works
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Search and select 1-3 movies you love</li>
                <li>Click "Get Recommendation" to find your perfect match</li>
                <li>Discover a new movie tailored to your taste!</li>
              </ol>
            </div>

            {/* Movie Search */}
            <div className="mb-8">
              <MovieSearch
                onMovieSelect={addMovie}
                disabled={selectedMovies.length >= 3 || isLoading}
              />
              {selectedMovies.length >= 3 && (
                <p className="text-center mt-2 text-orange-600 dark:text-orange-400 font-medium">
                  Maximum of 3 movies reached
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-2xl mx-auto mb-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Selected Movies */}
            {selectedMovies.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Selections ({selectedMovies.length}/3)
                  </h2>
                  <button
                    onClick={() => selectedMovies.forEach(m => removeMovie(m.id))}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {selectedMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      showRemoveButton
                      onRemove={() => removeMovie(movie.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Get Recommendation Button */}
            {selectedMovies.length > 0 && (
              <div className="text-center mb-8">
                <button
                  onClick={getRecommendation}
                  disabled={!canGetRecommendation || isLoading}
                  className="btn-primary text-xl px-12 py-4"
                >
                  {isLoading ? 'Finding Your Match...' : 'Get Recommendation'}
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <LoadingSpinner />}

            {/* Empty State */}
            {selectedMovies.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Start by searching for movies you love
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Powered by{' '}
            <a
              href="http://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              OMDb API
            </a>
          </p>
          <p className="text-sm">
            Don't forget to add your API key to the .env file!
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

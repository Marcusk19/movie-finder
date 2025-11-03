import { Movie } from '../utils/types';

interface MovieCardProps {
  movie: Movie;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function MovieCard({ movie, onRemove, showRemoveButton = false }: MovieCardProps) {
  return (
    <div className="movie-card relative">
      {showRemoveButton && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
          aria-label="Remove movie"
        >
          ×
        </button>
      )}

      <a
        href={`https://www.imdb.com/title/${movie.id}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
          <div className="relative w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700">
            {movie.poster && movie.poster !== 'N/A' ? (
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-center px-4">No Poster Available</span>
              </div>
            )}
          </div>
      </a>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {movie.year}
        </p>
        {movie.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        {movie.imdbRating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {movie.imdbRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

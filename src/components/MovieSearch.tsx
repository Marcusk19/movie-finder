import { useState, useEffect, useRef } from 'react';
import { searchMovies, getMovieDetails, convertOmdbToMovie } from '../services/omdbApi';
import { Movie } from '../utils/types';

interface MovieSearchProps {
  onMovieSelect: (movie: Movie) => void;
  disabled?: boolean;
}

export default function MovieSearch({ onMovieSelect, disabled = false }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; year: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchMovies(query);
        if (results.Response === 'True' && results.Search) {
          setSuggestions(
            results.Search.slice(0, 8).map((movie) => ({
              id: movie.imdbID,
              title: movie.Title,
              year: movie.Year,
            }))
          );
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectMovie = async (imdbId: string) => {
    try {
      const movieDetails = await getMovieDetails(imdbId);
      const movie = convertOmdbToMovie(movieDetails);
      onMovieSelect(movie);
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for a movie..."
          disabled={disabled}
          className="input-field pr-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {suggestions.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelectMovie(movie.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {movie.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {movie.year}
              </div>
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
          <p className="text-gray-600 dark:text-gray-400">No movies found</p>
        </div>
      )}
    </div>
  );
}

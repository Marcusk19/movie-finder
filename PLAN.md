# Movie Finder - Implementation Plan

## Overview
A movie recommendation website that suggests movies based on user input of up to 3 movies they like. The recommendation matches the theme, style, and tone of the input movies.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: OMDb API for movie data
- **HTTP Client**: Fetch API (native)

## Project Structure
```
movie-finder/
├── src/
│   ├── components/
│   │   ├── MovieSearch.tsx          # Input component for 3 movies
│   │   ├── MovieCard.tsx            # Display movie details
│   │   ├── RecommendationResult.tsx # Show recommended movie
│   │   └── LoadingSpinner.tsx       # Loading states
│   ├── services/
│   │   ├── omdbApi.ts               # OMDb API client
│   │   └── recommendationEngine.ts  # Core recommendation logic
│   ├── utils/
│   │   ├── movieSimilarity.ts       # Similarity scoring algorithms
│   │   └── types.ts                 # TypeScript interfaces
│   ├── hooks/
│   │   └── useMovieRecommendation.ts # Custom React hook
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env
├── package.json
└── PLAN.md (this file)
```

## Recommendation Algorithm (Hybrid Approach)

### Phase 1 - Simple (OMDb-based)
The initial implementation will use OMDb API data to calculate similarity:

1. **Extract Metadata** from input movies:
   - Genres (e.g., "Action, Thriller, Sci-Fi")
   - Year of release
   - Director
   - Main actors
   - IMDb rating
   - Plot keywords (from plot description)

2. **Weighting Factors**:
   - Genre overlap: 40%
   - Director match: 25%
   - Actor overlap: 20%
   - Year similarity: 15%

3. **Recommendation Process**:
   - Combine all genres from input movies
   - Search OMDb for movies matching those genres
   - Calculate similarity scores for each candidate
   - Filter out the input movies from results
   - Return top-scored movie

4. **Similarity Calculation**:
   ```
   Score = (Genre_Similarity × 0.4) +
           (Director_Match × 0.25) +
           (Actor_Overlap × 0.20) +
           (Year_Proximity × 0.15)
   ```

### Phase 2 - Future Enhancement Structure
Structure the code to easily add:
- TMDb API integration for richer metadata
- Plot summary analysis using TF-IDF
- Cosine similarity between movie vectors
- Machine learning recommendations
- User preference learning

## Similarity Calculation Tools & Techniques

### 1. Jaccard Similarity (Set-based)
For comparing genres, actors, and keywords:
```
J(A,B) = |A ∩ B| / |A ∪ B|
```
- Good for: Genre overlap, actor overlap
- Example: Movies with genres ["Action", "Sci-Fi"] and ["Sci-Fi", "Thriller"] have 33% similarity

### 2. Weighted Scoring
Custom formula combining different attributes:
```typescript
function calculateSimilarity(movie1, movie2) {
  const genreScore = jaccardSimilarity(movie1.genres, movie2.genres);
  const actorScore = jaccardSimilarity(movie1.actors, movie2.actors);
  const directorScore = movie1.director === movie2.director ? 1 : 0;
  const yearScore = 1 - (Math.abs(movie1.year - movie2.year) / 50);

  return genreScore * 0.4 + directorScore * 0.25 +
         actorScore * 0.2 + yearScore * 0.15;
}
```

### 3. String Similarity (Future)
For fuzzy matching of plot descriptions:
- Levenshtein distance
- Or use a library like `string-similarity`

### 4. TF-IDF & Cosine Similarity (Future)
For analyzing plot summaries and finding thematic similarities:
- Extract keywords from plots using TF-IDF
- Calculate cosine similarity between keyword vectors
- Identify movies with similar themes/topics

## Visualization Tools (Optional Future Features)

### 1. Similarity Score Display
- Show why a movie was recommended
- Display breakdown: "80% genre match, 100% director match, etc."

### 2. Movie Relationship Graph (Advanced)
Libraries to consider:
- **D3.js**: Network graphs showing movie relationships
- **Recharts/Victory**: Bar charts for similarity scores
- **Vis.js**: Interactive network visualization

### 3. Similarity Matrix
- Show how all movies relate to each other
- Heatmap visualization of scores

## Implementation Steps

### Step 1: Project Initialization
- [ ] Run `npm create vite@latest . -- --template react-ts`
- [ ] Install dependencies: `npm install`
- [ ] Install Tailwind CSS
- [ ] Set up Tailwind configuration
- [ ] Create .env file for OMDb API key

### Step 2: Type Definitions
- [ ] Create `src/utils/types.ts` with interfaces:
  - `Movie` interface for OMDb response
  - `MovieInput` for user selections
  - `RecommendationResult` with similarity scores

### Step 3: API Integration
- [ ] Create `src/services/omdbApi.ts`
- [ ] Implement movie search function
- [ ] Implement movie details fetch by IMDb ID
- [ ] Add error handling and rate limiting

### Step 4: Recommendation Engine
- [ ] Create `src/utils/movieSimilarity.ts`
  - Jaccard similarity function
  - Year similarity function
  - Overall similarity calculator
- [ ] Create `src/services/recommendationEngine.ts`
  - Input movie analysis
  - Candidate movie search
  - Scoring and ranking
  - Return top recommendation

### Step 5: React Components
- [ ] `MovieSearch.tsx`: Search input with autocomplete
- [ ] `MovieCard.tsx`: Display movie with poster, title, year
- [ ] `RecommendationResult.tsx`: Show recommended movie + explanation
- [ ] `LoadingSpinner.tsx`: Loading states

### Step 6: State Management
- [ ] Create `src/hooks/useMovieRecommendation.ts`
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Manage selected movies array

### Step 7: UI/UX
- [ ] Responsive layout with Tailwind
- [ ] Movie poster display
- [ ] Input validation (max 3 movies)
- [ ] Clear/reset functionality
- [ ] Error messages

### Step 8: Polish
- [ ] Loading animations
- [ ] Smooth transitions
- [ ] Empty states
- [ ] Error boundaries

## Key Features

### MVP (Minimum Viable Product)
1. **Movie Search**: Type movie title, get autocomplete suggestions
2. **Selection**: Select 1-3 movies
3. **Recommendation**: Click button to get a recommendation
4. **Display**: Show recommended movie with poster, details, and similarity score
5. **Explanation**: Show why the movie was recommended

### Nice-to-Have
1. Similarity score breakdown
2. Multiple recommendations (top 5)
3. Filter by year range
4. Exclude watched movies
5. Save preferences to localStorage
6. Share recommendations

## OMDb API Notes

### API Limitations
- Free tier: 1,000 requests per day
- Requires API key
- Limited metadata compared to TMDb

### Key Endpoints
- Search: `http://www.omdbapi.com/?s={query}&apikey={key}`
- Details: `http://www.omdbapi.com/?i={imdbID}&apikey={key}`
- Plot: `http://www.omdbapi.com/?i={imdbID}&plot=full&apikey={key}`

### Data Available
- Title, Year, Rated, Released, Runtime
- Genre, Director, Writer, Actors
- Plot, Language, Country
- Awards, Poster, Ratings
- IMDb ID and Rating

## Future Enhancements

### Phase 2: Enhanced Algorithm
- Integrate TMDb API for:
  - Plot keywords
  - User ratings
  - Popularity scores
  - Similar movies endpoint
- Implement plot analysis with TF-IDF
- Add content-based filtering

### Phase 3: User Features
- User accounts and history
- Personal watchlist
- Rating system
- Social features (share recommendations)

### Phase 4: Advanced ML
- Train custom recommendation model
- Collaborative filtering
- Hybrid recommendations (content + collaborative)
- A/B testing different algorithms

## Development Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Environment Variables
```env
VITE_OMDB_API_KEY=your_api_key_here
```

## Success Metrics
- Recommendation relevance (manual testing)
- Algorithm accuracy (genre match %)
- User experience (time to recommendation)
- API usage efficiency

# 🎬 Movie Finder

A smart movie recommendation web app that suggests movies based on your favorite films. Built with React, TypeScript, Tailwind CSS, and powered by the OMDb API.

## ✨ Features

- **Intelligent Recommendations**: Get personalized movie suggestions based on 1-3 movies you love
- **Smart Similarity Matching**: Uses a hybrid algorithm that considers:
  - Genre overlap (40% weight)
  - Director match (25% weight)
  - Actor overlap (20% weight)
  - Year similarity (15% weight)
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Detailed Explanations**: See why each movie was recommended with similarity score breakdowns
- **Real-time Search**: Autocomplete movie search with instant suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OMDb API Key (free at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd movie-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**

   Open the `.env` file and replace `your_api_key_here` with your actual OMDb API key:
   ```env
   VITE_OMDB_API_KEY=your_actual_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 📖 How to Use

1. **Search for Movies**: Type a movie title in the search bar to see suggestions
2. **Select 1-3 Movies**: Click on movies from the search results to add them (max 3)
3. **Get Recommendation**: Click the "Get Recommendation" button
4. **Explore Results**: View your personalized recommendation with similarity scores and explanations
5. **Try Again**: Click "Try Again" to get another recommendation with different movies

## 🏗️ Project Structure

```
movie-finder/
├── src/
│   ├── components/          # React components
│   │   ├── MovieSearch.tsx
│   │   ├── MovieCard.tsx
│   │   ├── RecommendationResult.tsx
│   │   └── LoadingSpinner.tsx
│   ├── services/           # API and business logic
│   │   ├── omdbApi.ts
│   │   └── recommendationEngine.ts
│   ├── utils/              # Utilities and types
│   │   ├── movieSimilarity.ts
│   │   └── types.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useMovieRecommendation.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables (your API key)
├── .env.example            # Example environment variables
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── PLAN.md                 # Detailed implementation plan
```

## 🧮 Recommendation Algorithm

### Phase 1: Similarity-Based (Current)

The recommendation engine uses a weighted scoring system:

1. **Genre Matching** (40%): Uses Jaccard similarity to compare genre overlap
2. **Director Matching** (25%): Binary match (1 or 0)
3. **Actor Matching** (20%): Jaccard similarity for cast overlap
4. **Year Similarity** (15%): Linear decay based on release year difference

**Formula:**
```
Total Score = (Genre × 0.4) + (Director × 0.25) + (Actors × 0.2) + (Year × 0.15)
```

### Future Enhancements (Planned)

- TMDb API integration for richer metadata
- Plot analysis using TF-IDF
- Collaborative filtering with user ratings
- Machine learning models

## 🛠️ Built With

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[OMDb API](http://www.omdbapi.com/)** - Movie database

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔑 API Key Setup

To get your free OMDb API key:

1. Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Select the FREE tier (1,000 daily requests)
3. Enter your email and verify
4. Copy your API key
5. Paste it in the `.env` file

## 🎨 Features Breakdown

### Similarity Calculation
- **Jaccard Similarity**: Measures set overlap for genres and actors
- **Year Proximity**: Recent movies get higher scores with other recent movies
- **Weighted Scoring**: Different factors have different importance levels

### User Experience
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode**: Automatic dark mode support
- **Loading States**: Clear feedback during API calls
- **Error Handling**: Graceful error messages

### Visual Feedback
- **Progress Bars**: Show similarity breakdown by category
- **Percentage Scores**: Clear numerical feedback
- **Explanations**: Human-readable reasons for recommendations

## 🐛 Troubleshooting

### "No movies found" error
- Check that your API key is correctly set in `.env`
- Verify the API key is active (check your email for activation)
- Ensure you haven't exceeded the daily rate limit (1,000 requests/day for free tier)

### Movies not loading
- Check your internet connection
- Verify the OMDb API is accessible from your location
- Check browser console for specific error messages

### Build errors
- Delete `node_modules` and run `npm install` again
- Ensure you're using Node.js v18 or higher
- Check that all dependencies installed successfully

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Movie data provided by [OMDb API](http://www.omdbapi.com/)
- Icons and design inspired by modern movie streaming platforms

## 🚀 Future Enhancements

See [PLAN.md](./PLAN.md) for the complete roadmap, including:
- Multiple recommendation support (top 5)
- Advanced ML-based recommendations
- User accounts and history
- Social sharing features
- Integration with streaming platforms

---

**Happy movie hunting! 🍿**

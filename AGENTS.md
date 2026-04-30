# AGENTS.md

## Setup And Commands
- Use pnpm; `pnpm-lock.yaml` is the lockfile and `package.json` pins `pnpm@10.33.2`.
- `pnpm install` installs dependencies.
- `pnpm run dev` starts the Vite dev server, usually at `http://localhost:5173`.
- `pnpm run build` runs `tsc && vite build`; use it for typecheck plus production build verification.
- `pnpm run preview` serves the built app locally after `pnpm run build`.
- `pnpm run lint` runs ESLint with the repo-local `.eslintrc.cjs` config.
- There is no test script or test framework configured.

## Environment
- Runtime TMDB calls require `VITE_TMDB_API_KEY` in `.env`; use the TMDB API Read Access Token, not the v3 API key.
- `.env` and `.env.local` are gitignored. Do not commit real API tokens.
- Pre-commit is configured only for `gitleaks` secret scanning.

## App Structure
- This is a single-package React 18 + TypeScript + Vite app; entrypoints are `src/main.tsx` and `src/App.tsx`.
- `src/services/tmdbApi.ts` owns TMDB fetches, Bearer auth, response conversion, and poster URL construction.
- `src/services/recommendationEngine.ts` finds candidates through TMDB genre/director searches, fetches details, then ranks them.
- `src/utils/movieSimilarity.ts` is the scoring source of truth: genre 40%, director 25%, actors 20%, year 15%.
- User selection and recommendation state live in `src/hooks/useMovieRecommendation.ts`; the UI caps selected movies at 3.

## Styling
- Tailwind scans `index.html` and `src/**/*.{js,ts,jsx,tsx}`.
- Shared component classes are in `src/index.css` under `@layer components` (`movie-card`, `btn-primary`, `btn-secondary`, `input-field`).
- The custom Tailwind color namespace is `primary` in `tailwind.config.js`.

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Film, Tv, Video, Bookmark, Download, History, ChevronLeft, ChevronRight } from 'lucide-react';
import PlayerPage from './PlayerPage';

type MediaItem = {
  id: number;
  tmdbId: number;
  title: string;
  year: string;
  score: number;
  img: string;
  media_type: 'movie' | 'tv';
};

const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function extractYear(value: string | undefined) {
  if (!value) return 'N/A';
  return value.slice(0, 4) || 'N/A';
}

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const debounceRef = React.useRef<number | undefined>(undefined);

  async function performSearch(q: string) {
    if (!q || q.trim().length === 0) {
      setResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    if (!TMDB_API_KEY) {
      setSearchError('Missing TMDB API key.');
      setResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const resp = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          q,
        )}&page=1&include_adult=false`,
      );
      if (!resp.ok) throw new Error(`search failed: ${resp.status}`);
      const payload = await resp.json();
      const items: any[] = Array.isArray(payload.results) ? payload.results : [];

      const mapped = items
        .filter((it) => it.media_type === 'movie' || it.media_type === 'tv')
        .map((item) => ({
          id: item.id,
          tmdbId: item.id,
          title: item.title ?? item.name ?? 'Untitled',
          year: extractYear(item.release_date ?? item.first_air_date),
          score: Number(item.vote_average ?? 0),
          img: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image',
          media_type: item.media_type,
        }))
        .slice(0, 8);

      setResults(mapped);
    } catch (e) {
      console.error('Search error', e);
      setSearchError('Search failed. Try again later.');
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  React.useEffect(() => {
    // simple debounce
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    // @ts-ignore
    debounceRef.current = window.setTimeout(() => performSearch(query), 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSelect(media: MediaItem) {
    setQuery('');
    setResults([]);
    navigate(`/watch/${media.media_type}/${media.tmdbId}`);
  }

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-white font-sans overflow-hidden">
      <aside
        className={`h-full bg-[#050505] border-r border-white/5 flex flex-col overflow-hidden p-6 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-10">
          <Link
            to="/"
            onClick={(event) => {
              if (isCollapsed) {
                event.preventDefault();
                setIsCollapsed(false);
              }
            }}
            className="group relative flex items-center gap-2"
          >
            <div className="relative w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-200">
              <span
                className={`text-lg font-bold italic transition-all duration-200 ${
                  isCollapsed ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
                }`}
              >
                F
              </span>
              <ChevronRight
                size={16}
                className={`absolute inset-0 m-auto transition-all duration-200 ${
                  isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            {!isCollapsed && <span className="text-xl font-bold tracking-tight">Fluxlith</span>}
          </Link>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed((current) => !current)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition-all duration-300 hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-3">
            <Link
              to="/movies"
              className="flex items-center gap-3 pl-4 text-zinc-400 hover:text-white transition-colors"
            >
              <Film size={16} />
              <span
                className={`inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                Movies
              </span>
            </Link>
            <Link
              to="/tv"
              className="flex items-center gap-3 pl-4 text-zinc-400 hover:text-white transition-colors"
            >
              <Tv size={16} />
              <span
                className={`inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                TV Shows
              </span>
            </Link>
            <Link
              to="/anime"
              className="flex items-center gap-3 pl-4 text-zinc-400 hover:text-white transition-colors"
            >
              <Video size={16} />
              <span
                className={`inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                Anime
              </span>
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="h-16 flex items-center px-8 border-b border-white/5 bg-[#0F0F0F]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for movies, actors, or genres..."
              className="w-full bg-zinc-900/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />

            {query && (
              <div className="absolute left-0 right-0 mt-2 z-20 max-h-80 overflow-auto rounded-2xl border border-white/5 bg-zinc-950 p-2">
                {searchLoading ? (
                  <div className="p-3 text-sm text-zinc-400">Searching...</div>
                ) : searchError ? (
                  <div className="p-3 text-sm text-red-300">{searchError}</div>
                ) : results.length === 0 ? (
                  <div className="p-3 text-sm text-zinc-400">No results</div>
                ) : (
                  results.map((r) => (
                    <button
                      key={`${r.media_type}-${r.tmdbId}`}
                      onClick={() => handleSelect(r)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/3"
                    >
                      <img src={r.img} alt={r.title} className="w-12 h-18 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{r.title}</div>
                        <div className="text-xs text-zinc-400">{r.media_type.toUpperCase()} • {r.year}</div>
                      </div>
                      <div className="text-xs text-zinc-400">Score {r.score.toFixed(1)}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </header>

        <div className="pb-8">{children}</div>
      </main>
    </div>
  );
}

function HomePage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrending = async () => {
      if (!TMDB_API_KEY) {
        setError('Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
          throw new Error(`TMDB request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const results: any[] = Array.isArray(payload.results) ? payload.results : [];

        const mapped = results
          .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          .map((item) => ({
            id: item.id,
            tmdbId: item.id,
            title: item.title ?? item.name ?? 'Untitled',
            year: extractYear(item.release_date ?? item.first_air_date),
            score: Number(item.vote_average ?? 0),
            img: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image',
            media_type: item.media_type,
          }))
          .slice(0, 24);

        setMediaItems(mapped);
      } catch (fetchError) {
        console.error('Failed to fetch TMDB data', fetchError);
        setError('Unable to load TMDB data. Check your API key and network connection.');
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  const handleSelect = (media: MediaItem) => {
    navigate(`/watch/${media.media_type}/${media.tmdbId}`);
  };

  return (
    <div className="px-8 py-6 space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-400">Fluxlith</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">Premium streaming with TMDB + Vidsync</h1>
            <p className="max-w-2xl text-sm text-zinc-400 mt-3">
              Browse the latest trending movies and TV shows from TMDB. Click a card to open the premium player page with full overview and playback.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-zinc-950 p-5 text-sm text-zinc-400">
            <p className="font-semibold text-white">Premium details</p>
            <p className="mt-2">Each selection opens a dedicated watch page.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Trending Now</h2>
            <p className="text-sm text-zinc-500">Fresh picks from TMDB, updated weekly.</p>
          </div>
          <div className="text-sm text-zinc-500">{mediaItems.length} items</div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/5 bg-zinc-950 p-8 text-center text-sm text-zinc-400">Loading trending TMDB content...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {mediaItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="group text-left overflow-hidden rounded-3xl border border-white/5 bg-zinc-950 p-2 transition hover:border-blue-400/40 hover:bg-zinc-900"
              >
                <div className="aspect-2/3 overflow-hidden rounded-3xl bg-zinc-800">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span>{item.media_type.toUpperCase()}</span>
                    <span>{item.year}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white line-clamp-2">{item.title}</h3>
                  <p className="mt-1 text-[13px] text-zinc-400">Score {item.score.toFixed(1)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:type/:id" element={<PlayerPage />} />
          <Route path="*" element={<div className="p-8 text-center text-zinc-500">Page under construction</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

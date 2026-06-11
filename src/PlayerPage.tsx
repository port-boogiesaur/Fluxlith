import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

type MediaDetails = {
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  vote_average?: number;
  genres?: Array<{ id: number; name: string }>;
};

const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const VIDSYNC_THEME = '5865f2';

function buildTmdbRequest(path: string) {
  const base = `https://api.themoviedb.org/3${path}`;
  const headers: Record<string, string> = {};
  let url = base;
  let authUsed: 'bearer' | 'api_key' | 'none' = 'none';

  const looksLikeJwt = typeof TMDB_API_KEY === 'string' && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(TMDB_API_KEY);

  if (TMDB_API_KEY && looksLikeJwt) {
    headers['Authorization'] = `Bearer ${TMDB_API_KEY}`;
    authUsed = 'bearer';
  } else if (TMDB_API_KEY) {
    url += url.includes('?') ? `&api_key=${TMDB_API_KEY}` : `?api_key=${TMDB_API_KEY}`;
    authUsed = 'api_key';
  }

  return { url, init: { headers }, authUsed };
}

const getVidsyncUrl = (type: 'movie' | 'tv', id: string) => {
  if (type === 'movie') {
    return `https://vidsync.xyz/embed/movie/${id}?autoPlay=true&theme=${VIDSYNC_THEME}`;
  }

  return `https://vidsync.xyz/embed/tv/${id}/1/1?autoPlay=true&nextButton=true&autoNext=true&theme=${VIDSYNC_THEME}`;
};

function extractYear(value: string | undefined) {
  if (!value) return '';
  return value.slice(0, 4) || '';
}

export default function PlayerPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!TMDB_API_KEY) {
        setError('Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.');
        setLoading(false);
        return;
      }

      if (type !== 'movie' && type !== 'tv') {
        setError('Invalid media type.');
        setLoading(false);
        return;
      }

      if (!id) {
        setError('Invalid TMDB ID.');
        setLoading(false);
        return;
      }

      try {
        const { url, init, authUsed } = buildTmdbRequest(`/${type}/${id}?language=en-US`);
        console.debug('TMDB details request', { url, authUsed });
        const response = await fetch(url, init as RequestInit);
        console.debug('TMDB details response', { status: response.status });
        if (!response.ok) {
          throw new Error(`TMDB details request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setDetails(payload);
      } catch (fetchError) {
        console.error('Failed to fetch TMDB details', fetchError);
        setError('Unable to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [type, id]);

  const title = details?.title ?? details?.name ?? 'Untitled';
  const year = extractYear(details?.release_date ?? details?.first_air_date);
  const overview = details?.overview ?? 'No summary available for this title.';
  const embedUrl = type && id && (type === 'movie' || type === 'tv') ? getVidsyncUrl(type, id) : '';
  const backgroundImage = details?.poster_path ? `${TMDB_IMAGE_BASE}${details.poster_path}` : undefined;

  return (
    <div className="min-h-screen bg-[#06070D] text-white">
      <div className="relative overflow-hidden py-8 px-6 sm:px-10">
        {backgroundImage ? (
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        ) : null}
        <div className="relative z-10 mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-400/40 hover:bg-white/10">
                ← Back to home
              </Link>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/90 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-400/40 hover:bg-zinc-900"
            >
              Go back
            </button>
          </div>

          {loading ? (
            <div className="rounded-4xl border border-white/5 bg-zinc-950 p-12 text-center text-sm text-zinc-400">Loading movie details...</div>
          ) : error ? (
            <div className="rounded-4xl border border-red-500/20 bg-red-500/5 p-12 text-center text-sm text-red-200">{error}</div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-4xl overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                <div className="relative w-full pt-[56.25%] bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    frameBorder="0"
                    allowFullScreen
                    allow="encrypted-media"
                    title={`${title} player`}
                  />
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.35em] text-blue-400">Now playing</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                      {year ? <span>{year}</span> : null}
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">{type?.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/5 bg-zinc-950/80 p-6">
                    <p className="text-sm leading-7 text-zinc-300">{overview}</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-white/5 bg-zinc-950/80 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">IMDb-style score</p>
                    <p className="mt-3 text-4xl font-semibold text-white">{details?.vote_average?.toFixed(1) ?? '—'}</p>
                  </div>
                  {details?.genres?.length ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Genres</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {details.genres.map((genre) => (
                          <span key={genre.id} className="rounded-full bg-white/5 px-3 py-1 text-sm text-zinc-300">{genre.name}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Search, Bell, Home, Film, Tv, Video, Bookmark, Download, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function Layout({ children, user, login }: { children: React.ReactNode, user: any, login: () => void }) {
  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-white font-sans overflow-hidden">
      <aside className="w-56 h-full bg-[#050505] border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg italic">V</div>
          <span className="text-xl font-bold tracking-tight">VELOCITY</span>
        </div>
        <nav className="flex-1 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Browse</h3>
            <Link to="/" className="flex items-center gap-3 text-sm text-blue-400 group">
              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>Home
            </Link>
            <Link to="/movies" className="flex items-center gap-3 pl-4 text-sm text-zinc-400 hover:text-white transition-colors">
              <Film size={16} /> Movies
            </Link>
            <Link to="/tv" className="flex items-center gap-3 pl-4 text-sm text-zinc-400 hover:text-white transition-colors">
              <Tv size={16} /> TV Shows
            </Link>
            <Link to="/anime" className="flex items-center gap-3 pl-4 text-sm text-zinc-400 hover:text-white transition-colors">
              <Video size={16} /> Anime
            </Link>
          </div>
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Library</h3>
            <Link to="/watchlist" className="flex items-center gap-3 pl-4 text-sm text-zinc-400 hover:text-white">
              <Bookmark size={16} /> Watchlist
            </Link>
            <Link to="/downloads" className="flex items-center gap-3 pl-4 text-sm text-zinc-400 hover:text-white">
              <Download size={16} /> Downloads
            </Link>
            <Link to="/history" className="flex items-center gap-3 pl-4 text-sm text-zinc-400 hover:text-white">
              <History size={16} /> History
            </Link>
          </div>
        </nav>
        <div className="pt-6 border-t border-white/5">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600"></div>
              )}
              <div className="text-xs">
                <p className="font-medium truncate max-w-[120px]">{user.displayName || "User"}</p>
                <p className="text-zinc-500">Premium Plan</p>
              </div>
            </div>
          ) : (
            <button onClick={login} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
              Sign In
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0F0F0F]/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input type="text" placeholder="Search for movies, actors, or genres..." className="w-full bg-zinc-900/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>Database Synced
            </div>
            <button className="p-2 text-zinc-400 hover:text-white">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="px-8 py-6">
        <div className="relative h-96 w-full rounded-2xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover brightness-50" alt="Beyond the Horizon" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span className="bg-blue-500/20 px-2 py-0.5 rounded">Trending Now</span> • <span>Sci-Fi Adventure</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Beyond the Horizon</h1>
            <p className="text-zinc-300 max-w-md text-sm leading-relaxed mb-6">In a world where gravity is a luxury, a young pilot discovers a secret that could change the fate of the floating cities forever.</p>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 transition-colors">Watch Now</button>
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-sm font-semibold transition-colors">+ Watchlist</button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Continue Watching</h2>
          <Link to="/history" className="text-xs text-zinc-500 hover:text-white">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "The Neon Syndicate", meta: "S2:E4", progress: 65, img: "https://images.unsplash.com/photo-1616530940355-351fabd9524b" },
            { title: "Midnight Protocol", meta: "S1:E8", progress: 82, img: "https://images.unsplash.com/photo-1485846234645-a62644f84728" },
            { title: "Ancient Echoes", meta: "Movie", progress: 15, img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf" },
            { title: "Solaris Drifter", meta: "S3:E1", progress: 45, img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26" },
          ].map((item, i) => (
            <div key={i} className="space-y-2 group cursor-pointer">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
                <img src={`${item.img}?auto=format&fit=crop&q=80&w=400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-700">
                  <div className="h-full bg-blue-500" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-semibold truncate">{item.title}</h4>
                <span className="text-[10px] text-zinc-500">{item.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recommended for You</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-xs transition-colors"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-xs transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { title: "The Last Oasis", score: "9.2", year: "2024", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0" },
            { title: "Cyber Cities", score: "8.8", year: "2023", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c" },
            { title: "Ghost Protocol", score: "7.9", year: "2024", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0" },
            { title: "Vintage Days", score: "9.5", year: "2023", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1" },
            { title: "Silent Sea", score: "8.1", year: "2022", img: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d" },
            { title: "Neon Dreams", score: "8.5", year: "2023", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5" },
            { title: "Digital Frontier", score: "9.0", year: "2024", img: "https://images.unsplash.com/photo-1614729939124-032f0b5609ce" },
          ].map((item, i) => (
            <div key={i} className="w-36 lg:w-40 flex-shrink-0 space-y-2 cursor-pointer group">
              <div className="aspect-[2/3] rounded-lg bg-zinc-800 overflow-hidden relative">
                <img src={`${item.img}?auto=format&fit=crop&q=80&w=300`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-xs font-semibold truncate px-1">{item.title}</h4>
              <p className="text-[10px] text-zinc-500 italic px-1">{item.score} IMDb • {item.year}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BrowserRouter>
      <Layout user={user} login={login}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<div className="p-8 text-center text-zinc-500">Page under construction</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingHashtag, SafeUser } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { Search, TrendingUp, UserPlus, Check, Sparkles } from 'lucide-react';

export function RightSidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState<TrendingHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SafeUser[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch Trending
    fetch('/api/explore/trending')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTrending(data.data);
      })
      .catch((err) => console.error('Error fetching trending', err));

    // Fetch Suggested Users
    fetch('/api/explore/suggested')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSuggestedUsers(data.data);
      })
      .catch((err) => console.error('Error fetching suggested', err));
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFollowToggle = async (targetUsername: string, userId: string) => {
    if (!user) {
      alert('Please select or log in to a persona to follow users!');
      return;
    }

    const currentStatus = !!followingMap[userId];
    setFollowingMap((prev) => ({ ...prev, [userId]: !currentStatus }));

    try {
      const res = await fetch(`/api/users/${targetUsername}/follow`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        // Rollback
        setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
      }
    } catch {
      setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
    }
  };

  return (
    <aside className="hidden xl:block w-80 h-screen sticky top-0 px-5 py-6 border-l border-slate-200/80 dark:border-zinc-800/80 overflow-y-auto space-y-6 select-none z-30">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags, people, posts..."
          className="w-full bg-slate-100 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </form>

      {/* Trending Topics Card */}
      <div className="glass-panel rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Trending For You
          </h3>
        </div>

        <div className="space-y-2.5">
          {trending.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No trending topics yet.</p>
          ) : (
            trending.slice(0, 5).map((item, index) => (
              <Link
                key={item.id}
                href={`/explore?tag=${item.name}`}
                className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      #{item.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block pl-4">
                    {item.count} {item.count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Who To Follow Card */}
      <div className="glass-panel rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Creators to Follow
          </h3>
        </div>

        <div className="space-y-3">
          {suggestedUsers.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">You are following all featured creators!</p>
          ) : (
            suggestedUsers.slice(0, 4).map((sUser) => {
              const isFollowed = followingMap[sUser.id];
              return (
                <div
                  key={sUser.id}
                  className="flex items-center justify-between gap-2"
                >
                  <Link
                    href={`/${sUser.username}`}
                    className="flex items-center gap-2.5 min-w-0 group"
                  >
                    <Avatar src={sUser.avatarUrl} alt={sUser.name} size="sm" />
                    <div className="truncate">
                      <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {sUser.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        @{sUser.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleFollowToggle(sUser.username, sUser.id)}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isFollowed
                        ? 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    {isFollowed ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> Following
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UserPlus className="w-3 h-3" /> Follow
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-400 dark:text-zinc-500 px-2 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>Prodigy InfoTech FS-05</span>
          <span>•</span>
          <span>Terms</span>
          <span>•</span>
          <span>Privacy</span>
          <span>•</span>
          <span>Guidelines</span>
        </div>
        <p>© 2026 Prodigy Social Network</p>
      </div>
    </aside>
  );
}

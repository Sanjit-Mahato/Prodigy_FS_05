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
    <aside className="hidden xl:block w-80 h-screen sticky top-0 px-5 py-6 border-l border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#07080A] overflow-y-auto space-y-6 select-none z-30 transition-colors">
      {/* Search Input Bar - ITSUA Rectilinear Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags, creators, posts..."
          className="w-full bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none pl-10 pr-4 py-2.5 font-sans text-xs text-[#0E1012] dark:text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
        />
      </form>

      {/* Trending Topics Card - ITSUA Card */}
      <div className="bg-white dark:bg-[#0E1012] rounded-sm p-4 border border-[#E5E7EB] dark:border-[#1F2429]">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#E5E7EB] dark:border-[#1F2429]">
          <TrendingUp className="w-4 h-4 text-[#2F4CFF]" />
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white">
            Trending Tags
          </h3>
        </div>

        <div className="space-y-2">
          {trending.length === 0 ? (
            <p className="font-mono text-xs text-[#6B7280] py-2">No trending tags indexed yet.</p>
          ) : (
            trending.slice(0, 5).map((item, index) => (
              <Link
                key={item.id}
                href={`/explore?tag=${item.name}`}
                className="flex items-center justify-between p-2 rounded-none hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold text-[#6B7280]">
                      #{index + 1}
                    </span>
                    <span className="font-sans font-medium text-xs text-[#0E1012] dark:text-white group-hover:text-[#2F4CFF] transition-colors">
                      #{item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#6B7280] block pl-4">
                    {item.count} {item.count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#2F4CFF] opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Who To Follow Card - ITSUA Card */}
      <div className="bg-white dark:bg-[#0E1012] rounded-sm p-4 border border-[#E5E7EB] dark:border-[#1F2429]">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#E5E7EB] dark:border-[#1F2429]">
          <Sparkles className="w-4 h-4 text-[#008B6B]" />
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white">
            Featured Creators
          </h3>
        </div>

        <div className="space-y-3">
          {suggestedUsers.length === 0 ? (
            <p className="font-mono text-xs text-[#6B7280] py-2">All creators followed in network.</p>
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
                      <p className="font-sans font-medium text-xs text-[#0E1012] dark:text-white group-hover:text-[#2F4CFF] transition-colors truncate">
                        {sUser.name}
                      </p>
                      <p className="font-mono text-[10px] text-[#6B7280] truncate">
                        @{sUser.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleFollowToggle(sUser.username, sUser.id)}
                    className={`shrink-0 px-3 py-1 rounded-none font-mono text-[11px] font-semibold uppercase tracking-wider transition-all ${
                      isFollowed
                        ? 'bg-slate-100 dark:bg-[#151722] text-[#6B7280] border border-[#E5E7EB] dark:border-[#1F2429]'
                        : 'bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012]'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] px-1 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>Kinetic InfoTech FS-05</span>
          <span>•</span>
          <span>Terms</span>
          <span>•</span>
          <span>Privacy</span>
          <span>•</span>
          <span>Guidelines</span>
        </div>
        <p>© 2026 Kinetic Creative Network</p>
      </div>
    </aside>
  );
}

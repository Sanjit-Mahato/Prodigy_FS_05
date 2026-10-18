'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SafeUser, PostWithDetails, TrendingHashtag } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/feed/PostCard';
import {
  Search,
  TrendingUp,
  Users,
  Grid,
  Hash,
  Sparkles,
  Heart,
  MessageCircle,
  Play,
  Loader2,
} from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'media' | 'tags'>('all');
  const [trending, setTrending] = useState<TrendingHashtag[]>([]);
  const [searchResults, setSearchResults] = useState<{
    users: SafeUser[];
    posts: PostWithDetails[];
    tags: TrendingHashtag[];
  }>({ users: [], posts: [], tags: [] });

  const [loading, setLoading] = useState(false);

  // Load trending tags on mount
  useEffect(() => {
    fetch('/api/explore/trending')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTrending(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // If empty, fetch default recent posts
      setLoading(true);
      try {
        const res = await fetch('/api/posts?limit=15');
        const data = await res.json();
        if (data.success) {
          setSearchResults({ users: [], posts: data.data, tags: [] });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/explore/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialTag) {
      setQuery(`#${initialTag}`);
      performSearch(`#${initialTag}`);
    } else if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    } else {
      performSearch('');
    }
  }, [initialQuery, initialTag, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleTagClick = (tagName: string) => {
    setQuery(`#${tagName}`);
    performSearch(`#${tagName}`);
  };

  const mediaPosts = searchResults.posts.filter((p) => p.media && p.media.length > 0);

  return (
    <div>
      {/* Search Header */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, #hashtags, or @creators..."
            className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </form>

        {/* Trending Hashtag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            Trending:
          </span>
          {trending.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.name)}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs"
            >
              #{tag.name}
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-slate-200/80 dark:border-zinc-800/80 mt-2">
          {[
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'people', label: 'People', icon: Users },
            { id: 'media', label: 'Photos & Videos', icon: Grid },
            { id: 'tags', label: 'Tags', icon: Hash },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-medium">Searching content across the network...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* People Section */}
          {(activeTab === 'all' || activeTab === 'people') && searchResults.users.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  People
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/${u.username}`}
                    className="glass-panel rounded-2xl p-3 flex items-center gap-3 hover:border-indigo-400 transition-all group"
                  >
                    <Avatar src={u.avatarUrl} alt={u.name} size="md" />
                    <div className="truncate flex-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {u.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        @{u.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Visual Media Masonry Grid */}
          {(activeTab === 'all' || activeTab === 'media') && mediaPosts.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-purple-500" />
                  Media Showcase
                </h3>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaPosts.map((post) => {
                  const firstMedia = post.media[0];
                  const isVideo = firstMedia.type === 'VIDEO';

                  return (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-sm"
                    >
                      {isVideo ? (
                        <div className="w-full h-full relative">
                          <video
                            src={firstMedia.url}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white">
                            <Play className="w-3 h-3 fill-current" />
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={firstMedia.url}
                          alt="Explore post thumbnail"
                          fill
                          unoptimized={!firstMedia.url.startsWith('http')}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Hover Overlay with Likes & Comments */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-white" />
                          {post._count?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 fill-white" />
                          {post._count?.comments || 0}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feed Posts List */}
          {activeTab === 'all' && searchResults.posts.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Community Posts
              </h3>
              <div className="space-y-4">
                {searchResults.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {(activeTab === 'all' || activeTab === 'tags') && searchResults.tags.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-indigo-500" />
                  Matched Hashtags
                </h3>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {searchResults.tags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTagClick(t.name)}
                    className="glass-panel p-3 rounded-2xl flex items-center justify-between text-left hover:border-indigo-400 transition-all"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        #{t.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.count} {t.count === 1 ? 'post' : 'posts'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty search */}
          {searchResults.users.length === 0 &&
            searchResults.posts.length === 0 &&
            searchResults.tags.length === 0 && (
              <div className="glass-panel rounded-3xl p-10 text-center border border-slate-200/80 dark:border-zinc-800/80">
                <Search className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  No matches found for &quot;{query}&quot;
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Try searching for tags like #nature, #travel, or users like Sarah or Alex.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

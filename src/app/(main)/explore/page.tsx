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
      {/* Search Header - ITSUA Rectilinear System */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, #hashtags, or @creators..."
            className="w-full bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none pl-10 pr-4 py-2.5 font-sans text-xs text-[#0E1012] dark:text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
          />
        </form>

        {/* Trending Hashtag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <span className="font-mono text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#2F4CFF]" />
            Trending:
          </span>
          {trending.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.name)}
              className="shrink-0 px-2.5 py-1 rounded-none font-mono text-xs font-semibold bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] text-[#0E1012] dark:text-white hover:border-[#2F4CFF] hover:text-[#2F4CFF] transition-colors"
            >
              #{tag.name}
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-[#E5E7EB] dark:border-[#1F2429] mt-2">
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
                className={`flex items-center gap-1.5 pb-2.5 px-4 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#2F4CFF] text-[#2F4CFF]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0E1012] dark:hover:text-white'
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
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6B7280]">
          <Loader2 className="w-6 h-6 animate-spin text-[#2F4CFF]" />
          <p className="font-mono text-xs uppercase tracking-wider">Indexing matching records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* People Section */}
          {(activeTab === 'all' || activeTab === 'people') && searchResults.users.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#2F4CFF]" />
                  People
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/${u.username}`}
                    className="bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm p-3 flex items-center gap-3 hover:border-[#2F4CFF] transition-all group"
                  >
                    <Avatar src={u.avatarUrl} alt={u.name} size="md" />
                    <div className="truncate flex-1">
                      <p className="font-sans font-medium text-xs text-[#0E1012] dark:text-white group-hover:text-[#2F4CFF] transition-colors truncate">
                        {u.name}
                      </p>
                      <p className="font-mono text-[11px] text-[#6B7280] truncate">
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
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3 flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-[#2F4CFF]" />
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
                      className="group relative aspect-square rounded-sm overflow-hidden bg-slate-900 border border-[#E5E7EB] dark:border-[#1F2429]"
                    >
                      {isVideo ? (
                        <div className="w-full h-full relative">
                          <video
                            src={firstMedia.url}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 p-1 rounded-none bg-black/80 text-white font-mono text-[10px]">
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
                      <div className="absolute inset-0 bg-[#0E1012]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-mono text-xs">
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
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2F4CFF]" />
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
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#2F4CFF]" />
                  Matched Hashtags
                </h3>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {searchResults.tags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTagClick(t.name)}
                    className="bg-white dark:bg-[#0E1012] p-3 rounded-sm border border-[#E5E7EB] dark:border-[#1F2429] flex items-center justify-between text-left hover:border-[#2F4CFF] transition-all"
                  >
                    <div>
                      <span className="font-mono font-semibold text-xs text-[#0E1012] dark:text-white block">
                        #{t.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#6B7280]">
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
              <div className="bg-white dark:bg-[#0E1012] rounded-sm p-10 text-center border border-[#E5E7EB] dark:border-[#1F2429]">
                <Search className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
                <h3 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">
                  No matches found for &quot;{query}&quot;
                </h3>
                <p className="font-mono text-xs text-[#6B7280] mt-1">
                  Try querying tags like #nature, #travel, or creator names.
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

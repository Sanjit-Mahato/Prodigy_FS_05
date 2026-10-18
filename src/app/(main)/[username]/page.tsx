'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SafeUser, PostWithDetails } from '@/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PostCard } from '@/components/feed/PostCard';
import { Grid, List, Heart, MessageCircle, Play, Loader2, UserX } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<SafeUser | null>(null);
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'grid'>('posts');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${username}`);
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }, [username]);

  const fetchUserPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts?author=${username}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    setLoading(true);
    fetchProfile();
    fetchUserPosts();
  }, [fetchProfile, fetchUserPosts]);

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setUser((prev) =>
      prev
        ? {
            ...prev,
            _count: {
              posts: Math.max(0, (prev._count?.posts || 1) - 1),
              followers: prev._count?.followers || 0,
              following: prev._count?.following || 0,
            },
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading profile @{username}...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/80 dark:border-zinc-800/80 my-8">
        <UserX className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-6">
          The user @{username} does not exist or may have been removed.
        </p>
        <Link
          href="/feed"
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  const mediaPosts = posts.filter((p) => p.media && p.media.length > 0);

  return (
    <div>
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        onUserUpdated={(updated) => setUser((prev) => (prev ? { ...prev, ...updated } : updated))}
      />

      {/* Profile Content Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-zinc-800/80 mb-5">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 pb-3 px-5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 pb-3 px-5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'grid'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Media Grid ({mediaPosts.length})</span>
        </button>
      </div>

      {/* Content Body */}
      {posts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center border border-slate-200/80 dark:border-zinc-800/80">
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            @{user.username} hasn&apos;t shared any posts yet.
          </p>
        </div>
      ) : activeTab === 'posts' ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      ) : (
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
                    alt="Post thumbnail"
                    fill
                    unoptimized={!firstMedia.url.startsWith('http')}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

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
      )}
    </div>
  );
}

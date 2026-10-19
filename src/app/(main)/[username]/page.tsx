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
      <div className="bg-white dark:bg-[#0E1012] rounded-sm p-12 text-center border border-[#E5E7EB] dark:border-[#1F2429] my-8">
        <UserX className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
        <h2 className="font-sans text-lg font-medium text-[#0E1012] dark:text-white">User Record Not Found</h2>
        <p className="font-mono text-xs text-[#6B7280] mt-1 mb-6">
          The handle @{username} is not registered in the network ledger.
        </p>
        <Link
          href="/feed"
          className="px-5 py-2.5 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
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

      {/* Profile Content Tabs - ITSUA System */}
      <div className="flex border-b border-[#E5E7EB] dark:border-[#1F2429] mb-5">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 pb-3 px-5 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-[#2F4CFF] text-[#2F4CFF]'
              : 'border-transparent text-[#6B7280] hover:text-[#0E1012] dark:hover:text-white'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 pb-3 px-5 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'grid'
              ? 'border-[#2F4CFF] text-[#2F4CFF]'
              : 'border-transparent text-[#6B7280] hover:text-[#0E1012] dark:hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Media Grid ({mediaPosts.length})</span>
        </button>
      </div>

      {/* Content Body */}
      {posts.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1012] rounded-sm p-10 text-center border border-[#E5E7EB] dark:border-[#1F2429]">
          <p className="font-mono text-xs text-[#6B7280]">
            @{user.username} hasn&apos;t published any entries yet.
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
                    alt="Post thumbnail"
                    fill
                    unoptimized={!firstMedia.url.startsWith('http')}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

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
      )}
    </div>
  );
}

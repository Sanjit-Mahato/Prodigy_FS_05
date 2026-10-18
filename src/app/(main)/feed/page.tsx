'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PostWithDetails } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostBox } from '@/components/feed/CreatePostBox';
import { motion } from 'framer-motion';
import { Sparkles, Users, RefreshCw, Loader2 } from 'lucide-react';

export default function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async (tab: 'forYou' | 'following') => {
    try {
      const res = await fetch(`/api/posts?feed=${tab}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts(activeTab);
  }, [activeTab, fetchPosts, user]);

  // Listen for newly created posts from global modal or inline box
  useEffect(() => {
    const handleNewPost = (e: Event) => {
      const customEvent = e as CustomEvent<PostWithDetails>;
      if (customEvent.detail) {
        setPosts((prev) => [customEvent.detail, ...prev]);
      }
    };
    window.addEventListener('post-created', handleNewPost);
    return () => window.removeEventListener('post-created', handleNewPost);
  }, []);

  const handlePostCreated = (newPost: PostWithDetails) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(activeTab);
  };

  return (
    <div>
      {/* Feed Header & Tabs */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-zinc-800/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'forYou'
                ? 'text-indigo-600 dark:text-white'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {activeTab === 'forYou' && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">For You</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'following'
                ? 'text-indigo-600 dark:text-white'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {activeTab === 'following' && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <Users className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Following</span>
          </button>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-full text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title="Refresh Feed"
          aria-label="Refresh Feed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Inline Post Creator */}
      <CreatePostBox onPostCreated={handlePostCreated} />

      {/* Feed Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-medium">Curating your personalized feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center border border-slate-200/80 dark:border-zinc-800/80">
          <Users className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {activeTab === 'following'
              ? 'No posts from people you follow yet'
              : 'No posts available in this feed'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            {activeTab === 'following'
              ? 'Follow creators like Sarah, Alex, or Leo from the right sidebar to see their photos and updates here!'
              : 'Be the first to share an inspiring post, photo, or video!'}
          </p>
          {activeTab === 'following' && (
            <button
              onClick={() => setActiveTab('forYou')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
            >
              Explore &quot;For You&quot; Feed
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

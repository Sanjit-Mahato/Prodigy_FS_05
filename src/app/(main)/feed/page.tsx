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
      {/* Feed Header & Tabs - ITSUA Planar Architecture */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB] dark:border-[#1F2429]">
        <div className="flex items-center gap-1 border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] p-1 rounded-none">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'forYou'
                ? 'bg-[#0E1012] dark:bg-white text-white dark:text-[#0E1012]'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#0E1012] dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'following'
                ? 'bg-[#0E1012] dark:bg-white text-white dark:text-[#0E1012]'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#0E1012] dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] text-[#6B7280] hover:text-[#2F4CFF] hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors"
          title="Refresh Feed"
          aria-label="Refresh Feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#2F4CFF]' : ''}`} />
        </button>
      </div>

      {/* Inline Post Creator */}
      <CreatePostBox onPostCreated={handlePostCreated} />

      {/* Feed Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6B7280]">
          <Loader2 className="w-6 h-6 animate-spin text-[#2F4CFF]" />
          <p className="font-mono text-xs uppercase tracking-wider">Syncing feed stream...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm p-10 text-center">
          <Users className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
          <h3 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">
            {activeTab === 'following'
              ? 'No posts from followed creators yet'
              : 'No posts currently indexed'}
          </h3>
          <p className="font-mono text-xs text-[#6B7280] max-w-sm mx-auto mt-1 mb-5">
            {activeTab === 'following'
              ? 'Follow creators from the sidebar or explore feed to see their photos and updates here.'
              : 'Be the first to publish a post, photo, or 60fps video.'}
          </p>
          {activeTab === 'following' && (
            <button
              onClick={() => setActiveTab('forYou')}
              className="px-5 py-2.5 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Explore Global Feed
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

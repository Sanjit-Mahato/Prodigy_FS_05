'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostWithDetails } from '@/types';
import { PostCard } from '@/components/feed/PostCard';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center border border-slate-200/80 dark:border-zinc-800/80 my-8">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Post Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-5">
          This post may have been deleted or is unavailable.
        </p>
        <Link
          href="/feed"
          className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200/80 dark:border-zinc-800/80">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-zinc-200" />
        </button>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">Post</h1>
      </div>

      <PostCard
        post={post}
        onPostDeleted={() => router.push('/feed')}
      />
    </div>
  );
}

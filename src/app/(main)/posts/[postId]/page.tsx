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
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#6B7280]">
        <Loader2 className="w-6 h-6 animate-spin text-[#2F4CFF]" />
        <p className="font-mono text-xs uppercase tracking-wider">Loading record...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white dark:bg-[#0E1012] rounded-sm p-10 text-center border border-[#E5E7EB] dark:border-[#1F2429] my-8">
        <AlertCircle className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
        <h2 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">Post Not Found</h2>
        <p className="font-mono text-xs text-[#6B7280] mt-1 mb-5">
          This post entry does not exist or has been removed from the network ledger.
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#E5E7EB] dark:border-[#1F2429]">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] hover:bg-slate-50 dark:hover:bg-[#151722] text-[#0E1012] dark:text-white transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">Post Ledger</h1>
      </div>

      <PostCard
        post={post}
        initialShowComments={true}
        onPostDeleted={() => router.push('/feed')}
      />
    </div>
  );
}

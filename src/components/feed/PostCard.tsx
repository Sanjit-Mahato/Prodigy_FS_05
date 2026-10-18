'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PostWithDetails, CommentWithAuthor } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { MediaCarousel } from './MediaCarousel';
import { HeartAnimation } from './HeartAnimation';
import { tokenizeCaption } from '@/lib/parser';
import { formatRelativeTime } from '@/lib/utils';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Send,
  CornerDownRight,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  post: PostWithDetails;
  onPostDeleted?: (postId: string) => void;
}

export function PostCard({ post, onPostDeleted }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [commentsCount, setCommentsCount] = useState(post._count?.comments || 0);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  // Menu dropdown state
  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = user?.id === post.authorId;

  // Like Toggle Function
  const handleLike = async () => {
    if (!user) {
      alert('Please select or login as a user to like posts!');
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;

    // Optimistic update
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : Math.max(0, likesCount - 1));

    if (newLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        // Rollback on failure
        setIsLiked(previousLiked);
        setLikesCount(previousCount);
      }
    } catch {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    } else {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  // Comments loading
  const toggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);
    if (nextState && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        const data = await res.json();
        if (data.success) {
          setComments(data.data);
        }
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText.trim(),
          parentId: replyingTo?.id || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (replyingTo) {
          // Add reply to parent comment
          setComments((prev) =>
            prev.map((c) =>
              c.id === replyingTo.id
                ? { ...c, replies: [...(c.replies || []), data.data] }
                : c
            )
          );
        } else {
          // Add top-level comment
          setComments((prev) => [data.data, ...prev]);
        }
        setCommentsCount((prev) => prev + 1);
        setCommentText('');
        setReplyingTo(null);
      }
    } catch (err) {
      console.error('Error posting comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string, isReply: boolean = false, parentId?: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (isReply && parentId) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: (c.replies || []).filter((r) => r.id !== commentId) }
                : c
            )
          );
        } else {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
        setCommentsCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/posts/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by @${post.author.username}`,
          text: post.caption || 'Check out this post on Prodigy Social!',
          url: postUrl,
        });
      } catch {
        // User cancelled or fallback
      }
    } else {
      await navigator.clipboard.writeText(postUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const tokens = tokenizeCaption(post.caption);

  return (
    <article className="glass-panel rounded-3xl p-4 sm:p-5 mb-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <HeartAnimation show={showHeartBurst} />

      {/* Post Header */}
      <div className="flex items-center justify-between mb-3.5">
        <Link
          href={`/${post.author.username}`}
          className="flex items-center gap-3 group"
        >
          <Avatar
            src={post.author.avatarUrl}
            alt={post.author.name}
            size="md"
            className="group-hover:ring-indigo-500 transition-all"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.author.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
              <span>@{post.author.username}</span>
              <span>•</span>
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {formatRelativeTime(post.createdAt)}
              </time>
            </div>
          </div>
        </Link>

        {/* More Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute right-0 mt-1 w-44 rounded-2xl glass-dropdown z-40 p-1.5 shadow-xl border border-slate-200 dark:border-zinc-800 text-xs"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleShare();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share link
                  </button>

                  {isAuthor && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDeletePost();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete post
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-sm text-slate-800 dark:text-zinc-200 mb-3 whitespace-pre-line leading-relaxed break-words">
          {tokens.map((token, idx) => {
            if (token.type === 'hashtag') {
              return (
                <Link
                  key={idx}
                  href={token.href!}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-block mr-1"
                >
                  {token.value}
                </Link>
              );
            }
            if (token.type === 'mention') {
              return (
                <Link
                  key={idx}
                  href={token.href!}
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:underline inline-block mr-1"
                >
                  {token.value}
                </Link>
              );
            }
            return <span key={idx}>{token.value}</span>;
          })}
        </p>
      )}

      {/* Media Carousel */}
      {post.media && post.media.length > 0 && (
        <div className="mb-3.5">
          <MediaCarousel media={post.media} onDoubleTap={handleDoubleTap} />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1 text-slate-600 dark:text-zinc-400">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 group transition-colors focus:outline-none ${
              isLiked ? 'text-rose-500' : 'hover:text-rose-500'
            }`}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <motion.div
              whileTap={{ scale: 0.75 }}
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.25 }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-rose-500'
                }`}
              />
            </motion.div>
            <span className="text-xs font-semibold tabular-nums">
              {likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={toggleComments}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
            aria-label="View comments"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-semibold tabular-nums">
              {commentsCount}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none relative"
            aria-label="Share post"
            title="Share post"
          >
            {isCopied ? (
              <Check className="w-5 h-5 text-emerald-500" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            {isCopied && (
              <span className="text-[11px] font-medium text-emerald-500 animate-fade-in">
                Copied!
              </span>
            )}
          </button>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${
            isSaved ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label={isSaved ? 'Remove bookmark' : 'Bookmark post'}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-800/80"
          >
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-4">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl mb-2 text-xs text-indigo-700 dark:text-indigo-300">
                    <span className="flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      Replying to @{replyingTo.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="font-bold hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : 'Write a comment...'}
                      className="w-full bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/80 rounded-full px-4 py-2 pr-10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || submittingComment}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 disabled:opacity-40 disabled:hover:text-indigo-600 transition-colors"
                      aria-label="Send comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3 italic">
                Select a demo persona or log in to leave comments.
              </p>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <div className="py-4 text-center text-xs text-slate-400">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="py-3 text-center text-xs text-slate-400">No comments yet. Be the first to chime in!</div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="text-xs group">
                    <div className="flex items-start gap-2.5">
                      <Link href={`/${comment.user.username}`}>
                        <Avatar src={comment.user.avatarUrl} alt={comment.user.name} size="sm" />
                      </Link>
                      <div className="flex-1 bg-slate-100/70 dark:bg-zinc-800/50 rounded-2xl p-2.5">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <Link
                            href={`/${comment.user.username}`}
                            className="font-bold text-slate-900 dark:text-white hover:underline"
                          >
                            {comment.user.name}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                            {(user?.id === comment.userId || isAuthor) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-800 dark:text-zinc-200 leading-relaxed break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    {/* Reply button */}
                    {user && (
                      <div className="ml-10 mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                        <button
                          onClick={() => setReplyingTo({ id: comment.id, username: comment.user.username })}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 mt-2 space-y-2 border-l-2 border-slate-200 dark:border-zinc-800 pl-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2 group/reply">
                            <Link href={`/${reply.user.username}`}>
                              <Avatar src={reply.user.avatarUrl} alt={reply.user.name} size="xs" />
                            </Link>
                            <div className="flex-1 bg-slate-100/50 dark:bg-zinc-800/30 rounded-xl p-2">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <Link
                                  href={`/${reply.user.username}`}
                                  className="font-bold text-[11px] text-slate-900 dark:text-white hover:underline"
                                >
                                  {reply.user.name}
                                </Link>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-slate-400">
                                    {formatRelativeTime(reply.createdAt)}
                                  </span>
                                  {(user?.id === reply.userId || isAuthor) && (
                                    <button
                                      onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                      className="opacity-0 group-hover/reply:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity"
                                      title="Delete reply"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-800 dark:text-zinc-200 leading-relaxed break-words">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { HeartAnimation } from '@/components/feed/HeartAnimation';
import { Avatar } from '@/components/ui/Avatar';

interface SandboxComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

export function InteractiveSandbox() {
  const [likes, setLikes] = useState(1842);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<SandboxComment[]>([
    {
      id: '1',
      author: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: 'The dynamic range in this shot is staggering. Shot on 35mm f/2.8?',
      time: '12m ago',
    },
    {
      id: '2',
      author: 'Leo Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      text: 'Color grade is so natural. Love how the highlights roll off.',
      time: '4m ago',
    },
  ]);

  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Moraine Lake at sunrise. 45MP uncompressed RAW.',
      alt: 'Alpine turquoise lake surrounded by rugged mountains',
    },
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Mist peeling off Mount Temple ridgeline.',
      alt: 'Sharp mountain peak piercing through mist',
    },
  ];

  const handleDoubleTap = () => {
    setShowHeartBurst(true);
    if (!isLiked) {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: SandboxComment = {
      id: Date.now().toString(),
      author: 'You (Visitor)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      text: commentText.trim(),
      time: 'Just now',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  return (
    <section className="py-24 bg-white dark:bg-[#07080A] border-b border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Instructions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold tracking-wider uppercase text-[#0E1012] dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#2F4CFF]" />
              <span>Interactive Verification Simulator</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-[#0E1012] dark:text-white leading-[1.08]">
              Try the interaction engine right now.
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              No account required. Double-tap the photo to trigger the spring particle burst, swipe through the 45MP uncompressed carousel, or leave an inline reply.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-3 border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm bg-white dark:bg-[#0E1012]">
                <span className="w-8 h-8 rounded-none bg-[#0E1012] text-white flex items-center justify-center shrink-0 font-mono font-semibold text-xs">
                  01
                </span>
                <div>
                  <h4 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">Double-Tap Heart Burst</h4>
                  <p className="font-sans text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Touch or double-click anywhere on the photo for instant optimistic feedback.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm bg-white dark:bg-[#0E1012]">
                <span className="w-8 h-8 rounded-none bg-[#2F4CFF] text-white flex items-center justify-center shrink-0 font-mono font-semibold text-xs">
                  02
                </span>
                <div>
                  <h4 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">Multi-Photo Carousel</h4>
                  <p className="font-sans text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Navigate slides while preserving native aspect ratios without algorithmic cropping.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm bg-white dark:bg-[#0E1012]">
                <span className="w-8 h-8 rounded-none bg-[#008B6B] text-white flex items-center justify-center shrink-0 font-mono font-semibold text-xs">
                  03
                </span>
                <div>
                  <h4 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">Live Comment Appending</h4>
                  <p className="font-sans text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Type a message below to test real-time optimistic thread updating.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Card - ITSUA Card (rounded-sm 4px, border #E5E7EB, planar flat) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm overflow-hidden max-w-lg mx-auto">
              {/* Post Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012]">
                <div className="flex items-center gap-3">
                  <Avatar
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
                    alt="Sarah Chen"
                    size="md"
                  />
                  <div>
                    <h4 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">Sarah Chen</h4>
                    <p className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF]">@sarah_c • Banff National Park</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#2F4CFF] bg-[#2F4CFF]/5 border border-[#2F4CFF]/20 px-2.5 py-1 rounded-none uppercase">
                  #travel
                </span>
              </div>

              {/* Caption */}
              <p className="px-5 py-4 font-sans text-base text-[#0E1012] dark:text-slate-200 leading-relaxed border-b border-[#E5E7EB] dark:border-[#1F2429]">
                Alpine glow over Moraine Lake. Double-tap to feel the spring physics burst!{' '}
                <span className="text-[#2F4CFF] font-semibold">#nature #photography</span>
              </p>

              {/* Media Carousel Viewport */}
              <div
                className="relative aspect-[16/10] bg-black overflow-hidden select-none cursor-pointer border-b border-[#E5E7EB] dark:border-[#1F2429]"
                onDoubleClick={handleDoubleTap}
              >
                {/* Image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={slides[currentSlide].url}
                    alt={slides[currentSlide].alt}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Heart Burst Animation */}
                <HeartAnimation show={showHeartBurst} />

                {/* Carousel Controls */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-none bg-[#0E1012]/90 text-white flex items-center justify-center hover:bg-black transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-none bg-[#0E1012]/90 text-white flex items-center justify-center hover:bg-black transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Pagination Indicator */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-none bg-[#0E1012]/90 text-white font-mono text-xs font-semibold tracking-wider">
                      {currentSlide + 1} / {slides.length}
                    </div>
                  </>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012]">
                <div className="flex items-center gap-6">
                  <button
                    onClick={toggleLike}
                    className="flex items-center gap-2 group transition-transform active:scale-95"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-[#6B7280] dark:text-[#9CA3AF] group-hover:text-[#0E1012] dark:group-hover:text-white'
                      }`}
                    />
                    <span className="font-mono text-sm font-semibold text-[#0E1012] dark:text-slate-200">
                      {likes.toLocaleString()}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#9CA3AF]">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-mono text-sm font-semibold text-[#0E1012] dark:text-slate-200">
                      {comments.length}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2F4CFF]">
                  Double-tap to test
                </span>
              </div>

              {/* Comments Stream */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#07080A] max-h-52 overflow-y-auto space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 text-sm">
                    <Avatar src={c.avatar} alt={c.author} size="sm" />
                    <div className="flex-1">
                      <span className="font-sans font-medium text-[#0E1012] dark:text-white mr-2">
                        {c.author}
                      </span>
                      <span className="font-sans text-[#0E1012] dark:text-slate-300">
                        {c.text}
                      </span>
                      <span className="block font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        {c.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input Box - ITSUA input & button (0px radius, border #E5E7EB, mono typography) */}
              <form onSubmit={handleAddComment} className="p-3 border-t border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment to test..."
                  className="flex-1 bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none px-3.5 py-2.5 font-sans text-sm text-[#0E1012] dark:text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-5 py-2.5 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

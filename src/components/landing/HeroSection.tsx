'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Film, Heart, MessageCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

const HERO_CAROUSEL_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    title: 'Alpine Sunrise over Moraine Lake',
    caption: 'Sunrise over Moraine Lake. Double-tap to trigger the spring heart animation.',
    tag: '#travel #nature',
    specs: 'ISO 64 • 28mm ƒ/5.6',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Brutalist Monolith Cantilever',
    caption: 'Structural cantilever concrete study under dawn overcast lighting.',
    tag: '#architecture #brutalism',
    specs: 'ISO 100 • 24mm ƒ/2.8',
  },
  {
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    title: 'Volumetric Rain Streets',
    caption: 'Anamorphic cine frame captured during midnight storm in Shinjuku.',
    tag: '#cinema #night',
    specs: 'ISO 1600 • 50mm ƒ/1.2',
  },
];

export function HeroSection() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [likes, setLikes] = useState(1842);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const lastTapRef = useRef<number>(0);

  // 3D Perspective Hover Tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      triggerLike();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const triggerLike = () => {
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
    if (!isLiked) {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % HERO_CAROUSEL_IMAGES.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + HERO_CAROUSEL_IMAGES.length) % HERO_CAROUSEL_IMAGES.length);
  };

  const currentItem = HERO_CAROUSEL_IMAGES[photoIndex];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-24 border-b border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#07080A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Mono Label - ITSUA mono-label-sm */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] text-[#0E1012] dark:text-white font-mono text-[12px] font-semibold tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-[#008B6B] inline-block" />
            <span>KINETIC • High-Velocity Social Architecture</span>
          </motion.div>

          {/* Main Title - Space Grotesk headline-lg (72px / 48px), 2 lines max at all viewports */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-medium tracking-tight text-[#0E1012] dark:text-white leading-[1.05]"
          >
            Uncompressed photos.{' '}
            <span className="text-[#2F4CFF]">
              Real cinema.
            </span>
          </motion.h1>

          {/* Subtitle - Space Grotesk body-lg (18px) */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed font-sans max-w-2xl mx-auto"
          >
            Publish 45MP photo carousels and 60fps video reels directly from your camera. Follow photographers and motion designers, join discussion threads, and browse work in chronological order.
          </motion.p>

          {/* Primary & Secondary Actions - ITSUA button-primary and button-secondary (0px radius, 64px height, mono-label-md) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/feed"
              className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono font-semibold text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 transition-colors group"
            >
              <span>Open Feed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#hyperframes-showcase"
              className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-none bg-[#2F4CFF] hover:bg-[#253dcf] text-white font-mono font-semibold text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 transition-colors"
            >
              <Film className="w-4 h-4" />
              <span>Watch Animation</span>
            </a>
          </motion.div>
        </div>

        {/* Central Hero Exhibition Showcase with 3D Tilt & Double-Tap Heart Physics */}
        <div className="relative mt-16 sm:mt-20 max-w-5xl mx-auto perspective-[1200px]">
          {/* Main Central Card */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm p-6 sm:p-7 max-w-xl mx-auto relative z-10 select-none cursor-pointer"
            onClick={handleDoubleTap}
          >
            {/* Double Tap Heart Burst Animation */}
            <AnimatePresence>
              {showHeartBurst && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: [0.4, 1.3, 1] }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                  <Heart className="w-24 h-24 fill-rose-500 stroke-rose-400 drop-shadow-[0_0_24px_rgba(244,63,94,0.6)]" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
                  alt="Sarah Chen"
                  size="md"
                />
                <div>
                  <h4 className="text-base font-medium font-sans text-[#0E1012] dark:text-white">
                    Sarah Chen
                  </h4>
                  <p className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    @sarah_c • Banff National Park
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-sm border border-[#2F4CFF]/30 font-mono text-xs font-semibold text-[#2F4CFF] bg-[#2F4CFF]/5 uppercase">
                {currentItem.tag.split(' ')[0]}
              </span>
            </div>

            <p className="font-sans text-base text-[#0E1012] dark:text-slate-200 mb-4 leading-relaxed">
              {currentItem.caption}
            </p>

            {/* Interactive Photo Frame with Carousel Controls */}
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-black select-none border border-[#E5E7EB] dark:border-[#1F2429] group/frame">
              <Image
                src={currentItem.src}
                alt={currentItem.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4">
                <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
                  {currentItem.specs}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase bg-[#0E1012]/80 border border-white/20 text-white px-2 py-0.5">
                  {photoIndex + 1}/{HERO_CAROUSEL_IMAGES.length} Photos
                </span>
              </div>

              {/* Prev/Next Buttons */}
              <button
                onClick={prevPhoto}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#0E1012]/80 text-white border border-white/20 hover:bg-black opacity-0 group-hover/frame:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#0E1012]/80 text-white border border-white/20 hover:bg-black opacity-0 group-hover/frame:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 text-[#6B7280] dark:text-[#9CA3AF] font-mono text-xs">
              <div className="flex items-center gap-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerLike();
                  }}
                  className={`flex items-center gap-1.5 font-semibold transition-colors ${
                    isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? 'fill-rose-500 stroke-rose-500' : ''
                    }`}
                  />
                  <span>{likes.toLocaleString()}</span>
                </button>
                <span className="flex items-center gap-1.5 font-medium">
                  <MessageCircle className="w-4 h-4" />
                  128
                </span>
              </div>
              <span className="font-semibold text-[#2F4CFF] uppercase tracking-wider">
                Double-tap to like
              </span>
            </div>
          </motion.div>

          {/* Context Badges */}
          <motion.div
            initial={{ opacity: 0, x: -24, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:block absolute -left-6 top-16 w-64 bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm p-4 -rotate-1 hover:rotate-0 transition-transform z-20"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2F4CFF]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white">
                Live Interaction
              </span>
            </div>
            <p className="font-sans text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="font-semibold text-[#2F4CFF]">@alex_r</span> liked your photo reel.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
            className="hidden md:block absolute -right-6 bottom-10 w-64 bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm p-4 rotate-1 hover:rotate-0 transition-transform z-20"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#008B6B]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white">
                Network Metric
              </span>
            </div>
            <p className="font-sans text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="font-semibold text-[#008B6B]">@maya_p</span> joined your network graph.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

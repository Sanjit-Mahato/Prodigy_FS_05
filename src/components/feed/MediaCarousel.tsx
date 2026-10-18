'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaCarouselProps {
  media: MediaItem[];
  onDoubleTap?: () => void;
}

export function MediaCarousel({ media, onDoubleTap }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);

  if (!media || media.length === 0) return null;

  const handlePointerDown = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (onDoubleTap) onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : prev));
  };

  const currentItem = media[currentIndex];
  const isVideo = currentItem.type === 'VIDEO';

  const toggleVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isExternalUrl = currentItem.url.startsWith('http://') || currentItem.url.startsWith('https://');

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-900 rounded-2xl select-none group aspect-[4/3] sm:aspect-[16/10] max-h-[520px] flex items-center justify-center"
      onPointerDown={handlePointerDown}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={currentItem.url}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <button
                onClick={toggleVideoPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {!isPlaying && (
                  <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-indigo-600 shadow-xl transition-transform transform hover:scale-110">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                )}
              </button>

              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all z-20"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <Image
              src={currentItem.url}
              alt="Post media"
              fill
              unoptimized={!isExternalUrl}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
              priority={currentIndex === 0}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Multiple media carousel arrows */}
      {media.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < media.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 py-1 px-2.5 rounded-full bg-black/40 backdrop-blur-md">
            {media.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'w-4 bg-white'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Media Count Pill */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white/90 z-20">
            {currentIndex + 1}/{media.length}
          </div>
        </>
      )}
    </div>
  );
}

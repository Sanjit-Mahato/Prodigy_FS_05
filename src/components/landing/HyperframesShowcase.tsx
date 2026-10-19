'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Layers, MessageCircle, Heart, Film } from 'lucide-react';

const MILESTONES = [
  { label: 'Kinetic Intro', time: 0.1, icon: Film, desc: 'Typography typography beats' },
  { label: 'Double-Tap Burst', time: 3.2, icon: Heart, desc: 'Spring particle burst & optimistic like' },
  { label: 'Carousel Swipe', time: 4.4, icon: Layers, desc: 'Multi-image aspect preservation' },
  { label: 'Nested Comments', time: 5.4, icon: MessageCircle, desc: 'Threaded creator conversation' },
];

export function HyperframesShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(8);
  const [activeMilestone, setActiveMilestone] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const idx = MILESTONES.findIndex((m, i) => {
        const nextTime = MILESTONES[i + 1]?.time ?? duration;
        return video.currentTime >= m.time && video.currentTime < nextTime;
      });
      if (idx !== -1) setActiveMilestone(idx);
    };

    const onLoadedMetadata = () => {
      if (video.duration) setDuration(video.duration);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [duration]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const jumpTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    }
  };

  const restart = () => {
    jumpTo(0);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#07080A] text-white border-b border-[#1F2429]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1F2429] bg-[#0E1012] font-mono text-xs font-semibold tracking-wider uppercase text-white mb-4">
            <Film className="w-3.5 h-3.5 text-[#2F4CFF]" />
            <span>HyperFrames Animation Engine • 30fps Deterministic Render</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-white leading-[1.08]">
            Simulated interaction timeline in motion.
          </h2>

          <p className="mt-4 font-sans text-base sm:text-lg text-[#9CA3AF] font-normal leading-relaxed">
            Rendered frame-by-frame with Headless Chrome and FFmpeg via HyperFrames. Click any chapter below to inspect double-tap heart bursts, multi-photo swiping, and nested replies.
          </p>
        </div>

        {/* Video Player Container - ITSUA Card (rounded-sm 4px, border #1F2429) */}
        <div className="relative rounded-sm overflow-hidden bg-[#0E1012] border border-[#1F2429]">
          {/* Top Video Chrome Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1F2429] bg-[#0E1012] font-mono text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0E1012] border border-[#1F2429] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#008B6B] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F4CFF] inline-block" />
              <span className="ml-3 font-semibold uppercase tracking-wider text-slate-200">
                hyperframes-showcase.mp4
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#008B6B] font-semibold uppercase tracking-wider">1280×720 @ 30FPS</span>
              <button
                onClick={restart}
                className="hover:text-white p-1 rounded-none transition-colors"
                title="Restart playback"
                aria-label="Restart playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black group">
            <video
              ref={videoRef}
              src="/animations/hyperframes-showcase.mp4"
              poster="/animations/hyperframes-showcase-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Play/Pause Center Indicator on hover */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-none bg-[#0E1012]/90 border border-[#1F2429] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-white" />}
            </button>

            {/* Progress Line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 bg-[#1F2429] cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                jumpTo(pos * duration);
              }}
            >
              <div
                className="h-full bg-[#2F4CFF] transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Interactive Chapter Buttons - ITSUA rectilinear grid buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F2429]">
            {MILESTONES.map((m, idx) => {
              const Icon = m.icon;
              const isActive = activeMilestone === idx;
              return (
                <button
                  key={m.label}
                  onClick={() => jumpTo(m.time)}
                  className={`p-4 text-left rounded-none transition-all ${
                    isActive
                      ? 'bg-[#0E1012] text-white border-b-2 border-[#2F4CFF]'
                      : 'bg-[#0E1012]/90 text-[#9CA3AF] hover:bg-[#0E1012] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2F4CFF]' : 'text-[#6B7280]'}`} />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                      {m.label}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#9CA3AF] line-clamp-1">
                    {m.desc}
                  </p>
                  <span className="font-mono text-xs font-semibold text-[#6B7280] mt-2 block">
                    0:0{Math.floor(m.time)}S
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

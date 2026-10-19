'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import Link from 'next/link';

export function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3D Tilt perspective transform
  const rotateX = useTransform(smoothProgress, [0, 0.4, 0.7, 1], [16, 0, 0, -10]);
  const scale = useTransform(smoothProgress, [0, 0.4, 0.7, 1], [0.9, 1, 1, 0.94]);
  const translateY = useTransform(smoothProgress, [0, 0.4, 0.7, 1], [60, 0, 0, -40]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-[#07080A] text-white border-b border-[#1F2429]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - 2 lines max at all widths */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1F2429] bg-[#0E1012] font-mono text-xs font-semibold tracking-wider uppercase text-white">
            <span className="w-2 h-2 rounded-full bg-[#008B6B]" />
            <span>ITSUA Motion Performance Ledgers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-white leading-[1.08]">
            Tuned for 60 frames per second.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#9CA3AF] font-normal leading-relaxed">
            Every interaction is tuned with spring physics, zero-delay optimistic updates, and native gestures that respond directly to scroll and touch.
          </p>
        </div>

        {/* 3D Scroll-Animated Stage */}
        <div className="perspective-[1200px] flex justify-center py-6">
          <motion.div
            style={{
              rotateX,
              scale,
              y: translateY,
              opacity,
              transformStyle: 'preserve-3d',
            }}
            className="w-full max-w-4xl rounded-sm bg-[#0E1012] border border-[#1F2429] overflow-hidden"
          >
            {/* Mockup Title Bar */}
            <div className="px-6 py-3.5 bg-[#0E1012] border-b border-[#1F2429] flex items-center justify-between font-mono text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F2429] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#008B6B] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F4CFF] inline-block" />
                <span className="ml-3 font-semibold text-slate-200 uppercase tracking-wider">kinetic.network/feed</span>
              </div>
              <span className="font-semibold text-[#2F4CFF] uppercase tracking-wider">Feed Specimen</span>
            </div>

            {/* App Interface Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Column: Creator Profile Snap */}
              <div className="md:col-span-5 p-6 sm:p-8 bg-[#0E1012] border-r border-[#1F2429] space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt="Leo Vance"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-sans text-base font-medium text-white">Leo Vance</h4>
                    <p className="font-mono text-xs text-[#6B7280]">@leo_v • 3D Motion</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 text-center">
                  <div className="bg-[#07080A] border border-[#1F2429] p-3 rounded-none">
                    <span className="block font-mono text-base font-semibold text-white">48</span>
                    <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">Posts</span>
                  </div>
                  <div className="bg-[#07080A] border border-[#1F2429] p-3 rounded-none">
                    <span className="block font-mono text-base font-semibold text-[#2F4CFF]">3.4k</span>
                    <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">Followers</span>
                  </div>
                  <div className="bg-[#07080A] border border-[#1F2429] p-3 rounded-none">
                    <span className="block font-mono text-base font-semibold text-[#008B6B]">412</span>
                    <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider">Following</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-sm text-[#9CA3AF]">
                  <p className="leading-relaxed">
                    Exploring kinetic choreography and shader pipelines. Sharing raw renders and process shots.
                  </p>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#2F4CFF]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Vancouver, BC • leovance.design</span>
                  </div>
                </div>

                <Link
                  href="/feed"
                  className="block w-full py-3 text-center font-mono text-xs font-semibold uppercase tracking-wider bg-[#2F4CFF] hover:bg-[#253dcf] text-white rounded-none transition-colors"
                >
                  View Leo&apos;s Feed
                </Link>
              </div>

              {/* Right Column: 3D Render Post with Heart Interaction */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-4 bg-[#07080A]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-medium text-white text-sm">Leo Vance</span>
                    <span className="text-[#6B7280]">• 2h ago</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-none font-mono text-[11px] font-semibold bg-[#2F4CFF]/10 text-[#2F4CFF] border border-[#2F4CFF]/20 uppercase">
                    #motion #3d
                  </span>
                </div>

                <p className="font-sans text-sm text-slate-200 leading-relaxed">
                  Volumetric lighting test rendered with custom metal shaders. High frame rate raw playback.
                </p>

                <div className="relative aspect-video rounded-sm overflow-hidden bg-black select-none border border-[#1F2429]">
                  <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
                    alt="Cyberpunk 3D Lighting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3.5 text-white">
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-300">Uncompressed 4K</span>
                    <span className="font-mono text-xs font-semibold text-[#008B6B] uppercase tracking-wider">60 FPS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-[#9CA3AF] pt-2">
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                      <Heart className="w-4 h-4 fill-rose-500" />
                      924
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      48 comments
                    </span>
                  </div>
                  <span className="text-[#2F4CFF] uppercase tracking-wider">
                    Double-tap to like
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technical Ledger Strip - ITSUA Color-coded Metrics & Structured Table */}
        <div className="mt-16 bg-[#0E1012] border border-[#1F2429] rounded-sm p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2F4CFF]">
                System Architecture
              </span>
              <h3 className="font-sans text-2xl font-medium text-white tracking-tight leading-snug">
                Verified platform throughput benchmarks.
              </h3>
              <p className="font-sans text-sm text-[#9CA3AF] leading-relaxed">
                Measured in local tests with real SQLite foreign key relations, zero artificial delay, and raw camera uploads.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#07080A] border border-[#1F2429] p-4 rounded-none space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Media Pipeline</span>
                  <span className="font-mono text-[11px] font-semibold text-[#2F4CFF] border border-[#2F4CFF]/30 px-2 py-0.5 rounded-none uppercase">20MB / 50MB</span>
                </div>
                <p className="font-sans text-xs text-[#9CA3AF]">Multipart upload pipeline with strict MIME type validation.</p>
              </div>

              <div className="bg-[#07080A] border border-[#1F2429] p-4 rounded-none space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Optimistic Latency</span>
                  <span className="font-mono text-[11px] font-semibold text-[#008B6B] border border-[#008B6B]/30 px-2 py-0.5 rounded-none uppercase">0ms Delay</span>
                </div>
                <p className="font-sans text-xs text-[#9CA3AF]">Instant client counter increment with error rollback.</p>
              </div>

              <div className="bg-[#07080A] border border-[#1F2429] p-4 rounded-none space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Graph Filtering</span>
                  <span className="font-mono text-[11px] font-semibold text-[#2F4CFF] border border-[#2F4CFF]/30 px-2 py-0.5 rounded-none uppercase">Dual Modes</span>
                </div>
                <p className="font-sans text-xs text-[#9CA3AF]">Seamless toggle between For You and Following graphs.</p>
              </div>

              <div className="bg-[#07080A] border border-[#1F2429] p-4 rounded-none space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Tag Indexing</span>
                  <span className="font-mono text-[11px] font-semibold text-[#C45A00] border border-[#C45A00]/30 px-2 py-0.5 rounded-none uppercase">Indexed</span>
                </div>
                <p className="font-sans text-xs text-[#9CA3AF]">Automated hashtag parser and full database search.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

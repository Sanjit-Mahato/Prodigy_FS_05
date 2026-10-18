'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, MessageCircle, Play, Users, Compass, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Prodigy InfoTech FS-05 • Next-Gen Social Experience</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Connect, Create &amp; Inspire with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Fluid Motion.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-normal"
          >
            Share high-res photos and videos, engage with double-tap heart bursts, discover trending hashtags, and follow creators in real-time. Built with Next.js 14, Framer Motion, and Prisma.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
          >
            <Link
              href="/feed"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95 group"
            >
              <span>Explore Live Feed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass-panel text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 font-semibold text-sm transition-all border border-slate-200 dark:border-zinc-800"
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>Browse Trending</span>
            </Link>
          </motion.div>
        </div>

        {/* Floating Mockup Showcase */}
        <div className="relative mt-16 sm:mt-24 max-w-5xl mx-auto">
          {/* Main Central Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-zinc-800/90 max-w-xl mx-auto relative z-10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
                  alt="Sarah Chen"
                  size="md"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sarah Chen
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    @sarah_c • Just now
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                Trending #travel
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 mb-3 leading-relaxed">
              Golden hour breaking through the mist over the Canadian Rockies. Double tap to feel the magic! ✨🏔️ #travel #nature @alex_r
            </p>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
                alt="Canadian Rockies preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-white/90 font-medium">
                  Swipe for carousel • 2 Photos
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-1 text-slate-600 dark:text-zinc-400 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-rose-500 font-bold">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  1,842
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MessageCircle className="w-4 h-4" />
                  128
                </span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-500">
                Interactive Preview
              </span>
            </div>
          </motion.div>

          {/* Floating Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden md:block absolute -left-10 top-16 w-64 glass-panel rounded-2xl p-4 shadow-xl border border-slate-200/80 dark:border-zinc-800/80 -rotate-3 hover:rotate-0 transition-transform"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Live Interaction
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-zinc-300">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">@alex_r</span> double-tapped your post with heart burst animation!
            </p>
          </motion.div>

          {/* Floating Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="hidden md:block absolute -right-8 bottom-10 w-64 glass-panel rounded-2xl p-4 shadow-xl border border-slate-200/80 dark:border-zinc-800/80 rotate-2 hover:rotate-0 transition-transform"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Social Graph
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-zinc-300">
              <span className="font-semibold text-purple-600 dark:text-purple-400">@maya_p</span> and 3 others started following your updates.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

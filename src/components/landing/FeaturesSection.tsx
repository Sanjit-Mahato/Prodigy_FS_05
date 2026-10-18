'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Heart,
  Users,
  Compass,
  Bell,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';

const features = [
  {
    icon: ImageIcon,
    title: 'Rich Media Uploads',
    description: 'Post high-resolution images, multi-photo carousels, and crisp videos with smooth swipe and autoplay controls.',
    color: 'from-emerald-500 to-teal-600',
    tag: 'Media Pipeline',
  },
  {
    icon: Heart,
    title: 'Double-Tap Heart Bursts',
    description: 'Delightful micro-interactions with spring physics, floating particles, and instant optimistic UI feedback.',
    color: 'from-rose-500 to-pink-600',
    tag: 'Framer Motion',
  },
  {
    icon: Users,
    title: 'Social Graph & Feeds',
    description: 'Follow favorite creators, switch between algorithmic "For You" and personalized "Following" timelines.',
    color: 'from-indigo-500 to-purple-600',
    tag: 'Connections',
  },
  {
    icon: Compass,
    title: 'Trending Hashtags & Search',
    description: 'Explore trending tags (#nature, #design, #ai), search creators and posts, and browse Pinterest-style media grids.',
    color: 'from-amber-500 to-orange-600',
    tag: 'Discovery',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Live badge counters and activity streams for likes, nested comments, mentions, and new followers.',
    color: 'from-blue-500 to-indigo-600',
    tag: 'Engagement',
  },
  {
    icon: Zap,
    title: '1-Click Persona Testing',
    description: 'Instant demo switcher with pre-seeded creator profiles (Alex, Sarah, Leo, Maya) for effortless evaluation.',
    color: 'from-purple-500 to-fuchsia-600',
    tag: 'Dev & Grading',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture &amp; Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Production Performance
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Every feature is crafted with clean separation of concerns, strict type-safety, and fluid animations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-200/80 dark:border-zinc-800/80 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800/60 px-2.5 py-1 rounded-full">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

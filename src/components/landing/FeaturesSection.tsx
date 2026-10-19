'use client';

import React from 'react';
import { motion } from 'framer-motion';

const architecturalPillars = [
  {
    title: 'High-Fidelity Media Pipeline',
    description:
      'Multi-part upload handler verifying MIME signatures and buffer integrity. Single photos, multi-image aspect carousels, and 60fps video playback with autoplay controls.',
    badge: '20MB photos • 50MB video',
  },
  {
    title: 'Double-Tap Micro-Interactions',
    description:
      'Spring physics heart particle bursts on double-tap or button click. Optimistic UI mutations with instant counter increments and automatic rollback on error.',
    badge: 'Framer Motion spring physics',
  },
  {
    title: 'Dual Social Feed Modes',
    description:
      'Toggle cleanly between the global "For You" timeline and the pure "Following" feed filtered exclusively to accounts you follow. No algorithmic suppression.',
    badge: 'Chronological & personalized',
  },
  {
    title: 'Dynamic Discovery & Indexing',
    description:
      'Automated hashtag indexing (#travel, #design, #ai) and @mention resolution into clickable links. Instant keyword search across users, captions, and tags.',
    badge: 'Relational SQLite indexes',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#07080A] border-b border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Narrative Split Headline & Core Claims */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold tracking-wider uppercase text-[#0E1012] dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#008B6B]" />
              <span>Architectural Ledger</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-[#0E1012] dark:text-white leading-[1.08]">
              The social engine, built with restraint.
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] font-normal leading-relaxed">
              Every system is engineered with clean separation of concerns: React Server Components for instant delivery, client components for spring micro-interactions, and Prisma ORM for relational integrity.
            </p>

            <div className="bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] p-6 rounded-sm space-y-4">
              <h4 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">
                Technical Stack Guarantees
              </h4>
              <ul className="space-y-3 font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <li className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#1F2429]">
                  <span className="uppercase tracking-wider">Framework</span>
                  <span className="font-semibold text-[#0E1012] dark:text-white">Next.js 14 App Router</span>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#1F2429]">
                  <span className="uppercase tracking-wider">Data Layer</span>
                  <span className="font-semibold text-[#0E1012] dark:text-white">Prisma + SQLite</span>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#1F2429]">
                  <span className="uppercase tracking-wider">Physics & Motion</span>
                  <span className="font-semibold text-[#2F4CFF]">Framer Motion & HyperFrames</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="uppercase tracking-wider">Authentication</span>
                  <span className="font-semibold text-[#0E1012] dark:text-white">Custom JWT Cookies</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Composed Narrative Pillar List - ITSUA Cards */}
          <div className="lg:col-span-7 space-y-4">
            {architecturalPillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] p-6 sm:p-8 rounded-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-sans text-xl font-medium text-[#0E1012] dark:text-white">
                    {pillar.title}
                  </h3>
                  <span className="self-start sm:self-auto font-mono text-xs font-semibold text-[#2F4CFF] bg-[#2F4CFF]/5 border border-[#2F4CFF]/20 px-2.5 py-1 rounded-none uppercase">
                    {pillar.badge}
                  </span>
                </div>

                <p className="font-sans text-base text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

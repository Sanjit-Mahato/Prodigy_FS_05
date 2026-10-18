'use client';

import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Heart, Users, Compass, CheckCircle2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export default function HomePage() {
  const { user, switchDemoUser } = useAuth();

  const demoAccounts = [
    {
      username: 'alex_r',
      name: 'Alex Rivera',
      role: 'UI Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      username: 'sarah_c',
      name: 'Sarah Chen',
      role: 'Landscape Photographer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    {
      username: 'leo_v',
      name: 'Leo Vance',
      role: '3D Motion Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      username: 'maya_p',
      name: 'Maya Patel',
      role: 'AI Researcher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0e14] mesh-gradient selection:bg-indigo-500 selection:text-white">
      <TopNavbar />

      <main>
        <HeroSection />

        {/* 1-Click Persona Quick Launch Row */}
        <section className="py-12 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-y border-slate-200/80 dark:border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Instant Interactive Evaluation
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                Choose a Persona to Test Real Social Interactions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {demoAccounts.map((account) => {
                const isActive = user?.username === account.username;
                return (
                  <button
                    key={account.username}
                    onClick={() => {
                      switchDemoUser(account.username);
                      window.location.href = '/feed';
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left group ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/30'
                        : 'glass-panel border-slate-200/80 dark:border-zinc-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                    }`}
                  >
                    <Avatar src={account.avatar} alt={account.name} size="md" />
                    <div className="truncate flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        @{account.username}
                      </p>
                      <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                        {account.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <FeaturesSection />

        {/* Bottom Banner Call to Action */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-indigo-200/50 dark:border-indigo-900/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                Ready to Experience the Social Feed?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed">
                Explore real posts with photo carousels, videos, double-tap hearts, comments, and profile customization.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/feed"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95"
                >
                  <span>Launch Application Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-panel text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 font-semibold text-sm transition-all"
                >
                  Explore Trending #Tags
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 dark:border-zinc-800/80 py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
        <p>Prodigy InfoTech Full Stack Internship Task 05 (Prodigy_FS_05)</p>
        <p className="mt-1">Crafted with Next.js 14, TypeScript, Tailwind CSS, Framer Motion &amp; Prisma.</p>
      </footer>
    </div>
  );
}

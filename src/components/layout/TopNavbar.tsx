'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DemoUserSwitcher } from '@/components/ui/DemoUserSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export function TopNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#0c0e14]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Mobile Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group md:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Prodigy
          </span>
        </Link>

        {/* Desktop breadcrumb / tagline */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Prodigy_FS_05 Live Network</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          <DemoUserSwitcher />
          <ThemeToggle />

          {!user && (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

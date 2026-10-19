'use client';

import React from 'react';
import Link from 'next/link';
import { DemoUserSwitcher } from '@/components/ui/DemoUserSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export function TopNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#07080A] border-b border-[#E5E7EB] dark:border-[#1F2429] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Editorial Identifier */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-none bg-[#0E1012] dark:bg-white flex items-center justify-center text-white dark:text-[#0E1012] font-mono font-bold text-sm tracking-wider">
              K
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-base tracking-tight text-[#0E1012] dark:text-white uppercase">
                Kinetic
              </span>
              <span className="font-mono text-[11px] font-semibold tracking-wider text-[#2F4CFF] uppercase">
                Network
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-block text-[#E5E7EB] dark:text-[#1F2429]">|</span>

          {/* Status Metric Utility */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[12px] font-semibold tracking-wider text-[#6B7280] dark:text-[#9CA3AF] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#008B6B] inline-block" />
            <span>Network Online • 60fps / 45MP</span>
          </div>
        </div>

        {/* Right Navigation & Control Actions */}
        <div className="flex items-center gap-3">
          <DemoUserSwitcher />
          <ThemeToggle />

          {!user ? (
            <Link
              href="/login"
              className="h-9 px-4 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold tracking-wider uppercase inline-flex items-center justify-center transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <Link
              href="/feed"
              className="h-9 px-4 rounded-none bg-[#2F4CFF] hover:bg-[#253dcf] text-white font-mono text-xs font-semibold tracking-wider uppercase inline-flex items-center justify-center transition-colors"
            >
              Open Feed
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

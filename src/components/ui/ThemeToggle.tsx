'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-9 h-9 flex items-center justify-center rounded-none border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] text-[#0E1012] dark:text-slate-100 transition-colors hover:bg-slate-50 dark:hover:bg-[#151722] focus:outline-none focus:border-[#2F4CFF] ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ y: -6, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 6, opacity: 0, rotate: 30 }}
        transition={{ duration: 0.15 }}
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2F4CFF]" />}
      </motion.div>
    </button>
  );
}

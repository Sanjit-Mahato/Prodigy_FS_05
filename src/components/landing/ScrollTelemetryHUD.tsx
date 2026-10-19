'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronUp, Activity } from 'lucide-react';

export function ScrollTelemetryHUD() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState('01 // HERO');

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const pct = Math.round(latest * 100);
      setPercentage(pct);

      if (pct < 20) {
        setActiveSection('01 // HERO');
      } else if (pct < 40) {
        setActiveSection('02 // SPECIMENS');
      } else if (pct < 65) {
        setActiveSection('03 // PARALLAX');
      } else if (pct < 85) {
        setActiveSection('04 // REELS');
      } else {
        setActiveSection('05 // DEPLOY');
      }
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center gap-3 select-none">
      <div className="flex items-center gap-3 px-3.5 py-2 bg-[#0E1012]/90 border border-[#1F2429] text-white font-mono text-[11px] font-semibold tracking-wider uppercase rounded-none shadow-xl">
        <div className="flex items-center gap-1.5 text-[#008B6B]">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>60 FPS</span>
        </div>

        <span className="text-[#1F2429]">|</span>

        <span className="text-slate-300">{activeSection}</span>

        <span className="text-[#1F2429]">|</span>

        <div className="flex items-center gap-2">
          <span className="text-[#2F4CFF] w-8 text-right">{percentage}%</span>
          <div className="w-12 h-1 bg-[#1F2429] overflow-hidden rounded-none">
            <motion.div
              className="h-full bg-[#2F4CFF]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={scrollToTop}
          className="ml-1 p-1 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Return to top"
          aria-label="Return to top"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

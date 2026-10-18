'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartAnimationProps {
  show: boolean;
}

export function HeartAnimation({ show }: HeartAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.4, 1.1, 1.2],
            opacity: [0, 1, 1, 0],
          }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            duration: 0.75,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-30"
        >
          <div className="relative">
            {/* Glow drop-shadow effect */}
            <div className="absolute inset-0 rounded-full blur-2xl bg-rose-500/60 scale-150 animate-pulse" />
            <Heart
              className="relative w-28 h-28 text-white fill-rose-500 drop-shadow-[0_10px_25px_rgba(244,63,94,0.7)]"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

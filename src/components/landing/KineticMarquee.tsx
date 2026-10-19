'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Film, Layers, Zap } from 'lucide-react';

const MARQUEE_IMAGES = [
  {
    title: 'Alpine Peak',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    creator: '@sarah_c',
    tag: '#nature',
  },
  {
    title: 'Glass Pavilion',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    creator: '@alex_r',
    tag: '#architecture',
  },
  {
    title: 'Neon Horizon',
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
    creator: '@leo_v',
    tag: '#cinema',
  },
  {
    title: 'Fluid Waveform',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    creator: '@maya_p',
    tag: '#generative',
  },
  {
    title: 'Yosemite Valley',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    creator: '@sarah_c',
    tag: '#wilderness',
  },
  {
    title: 'Brutalist Angle',
    src: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80',
    creator: '@alex_r',
    tag: '#brutalism',
  },
  {
    title: 'Cyber Shaders',
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    creator: '@leo_v',
    tag: '#motion',
  },
  {
    title: 'Pacific Coast',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    creator: '@sarah_c',
    tag: '#travel',
  },
];

const TELEMETRY_ITEMS = [
  'KINETIC ENGINE // 60.0 FPS CONTINUOUS MOTION',
  '45.4 MEGAPIXELS RAW UNCOMPRESSED CAROUSELS',
  'DOUBLE-TAP SPRING VELOCITY DAMPENING (STIFFNESS 100)',
  'SQLITE + PRISMA ORM RELATIONAL GRAPH ARCHITECTURE',
  'ZERO-DELAY OPTIMISTIC COUNTER MUTATIONS',
  'NEXT.JS 14 APP ROUTER SERVER COMPONENTS PIPELINE',
  'ITSUA MINIMAL EDITORIAL ENGINEERING SPECIFICATION',
  'CHRONOLOGICAL FOLLOWING GRAPH VS GLOBAL TIMELINE',
];

export function KineticMarquee() {
  return (
    <section className="py-12 bg-white dark:bg-[#0E1012] border-b border-[#E5E7EB] dark:border-[#1F2429] overflow-hidden select-none transition-colors">
      {/* Top Track: Photographic Film Strip */}
      <div className="relative flex overflow-x-hidden mb-6">
        <motion.div
          animate={{ x: [0, -1800] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 38,
            ease: 'linear',
          }}
          className="flex items-center gap-4 shrink-0"
        >
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-1.5 bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm shrink-0 w-64 group hover:border-[#2F4CFF] transition-colors"
            >
              <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-black shrink-0">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="truncate flex-1">
                <span className="font-mono text-[10px] font-semibold text-[#2F4CFF] uppercase block">
                  {item.tag}
                </span>
                <p className="font-sans font-medium text-xs text-[#0E1012] dark:text-white truncate">
                  {item.title}
                </p>
                <span className="font-mono text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                  {item.creator}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Track: Kinetic Telemetry Ledger */}
      <div className="relative flex overflow-x-hidden border-t border-[#E5E7EB] dark:border-[#1F2429] pt-4">
        <motion.div
          animate={{ x: [-1800, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 32,
            ease: 'linear',
          }}
          className="flex items-center gap-6 shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]"
        >
          {[...TELEMETRY_ITEMS, ...TELEMETRY_ITEMS].map((txt, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008B6B]" />
              <span>{txt}</span>
              <span className="text-[#2F4CFF]">///</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Camera, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface ReelItem {
  id: string;
  title: string;
  creator: string;
  tag: string;
  specs: string;
  src: string;
  aspect: string;
}

const COLUMN_1: ReelItem[] = [
  {
    id: 'c1-1',
    title: 'Brutalist Monolith Cantilever',
    creator: '@alex_r',
    tag: '#architecture',
    specs: 'ISO 64 • 24mm ƒ/2.8 • 1/500s',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'c1-2',
    title: 'Misty Alpine Ridge at Dusk',
    creator: '@sarah_c',
    tag: '#nature',
    specs: 'ISO 100 • 70mm ƒ/4.0 • 1/250s',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'c1-3',
    title: 'Neon Chiaroscuro Rain Alley',
    creator: '@leo_v',
    tag: '#cinema',
    specs: 'ISO 800 • 35mm ƒ/1.4 • 1/60s',
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[16/10]',
  },
];

const COLUMN_2: ReelItem[] = [
  {
    id: 'c2-1',
    title: 'Volumetric Shader Light Chamber',
    creator: '@leo_v',
    tag: '#3d #motion',
    specs: '60 FPS • 4K Metal Pipeline',
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 'c2-2',
    title: 'Curved Glass Concrete Pavilion',
    creator: '@alex_r',
    tag: '#architecture',
    specs: 'ISO 50 • 16mm ƒ/8.0 • 1/125s',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'c2-3',
    title: 'Deep Pacific Ocean Horizon',
    creator: '@sarah_c',
    tag: '#nature',
    specs: 'ISO 100 • 50mm ƒ/2.0 • 1/1000s',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
];

const COLUMN_3: ReelItem[] = [
  {
    id: 'c3-1',
    title: 'Generative Topology Fluid Field',
    creator: '@maya_p',
    tag: '#generative',
    specs: 'WebGL 2.0 • Compute Shaders',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'c3-2',
    title: 'Yosemite Granite Monolith at Dawn',
    creator: '@sarah_c',
    tag: '#nature #travel',
    specs: 'ISO 64 • 28mm ƒ/5.6 • 1/320s',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'c3-3',
    title: 'Geometric Concrete Shadows',
    creator: '@alex_r',
    tag: '#brutalism',
    specs: 'ISO 100 • 35mm ƒ/2.8 • 1/800s',
    src: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[16/10]',
  },
];

export function ParallaxImageReel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Staggered parallax translations for each column
  const yCol1 = useTransform(smoothProgress, [0, 1], [-90, 90]);
  const yCol2 = useTransform(smoothProgress, [0, 1], [110, -110]);
  const yCol3 = useTransform(smoothProgress, [0, 1], [-70, 70]);

  // Subtle 3D perspective rotation on scroll
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [6, 0, -4]);

  return (
    <section
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-[#07080A] text-white border-b border-[#1F2429]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#1F2429]">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1F2429] bg-[#0E1012] font-mono text-xs font-semibold tracking-wider uppercase text-white">
              <Camera className="w-3.5 h-3.5 text-[#2F4CFF]" />
              <span>Scroll-Driven Parallax Stream • 45MP Uncompressed</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-white leading-[1.08]">
              High-density visual parallax.
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              As you scroll through Kinetic, multi-column media feeds drift at physics-calculated velocity differentials, preserving optical resolution at full dynamic range.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="px-5 py-3 rounded-none bg-white hover:bg-slate-200 text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
            >
              <span>Explore Visual Grid</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3D Parallax Canvas */}
        <motion.div
          style={{ rotateX, transformStyle: 'preserve-3d' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 perspective-[1400px]"
        >
          {/* Column 1 */}
          <motion.div style={{ y: yCol1 }} className="space-y-6 lg:space-y-8">
            {COLUMN_1.map((item) => (
              <ParallaxCard key={item.id} item={item} />
            ))}
          </motion.div>

          {/* Column 2 */}
          <motion.div style={{ y: yCol2 }} className="space-y-6 lg:space-y-8 md:pt-12">
            {COLUMN_2.map((item) => (
              <ParallaxCard key={item.id} item={item} />
            ))}
          </motion.div>

          {/* Column 3 */}
          <motion.div style={{ y: yCol3 }} className="space-y-6 lg:space-y-8">
            {COLUMN_3.map((item) => (
              <ParallaxCard key={item.id} item={item} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ParallaxCard({ item }: { item: ReelItem }) {
  return (
    <div className="group relative bg-[#0E1012] border border-[#1F2429] rounded-sm overflow-hidden transition-all duration-300 hover:border-[#2F4CFF]/60 hover:shadow-2xl">
      {/* Visual Specimen Container */}
      <div className={`relative w-full ${item.aspect} bg-black overflow-hidden select-none`}>
        <Image
          src={item.src}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
          <span className="px-2 py-0.5 rounded-none bg-[#0E1012]/80 border border-white/20 font-semibold text-white/90 uppercase tracking-wider backdrop-blur-none">
            {item.creator}
          </span>
          <span className="px-2 py-0.5 rounded-none bg-[#2F4CFF]/80 text-white font-semibold uppercase tracking-wider">
            {item.tag}
          </span>
        </div>

        {/* Bottom Shutter & Metadata Overlay */}
        <div className="absolute bottom-3 left-3 right-3 space-y-1">
          <p className="font-sans font-medium text-white text-base leading-snug line-clamp-1 group-hover:text-[#2F4CFF] transition-colors">
            {item.title}
          </p>
          <div className="flex items-center justify-between font-mono text-[10px] text-white/70">
            <span>{item.specs}</span>
            <span className="text-[#008B6B] font-semibold uppercase">RAW Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

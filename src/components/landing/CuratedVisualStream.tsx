'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Filter, Eye, Camera, ArrowRight, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';

interface VisualSpecimen {
  id: string;
  category: 'architecture' | 'cinema' | 'typography' | 'nature';
  title: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
  src: string;
  tag: string;
  specs: {
    iso: string;
    focal: string;
    aperture: string;
    shutter: string;
    resolution: string;
  };
  initialLikes: number;
}

const SPECIMENS: VisualSpecimen[] = [
  {
    id: 'spec-1',
    category: 'architecture',
    title: 'Minimalist Monolith & Cantilever Study',
    creator: {
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    tag: '#architecture #brutalism',
    specs: {
      iso: 'ISO 64',
      focal: '24mm',
      aperture: 'ƒ/2.8',
      shutter: '1/800s',
      resolution: '45.4 MP',
    },
    initialLikes: 1420,
  },
  {
    id: 'spec-2',
    category: 'cinema',
    title: 'Cyberpunk Volumetric Neon Alley',
    creator: {
      name: 'Leo Vance',
      username: 'leo_v',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    tag: '#cinema #lighting',
    specs: {
      iso: 'ISO 1250',
      focal: '35mm',
      aperture: 'ƒ/1.4',
      shutter: '1/60s',
      resolution: '8K Still',
    },
    initialLikes: 2190,
  },
  {
    id: 'spec-3',
    category: 'nature',
    title: 'Alpine Sunrise over Moraine Lake',
    creator: {
      name: 'Sarah Chen',
      username: 'sarah_c',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    tag: '#nature #travel',
    specs: {
      iso: 'ISO 100',
      focal: '28mm',
      aperture: 'ƒ/5.6',
      shutter: '1/250s',
      resolution: '45.7 MP',
    },
    initialLikes: 3410,
  },
  {
    id: 'spec-4',
    category: 'typography',
    title: 'Generative Topology Geometric Waveform',
    creator: {
      name: 'Maya Patel',
      username: 'maya_p',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tag: '#generative #code',
    specs: {
      iso: 'Compute',
      focal: 'WebGL 2.0',
      aperture: 'Float32',
      shutter: '60 FPS',
      resolution: 'Vector Grid',
    },
    initialLikes: 1874,
  },
  {
    id: 'spec-5',
    category: 'architecture',
    title: 'Curved Glass Concrete Skyscraper',
    creator: {
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tag: '#architecture #structural',
    specs: {
      iso: 'ISO 50',
      focal: '16mm',
      aperture: 'ƒ/8.0',
      shutter: '1/160s',
      resolution: '50.1 MP',
    },
    initialLikes: 960,
  },
  {
    id: 'spec-6',
    category: 'cinema',
    title: 'Volumetric Metal Hardware Shader',
    creator: {
      name: 'Leo Vance',
      username: 'leo_v',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    tag: '#cinema #3d',
    specs: {
      iso: 'Metal 3',
      focal: 'Raymarch',
      aperture: 'Sub-surface',
      shutter: '120 FPS',
      resolution: '4K DCI',
    },
    initialLikes: 1530,
  },
  {
    id: 'spec-7',
    category: 'nature',
    title: 'Yosemite Valley Stream & Granite Monolith',
    creator: {
      name: 'Sarah Chen',
      username: 'sarah_c',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tag: '#nature #wilderness',
    specs: {
      iso: 'ISO 64',
      focal: '35mm',
      aperture: 'ƒ/4.0',
      shutter: '1/320s',
      resolution: '45.7 MP',
    },
    initialLikes: 2890,
  },
  {
    id: 'spec-8',
    category: 'typography',
    title: 'High-Contrast Editorial Typography Grid',
    creator: {
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    tag: '#typography #design',
    specs: {
      iso: 'Space Grotesk',
      focal: 'IBM Plex',
      aperture: '0px Radius',
      shutter: 'Pure Monochrome',
      resolution: 'Vector Crisp',
    },
    initialLikes: 1120,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Disciplines', count: 8 },
  { id: 'architecture', label: 'Architecture', count: 2 },
  { id: 'cinema', label: 'Cinema & 3D', count: 2 },
  { id: 'nature', label: 'Nature & Landscape', count: 2 },
  { id: 'typography', label: 'Design & Systems', count: 2 },
] as const;

export function CuratedVisualStream() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    SPECIMENS.forEach((s) => {
      map[s.id] = s.initialLikes;
    });
    return map;
  });

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isLiked = !!likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesCountMap((prev) => ({
      ...prev,
      [id]: isLiked ? prev[id] - 1 : prev[id] + 1,
    }));
  };

  const filtered =
    selectedCategory === 'all'
      ? SPECIMENS
      : SPECIMENS.filter((s) => s.category === selectedCategory);

  return (
    <section className="py-24 bg-white dark:bg-[#07080A] border-b border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] font-mono text-xs font-semibold tracking-wider uppercase text-[#0E1012] dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#2F4CFF]" />
              <span>Curated Media Stream • Uncompressed Visual Ledger</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-[#0E1012] dark:text-white leading-[1.08]">
              High-resolution creator specimens.
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Explore authentic photography, cinematic motion tests, and architectural studies shared across the network. Tap the heart icon to simulate live interaction.
            </p>
          </div>

          <div className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF] uppercase">
            Showing <span className="font-semibold text-[#0E1012] dark:text-white">{filtered.length}</span> of 8 specimens
          </div>
        </div>

        {/* Filter Tabs - ITSUA 0px Rectilinear Button Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 border-b border-[#E5E7EB] dark:border-[#1F2429] scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0E1012] dark:bg-white text-white dark:text-[#0E1012]'
                    : 'bg-white dark:bg-[#0E1012] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#1F2429] hover:text-[#0E1012] dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-2 opacity-60">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Specimen Masonry Grid with Framer Motion AnimatePresence */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const isLiked = !!likedMap[item.id];
              const likesCount = likesCountMap[item.id];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429] rounded-sm overflow-hidden flex flex-col justify-between transition-colors hover:border-[#2F4CFF]"
                >
                  {/* Photo Canvas */}
                  <div className="relative aspect-[4/3] sm:aspect-square bg-black overflow-hidden select-none">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Category Tag Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-none font-mono text-[10px] font-semibold uppercase tracking-wider bg-[#0E1012]/80 text-white border border-white/20">
                        {item.tag.split(' ')[0]}
                      </span>
                    </div>

                    {/* Interactive Like Action Pill */}
                    <button
                      onClick={(e) => toggleLike(item.id, e)}
                      className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                        isLiked
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#0E1012]/80 text-white border border-white/20 hover:bg-black'
                      }`}
                      aria-label="Like photo"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-white stroke-white' : 'stroke-white'
                        }`}
                      />
                      <span>{likesCount.toLocaleString()}</span>
                    </button>
                  </div>

                  {/* Metadata and Camera Specs */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/${item.creator.username}`}
                        className="flex items-center gap-2 mb-2 group/author"
                      >
                        <Avatar
                          src={item.creator.avatar}
                          alt={item.creator.name}
                          size="xs"
                        />
                        <span className="font-mono text-xs font-semibold text-[#0E1012] dark:text-white group-hover/author:text-[#2F4CFF] transition-colors truncate">
                          @{item.creator.username}
                        </span>
                      </Link>

                      <h4 className="font-sans font-medium text-sm text-[#0E1012] dark:text-white leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    {/* Camera Shutter Ledger */}
                    <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1F2429] flex items-center justify-between font-mono text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                      <span>{item.specs.iso} • {item.specs.aperture}</span>
                      <span className="text-[#008B6B] font-semibold">{item.specs.resolution}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

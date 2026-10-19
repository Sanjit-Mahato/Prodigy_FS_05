'use client';

import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { KineticMarquee } from '@/components/landing/KineticMarquee';
import { CuratedVisualStream } from '@/components/landing/CuratedVisualStream';
import { ParallaxImageReel } from '@/components/landing/ParallaxImageReel';
import { InteractiveSandbox } from '@/components/landing/InteractiveSandbox';
import { HyperframesShowcase } from '@/components/landing/HyperframesShowcase';
import { ScrollShowcase } from '@/components/landing/ScrollShowcase';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ScrollTelemetryHUD } from '@/components/landing/ScrollTelemetryHUD';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
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
    <div className="min-h-screen bg-white dark:bg-[#07080A] text-[#0E1012] dark:text-slate-100 selection:bg-[#2F4CFF] selection:text-white transition-colors duration-150 relative">
      {/* Editorial Scroll Telemetry HUD */}
      <ScrollTelemetryHUD />

      {/* Persistent Navigation */}
      <TopNavbar />

      <main>
        {/* Section 01: Hero Section with 3D Tilt & Double-Tap Heart Physics */}
        <HeroSection />

        {/* Section 02: Infinite Kinetic Velocity Film Strip & Telemetry */}
        <KineticMarquee />

        {/* Section 03: 1-Click Interactive Persona Switcher - ITSUA Grid Layout */}
        <section className="py-16 bg-white dark:bg-[#0E1012] border-b border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#008B6B]" />
                  <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#0E1012] dark:text-white">
                    Creator Personas
                  </span>
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-medium text-[#0E1012] dark:text-white">
                  Instant Interactive Evaluation Switcher
                </h3>
                <p className="font-sans text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                  Click any creator to simulate real social interactions from their perspective.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2F4CFF] px-2.5 py-1 border border-[#2F4CFF]/30 bg-[#2F4CFF]/5 rounded-none self-start sm:self-auto">
                4 Pre-seeded Personas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {demoAccounts.map((account) => {
                const isActive = user?.username === account.username;
                return (
                  <button
                    key={account.username}
                    onClick={() => {
                      switchDemoUser(account.username);
                      window.location.href = '/feed';
                    }}
                    className={`flex items-center gap-3.5 p-4 rounded-sm border transition-all text-left group ${
                      isActive
                        ? 'bg-[#2F4CFF]/5 text-[#0E1012] dark:text-white border-[#2F4CFF]'
                        : 'bg-white dark:bg-[#07080A] border-[#E5E7EB] dark:border-[#1F2429] hover:border-[#2F4CFF]/50'
                    }`}
                  >
                    <Avatar src={account.avatar} alt={account.name} size="md" />
                    <div className="truncate flex-1">
                      <p className="font-sans text-base font-medium text-[#0E1012] dark:text-white truncate group-hover:text-[#2F4CFF] transition-colors">
                        {account.name}
                      </p>
                      <p className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate">
                        @{account.username}
                      </p>
                      <span className="font-mono text-xs font-semibold text-[#2F4CFF] uppercase tracking-wider">
                        {account.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 04: Curated Uncompressed Visual Stream (Interactive Like, Shutter Specs, Discipline Filters) */}
        <CuratedVisualStream />

        {/* Section 05: Scroll-Driven 3-Column Parallax Image Stream */}
        <ParallaxImageReel />

        {/* Section 06: Live Interactive Post Sandbox ("One Live Thing") */}
        <InteractiveSandbox />

        {/* Section 07: HyperFrames Deterministic Render Showcase */}
        <div id="hyperframes-showcase">
          <HyperframesShowcase />
        </div>

        {/* Section 08: Scroll-Driven 3D Perspective Showcase */}
        <ScrollShowcase />

        {/* Section 09: Architectural 4-Pillar Features */}
        <FeaturesSection />

        {/* Section 10: Bottom Call to Action - ITSUA Stark Grid Layout */}
        <section className="py-24 relative overflow-hidden bg-white dark:bg-[#07080A] border-t border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold tracking-wider uppercase text-[#0E1012] dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#008B6B]" />
              <span>Full-Stack Feed Specification</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-sans font-medium tracking-tight text-[#0E1012] dark:text-white leading-[1.08]">
              Ready to launch the social feed?
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
              Explore real creator posts with multi-photo carousels, video reels, double-tap heart bursts, and profile customization.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/feed"
                className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono font-semibold text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 transition-colors group"
              >
                <span>Launch Application Feed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-none border border-[#0E1012] dark:border-[#E5E7EB] text-[#0E1012] dark:text-white font-mono font-semibold text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 hover:bg-[#0E1012]/5 dark:hover:bg-white/5 transition-colors"
              >
                Explore Trending #Tags
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#07080A] font-mono text-xs tracking-wider uppercase text-[#6B7280] dark:text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>KINETIC CREATIVE NETWORK • PRODIGY_FS_05 SPECIFICATION</p>
          <p>
            NEXT.JS 14 • FRAMER MOTION • HYPERFRAMES • PRISMA ORM • ITSUA SYSTEM
          </p>
        </div>
      </footer>
    </div>
  );
}

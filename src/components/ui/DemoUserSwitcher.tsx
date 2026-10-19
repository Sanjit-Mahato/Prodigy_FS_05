'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from './Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, Sparkles, LogOut, ChevronDown } from 'lucide-react';

const DEMO_PERSONAS = [
  {
    username: 'alex_r',
    name: 'Alex Rivera',
    role: 'UI Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'sarah_c',
    name: 'Sarah Chen',
    role: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'leo_v',
    name: 'Leo Vance',
    role: 'Motion Artist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'maya_p',
    name: 'Maya Patel',
    role: 'AI Researcher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

export function DemoUserSwitcher({ compact = false }: { compact?: boolean }) {
  const { user, switchDemoUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSelect = async (username: string) => {
    if (user?.username === username) {
      setIsOpen(false);
      return;
    }
    setSwitching(username);
    await switchDemoUser(username);
    setSwitching(null);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] text-xs font-mono font-semibold uppercase bg-white dark:bg-[#0E1012] text-[#0E1012] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors"
        title="Quick 1-Click Demo User Switcher"
      >
        <span className="w-2 h-2 rounded-full bg-[#008B6B] inline-block" />
        <span className="hidden sm:inline text-[#6B7280]">Persona:</span>
        <span className="font-mono font-semibold text-[#0E1012] dark:text-white">
          {user ? user.name.split(' ')[0] : 'Select'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing on outside click */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 mt-2 w-72 rounded-sm border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] z-50 p-2 overflow-hidden"
            >
              <div className="px-3 py-2.5 bg-slate-50 dark:bg-[#151722] border-b border-[#E5E7EB] dark:border-[#1F2429] mb-1.5">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#2F4CFF]" />
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white">
                    Demo Personas
                  </p>
                </div>
                <p className="font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  Instant 1-click evaluation switch
                </p>
              </div>

              <div className="py-1 space-y-1">
                {DEMO_PERSONAS.map((persona) => {
                  const isActive = user?.username === persona.username;
                  const isCurrentSwitching = switching === persona.username;

                  return (
                    <button
                      key={persona.username}
                      onClick={() => handleSelect(persona.username)}
                      disabled={isCurrentSwitching}
                      className={`w-full flex items-center justify-between p-2 rounded-sm transition-all text-left ${
                        isActive
                          ? 'bg-[#2F4CFF]/10 text-[#2F4CFF] border border-[#2F4CFF]/30'
                          : 'hover:bg-slate-50 dark:hover:bg-[#151722]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar src={persona.avatar} alt={persona.name} size="sm" />
                        <div>
                          <p className="font-sans text-sm font-semibold text-[#0E1012] dark:text-white leading-tight">
                            {persona.name}
                          </p>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                            <span>@{persona.username}</span>
                            <span>•</span>
                            <span className="text-[#2F4CFF] font-semibold">
                              {persona.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-4 h-4 rounded-full bg-[#2F4CFF] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      {isCurrentSwitching && (
                        <div className="w-4 h-4 border-2 border-[#2F4CFF] border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {user && (
                <div className="pt-2 mt-2 border-t border-[#E5E7EB] dark:border-[#1F2429]">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#C45A00] hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-none transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

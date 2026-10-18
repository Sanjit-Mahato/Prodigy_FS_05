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
    color: 'from-blue-500 to-indigo-600',
  },
  {
    username: 'sarah_c',
    name: 'Sarah Chen',
    role: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    color: 'from-rose-500 to-pink-600',
  },
  {
    username: 'leo_v',
    name: 'Leo Vance',
    role: 'Motion Artist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    color: 'from-amber-500 to-orange-600',
  },
  {
    username: 'maya_p',
    name: 'Maya Patel',
    role: 'AI Researcher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    color: 'from-purple-500 to-fuchsia-600',
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 transition-all shadow-sm group"
        title="Quick 1-Click Demo User Switcher"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
        <span className="hidden sm:inline">Testing Persona:</span>
        <span className="font-semibold text-indigo-900 dark:text-indigo-200">
          {user ? user.name.split(' ')[0] : 'Select Persona'}
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
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 rounded-2xl glass-dropdown z-50 p-2 shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800"
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    1-Click Demo Accounts
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Switch perspectives instantly to test social interactions
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
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80'
                          : 'hover:bg-slate-100/70 dark:hover:bg-zinc-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar src={persona.avatar} alt={persona.name} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                            {persona.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-zinc-400">
                            <span>@{persona.username}</span>
                            <span>•</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              {persona.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      {isCurrentSwitching && (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {user && (
                <div className="pt-1 mt-1 border-t border-slate-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
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

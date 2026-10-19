'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Modal } from '@/components/ui/Modal';
import { CreatePostBox } from '@/components/feed/CreatePostBox';
import { PostWithDetails } from '@/types';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handlePostCreated = (newPost: PostWithDetails) => {
    setShowCreateModal(false);
    // Reload or dispatch event so feed updates
    window.dispatchEvent(new CustomEvent('post-created', { detail: newPost }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#07080A] transition-colors selection:bg-[#2F4CFF] selection:text-white">
      <TopNavbar />

      <div className="max-w-7xl mx-auto flex justify-center">
        {/* Left Desktop Sidebar Navigation */}
        <SidebarNav onOpenCreateModal={() => setShowCreateModal(true)} />

        {/* Center Main Scrollable Content */}
        <main className="flex-1 max-w-2xl min-h-screen px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {children}
        </main>

        {/* Right Desktop Sidebar (Trending, Search, Creators) */}
        <RightSidebar />
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar onOpenCreateModal={() => setShowCreateModal(true)} />

      {/* Global Quick Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Post"
        maxWidth="lg"
      >
        <CreatePostBox onPostCreated={handlePostCreated} />
      </Modal>
    </div>
  );
}

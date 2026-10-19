'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SafeUser } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Camera, Loader2, Save } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SafeUser;
  onProfileUpdated: (updatedUser: SafeUser) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}: EditProfileModalProps) {
  const { updateLocalUser } = useAuth();
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [website, setWebsite] = useState(user.website || '');
  const [location, setLocation] = useState(user.location || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [coverUrl, setCoverUrl] = useState(user.coverUrl || '');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleFileUpload = async (file: File, type: 'avatar' | 'cover') => {
    const formData = new FormData();
    formData.append('file', file);
    if (type === 'avatar') setUploadingAvatar(true);
    else setUploadingCover(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'avatar') setAvatarUrl(data.data.url);
        else setCoverUrl(data.data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      else setUploadingCover(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          website: website.trim() || null,
          location: location.trim() || null,
          avatarUrl: avatarUrl || null,
          coverUrl: coverUrl || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onProfileUpdated(data.data);
        updateLocalUser(data.data);
        onClose();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch {
      alert('Network error while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Ledger" maxWidth="lg">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Cover Photo Preview & Upload */}
        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1.5">
            Cover Photo
          </label>
          <div
            className="relative h-28 w-full rounded-sm overflow-hidden bg-[#0E1012] flex items-center justify-center bg-cover bg-center border border-[#E5E7EB] dark:border-[#1F2429] group"
            style={{
              backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
            }}
          >
            <div className="absolute inset-0 bg-[#0E1012]/40 flex items-center justify-center">
              <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-slate-100">
                <Camera className="w-3.5 h-3.5" />
                <span>{uploadingCover ? 'Uploading...' : 'Update Cover'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'cover');
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <Avatar src={avatarUrl} alt={name} size="xl" />
          <div>
            <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1">
              Profile Photo
            </label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] hover:bg-slate-50 dark:hover:bg-[#151722] font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Select File'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'avatar');
                }}
              />
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none px-3.5 py-2 font-sans text-xs text-[#0E1012] dark:text-white focus:outline-none focus:border-[#2F4CFF]"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Introduce yourself to the community..."
            className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none px-3.5 py-2 font-sans text-xs text-[#0E1012] dark:text-white focus:outline-none focus:border-[#2F4CFF] resize-none"
          />
        </div>

        {/* Location & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none px-3.5 py-2 font-sans text-xs text-[#0E1012] dark:text-white focus:outline-none focus:border-[#2F4CFF]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none px-3.5 py-2 font-sans text-xs text-[#0E1012] dark:text-white focus:outline-none focus:border-[#2F4CFF]"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E7EB] dark:border-[#1F2429]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-[#0E1012] dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadingAvatar || uploadingCover}
            className="flex items-center gap-1.5 px-5 py-2 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Ledger</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

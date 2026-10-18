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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="lg">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Cover Photo Preview & Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
            Cover Photo
          </label>
          <div
            className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center bg-cover bg-center group"
            style={{
              backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-medium transition-all">
                <Camera className="w-4 h-4" />
                <span>{uploadingCover ? 'Uploading...' : 'Change Cover'}</span>
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Profile Photo
            </label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-200 transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Photo'}</span>
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell the community about yourself..."
            className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Location & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadingAvatar || uploadingCover}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnline?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

export function Avatar({
  src,
  alt = 'User avatar',
  size = 'md',
  className,
  showOnline = false,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const isExternalUrl = src?.startsWith('http://') || src?.startsWith('https://');

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 font-semibold text-white select-none ring-2 ring-slate-200 dark:ring-zinc-800 shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={!isExternalUrl}
          className="object-cover rounded-full"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{getInitials(alt || 'U')}</span>
      )}

      {showOnline && (
        <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
      )}
    </div>
  );
}

// src/components/SkeletonCard.tsx
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-6 overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-white/5 rounded-lg w-2/3 animate-pulse" />
        <div className="h-4 bg-white/5 rounded-md w-12 animate-pulse" />
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-white/5 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-white/5 rounded-lg w-5/6 animate-pulse" />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse" />
        <div className="space-y-1">
          <div className="h-2 bg-white/5 rounded w-8 animate-pulse" />
          <div className="h-2 bg-white/5 rounded w-16 animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-3 bg-white/5 rounded-full w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-white/5 rounded w-12" />
          <div className="h-3 bg-white/5 rounded w-12" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
        <div className="h-4 bg-white/5 rounded w-20" />
        <div className="h-10 bg-white/5 rounded-xl w-24" />
      </div>
    </div>
  );
}

// src/components/LoadingSpinner.tsx
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20 relative">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-white/5" />
        <div className="absolute inset-2 rounded-full border-b-2 border-secondary animate-spin-slow" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 animate-pulse">Syncing Galaxy...</p>
    </div>
  );
}

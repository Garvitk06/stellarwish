// src/components/ProgressBar.tsx
import React from 'react';

interface Props {
  percent: number;
  animated?: boolean;
}

export default function ProgressBar({ percent, animated = true }: Props) {
  const displayPercent = Math.min(percent, 100);
  const isFullyFunded = percent >= 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Growth Status</span>
        <span className={`text-sm font-black font-mono ${isFullyFunded ? 'text-success' : 'text-primary-light'}`}>
          {percent.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5 shadow-inner overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
            isFullyFunded ? 'bg-success' : 'bg-stellar-gradient'
          } ${animated && !isFullyFunded ? 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}`}
          style={{ width: `${displayPercent}%` }}
        >
          {animated && !isFullyFunded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          )}
        </div>
      </div>
    </div>
  );
}

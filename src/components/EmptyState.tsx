// src/components/EmptyState.tsx
import React from 'react';
import Link from 'next/link';

interface Props {
  message?: string;
  onAction?: () => void;
  actionText?: string;
}

export default function EmptyState({ 
  message = "No wishes found in this sector.", 
  onAction,
  actionText = "Initialize Mission"
}: Props) {
  return (
    <div className="glass-card py-20 px-8 text-center max-w-2xl mx-auto space-y-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-stellar-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />
      
      <div className="relative flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" />
          <span className="text-4xl animate-twinkle">✦</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black font-space text-white">{message}</h3>
          <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed font-medium font-inter">
            Be the first to launch a wish in this galaxy and start your crowdfunding orbit!
          </p>
        </div>
        
        <div className="pt-4 flex items-center justify-center gap-4">
          {onAction ? (
            <button
              onClick={onAction}
              className="btn-stellar !px-10"
            >
              {actionText}
            </button>
          ) : (
            <Link
              href="/create"
              className="btn-stellar !px-10"
            >
              Launch a Wish
            </Link>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}

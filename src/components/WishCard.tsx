// src/components/WishCard.tsx
import React from 'react';
import Link from 'next/link';
import { Wish } from '@/types';
import ProgressBar from './ProgressBar';
import CountdownTimer from './CountdownTimer';
import { truncateAddress, getProgressPercent, getStatusColor } from '@/lib/utils';

interface Props {
  wish: Wish;
}

export default function WishCard({ wish }: Props) {
  const percent = getProgressPercent(wish.raisedAmount, wish.targetAmount);
  // We'll update the getStatusColor utility in a separate step or just override classes here
  const statusColor = getStatusColor(wish.status);

  return (
    <div className="glass-card p-6 flex flex-col group h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors line-clamp-1 font-space tracking-tight">
          {wish.title}
        </h3>
        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border border-white/10 ${statusColor} bg-white/5 backdrop-blur-md`}>
          {wish.status}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
        {wish.description}
      </p>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
          {wish.creatorAddress.slice(2, 3).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Creator</span>
          <span className="text-xs text-gray-300 font-mono">
            {truncateAddress(wish.creatorAddress)}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-8 mt-auto">
        <ProgressBar percent={percent} />
        <div className="flex justify-between text-[11px] font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-bold uppercase tracking-widest">Raised</span>
            <span className="text-white font-black text-sm">{wish.raisedAmount.toFixed(2)} XLM</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-gray-500 font-bold uppercase tracking-widest">Target</span>
            <span className="text-gray-400 text-sm">{wish.targetAmount.toFixed(1)} XLM</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
        <CountdownTimer deadline={wish.deadline} />
        <Link 
          href={`/wish/${wish._id}`}
          className="px-5 py-2.5 bg-white/5 hover:bg-stellar-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-transparent"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}

// src/app/wish/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Wish } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import CountdownTimer from '@/components/CountdownTimer';
import ContributeModal from '@/components/ContributeModal';
import { formatXLM, truncateAddress, getProgressPercent, getStatusColor } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function WishDetail() {
  const { id } = useParams();
  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWish();
  }, [id]);

  const fetchWish = async () => {
    try {
      const res = await fetch(`/api/wishes/${id}`);
      const data = await res.json();
      setWish(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-32"><LoadingSpinner /></div>;
  if (!wish) return (
    <div className="text-center py-32 space-y-6">
      <h3 className="text-3xl font-black font-space text-white">404: Stellar Object Not Found</h3>
      <p className="text-gray-500">The wish you are looking for has drifted out of range.</p>
    </div>
  );

  const percent = getProgressPercent(wish.raisedAmount, wish.targetAmount);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-4 animate-in fade-in duration-1000">
      {/* Main Content Card */}
      <div className="glass-card p-8 md:p-14 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[15rem] font-black pointer-events-none select-none">
           WISH
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border border-white/10 ${getStatusColor(wish.status)} bg-white/5 backdrop-blur-md tracking-[0.2em]`}>
                {wish.status}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                 ID: {wish._id.slice(-6).toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black font-space leading-[0.9] text-white tracking-tighter">
              {wish.title}
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium max-w-2xl">
              {wish.description}
            </p>
          </div>

          <div className="glass-card !bg-white/[0.02] p-8 rounded-3xl border-white/5 min-w-[320px] w-full lg:w-auto space-y-6 shadow-3xl">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Growth Goal</span>
                <span className="font-black text-xl text-white tracking-tight">{formatXLM(wish.targetAmount)} <span className="text-xs opacity-50">XLM</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Accumulated</span>
                <span className="font-black text-xl text-primary-light tracking-tight">{formatXLM(wish.raisedAmount)} <span className="text-xs opacity-50">XLM</span></span>
              </div>
            </div>
            
            <div className="h-px bg-white/5" />
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Time Remaining</span>
              <CountdownTimer deadline={wish.deadline} className="!text-2xl !font-black !tracking-tighter" />
            </div>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <ProgressBar percent={percent} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-10 border-t border-white/5 pt-10 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center font-black text-secondary text-xl shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              {wish.creatorAddress.slice(2, 3).toUpperCase()}
            </div>
            <div className="space-y-1">
              <span className="text-gray-600 block text-[10px] uppercase font-black tracking-widest">Mission Architect</span>
              <a 
                href={`https://stellar.expert/explorer/testnet/account/${wish.creatorAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light font-mono hover:text-white transition-colors font-bold text-sm"
              >
                {truncateAddress(wish.creatorAddress)}
              </a>
            </div>
          </div>
          
          <button 
            disabled={wish.status !== 'active'}
            onClick={() => setIsModalOpen(true)}
            className="btn-stellar !px-16 !py-5 !text-xl !rounded-2xl w-full md:w-auto disabled:opacity-30 disabled:hover:scale-100 disabled:grayscale"
          >
            Launch Support ✦
          </button>
        </div>
      </div>

      {/* Contributions Section */}
      <div className="glass-card p-10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-7xl font-black pointer-events-none select-none uppercase tracking-widest">
           History
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-black font-space text-white tracking-tighter">Support Feed</h3>
            <p className="text-gray-500 text-sm font-medium">Tracing the flow of XLM across the network.</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 glass-card !bg-white/5 !rounded-xl !border-white/10">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Backers</span>
            <span className="text-sm font-black text-white font-mono">{wish.contributions.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                <th className="pb-6 font-black pl-2">Contributor</th>
                <th className="pb-6 font-black">Amount</th>
                <th className="pb-6 font-black">Network ID</th>
                <th className="pb-6 font-black text-right pr-2">Orbit Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {wish.contributions.map((c, i) => (
                <tr key={i} className="group border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 font-mono text-gray-300 font-bold pl-2">{truncateAddress(c.contributorAddress)}</td>
                  <td className="py-6">
                    <span className="bg-stellar-gradient text-transparent bg-clip-text font-black text-lg">
                      {c.amount} <span className="text-[10px] uppercase opacity-50">XLM</span>
                    </span>
                  </td>
                  <td className="py-6">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${c.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary/60 hover:text-primary-light flex items-center gap-2 font-mono text-xs transition-all"
                    >
                      {c.txHash.slice(0, 12)}...
                      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                  <td className="py-6 text-gray-500 text-xs font-bold font-mono text-right pr-2">
                    {new Date(c.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {wish.contributions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-700">
                        ✦
                      </div>
                      <p className="text-gray-600 font-bold italic tracking-wide text-sm">
                        Total silence in this sector. Launch the first contribution to ignite this wish.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ContributeModal 
          wish={wish} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            fetchWish();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

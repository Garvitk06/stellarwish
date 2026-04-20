// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wish } from '@/types';
import WishCard from '@/components/WishCard';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';

export default function Home() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchWishes();
  }, [statusFilter]);

  const fetchWishes = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/api/wishes' : `/api/wishes?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setWishes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['all', 'active', 'funded', 'expired'];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 pt-16 px-4 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary-light mb-4 animate-bounce">
          ✦ Decentralized Crowdfunding ✦
        </div>
        <h1 className="text-6xl md:text-8xl font-black font-space leading-[0.9] tracking-tighter">
          Fund Dreams on<br />
          <span className="text-stellar drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            the Galaxy
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Create a wish, share it with the world, and watch your community fund your dreams using Stellar XLM. Transparent, decentralized, and fast as light.
        </p>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/create" className="btn-stellar w-full md:w-auto">
            Create a Wish
          </Link>
          <Link href="/dashboard" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 w-full md:w-auto">
            My Portfolio
          </Link>
        </div>
      </section>

      {/* Wishes Section */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
          <h2 className="text-2xl font-bold font-space flex items-center gap-2">
            Explore Wishes <span className="text-primary/50 text-sm">/ {statusFilter}</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 p-1 glass-card rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === tab
                    ? 'bg-stellar-gradient text-white shadow-lg'
                    : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : wishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
            {wishes.map((wish) => (
              <WishCard key={wish._id} wish={wish} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

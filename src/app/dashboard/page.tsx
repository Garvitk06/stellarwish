// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Wish } from '@/types';
import WishCard from '@/components/WishCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function DashboardPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [refundingIds, setRefundingIds] = useState<string[]>([]);
  const [payoutingIds, setPayoutingIds] = useState<string[]>([]);

  useEffect(() => {
    const address = window.sessionStorage.getItem('stellar_wish_address');
    if (address) {
      setUserAddress(address);
      fetchMyWishes(address);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyWishes = async (address: string) => {
    try {
      const res = await fetch(`/api/wishes?creatorAddress=${address}`);
      const data = await res.json();
      setWishes(data);
    } catch (error) {
      console.error('Error fetching my wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (wish: Wish) => {
    setEditingId(wish._id);
    setEditForm({ title: wish.title, description: wish.description });
  };

  const handleEditSubmit = async (id: string) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-address': userAddress || '',
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setWishes(wishes.map(w => w._id === id ? { ...w, ...editForm } : w));
        setEditingId(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update wish');
      }
    } catch (error) {
      console.error('Error updating wish:', error);
      alert('An error occurred while updating the wish');
    }
  };

  const handleRefund = async (id: string) => {
    if (!confirm('This will trigger XLM refunds from the escrow to all contributors of this wish. Proceed?')) return;

    setRefundingIds([...refundingIds, id]);
    try {
      const res = await fetch(`/api/wishes/${id}/refund`, {
        method: 'POST',
        headers: {
          'x-user-address': userAddress || '',
        },
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setWishes(wishes.map(w => w._id === id ? { ...w, status: 'refunded' as const } : w));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to process refunds');
      }
    } catch (error) {
      console.error('Error refunding wish:', error);
      alert('An error occurred during the refund process');
    } finally {
      setRefundingIds(refundingIds.filter(rid => rid !== id));
    }
  };

  const handleRetryPayout = async (id: string) => {
    if (!confirm('This will attempt to transfer the funds from the escrow to your wallet. Proceed?')) return;

    setPayoutingIds([...payoutingIds, id]);
    try {
      const res = await fetch(`/api/wishes/${id}/payout`, {
        method: 'POST',
        headers: {
          'x-user-address': userAddress || '',
        },
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setWishes(wishes.map(w => w._id === id ? { ...w, payoutHash: data.hash } : w));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to process payout');
      }
    } catch (error) {
      console.error('Error processing payout:', error);
      alert('An error occurred during the payout process');
    } finally {
      setPayoutingIds(payoutingIds.filter(pid => pid !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wish? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-address': userAddress || '',
        },
      });

      if (res.ok) {
        setWishes(wishes.filter((w) => w._id !== id));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete wish');
      }
    } catch (error) {
      console.error('Error deleting wish:', error);
      alert('An error occurred while deleting the wish');
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  if (!userAddress) {
    return (
      <div className="py-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-5">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
          <span className="text-3xl animate-twinkle">✦</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black font-space text-white tracking-tighter text-balance">Access Required</h2>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">Please connect your Stellar portfolio to access your dashboard and mission control.</p>
        </div>
        <div className="flex justify-center">
          <Link href="/" className="btn-stellar !rounded-xl text-xs uppercase tracking-widest px-10">
            Return to Command Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-in fade-in duration-1000 ease-out">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-light">
             Control Unit
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-space text-white tracking-tighter">My Dashboard</h1>
          <p className="text-gray-500 text-lg font-medium">Manage your active wishes and monitor funding trajectories.</p>
        </div>
        <Link 
          href="/create"
          className="btn-stellar !text-xs !bg-white/5 !border !border-white/10 !text-white hover:!bg-stellar-gradient hover:!border-transparent !px-10 !rounded-2xl"
        >
          Create New Mission ✦
        </Link>
      </div>

      {wishes.length === 0 ? (
        <EmptyState 
          message="No active missions found." 
          actionText="Initialize First Wish" 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {wishes.map((wish) => (
            <div key={wish._id} className="relative group flex flex-col gap-6">
              <div className="relative">
                <WishCard wish={wish} />
                <button
                  onClick={() => handleDelete(wish._id)}
                  className="absolute top-4 right-4 p-2.5 glass-card !bg-red-500/10 text-red-400 !border-red-500/20 !rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:!bg-red-500 hover:text-white"
                  title="Delete Mission"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Management Controls */}
              <div className="px-2 space-y-4">
                {editingId === wish._id ? (
                  <div className="glass-card !bg-white/[0.02] p-5 space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Modify Title</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-white/5 rounded-xl p-3 text-white text-sm focus:border-primary/50 transition-all outline-none"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Update Story</label>
                      <textarea
                        className="w-full bg-background border border-white/5 rounded-xl p-3 text-white text-xs h-24 focus:border-primary/50 transition-all outline-none resize-none leading-relaxed"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleEditSubmit(wish._id)}
                        className="btn-stellar flex-1 !py-2.5 !text-[10px] !uppercase !tracking-widest"
                      >
                        Commit Changes
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2.5 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                      >
                        Abort
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {wish.status === 'active' && (
                      <button
                        onClick={() => handleEditInit(wish)}
                        className="flex-1 py-3 bg-white/5 text-gray-400 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all group/btn flex items-center justify-center gap-2"
                      >
                        Edit Details
                        <span className="text-secondary opacity-50 group-hover/btn:opacity-100 transition-opacity animate-twinkle">✧</span>
                      </button>
                    )}
                    {wish.status === 'expired' && (
                      <button
                        onClick={() => handleRefund(wish._id)}
                        disabled={refundingIds.includes(wish._id)}
                        className="flex-1 py-3 bg-red-400/5 text-red-400 border border-red-400/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-400 hover:text-white transition-all disabled:opacity-30"
                      >
                        {refundingIds.includes(wish._id) ? 'Processing Refunds...' : 'Refund Contributors'}
                      </button>
                    )}
                    {wish.status === 'funded' && !wish.payoutHash && (
                      <button
                        onClick={() => handleRetryPayout(wish._id)}
                        disabled={payoutingIds.includes(wish._id)}
                        className="flex-1 btn-stellar !py-3 !text-[10px] !uppercase !tracking-widest disabled:opacity-30"
                      >
                        {payoutingIds.includes(wish._id) ? 'Deploying Funds...' : 'Finalize Payout 🚀'}
                      </button>
                    )}
                  </div>
                )}
                
                {/* Payout Info */}
                {wish.payoutHash && (
                  <div className="pt-2 animate-in fade-in duration-1000">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${wish.payoutHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 glass-card !bg-success/5 hover:!bg-success/10 !border-success/20 transition-all px-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[10px] text-success font-black uppercase tracking-[0.15em]">Transaction Success</span>
                      </div>
                      <svg className="w-3 h-3 text-success opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

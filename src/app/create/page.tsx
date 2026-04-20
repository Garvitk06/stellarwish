// src/app/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WalletConnect from '@/components/WalletConnect';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CreateWish() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: 1,
    deadline: '',
  });

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description)) return;
    if (step === 2 && (!formData.targetAmount || !formData.deadline)) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!creatorAddress) return;
    try {
      setLoading(true);
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, creatorAddress }),
      });
      const data = await res.json();
      if (data._id) {
        router.push(`/wish/${data._id}`);
      }
    } catch (error) {
      console.error('Error creating wish:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-10 relative">
      {/* Decorative Orbs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-40 -right-10 w-60 h-60 bg-secondary/10 rounded-full blur-[120px] -z-10" />

      {/* Stepper */}
      <div className="flex justify-between items-center relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10"></div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-2 ${
              step >= i 
                ? 'bg-stellar-gradient border-transparent text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-110' 
                : 'bg-background border-white/5 text-gray-600'
            }`}
          >
            {i === 1 && "I"}
            {i === 2 && "II"}
            {i === 3 && "III"}
          </div>
        ))}
      </div>

      <div className="glass-card p-10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-9xl font-black pointer-events-none select-none">
          {step === 1 && "STORY"}
          {step === 2 && "GOAL"}
          {step === 3 && "LAUNCH"}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-4xl font-black font-space tracking-tighter">Tell your story</h2>
              <p className="text-gray-500 text-sm font-medium">Capture the imagination of the Stellar community.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 font-black uppercase tracking-[0.2em]">Wish Title</label>
                <input
                  type="text"
                  maxLength={80}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What are you wishing for?"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700 font-medium"
                />
                <p className="text-right text-[10px] text-gray-600 mt-2 font-mono font-bold tracking-widest">{formData.title.length} / 80</p>
              </div>
              
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 font-black uppercase tracking-[0.2em]">Description</label>
                <textarea
                  rows={5}
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share the details, the why, and the impact..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-700 font-medium leading-relaxed"
                />
                <p className="text-right text-[10px] text-gray-600 mt-2 font-mono font-bold tracking-widest">{formData.description.length} / 500</p>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!formData.title || !formData.description}
              className="btn-stellar w-full !rounded-2xl py-5 disabled:opacity-30 disabled:hover:scale-100"
            >
              Next Phase ✦
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-4xl font-black font-space tracking-tighter">Set your goals</h2>
              <p className="text-gray-500 text-sm font-medium">Define the resources needed for your mission.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 font-black uppercase tracking-[0.2em]">Target Amount (XLM)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:border-primary/50 outline-none transition-all font-black text-2xl"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-black tracking-widest uppercase text-xs">XLM</div>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] text-gray-500 mb-2 font-black uppercase tracking-[0.2em]">Deadline Date</label>
                <input
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:border-primary/50 outline-none transition-all font-medium lg:appearance-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 py-5 glass-card !rounded-2xl text-gray-400 font-black uppercase text-xs tracking-widest hover:text-white transition-all">Back</button>
              <button
                onClick={nextStep}
                disabled={!formData.targetAmount || !formData.deadline}
                className="btn-stellar flex-[2] !rounded-2xl py-5 disabled:opacity-30 disabled:hover:scale-100"
              >
                Review Launch ✦
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-2">
              <h2 className="text-4xl font-black font-space tracking-tighter">Review & Launch</h2>
              <p className="text-gray-500 text-sm font-medium">Verify your flight parameters before ignition.</p>
            </div>

            <div className="glass-card !bg-white/[0.02] p-8 text-left space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <span className="text-4xl">🚀</span>
               </div>
              
              <div>
                <span className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] block mb-2">Final Objective</span>
                <p className="font-black text-2xl text-white tracking-tight leading-tight">{formData.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                <div>
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] block mb-1">Total Target</span>
                  <p className="font-black text-xl text-primary-light">{formData.targetAmount} <span className="text-xs">XLM</span></p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] block mb-1">Expiration</span>
                  <p className="font-black text-xl text-white">{formData.deadline}</p>
                </div>
              </div>
            </div>

            {!creatorAddress ? (
              <div className="p-12 glass-card !bg-primary/5 !border-primary/20 group relative">
                <div className="absolute inset-0 bg-stellar-gradient opacity-0 group-hover:opacity-[0.02] transition-opacity" />
                <p className="text-gray-400 mb-8 font-bold text-sm leading-relaxed">
                  Authentication Required.<br />
                  <span className="text-xs font-medium opacity-60">Authorize with your Freighter wallet to publish to the galaxy.</span>
                </p>
                <div className="flex justify-center">
                  <WalletConnect onConnect={(addr) => setCreatorAddress(addr)} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-stellar w-full !rounded-2xl py-6 text-xl shadow-[0_0_40px_rgba(6,182,212,0.2)]"
                >
                  {loading ? <LoadingSpinner /> : 'Initiate Ignition 🚀'}
                </button>
                <button onClick={prevStep} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-primary transition-all">
                  ← Edit Parameters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

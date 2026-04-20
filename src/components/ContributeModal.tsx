// src/components/ContributeModal.tsx
'use client';

import React, { useState } from 'react';
import { Wish } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import { signTransaction, getPublicKey } from '@stellar/freighter-api';
import { buildPaymentXDR } from '@/lib/stellar';

interface Props {
  wish: Wish;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'input' | 'processing' | 'success';

export default function ContributeModal({ wish, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('input');
  const [amount, setAmount] = useState<number>(1);
  const [statusText, setStatusText] = useState('');

  const handleFund = async () => {
    try {
      setStep('processing');
      setStatusText('Syncing with Freighter...');
      
      const publicKey = await getPublicKey();
      
      if (!publicKey) {
        throw new Error('Could not find a connected wallet. Please connect your Freighter wallet.');
      }

      setStatusText('Building Transaction...');
      const xdr = await buildPaymentXDR(
        publicKey,
        process.env.NEXT_PUBLIC_ESCROW_ADDRESS || 'GBRPYHIL2CI3FNMWB27S6GZ66W5A6IHYZ3BML5U3BH522E3Y464N6SGR', 
        amount.toString(),
        wish.stellarMemo
      );

      setStatusText('Sign Transaction in Freighter...');
      const signedXdr = await signTransaction(xdr, { network: 'TESTNET' });

      setStatusText('Broadcasting to Galaxy...');
      
      const { server } = await import('@/lib/stellar');
      const { Transaction, Networks } = await import('@stellar/stellar-sdk');
      
      const transaction = new Transaction(signedXdr, Networks.TESTNET);
      const result = await server.submitTransaction(transaction);
      
      const txHash = result.hash;
      
      setStatusText('Confirming on StellarWish...');
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishId: wish._id,
          contributorAddress: publicKey,
          amount,
          txHash
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update contribution Record');
      }
      
      setStep('success');
    } catch (e: any) {
      alert(e.message || 'Transaction failed');
      setStep('input');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-card p-10 max-w-md w-full shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-stellar-gradient"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-black font-space text-white tracking-tighter">Support Mission</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{wish._id.slice(-8).toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-white transition-all w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-white/10"
          >
            ✕
          </button>
        </div>

        {step === 'input' && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300 relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">Deployment Amount</span>
                <span className="text-[10px] text-primary-light font-black tracking-widest uppercase">Network: Testnet</span>
              </div>
              <div className="glass-card !bg-background !border-white/5 p-6 flex items-center justify-between group-hover:border-primary/20 transition-all">
                <input
                  type="number"
                  min={1}
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-transparent text-5xl font-black text-white outline-none font-space tracking-tighter"
                />
                <span className="text-xl font-black text-primary-light ml-4 font-space tracking-widest">XLM</span>
              </div>
            </div>

            <div className="glass-card !bg-primary/5 !border-primary/10 p-5">
              <p className="text-xs text-primary-light/80 leading-relaxed font-medium italic">
                Stellar Escrow Protocol Active. Funds only released upon milestone completion or funding success.
              </p>
            </div>

            <button
              onClick={handleFund}
              className="btn-stellar w-full !py-5 !text-xl !rounded-2xl"
            >
              Commit Support ✦
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center gap-10 animate-in fade-in duration-500 relative z-10">
            <div className="relative">
              <div className="absolute inset-x-0 -bottom-8 mx-auto w-24 h-8 bg-primary/20 blur-2xl rounded-full"></div>
              <LoadingSpinner />
            </div>
            <div className="space-y-3 text-center">
              <h3 className="text-xl font-black font-space text-white tracking-widest uppercase">Processing...</h3>
              <p className="text-gray-500 font-bold text-xs animate-pulse tracking-widest uppercase">{statusText}</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-10 animate-in zoom-in-95 duration-500 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-stellar-gradient flex items-center justify-center mx-auto text-white text-5xl shadow-3xl shadow-primary/40 animate-pulseGlow">
              ✓
            </div>
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-white font-space tracking-tighter">Mission Success!</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">
                Your contribution has been broadcasted to the Stellar network. Thank you for making this wish a reality.
              </p>
            </div>
            <button
              onClick={onSuccess}
              className="w-full py-5 glass-card !bg-white/5 !text-white font-black uppercase tracking-widest text-xs hover:!bg-white/10 transition-all !rounded-2xl"
            >
              Close Signal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

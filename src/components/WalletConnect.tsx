// src/components/WalletConnect.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  setAllowed, 
  getPublicKey, 
  isConnected 
} from '@stellar/freighter-api';
import { truncateAddress } from '@/lib/utils';

interface Props {
  onConnect?: (address: string) => void;
}

export default function WalletConnect({ onConnect }: Props) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (await isConnected()) {
        const pubKey = await getPublicKey();
        if (pubKey) {
          setAddress(pubKey);
          window.sessionStorage.setItem('stellar_wish_address', pubKey);
          onConnect?.(pubKey);
        }
      }
    } catch (e) {
      console.error('Freighter connection error:', e);
    }
  };

  const requestAccess = async () => {
    try {
      const allowed = await setAllowed();
      if (allowed) {
        return await getPublicKey();
      }
      return null;
    } catch (e) {
      console.error('Access request error:', e);
      return null;
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (await isConnected()) {
        const pubKey = await requestAccess();
        if (pubKey) {
          setAddress(pubKey);
          window.sessionStorage.setItem('stellar_wish_address', pubKey);
          onConnect?.(pubKey);
        } else {
          setErrorMsg('Access denied or cancelled');
        }
      } else {
        setErrorMsg('Please install Freighter wallet');
      }
    } catch (e) {
      setErrorMsg('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAddress('');
    window.sessionStorage.removeItem('stellar_wish_address');
    onConnect?.('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      {!address ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="btn-stellar !px-6 !py-2.5 !text-xs !rounded-xl flex items-center gap-2 group"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="hidden sm:inline">Connect Wallet</span>
          )}
          <span className="sm:hidden">Connect</span>
          <span className="opacity-50 group-hover:opacity-100 transition-opacity">✦</span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2.5 glass-card !rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-stellar-gradient flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
              {address.slice(2, 3).toUpperCase()}
            </div>
            <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-white transition-colors">
              {truncateAddress(address)}
            </span>
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-3 w-56 glass-card !bg-slate-900/90 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-white/5">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Active Network</p>
                  <p className="text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    Stellar Testnet
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-3 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                >
                  Disconnect Wallet
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {errorMsg && (
        <div className="absolute top-full mt-4 right-0 w-64 p-4 glass-card !bg-red-950/20 !border-red-500/30 text-red-400 text-xs animate-in slide-in-from-top-2">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}

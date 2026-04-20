// src/components/CountdownTimer.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  deadline: Date | string;
  className?: string;
}

export default function CountdownTimer({ deadline, className }: Props) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className={`flex items-center gap-2 font-mono ${className || 'text-sm text-gray-400'} ${timeLeft === 'Expired' ? 'text-red-500' : ''}`}>
      <span className="text-[10px] uppercase opacity-50 font-black tracking-widest">Ending In</span>
      <span className="font-bold">{timeLeft}</span>
    </div>
  );
}

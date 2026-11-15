'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Flame, HeartHandshake } from 'lucide-react';
import FacebookIcon from './FacebookIcon';
import { spiritualAudio } from '@/lib/audio';

interface NavbarProps {
  onOpenDonate: () => void;
  onKnockFish: () => void;
  meritPoints: number;
}

export default function Navbar({ onOpenDonate, onKnockFish, meritPoints }: NavbarProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      spiritualAudio.playBell();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-horror-bg/90 border-b border-horror-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo XÁM Stile */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-black border-2 border-red-600 flex items-center justify-center shadow-lg shadow-red-950/60 group-hover:scale-105 transition-transform">
            <span className="text-xl">🕯️</span>
          </div>
          <div>
            <div className="font-serif font-black tracking-wider text-xl flex items-center gap-1 leading-none">
              <span className="text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">XÁM</span>
              <span className="text-red-500 font-extrabold italic drop-shadow-[0_0_12px_rgba(220,38,38,0.9)]">Stile</span>
            </div>
            <p className="text-[10px] text-zinc-400 tracking-wider uppercase mt-0.5">Kể Chuyện Kinh Dị</p>
          </div>
        </Link>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Nút Fanpage Facebook */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-600/50 hover:bg-blue-900/50 text-blue-300 hover:text-white text-xs font-semibold transition active:scale-95 shadow-sm"
          >
            <FacebookIcon size={14} className="text-blue-400" />
            <span>Fanpage Facebook</span>
          </a>

          {/* Nút Trừ Tà Tích Phúc */}
          <button
            onClick={() => {
              if (soundEnabled) spiritualAudio.playWoodenFish();
              onKnockFish();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-red-500 text-zinc-300 text-xs font-semibold transition active:scale-95 shadow-sm"
            title="Thắp nến trừ tà tích can đảm"
          >
            <span className="text-sm animate-pulse">🕯️</span>
            <span className="hidden md:inline">Can Đảm:</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-[11px] font-mono text-red-300 border border-red-800/60">
              {meritPoints}
            </span>
          </button>

          {/* Âm thanh */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-horror-surface border border-horror-border hover:border-red-500/60 text-zinc-400 hover:text-red-400 transition"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* Nút Donate Tiếp Sức */}
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 border border-red-500 text-white font-serif font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-950/70 hover:shadow-red-800/50 transition active:scale-95"
          >
            <Flame size={16} className="text-amber-300 animate-pulse" />
            <span>DONATE TIẾP SỨC</span>
          </button>
        </div>
      </div>
    </header>
  );
}

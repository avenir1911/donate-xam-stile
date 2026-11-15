'use client';

import React from 'react';
import { Crown, Sparkles, Flame, Eye, Skull } from 'lucide-react';
import { Donor } from '@/lib/types';

interface TopThreePodiumProps {
  topDonors: Donor[];
  onSelectDonor: (donor: Donor) => void;
  onBless: (id: string, e: React.MouseEvent) => void;
}

export default function TopThreePodium({ topDonors, onSelectDonor, onBless }: TopThreePodiumProps) {
  if (topDonors.length === 0) return null;

  const first = topDonors[0];
  const second = topDonors[1];
  const third = topDonors[2];

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-serif font-black text-red-400 flex items-center justify-center gap-2">
          <Skull className="text-red-500 animate-pulse" size={24} />
          <span>TAM ĐẠI HỘ PHÁP TIẾP SỨC KÊNH</span>
          <Skull className="text-red-500 animate-pulse" size={24} />
        </h2>
        <p className="text-xs text-zinc-400 font-serif italic mt-1">
          Hào quang trăng máu • Ba vị thí chủ gánh vác cõi đêm của Xám Stile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
        {/* HẠNG 2: PHÁP SƯ BẮT MA (Nhị Vị) */}
        {second && (
          <div className="order-2 md:order-1 flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-zinc-900/90 to-horror-surface border border-zinc-700/60 rounded-2xl p-5 text-center relative shadow-xl hover:border-zinc-500 transition duration-300 group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-zinc-300 text-zinc-950 font-serif font-black text-xs uppercase shadow-md flex items-center gap-1">
                <span>🥈 Hạng Nhì</span>
              </div>

              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mt-2 rounded-full p-1 bg-gradient-to-tr from-zinc-400 to-zinc-600 shadow-md">
                <img
                  src={second.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${second.name}`}
                  alt={second.name}
                  className="w-full h-full object-cover rounded-full bg-zinc-950"
                />
              </div>

              <h3 className="font-serif font-bold text-base text-zinc-200 mt-3 truncate" title={second.name}>
                {second.name}
              </h3>
              <p className="text-[11px] text-red-400 font-serif">{second.title}</p>

              <div className="mt-3 py-1.5 px-3 rounded-lg bg-black/60 border border-zinc-800">
                <span className="text-red-400 font-mono font-bold text-lg">
                  {second.amount.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-serif italic mt-3 line-clamp-2 min-h-[32px]">
                "{second.message}"
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => onBless(second.id, e)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition text-[11px] active:scale-90"
                  title="Thắp nến tiếp sức (+1 can đảm)"
                >
                  <span>🕯️ Trừ tà</span>
                  <span className="font-mono text-zinc-300">({second.blessingsCount || 0})</span>
                </button>
                <button
                  onClick={() => onSelectDonor(second)}
                  className="text-zinc-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
                >
                  <Eye size={12} />
                  <span>Xem Sớ</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HẠNG 1: CHÚA TỂ CÕI ÂM (Quán Quân - Đỏ Máu Rực Rỡ) */}
        {first && (
          <div className="order-1 md:order-2 flex flex-col items-center -translate-y-2 md:-translate-y-4">
            <div className="w-full bg-gradient-to-b from-red-950/80 via-horror-surface to-horror-card border-2 border-red-600 rounded-2xl p-6 text-center relative shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_rgba(220,38,38,0.8)] transition duration-300 group">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-serif font-black text-xs uppercase shadow-lg flex items-center gap-1.5 animate-bounce">
                <Crown size={14} className="text-amber-300" />
                <span>Quán Quân Cõi Âm</span>
              </div>

              {/* Avatar với Vòng Trăng Máu */}
              <div className="relative w-24 h-24 mx-auto mt-2 rounded-full p-1 bg-gradient-to-tr from-red-500 via-red-600 to-amber-500 shadow-2xl">
                <div className="absolute inset-0 rounded-full animate-ping opacity-25 bg-red-600" />
                <img
                  src={first.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${first.name}`}
                  alt={first.name}
                  className="w-full h-full object-cover rounded-full bg-zinc-950 relative z-10"
                />
              </div>

              <h3 className="font-serif font-black text-lg text-zinc-100 mt-4 truncate" title={first.name}>
                {first.name}
              </h3>
              <p className="text-xs text-red-400 font-serif font-semibold">{first.title}</p>

              <div className="mt-3 py-2 px-4 rounded-xl bg-red-950/70 border border-red-700/80 shadow-inner">
                <span className="text-red-300 font-mono font-black text-xl tracking-tight">
                  {first.amount.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <p className="text-xs text-zinc-300 font-serif italic mt-3 line-clamp-2 min-h-[32px]">
                "{first.message}"
              </p>

              <div className="mt-4 pt-3 border-t border-red-900/60 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => onBless(first.id, e)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition text-xs font-semibold active:scale-90"
                  title="Thắp nến tiếp sức (+1 can đảm)"
                >
                  <span className="text-sm">🕯️ Trừ tà</span>
                  <span className="font-mono text-red-300">({first.blessingsCount || 0})</span>
                </button>
                <button
                  onClick={() => onSelectDonor(first)}
                  className="text-red-400 hover:text-red-200 font-serif flex items-center gap-1 text-xs"
                >
                  <Eye size={14} />
                  <span>Chiêm Bái Sớ</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HẠNG 3: THẦY TRỪ TÀ (Tam Vị) */}
        {third && (
          <div className="order-3 md:order-3 flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-orange-950/40 to-horror-surface border border-orange-900/50 rounded-2xl p-5 text-center relative shadow-xl hover:border-orange-700 transition duration-300 group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-800 text-orange-100 font-serif font-black text-xs uppercase shadow-md flex items-center gap-1">
                <span>🥉 Hạng Ba</span>
              </div>

              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mt-2 rounded-full p-1 bg-gradient-to-tr from-orange-700 to-red-950 shadow-md">
                <img
                  src={third.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${third.name}`}
                  alt={third.name}
                  className="w-full h-full object-cover rounded-full bg-zinc-950"
                />
              </div>

              <h3 className="font-serif font-bold text-base text-zinc-200 mt-3 truncate" title={third.name}>
                {third.name}
              </h3>
              <p className="text-[11px] text-orange-400 font-serif">{third.title}</p>

              <div className="mt-3 py-1.5 px-3 rounded-lg bg-black/60 border border-orange-950/70">
                <span className="text-red-400 font-mono font-bold text-lg">
                  {third.amount.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-serif italic mt-3 line-clamp-2 min-h-[32px]">
                "{third.message}"
              </p>

              <div className="mt-4 pt-3 border-t border-orange-950/80 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => onBless(third.id, e)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition text-[11px] active:scale-90"
                  title="Thắp nến tiếp sức (+1 can đảm)"
                >
                  <span>🕯️ Trừ tà</span>
                  <span className="font-mono text-zinc-300">({third.blessingsCount || 0})</span>
                </button>
                <button
                  onClick={() => onSelectDonor(third)}
                  className="text-zinc-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
                >
                  <Eye size={12} />
                  <span>Xem Sớ</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

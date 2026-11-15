'use client';

import React from 'react';
import Image from 'next/image';
import { Flame, Sparkles, Scroll, Coins, Moon, Skull } from 'lucide-react';
import FacebookIcon from './FacebookIcon';
import { WebSettings } from '@/lib/types';

interface HeroProps {
  settings: WebSettings;
  totalDonors: number;
  currentTotal?: number;
  onOpenDonate: () => void;
}

export default function Hero({ settings, totalDonors, currentTotal, onOpenDonate }: HeroProps) {
  const actualTotal = currentTotal !== undefined ? currentTotal : settings.currentTotal;
  const goal = settings.templeFundGoal > 0 ? settings.templeFundGoal : 20000000;
  const percent = Math.min(100, Math.round((actualTotal / goal) * 100));

  return (
    <section className="relative pt-4 pb-10 overflow-hidden text-center">
      {/* KHUNG BANNER CHÍNH THỨC CỦA KÊNH XÁM STILE */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="relative rounded-2xl overflow-hidden border-2 border-red-900/60 shadow-[0_0_40px_rgba(220,38,38,0.35)] group">
          <img
            src="/xam-stile-banner.jpg"
            alt="Xám Stile - Kể chuyện kinh dị có thật và hư cấu"
            className="w-full h-auto object-cover max-h-[360px] sm:max-h-[420px] transition-transform duration-700 group-hover:scale-105"
          />
          {/* Lớp phủ sương mù gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-horror-bg via-transparent to-black/30 pointer-events-none" />
          
          {/* Huy hiệu nhỏ góc banner */}
          <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-red-600/50 text-[11px] text-red-300 font-serif">
            <Skull size={13} className="text-red-500" />
            <span>Kể chuyện kinh dị có thật & hư cấu</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Nhãn giới thiệu */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-700/60 text-red-300 text-xs tracking-wider uppercase mb-3 shadow-md">
          <Moon size={14} className="text-red-400 animate-pulse" />
          <span>BẢNG XẾP HẠNG & VINH DANH KHÁN GIẢ ĐỒNG HÀNH</span>
          <Moon size={14} className="text-red-400 animate-pulse" />
        </div>

        {/* Tiêu đề chính */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-red-300 to-red-600 drop-shadow-[0_2px_15px_rgba(220,38,38,0.7)]">
          {settings.title}
        </h1>

        <p className="mt-2 text-sm sm:text-base text-zinc-300 font-serif italic max-w-2xl mx-auto">
          "{settings.subtitle}"
        </p>

        {/* Dải thông báo */}
        {settings.bannerNotice && (
          <div className="mt-5 mx-auto max-w-2xl py-2 px-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center gap-2 text-xs sm:text-sm text-red-200 shadow-inner">
            <Scroll size={16} className="text-red-400 shrink-0" />
            <span className="font-serif">{settings.bannerNotice}</span>
          </div>
        )}

        {/* Thanh tiến độ Quỹ Tiếp Sức Kênh */}
        <div className="mt-6 max-w-xl mx-auto bg-horror-card/90 p-4 sm:p-5 rounded-2xl border border-red-900/60 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2 font-serif">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Coins size={16} className="text-red-400" />
              Tổng Linh Thạch Tiếp Sức:
            </span>
            <span className="text-red-400 font-bold font-mono text-base">
              {actualTotal.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3.5 bg-black rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 font-serif">
            <span>Tiến độ: <b className="text-red-400">{percent}%</b> mục tiêu</span>
            <span>Khán Giả Tiếp Sức: <b className="text-red-400">{totalDonors} Người</b></span>
            <span>Mục Tiêu: {settings.templeFundGoal.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        {/* Nút Donate & Xem Kênh */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={onOpenDonate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-serif font-black tracking-wider text-sm shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:shadow-[0_0_35px_rgba(220,38,38,0.9)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <Flame size={18} className="text-amber-300 animate-bounce" />
            <span>DONATE TIẾP SỨC KÊNH</span>
          </button>

          <a
            href={settings.facebookUrl || "https://www.facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-blue-900/60 hover:border-blue-500 text-zinc-200 hover:text-white font-serif font-semibold text-xs sm:text-sm transition flex items-center gap-2"
          >
            <FacebookIcon size={16} className="text-blue-400" />
            <span>THEO DÕI FANPAGE FACEBOOK</span>
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { X, Sparkles, Flame, Skull } from 'lucide-react';
import { Donor } from '@/lib/types';

interface ScrollDetailModalProps {
  donor: Donor | null;
  onClose: () => void;
  onBless: (id: string, e: React.MouseEvent) => void;
}

export default function ScrollDetailModal({ donor, onClose, onBless }: ScrollDetailModalProps) {
  if (!donor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1a0c10] via-[#10070a] to-[#080305] border-2 border-red-700 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] text-zinc-100 font-serif">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-red-950/60 border border-red-700/60 hover:bg-red-900 text-red-300 transition"
        >
          <X size={18} />
        </button>

        {/* Header cuộn sớ */}
        <div className="text-center pb-4 border-b border-red-900/60">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/70 border border-red-700/60 text-[11px] text-red-300 uppercase tracking-widest mb-2">
            <Skull size={12} className="text-red-400" />
            <span>SỚ TRI ÂN KHÁN GIẢ ĐỒNG HÀNH</span>
            <Skull size={12} className="text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-red-400 tracking-wider">
            SỔ VÀNG XÁM STILE
          </h2>
          <p className="text-xs text-zinc-400 italic mt-0.5">
            Khắc cốt ghi tâm • Công đức vô lượng
          </p>
        </div>

        {/* Nội dung chính sớ */}
        <div className="my-6 space-y-4 text-center">
          {/* Avatar & Danh xưng */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-red-600 via-red-800 to-black shadow-lg">
              <img
                src={donor.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${donor.name}`}
                alt={donor.name}
                className="w-full h-full object-cover rounded-full bg-zinc-950"
              />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mt-3">{donor.name}</h3>
            <span className="text-xs px-2.5 py-0.5 mt-1 rounded bg-red-950/70 text-red-300 border border-red-700/60 font-semibold">
              {donor.title}
            </span>
          </div>

          {/* Số tiền tiếp sức */}
          <div className="py-2.5 px-4 rounded-xl bg-black/60 border border-red-900/80 inline-block shadow-inner">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Linh Thạch Tiếp Sức</div>
            <div className="text-2xl font-mono font-black text-red-400">
              {donor.amount.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          {/* Lời gửi gắm */}
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 text-left">
            <div className="text-[10px] text-red-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
              <Flame size={12} />
              <span>Lời Gửi Gắm Đến Xám Stile:</span>
            </div>
            <p className="text-sm italic text-zinc-200 leading-relaxed">
              "{donor.message}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 px-1">
            <span>Ngày lưu danh: <b className="font-mono text-zinc-200">{donor.date}</b></span>
            <span>Trừ tà / Tiếp sức: <b className="font-mono text-red-400">{donor.blessingsCount || 0} lần</b></span>
          </div>
        </div>

        {/* Dấu Triện Đỏ XÁM STILE */}
        <div className="flex items-center justify-between pt-4 border-t border-red-900/60">
          <div className="w-16 h-16 rounded border-2 border-red-600 bg-red-950/40 text-red-500 flex flex-col items-center justify-center font-bold text-[9px] leading-tight rotate-6 shadow-md shadow-red-950">
            <span>XÁM STILE</span>
            <span>ẤN KÝ</span>
            <span className="text-[7px]">CHỨNG MINH</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => onBless(donor.id, e)}
              className="px-4 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 border border-red-600 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            >
              <span>🕯️ Trừ Tà (+1)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold transition"
            >
              Đóng Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

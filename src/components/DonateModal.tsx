'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Flame, Skull, Sparkles } from 'lucide-react';
import { WebSettings } from '@/lib/types';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebSettings;
}

export default function DonateModal({ isOpen, onClose, settings }: DonateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bank = settings.bankAccount || {
    bankName: 'Vietcombank (VCB)',
    accountNumber: '1050043488',
    accountHolder: 'DO DUY KHANG',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-horror-card border-2 border-red-600 rounded-2xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.4)] text-zinc-200 font-serif">
        {/* Nút tắt */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-horror-surface border border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-red-400 transition"
        >
          <X size={18} />
        </button>

        {/* Tiêu đề */}
        <div className="text-center pb-4 border-b border-red-900/60">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/70 border border-red-700/60 text-xs text-red-300 mb-2">
            <Skull size={13} className="text-red-400" />
            <span>Tiếp Sức Kênh Xám Stile</span>
          </div>
          <h2 className="text-xl font-black text-red-400 tracking-wider">DONATE TIẾP SỨC</h2>
          <p className="text-xs text-zinc-400 mt-1 italic">
            Quét mã QR để được vinh danh lên Bảng Vàng của kênh
          </p>
        </div>

        {/* Mã QR */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-3 bg-white rounded-xl shadow-lg border-4 border-red-600 relative group">
            <img
              src={settings.qrCodeUrl || `https://api.vietqr.io/image/VCB-${bank.accountNumber}-compact2.jpg?accountName=${encodeURIComponent(bank.accountHolder)}&addInfo=DONATE%20XAM%20STILE`}
              alt="Mã QR Donate"
              className="w-48 h-48 object-contain rounded-lg"
            />
          </div>
          <span className="text-[11px] text-zinc-400 mt-2">Mở App Ngân Hàng để Quét Mã</span>
        </div>

        {/* Thông tin tài khoản */}
        <div className="bg-horror-surface p-3.5 rounded-xl border border-zinc-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Ngân Hàng:</span>
            <span className="font-bold text-red-300">{bank.bankName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Số Tài Khoản:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-red-400 text-sm">{bank.accountNumber}</span>
              <button
                onClick={() => copyToClipboard(bank.accountNumber)}
                className="text-zinc-400 hover:text-red-400 transition"
                title="Sao chép số tài khoản"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Chủ Tài Khoản:</span>
            <span className="font-bold text-zinc-200 uppercase">{bank.accountHolder}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
            <span className="text-zinc-400">Nội Dung:</span>
            <span className="font-mono text-red-300 text-[11px] bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
              [TenBan] Donate Xam Stile
            </span>
          </div>
        </div>

        <p className="text-[11px] text-center text-zinc-400 italic mt-4">
          * Xám Stile xin chân thành cảm ơn sự đồng hành và tiếp sức của bạn!
        </p>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-serif font-bold text-xs tracking-wider transition shadow-md"
          >
            ĐÃ HIỂU & HOÀN TẤT
          </button>
        </div>
      </div>
    </div>
  );
}

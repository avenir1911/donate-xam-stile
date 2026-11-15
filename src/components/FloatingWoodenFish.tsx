'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { spiritualAudio } from '@/lib/audio';

const COOLDOWN_MS = 2000;       // 2 giây giữa các lần click
const DAILY_LIMIT = 50;         // Tối đa 50 lần/ngày
const STORAGE_KEY = 'xam_candle';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getDailyCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    if (date !== getTodayKey()) return 0;
    return count as number;
  } catch { return 0; }
}

function incrementDailyCount(): number {
  const count = getDailyCount() + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), count }));
  return count;
}

const BLESSING_WORDS = [
  '+1 Can Đảm',
  'Hết Sợ Ma',
  'Tránh Vía Độc',
  'Ngủ Ngon Lúc 2h',
  'Không Thấy Bóng Người',
  'Được Phù Hộ',
  'Xua Tan Vận Xui',
  'Xám Ra Tập Mới',
  'Tâm Trí Vững Vàng',
];

interface FloatingWoodenFishProps {
  meritPoints: number;
  onIncrementMerit: () => void;
}

export default function FloatingWoodenFish({ meritPoints, onIncrementMerit }: FloatingWoodenFishProps) {
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number }[]>([]);
  const [isKnocking, setIsKnocking] = useState(false);
  const [cooldownMsg, setCooldownMsg] = useState('');
  const lastClickRef = useRef<number>(0);

  // Hiển thị thông báo cooldown tạm thời
  const showCooldown = (msg: string) => {
    setCooldownMsg(msg);
    setTimeout(() => setCooldownMsg(''), 1200);
  };

  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();

    // Kiểm tra cooldown
    if (now - lastClickRef.current < COOLDOWN_MS) {
      showCooldown('⏳ Bình tĩnh...');
      return;
    }

    // Kiểm tra giới hạn ngày
    const dailyCount = getDailyCount();
    if (dailyCount >= DAILY_LIMIT) {
      showCooldown('🕯️ Đủ rồi hôm nay!');
      return;
    }

    lastClickRef.current = now;
    incrementDailyCount();

    spiritualAudio.playWoodenFish();
    onIncrementMerit();

    setIsKnocking(true);
    setTimeout(() => setIsKnocking(false), 150);

    const randomText = BLESSING_WORDS[Math.floor(Math.random() * BLESSING_WORDS.length)];
    const newText = {
      id: Date.now() + Math.random(),
      text: randomText,
      x: (Math.random() - 0.5) * 40,
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
    }, 1200);

    if ((meritPoints + 1) % 10 === 0) {
      spiritualAudio.playBell();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: 0.9, y: 0.9 },
        colors: ['#ef4444', '#dc2626', '#f97316', '#ffffff'],
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center select-none">
      {/* Thông báo cooldown */}
      {cooldownMsg && (
        <div
          className="absolute bottom-20 font-serif font-bold text-yellow-400 text-xs whitespace-nowrap text-center pointer-events-none"
          style={{ textShadow: '0 0 8px rgba(234,179,8,0.9)', animation: 'floatUp 1.2s ease-out forwards' }}
        >
          {cooldownMsg}
        </div>
      )}

      {/* Các chữ bay lên */}
      <div className="relative w-full pointer-events-none">
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-12 font-serif font-black text-red-400 text-sm whitespace-nowrap animate-float-fade"
            style={{
              left: `calc(50% + ${item.x}px)`,
              transform: 'translateX(-50%)',
              animation: 'floatUp 1.2s ease-out forwards',
              textShadow: '0 0 10px rgba(220,38,38,0.9)',
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Đèn bão / Quả Mõ Trừ Tà */}
      <button
        onClick={handleClick}
        className={`group relative w-16 h-16 rounded-full bg-gradient-to-br from-red-900 via-zinc-950 to-black border-2 border-red-500 p-2 shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:shadow-[0_0_30px_rgba(220,38,38,0.9)] transition-all flex flex-col items-center justify-center active:scale-90 ${
          isKnocking ? 'scale-90' : 'hover:scale-105'
        }`}
        title="Thắp nến trừ tà (+1 can đảm)"
      >
        <span className="text-2xl filter drop-shadow">🕯️</span>
        <span className="text-[9px] font-serif font-bold text-red-300 tracking-tighter">
          TRỪ TÀ
        </span>

        {/* Huy hiệu điểm */}
        <span className="absolute -top-2 -right-1 px-2 py-0.5 rounded-full bg-red-600 border border-red-300 text-white font-mono text-[10px] font-bold shadow-md">
          {meritPoints}
        </span>
      </button>

      <style jsx global>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, 0) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -60px) scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TopThreePodium from '@/components/TopThreePodium';
import LeaderboardTable from '@/components/LeaderboardTable';
import ScrollDetailModal from '@/components/ScrollDetailModal';
import DonateModal from '@/components/DonateModal';
import FloatingWoodenFish from '@/components/FloatingWoodenFish';
import { Donor, WebSettings } from '@/lib/types';
import { spiritualAudio } from '@/lib/audio';

export default function HomePage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [settings, setSettings] = useState<WebSettings>({
    title: 'BẢNG VINH DANH DONATE',
    subtitle: 'XÁM Stile • Kể Chuyện Kinh Dị Có Thật & Hư Cấu',
    bannerNotice: 'Mỗi linh thạch donate đều tiếp thêm động lực để Xám Stile thức đêm ra mắt những tập truyện rùng rợn nhất!',
    templeFundGoal: 20000000,
    currentTotal: 0,
    adminPin: 'tamlinh68',
  });

  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [meritPoints, setMeritPoints] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('meritPoints');
    if (saved) {
      setMeritPoints(parseInt(saved, 10) || 0);
    }
  }, []);

  const handleIncrementMerit = () => {
    setMeritPoints((prev) => {
      const next = prev + 1;
      localStorage.setItem('meritPoints', next.toString());
      return next;
    });
  };

  const fetchData = async () => {
    try {
      const [resDonors, resSettings] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/settings'),
      ]);
      if (resDonors.ok) {
        const data = await resDonors.json();
        setDonors(data);
      }
      if (resSettings.ok) {
        const data = await resSettings.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBless = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    spiritualAudio.playWoodenFish();
    handleIncrementMerit();

    try {
      setDonors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, blessingsCount: (d.blessingsCount || 0) + 1 } : d))
      );
      if (selectedDonor && selectedDonor.id === id) {
        setSelectedDonor((prev) => (prev ? { ...prev, blessingsCount: (prev.blessingsCount || 0) + 1 } : null));
      }

      await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bless', id }),
      });
    } catch (err) {
      console.error('Lỗi tiếp sức:', err);
    }
  };

  const activeDonors = donors.filter((d) => !d.hidden);
  const actualTotal = activeDonors.reduce((sum, d) => sum + d.amount, 0);
  const topThree = activeDonors.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          onOpenDonate={() => setIsDonateOpen(true)}
          onKnockFish={handleIncrementMerit}
          meritPoints={meritPoints}
        />

        <Hero
          settings={settings}
          totalDonors={activeDonors.length}
          currentTotal={actualTotal}
          onOpenDonate={() => setIsDonateOpen(true)}
        />

        {loading ? (
          <div className="py-16 text-center text-red-500 font-serif animate-pulse">
            Đang thỉnh sổ vàng Xám Stile từ cõi vô vi...
          </div>
        ) : (
          <>
            <TopThreePodium
              topDonors={topThree}
              onSelectDonor={(donor) => setSelectedDonor(donor)}
              onBless={handleBless}
            />

            <LeaderboardTable
              donors={donors}
              onSelectDonor={(donor) => setSelectedDonor(donor)}
              onBless={handleBless}
            />
          </>
        )}
      </div>

      {/* Footer Xám Stile */}
      <footer className="mt-16 py-8 border-t border-red-950/60 bg-horror-surface/90 text-center font-serif text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="flex items-center justify-center gap-2 text-zinc-400 font-semibold">
            <span>🕯️</span>
            <span>BẢN QUYỀN THUỘC VỀ KÊNH XÁM STILE • KỂ CHUYỆN KINH DỊ</span>
            <span>🕯️</span>
          </p>
          <p className="text-[11px] text-zinc-500">
            Cảm ơn tất cả quý khán thính giả đã luôn đồng hành, lắng nghe và tiếp sức cho Xám Stile!
          </p>
        </div>
      </footer>

      <ScrollDetailModal
        donor={selectedDonor}
        onClose={() => setSelectedDonor(null)}
        onBless={handleBless}
      />

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        settings={settings}
      />

      <FloatingWoodenFish
        meritPoints={meritPoints}
        onIncrementMerit={handleIncrementMerit}
      />
    </div>
  );
}

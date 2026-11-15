'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Scroll, Flame, Skull, Moon, Ghost } from 'lucide-react';
import { Donor, TierLevel } from '@/lib/types';

interface LeaderboardTableProps {
  donors: Donor[];
  onSelectDonor: (donor: Donor) => void;
  onBless: (id: string, e: React.MouseEvent) => void;
}

export default function LeaderboardTable({ donors, onSelectDonor, onBless }: LeaderboardTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      if (donor.hidden) return false;
      const matchSearch =
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTier = selectedTier === 'all' || donor.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [donors, searchTerm, selectedTier]);

  const getTierBadge = (tier: TierLevel) => {
    switch (tier) {
      case 'chua-te':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold bg-red-600/30 text-red-300 border border-red-500 flex items-center gap-1 shadow-sm">
            <Skull size={10} className="text-red-400" /> Chúa Tể Cõi Âm
          </span>
        );
      case 'phap-su':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold bg-purple-900/40 text-purple-300 border border-purple-600/50 flex items-center gap-1">
            <Moon size={10} className="text-purple-400" /> Pháp Sư Bắt Ma
          </span>
        );
      case 'tru-ta':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif bg-orange-950/50 text-orange-300 border border-orange-700/50 flex items-center gap-1">
            <Flame size={10} className="text-orange-400" /> Thầy Trừ Tà
          </span>
        );
      case 'nguoi-di-dem':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif bg-cyan-950/40 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
            <Ghost size={10} className="text-cyan-400" /> Người Đi Đêm
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-serif bg-zinc-800 text-zinc-400 border border-zinc-700">
            Khách Nghe Truyện
          </span>
        );
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Khung Bảng Vàng */}
      <div className="bg-horror-card/85 border border-red-900/50 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-red-900/40">
          <div>
            <h3 className="font-serif font-black text-lg sm:text-xl text-zinc-100 flex items-center gap-2">
              <Scroll size={20} className="text-red-500" />
              <span>DANH SÁCH BẢNG XẾP HẠNG DONATE</span>
            </h3>
            <p className="text-xs text-zinc-400 font-serif mt-0.5">
              Khắc cốt ghi tâm sự đồng hành của quý khán giả cùng kênh Xám Stile
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Tìm tên, lời nhắn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition font-serif"
              />
            </div>

            {/* Filter Tier */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300">
              <Filter size={12} className="text-red-400" />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer font-serif"
              >
                <option value="all" className="bg-zinc-950">Mọi Cấp Bậc</option>
                <option value="chua-te" className="bg-zinc-950">Chúa Tể (&gt;2M)</option>
                <option value="phap-su" className="bg-zinc-950">Pháp Sư (1M - 2M)</option>
                <option value="tru-ta" className="bg-zinc-950">Thầy Trừ Tà (500K - 1M)</option>
                <option value="nguoi-di-dem" className="bg-zinc-950">Người Đi Đêm (200K - 500K)</option>
                <option value="khanh-thinh" className="bg-zinc-950">Khách Nghe Truyện (&lt;200K)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danh sách các vị cúng dường */}
        <div className="mt-4 divide-y divide-zinc-800/60">
          {filteredDonors.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-serif">
              <p className="text-base">Chưa có người xem nào khớp với tiêu chí tìm kiếm trong cõi này.</p>
            </div>
          ) : (
            filteredDonors.map((donor, idx) => (
              <div
                key={donor.id}
                onClick={() => onSelectDonor(donor)}
                className={`group py-3.5 px-3 sm:px-4 rounded-xl flex items-center justify-between gap-3 sm:gap-4 transition cursor-pointer hover:bg-red-950/20 ${
                  donor.highlight ? 'bg-red-950/15 border border-red-700/40' : ''
                }`}
              >
                {/* Thứ hạng & Avatar & Tên */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span
                    className={`font-mono font-bold text-sm sm:text-base w-7 text-center shrink-0 ${
                      idx === 0
                        ? 'text-red-500 font-black'
                        : idx === 1
                        ? 'text-zinc-300'
                        : idx === 2
                        ? 'text-orange-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-red-600/50 to-zinc-800 shrink-0">
                    <img
                      src={donor.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${donor.name}`}
                      alt={donor.name}
                      className="w-full h-full object-cover rounded-full bg-zinc-950"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-zinc-200 group-hover:text-red-400 transition truncate">
                        {donor.name}
                      </h4>
                      {getTierBadge(donor.tier)}
                    </div>
                    <p className="text-xs text-zinc-400 font-serif italic truncate max-w-xs sm:max-w-md mt-0.5">
                      "{donor.message}"
                    </p>
                  </div>
                </div>

                {/* Số tiền & Nút Bái Lạy */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                  <div>
                    <div className="font-mono font-bold text-sm sm:text-base text-red-400">
                      {donor.amount.toLocaleString('vi-VN')} đ
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">{donor.date}</div>
                  </div>

                  <button
                    onClick={(e) => onBless(donor.id, e)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-black/50 border border-zinc-800 hover:border-red-600 hover:bg-red-950/40 text-red-400 hover:text-red-300 transition text-xs flex items-center gap-1 active:scale-90"
                    title="Thắp nến tiếp sức (+1 can đảm)"
                  >
                    <span>🕯️</span>
                    <span className="hidden sm:inline font-serif">Trừ tà</span>
                    <span className="font-mono text-zinc-300 text-[11px]">
                      {donor.blessingsCount || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

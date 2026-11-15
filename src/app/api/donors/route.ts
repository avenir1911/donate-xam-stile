import { NextResponse } from 'next/server';
import { getDonors, saveDonors, getSettings, saveSettings } from '@/lib/store';
import { Donor, TierLevel } from '@/lib/types';

function calculateTier(amount: number): TierLevel {
  if (amount >= 2000000) return 'chua-te';
  if (amount >= 1000000) return 'phap-su';
  if (amount >= 500000) return 'tru-ta';
  if (amount >= 200000) return 'nguoi-di-dem';
  return 'khanh-thinh';
}

function getDefaultTitle(tier: TierLevel): string {
  switch (tier) {
    case 'chua-te': return 'Chúa Tể Cõi Âm';
    case 'phap-su': return 'Pháp Sư Bắt Ma';
    case 'tru-ta': return 'Thầy Trừ Tà';
    case 'nguoi-di-dem': return 'Người Đi Đêm';
    default: return 'Khách Nghe Truyện';
  }
}

// GET /api/donors
export async function GET() {
  const donors = await getDonors();
  const sorted = [...donors].sort((a, b) => b.amount - a.amount);
  return NextResponse.json(sorted);
}

// POST /api/donors
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Hành động trừ tà (+1 can đảm)
    if (body.action === 'bless' && body.id) {
      const donors = await getDonors();
      const donor = donors.find(d => d.id === body.id);
      if (donor) {
        donor.blessingsCount = (donor.blessingsCount || 0) + 1;
        await saveDonors(donors);
        return NextResponse.json({ success: true, blessingsCount: donor.blessingsCount });
      }
      return NextResponse.json({ error: 'Không tìm thấy người xem' }, { status: 404 });
    }

    // Thêm donor mới
    const { name, amount, message, title, avatar, highlight, hidden } = body;
    if (!name || amount === undefined || amount < 0) {
      return NextResponse.json({ error: 'Tên và số tiền không hợp lệ' }, { status: 400 });
    }

    const tier = calculateTier(Number(amount));
    const finalTitle = title?.trim() || getDefaultTitle(tier);
    const newDonor: Donor = {
      id: `donor-${Date.now()}`,
      name: name.trim(),
      amount: Number(amount),
      message: message?.trim() || 'Ủng hộ kênh Xám Stile ra thêm nhiều video kinh dị chất lượng!',
      title: finalTitle,
      tier,
      avatar: avatar?.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      date: new Date().toISOString().split('T')[0],
      highlight: Boolean(highlight),
      hidden: Boolean(hidden),
      blessingsCount: 0
    };

    const donors = await getDonors();
    donors.unshift(newDonor);
    await saveDonors(donors);

    // Cập nhật tổng tiền trong settings
    const settings = await getSettings();
    settings.currentTotal = donors.filter(d => !d.hidden).reduce((sum, d) => sum + d.amount, 0);
    await saveSettings(settings);

    return NextResponse.json({ success: true, donor: newDonor }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/donors:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ cõi âm' }, { status: 500 });
  }
}

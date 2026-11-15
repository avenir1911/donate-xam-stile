import { NextResponse } from 'next/server';
import { getDonors, saveDonors, getSettings, saveSettings } from '@/lib/store';
import { TierLevel } from '@/lib/types';

function calculateTier(amount: number): TierLevel {
  if (amount >= 2000000) return 'chua-te';
  if (amount >= 1000000) return 'phap-su';
  if (amount >= 500000) return 'tru-ta';
  if (amount >= 200000) return 'nguoi-di-dem';
  return 'khanh-thinh';
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const donors = getDonors();
    const index = donors.findIndex(d => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Không tìm thấy người xem' }, { status: 404 });
    }

    const current = donors[index];
    const amount = body.amount !== undefined ? Number(body.amount) : current.amount;
    const tier = body.tier || calculateTier(amount);

    donors[index] = {
      ...current,
      name: body.name !== undefined ? body.name.trim() : current.name,
      amount,
      message: body.message !== undefined ? body.message.trim() : current.message,
      title: body.title !== undefined ? body.title.trim() : current.title,
      tier,
      avatar: body.avatar !== undefined ? body.avatar : current.avatar,
      date: body.date || current.date,
      highlight: body.highlight !== undefined ? Boolean(body.highlight) : current.highlight,
      hidden: body.hidden !== undefined ? Boolean(body.hidden) : current.hidden,
      blessingsCount: body.blessingsCount !== undefined ? Number(body.blessingsCount) : current.blessingsCount,
    };

    saveDonors(donors);

    const settings = getSettings();
    settings.currentTotal = donors.filter(d => !d.hidden).reduce((sum, d) => sum + d.amount, 0);
    saveSettings(settings);

    return NextResponse.json({ success: true, donor: donors[index] });
  } catch (error) {
    console.error('Error in PUT /api/donors/[id]:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const donors = getDonors();
    const filtered = donors.filter(d => d.id !== id);

    if (filtered.length === donors.length) {
      return NextResponse.json({ error: 'Không tìm thấy người xem để xoá' }, { status: 404 });
    }

    saveDonors(filtered);

    const settings = getSettings();
    settings.currentTotal = filtered.filter(d => !d.hidden).reduce((sum, d) => sum + d.amount, 0);
    saveSettings(settings);

    return NextResponse.json({ success: true, message: 'Đã xoá thành công' });
  } catch (error) {
    console.error('Error in DELETE /api/donors/[id]:', error);
    return NextResponse.json({ error: 'Lỗi xoá' }, { status: 500 });
  }
}

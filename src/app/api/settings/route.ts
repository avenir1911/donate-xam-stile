import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/store';

// GET /api/settings
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

// POST /api/settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await getSettings();

    if (body.currentPin && body.currentPin !== current.adminPin) {
      return NextResponse.json({ error: 'Mật mã sai lệch!' }, { status: 403 });
    }

    const updated = {
      ...current,
      title: body.title !== undefined ? body.title : current.title,
      subtitle: body.subtitle !== undefined ? body.subtitle : current.subtitle,
      bannerNotice: body.bannerNotice !== undefined ? body.bannerNotice : current.bannerNotice,
      templeFundGoal: body.templeFundGoal !== undefined ? Number(body.templeFundGoal) : current.templeFundGoal,
      qrCodeUrl: body.qrCodeUrl !== undefined ? body.qrCodeUrl : current.qrCodeUrl,
      facebookUrl: body.facebookUrl !== undefined ? body.facebookUrl : current.facebookUrl,
      bankAccount: body.bankAccount !== undefined ? body.bankAccount : current.bankAccount,
      adminPin: body.newPin ? body.newPin : current.adminPin
    };

    await saveSettings(updated);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Error in POST /api/settings:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật cài đặt' }, { status: 500 });
  }
}

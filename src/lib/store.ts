import fs from 'fs';
import path from 'path';
import { Donor, WebSettings } from './types';

const DONORS_FILE = path.join(process.cwd(), 'src', 'data', 'donors.json');
const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'settings.json');

// Đường dẫn tạm thời trên Vercel Serverless
const IS_VERCEL = process.env.VERCEL === '1';
const TMP_DIR = '/tmp';
const TMP_DONORS = path.join(TMP_DIR, 'donors.json');
const TMP_SETTINGS = path.join(TMP_DIR, 'settings.json');

// Biến môi trường Vercel KV / Upstash Redis (nếu có cấu hình)
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Khởi tạo file /tmp trên Vercel nếu chưa có
function getActiveDonorsPath(): string {
  if (IS_VERCEL) {
    if (!fs.existsSync(TMP_DONORS)) {
      try {
        if (fs.existsSync(DONORS_FILE)) {
          fs.copyFileSync(DONORS_FILE, TMP_DONORS);
        } else {
          fs.writeFileSync(TMP_DONORS, '[]', 'utf-8');
        }
      } catch (e) {
        console.error('Không thể copy donors vào /tmp:', e);
      }
    }
    return TMP_DONORS;
  }
  return DONORS_FILE;
}

function getActiveSettingsPath(): string {
  if (IS_VERCEL) {
    if (!fs.existsSync(TMP_SETTINGS)) {
      try {
        if (fs.existsSync(SETTINGS_FILE)) {
          fs.copyFileSync(SETTINGS_FILE, TMP_SETTINGS);
        } else {
          fs.writeFileSync(TMP_SETTINGS, '{}', 'utf-8');
        }
      } catch (e) {
        console.error('Không thể copy settings vào /tmp:', e);
      }
    }
    return TMP_SETTINGS;
  }
  return SETTINGS_FILE;
}

// Đọc danh sách donors (hỗ trợ cả Cloud KV và File/tmp)
export async function getDonors(): Promise<Donor[]> {
  // 1. Nếu có Cloud KV (Vercel KV / Upstash)
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/donors`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      }
    } catch (e) {
      console.error('Lỗi đọc KV donors:', e);
    }
  }

  // 2. Fallback đọc file (local hoặc /tmp trên Vercel)
  try {
    const targetFile = getActiveDonorsPath();
    if (!fs.existsSync(targetFile)) {
      if (fs.existsSync(DONORS_FILE)) {
        return JSON.parse(fs.readFileSync(DONORS_FILE, 'utf-8'));
      }
      return [];
    }
    const data = fs.readFileSync(targetFile, 'utf-8');
    return JSON.parse(data) as Donor[];
  } catch (error) {
    console.error('Lỗi đọc donors:', error);
    return [];
  }
}

// Lưu danh sách donors (hỗ trợ cả Cloud KV và File/tmp)
export async function saveDonors(donors: Donor[]): Promise<boolean> {
  let cloudSuccess = false;

  // 1. Lưu vào Cloud KV nếu có
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/set/donors`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(JSON.stringify(donors)),
      });
      if (res.ok) {
        cloudSuccess = true;
      }
    } catch (e) {
      console.error('Lỗi lưu KV donors:', e);
    }
  }

  // 2. Luôn lưu vào file /tmp hoặc local file để dự phòng
  try {
    const targetFile = getActiveDonorsPath();
    fs.writeFileSync(targetFile, JSON.stringify(donors, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Lỗi ghi donors file:', error);
    return cloudSuccess;
  }
}

// Đọc settings
export async function getSettings(): Promise<WebSettings> {
  // 1. Cloud KV
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/settings`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      }
    } catch (e) {
      console.error('Lỗi đọc KV settings:', e);
    }
  }

  // 2. File fallback
  try {
    const targetFile = getActiveSettingsPath();
    if (!fs.existsSync(targetFile)) {
      if (fs.existsSync(SETTINGS_FILE)) {
        return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      }
      return {
        title: 'BẢNG VINH DANH DONATE',
        subtitle: 'XÁM Stile',
        bannerNotice: '',
        templeFundGoal: 20000000,
        currentTotal: 0,
        adminPin: 'tamlinh68',
      };
    }
    const data = fs.readFileSync(targetFile, 'utf-8');
    return JSON.parse(data) as WebSettings;
  } catch (error) {
    console.error('Lỗi đọc settings:', error);
    return {
      title: 'BẢNG VINH DANH DONATE',
      subtitle: 'XÁM Stile',
      bannerNotice: '',
      templeFundGoal: 20000000,
      currentTotal: 0,
      adminPin: 'tamlinh68',
    };
  }
}

// Lưu settings
export async function saveSettings(settings: WebSettings): Promise<boolean> {
  let cloudSuccess = false;

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/set/settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(JSON.stringify(settings)),
      });
      if (res.ok) {
        cloudSuccess = true;
      }
    } catch (e) {
      console.error('Lỗi lưu KV settings:', e);
    }
  }

  try {
    const targetFile = getActiveSettingsPath();
    fs.writeFileSync(targetFile, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Lỗi ghi settings file:', error);
    return cloudSuccess;
  }
}

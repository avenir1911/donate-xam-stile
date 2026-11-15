import fs from 'fs';
import path from 'path';
import { Donor, WebSettings } from './types';

const DONORS_FILE = path.join(process.cwd(), 'src', 'data', 'donors.json');
const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'settings.json');

// Đọc danh sách donors
export function getDonors(): Donor[] {
  try {
    if (!fs.existsSync(DONORS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DONORS_FILE, 'utf-8');
    return JSON.parse(data) as Donor[];
  } catch (error) {
    console.error('Lỗi đọc donors.json:', error);
    return [];
  }
}

// Lưu danh sách donors
export function saveDonors(donors: Donor[]): boolean {
  try {
    fs.writeFileSync(DONORS_FILE, JSON.stringify(donors, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Lỗi ghi donors.json:', error);
    return false;
  }
}

// Đọc settings
export function getSettings(): WebSettings {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return {
        title: 'BẢNG CÔNG ĐỨC VÔ LƯỢNG',
        subtitle: 'Nam Tào Linh Bảng',
        bannerNotice: '',
        templeFundGoal: 10000000,
        currentTotal: 0,
        adminPin: 'tamlinh68'
      };
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data) as WebSettings;
  } catch (error) {
    console.error('Lỗi đọc settings.json:', error);
    return {
      title: 'BẢNG CÔNG ĐỨC VÔ LƯỢNG',
      subtitle: 'Nam Tào Linh Bảng',
      bannerNotice: '',
      templeFundGoal: 10000000,
      currentTotal: 0,
      adminPin: 'tamlinh68'
    };
  }
}

// Lưu settings
export function saveSettings(settings: WebSettings): boolean {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Lỗi ghi settings.json:', error);
    return false;
  }
}

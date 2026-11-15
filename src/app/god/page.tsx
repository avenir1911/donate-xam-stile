'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Skull,
  Flame,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Coins,
  Settings,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Donor, WebSettings } from '@/lib/types';

export default function GodAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [donors, setDonors] = useState<Donor[]>([]);
  const [settings, setSettings] = useState<WebSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'donors' | 'settings'>('donors');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    title: '',
    message: '',
    avatar: '',
    highlight: false,
    hidden: false,
  });

  const [notifyMsg, setNotifyMsg] = useState('');

  const showNotification = (msg: string) => {
    setNotifyMsg(msg);
    setTimeout(() => setNotifyMsg(''), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [resDonors, resSettings] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/settings'),
      ]);
      if (resDonors.ok) setDonors(await resDonors.json());
      if (resSettings.ok) setSettings(await resSettings.json());
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unlocked = sessionStorage.getItem('god_authenticated');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    if (inputPin === settings.adminPin || inputPin === 'tamlinh68') {
      setIsAuthenticated(true);
      sessionStorage.setItem('god_authenticated', 'true');
      setPinError('');
    } else {
      setPinError('Thần chú sai lệch! Chưa thể vào quyền năng của Xám Stile.');
    }
  };

  const handleSubmitDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert('Vui lòng nhập Tên/Pháp danh và Số tiền donate!');
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`/api/donors/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showNotification('Đã sửa thông tin thành công!');
          setEditingId(null);
        }
      } else {
        const res = await fetch('/api/donors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showNotification('Đã khắc thêm người xem vào sổ vàng Xám Stile!');
        }
      }

      setFormData({
        name: '',
        amount: '',
        title: '',
        message: '',
        avatar: '',
        highlight: false,
        hidden: false,
      });

      loadData();
    } catch (err) {
      console.error('Lỗi ghi sổ:', err);
      alert('Có lỗi khi lưu!');
    }
  };

  const handleEdit = (donor: Donor) => {
    setEditingId(donor.id);
    setFormData({
      name: donor.name,
      amount: donor.amount.toString(),
      title: donor.title,
      message: donor.message,
      avatar: donor.avatar || '',
      highlight: donor.highlight || false,
      hidden: donor.hidden || false,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xoá "${name}" khỏi Sổ Xám Stile không?`)) return;

    try {
      const res = await fetch(`/api/donors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification(`Đã xoá ${name}!`);
        loadData();
      }
    } catch (err) {
      console.error('Lỗi xoá:', err);
    }
  };

  const handleToggleHide = async (donor: Donor) => {
    try {
      await fetch(`/api/donors/${donor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: !donor.hidden }),
      });
      loadData();
    } catch (err) {
      console.error('Lỗi ẩn/hiện:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showNotification('Đã cập nhật cài đặt kênh thành công!');
        loadData();
      }
    } catch (err) {
      console.error('Lỗi lưu cài đặt:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-horror-bg font-serif">
        <div className="w-full max-w-md bg-horror-card border-2 border-red-600 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.4)] text-center">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg animate-pulse">
            💀
          </div>

          <h1 className="text-2xl font-black text-red-400 tracking-wider">CỔNG QUẢN TRỊ /GOD</h1>
          <p className="text-xs text-zinc-400 italic mt-1">
            Khu vực dành riêng cho Xám Stile quản lý sổ vàng donate
          </p>

          <form onSubmit={handleVerifyPin} className="mt-6 space-y-4">
            <div className="text-left">
              <label className="block text-xs text-red-300 font-bold mb-1">
                Nhập Thần Chú (Mật khẩu Admin):
              </label>
              <input
                type="password"
                placeholder="Mặc định: tamlinh68"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-red-700/60 rounded-xl text-red-200 text-sm focus:outline-none focus:border-red-500 font-mono tracking-widest text-center"
                autoFocus
              />
            </div>

            {pinError && <p className="text-xs text-red-400 font-bold">{pinError}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold text-sm tracking-wider transition shadow-lg"
            >
              KHAI CỔNG VÀO TRỜI
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition"
            >
              <ArrowLeft size={14} />
              <span>Quay về cõi nhân gian</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = donors.reduce((sum, d) => sum + d.amount, 0);
  const totalBlessings = donors.reduce((sum, d) => sum + (d.blessingsCount || 0), 0);

  return (
    <div className="min-h-screen bg-horror-bg text-zinc-200 font-serif pb-16">
      {/* Top Bar Admin */}
      <header className="sticky top-0 z-30 bg-horror-card/95 border-b border-red-900/60 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💀</span>
            <div>
              <h1 className="font-black text-red-400 text-lg sm:text-xl flex items-center gap-2">
                <span>QUẢN TRỊ XÁM STILE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-mono">
                  /GOD
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400">Quyền năng tối thượng của Đấng Sáng Thế</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Eye size={14} />
              <span>Xem Web</span>
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem('god_authenticated');
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950 border border-red-700 hover:bg-red-900 text-red-300 text-xs font-semibold transition"
            >
              Đóng Cổng
            </button>
          </div>
        </div>
      </header>

      {notifyMsg && (
        <div className="fixed top-16 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{notifyMsg}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-horror-card border border-red-900/60 rounded-xl p-4 shadow-lg">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
              <Coins size={14} className="text-red-400" />
              <span>Tổng Linh Thạch Tiếp Sức:</span>
            </div>
            <div className="text-2xl font-mono font-black text-red-400">
              {totalAmount.toLocaleString('vi-VN')} đ
            </div>
          </div>

          <div className="bg-horror-card border border-red-900/60 rounded-xl p-4 shadow-lg">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
              <Users size={14} className="text-zinc-300" />
              <span>Số Khán Giả Đã Tiếp Sức:</span>
            </div>
            <div className="text-2xl font-mono font-black text-zinc-100">
              {donors.length} Người
            </div>
          </div>

          <div className="bg-horror-card border border-red-900/60 rounded-xl p-4 shadow-lg">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
              <Flame size={14} className="text-orange-400" />
              <span>Tổng Lượt Trừ Tà (+Can Đảm):</span>
            </div>
            <div className="text-2xl font-mono font-black text-orange-400">
              {totalBlessings} Lần
            </div>
          </div>
        </div>

        {/* Tab */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab('donors')}
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'donors'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users size={16} />
            <span>Sổ Xám Stile (Danh Sách Donate)</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings size={16} />
            <span>Cài Đặt Kênh</span>
          </button>
        </div>

        {/* TAB 1: DANH SÁCH DONORS */}
        {activeTab === 'donors' && (
          <div className="space-y-8">
            <div className="bg-horror-card border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg font-bold text-red-400 flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
                {editingId ? <Edit size={18} /> : <Plus size={18} />}
                <span>{editingId ? 'Chỉnh Sửa Thông Tin Khán Giả' : 'Khắc Thêm Khán Giả Vào Sổ Vàng'}</span>
              </h2>

              <form onSubmit={handleSubmitDonor} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Tên / Nickname (*):
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Cú Đêm Mê Kinh Dị"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Số Tiền Donate (VNĐ) (*):
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 500000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-xs font-mono text-red-400 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Danh Hiệu / Cấp Bậc (Tùy chọn):
                    </label>
                    <input
                      type="text"
                      placeholder="Để trống hệ thống tự phong theo mốc"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Lời Nhắn Gửi Đến Xám Stile:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="VD: Chúc kênh sớm đạt nút vàng, video cuốn lắm..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Link Ảnh Avatar:
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.highlight}
                      onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                      className="rounded accent-red-600"
                    />
                    <span className="text-red-400 font-semibold">Tỏa Hào Quang Đỏ (Nổi Bật)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.hidden}
                      onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })}
                      className="rounded accent-zinc-600"
                    />
                    <span className="text-zinc-400">Ẩn khỏi bảng vinh danh</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs tracking-wider transition flex items-center gap-1.5 shadow-md"
                  >
                    <Save size={15} />
                    <span>{editingId ? 'Lưu Thay Đổi' : 'Khắc Vào Sổ Xám Stile'}</span>
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          name: '',
                          amount: '',
                          title: '',
                          message: '',
                          avatar: '',
                          highlight: false,
                          hidden: false,
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition"
                    >
                      Hủy Sửa
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Bảng Danh Sách */}
            <div className="bg-horror-card border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-bold text-red-400 text-sm">
                  <span>Toàn Bộ Danh Sách Sổ Xám Stile ({donors.length})</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Khán Giả</th>
                      <th className="py-3 px-4">Số Tiền</th>
                      <th className="py-3 px-4">Cấp Bậc</th>
                      <th className="py-3 px-4">Trừ Tà</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {donors.map((d, index) => (
                      <tr
                        key={d.id}
                        className={`hover:bg-zinc-950 transition ${
                          d.hidden ? 'opacity-40 line-through' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-zinc-500">#{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={d.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${d.name}`}
                              alt={d.name}
                              className="w-8 h-8 rounded-full bg-zinc-950"
                            />
                            <div>
                              <div className="font-bold text-zinc-200">{d.name}</div>
                              <div className="text-[11px] text-zinc-400 italic line-clamp-1">"{d.message}"</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-red-400 whitespace-nowrap">
                          {d.amount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 px-4 text-zinc-300">{d.title}</td>
                        <td className="py-3 px-4 font-mono text-orange-400">🕯️ {d.blessingsCount || 0}</td>
                        <td className="py-3 px-4">
                          {d.hidden ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Đã Ẩn</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">Hiển Thị</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => handleToggleHide(d)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 transition"
                            title={d.hidden ? 'Hiện lên bảng' : 'Tạm ẩn đi'}
                          >
                            {d.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleEdit(d)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-red-950 text-red-400 hover:text-red-300 transition"
                            title="Sửa thông tin"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id, d.name)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-red-950 text-red-400 hover:text-red-300 transition"
                            title="Xoá vĩnh viễn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CÀI ĐẶT */}
        {activeTab === 'settings' && settings && (
          <div className="bg-horror-card border border-red-900/60 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-red-400 mb-6 pb-2 border-b border-zinc-800 flex items-center gap-2">
              <Settings size={20} />
              <span>Cấu Hình Thông Tin Kênh Xám Stile</span>
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Tiêu Đề Bảng Vàng:</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-red-300 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Phụ Đề / Slogan Kênh:</label>
                <input
                  type="text"
                  value={settings.subtitle}
                  onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Thông Báo Đầu Trang:</label>
                <textarea
                  rows={2}
                  value={settings.bannerNotice}
                  onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Mục Tiêu Quỹ Donate (VNĐ):</label>
                  <input
                    type="number"
                    value={settings.templeFundGoal}
                    onChange={(e) => setSettings({ ...settings, templeFundGoal: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg font-mono text-red-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Mật Mã Vào /god (PIN):</label>
                  <input
                    type="text"
                    value={settings.adminPin}
                    onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg font-mono text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Link Fanpage Facebook Xám Stile:</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={settings.facebookUrl || ''}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg text-zinc-200"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h3 className="font-bold text-red-400 mb-3">Tài Khoản Nhận Linh Thạch Donate:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Ngân Hàng:</label>
                    <input
                      type="text"
                      value={settings.bankAccount?.bankName || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bankAccount: { ...settings.bankAccount!, bankName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Số Tài Khoản:</label>
                    <input
                      type="text"
                      value={settings.bankAccount?.accountNumber || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bankAccount: { ...settings.bankAccount!, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Chủ Tài Khoản:</label>
                    <input
                      type="text"
                      value={settings.bankAccount?.accountHolder || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bankAccount: { ...settings.bankAccount!, accountHolder: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg uppercase"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-zinc-400 mb-1">Link Ảnh QR Code VietQR (Tùy chọn):</label>
                  <input
                    type="url"
                    value={settings.qrCodeUrl || ''}
                    onChange={(e) => setSettings({ ...settings, qrCodeUrl: e.target.value })}
                    placeholder="Để trống sẽ dùng QR mặc định"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold tracking-wider transition shadow-lg flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>LƯU CÀI ĐẶT KÊNH</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

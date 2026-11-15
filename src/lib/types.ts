export type TierLevel = 
  | 'chua-te'      // Chúa Tể Cõi Âm (> 2.000.000)
  | 'phap-su'      // Pháp Sư Bắt Ma (1.000.000 - 2.000.000)
  | 'tru-ta'       // Thầy Trừ Tà (500.000 - 1.000.000)
  | 'nguoi-di-dem' // Người Đi Đêm (200.000 - 500.000)
  | 'khanh-thinh'  // Khách Nghe Truyện (< 200.000)

export interface Donor {
  id: string;
  name: string;           // Tên / Nickname người xem
  amount: number;         // Số tiền donate (VND)
  message: string;        // Lời nhắn / Lời gửi gắm cho Xám Stile
  title: string;          // Danh hiệu cấp bậc (vd: "Chúa Tể Cõi Âm", "Pháp Sư Bắt Ma")
  tier: TierLevel;        // Cấp bậc
  avatar?: string;        // URL avatar
  date: string;           // Ngày donate
  highlight?: boolean;    // Đánh dấu nổi bật viền đỏ máu
  hidden?: boolean;       // Ẩn khỏi bảng nếu cần
  blessingsCount?: number;// Lượt thắp nến / trừ tà (+1 can đảm)
}

export interface WebSettings {
  title: string;
  subtitle: string;
  bannerNotice: string;
  templeFundGoal: number; // Mục tiêu quỹ donate tiếp sức
  currentTotal: number;
  qrCodeUrl?: string;     // Link ảnh QR VietQR
  facebookUrl?: string;   // Link Fanpage Facebook Xám Stile
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  adminPin: string;       // Mã PIN vào trang /god (mặc định: "tamlinh68")
}

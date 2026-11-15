import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bảng Công Đức Vô Lượng • Xám Stile',
  description: 'Khắc danh tán dương thiện nam tín nữ cúng dường hộ pháp. Tích vạn lượng công đức!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-spiritual-bg text-slate-200 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <div className="fixed inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

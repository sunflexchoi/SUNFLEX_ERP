// app/layout.tsx (또는 전역 스타일 설정)
import { GeistSans } from 'geist/font/sans'; // 세련된 영문/숫자 폰트
import "./globals.css"; // Pretendard 국문 폰트 포함

export const metadata = {
  title: "SUNFLEX ERP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${GeistSans.variable}`}>
      <body className="antialiased font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

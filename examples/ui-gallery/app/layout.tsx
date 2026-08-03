import "./globals.css";

export const metadata = { title: "kit-ui 프리미티브 전시장" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
export const metadata = { title: "kit-ui 최소 예제" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "sans-serif", margin: 24 }}>{children}</body>
    </html>
  );
}

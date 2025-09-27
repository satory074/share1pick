import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Share1Pick - サバイバルオーディション番組の1pickを選んでシェア",
  description: "PRODUCE、Girls Planet、Boys Planet、I-LANDなどのサバイバルオーディション番組の参加者から1pickを選んでSNSでシェアできるウェブアプリケーション",
  keywords: "PRODUCE 101, Girls Planet, Boys Planet, I-LAND, サバイバルオーディション, 1pick, K-POP, アイドル",
  openGraph: {
    title: "Share1Pick",
    description: "サバイバルオーディション番組の1pickを選んでシェアしよう",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Share1Pick",
    description: "サバイバルオーディション番組の1pickを選んでシェアしよう",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

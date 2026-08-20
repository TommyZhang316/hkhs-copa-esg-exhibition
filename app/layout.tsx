import type { Metadata } from "next";
import "./globals.css";

const canonicalSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://hkhs-copa-esg-exhibition.tommy508508.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSiteUrl),
  title: "創建宜居．永續共融 | 香港房屋協會",
  description:
    "香港房屋協會把可持續發展融入屋邨管理、綠色營運和社區服務，展現物業管理實踐。",
  icons: {
    icon: "/brand/hkhs-vertical.png",
    shortcut: "/brand/hkhs-vertical.png",
  },
  openGraph: {
    title: "創建宜居．永續共融 | 香港房屋協會",
    description:
      "探索香港房屋協會在屋邨共融、綠色營運、數碼服務及智慧管理方面的物業管理實踐。",
    type: "website",
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "香港房屋協會，創建宜居．永續共融" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "創建宜居．永續共融 | 香港房屋協會",
    description: "探索香港房屋協會在屋邨落實可持續發展的物業管理行動與進展。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body>{children}</body>
    </html>
  );
}

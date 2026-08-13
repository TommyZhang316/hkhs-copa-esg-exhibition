import type { Metadata } from "next";
import "./globals.css";

const canonicalSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://hkhs-copa-esg-exhibition.tommy508508.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSiteUrl),
  title: "創建宜居．永續共融 | COPA",
  description:
    "香港房屋協會把可持續發展融入房屋發展、屋邨管理和社區服務。",
  icons: {
    icon: "/brand/hkhs-vertical.png",
    shortcut: "/brand/hkhs-vertical.png",
  },
  openGraph: {
    title: "創建宜居．永續共融 | COPA",
    description:
      "探索香港房屋協會在可持續居所、低碳轉型和裝備未來方面的行動。",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "創建宜居．永續共融，COPA 物業及資產綜合平台" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "創建宜居．永續共融 | COPA",
    description: "探索香港房屋協會三大可持續發展支柱與屋邨行動。",
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

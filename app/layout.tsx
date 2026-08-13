import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "創建宜居．永續共融 | COPA",
    description:
      "香港房屋協會把可持續發展融入房屋發展、屋邨管理和社區服務。",
    icons: {
      icon: "/brand/hkhs-vertical.jpg",
      shortcut: "/brand/hkhs-vertical.jpg",
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
}

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

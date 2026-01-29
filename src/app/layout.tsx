import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "ZoraCreator - Launch Tokens on Base",
  description: "Create and launch ERC20 tokens on Base blockchain via Zora Protocol. A Farcaster Mini App.",
  keywords: ["Zora", "Base", "Token", "Farcaster", "Crypto", "Web3"],
  openGraph: {
    title: "ZoraCreator - Launch Tokens on Base",
    description: "Create and launch ERC20 tokens on Base blockchain via Zora Protocol",
    images: [`${appUrl}/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZoraCreator - Launch Tokens on Base",
    description: "Create and launch ERC20 tokens on Base blockchain via Zora Protocol",
    images: [`${appUrl}/og-image.png`],
  },
  // Farcaster Frame meta tags
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/og-image.png`,
    "fc:frame:button:1": "🚀 Launch Token",
    "fc:frame:button:2": "📈 Top Gainers",
    "fc:frame:post_url": `${appUrl}/api/frame`,
    "fc:frame:aspect_ratio": "1.91:1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
            {/* Animated background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-orange-600/10 rounded-full blur-[100px] animate-pulse delay-500" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <Navigation />
              <main className="pt-24 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

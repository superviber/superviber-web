import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://superviber.com"),
  title: "Superviber - Coordinated Intelligence",
  description: "Coordinated intelligence for complex decisions. Multi-agent deliberation architecture that orchestrates expert perspectives to convergent consensus.",
  keywords: ["AI agents", "multi-agent", "LLM", "decision-making", "alignment", "deliberation", "consensus"],
  openGraph: {
    title: "Superviber",
    description: "Coordinated intelligence for complex decisions.",
    type: "website",
    url: "https://superviber.com",
    siteName: "Superviber",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "Superviber — coordinated intelligence for complex decisions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superviber",
    description: "Coordinated intelligence for complex decisions.",
    images: ["/images/og-card.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <Providers>
          <Navigation />
          <Main>
            {children}
          </Main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

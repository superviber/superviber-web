import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superviber - AI Agents That Deliberate",
  description: "Multi-agent AI architecture for complex decision-making. N+1 Alignment Dialogue orchestrates parallel expert deliberation to convergent consensus.",
  keywords: ["AI agents", "multi-agent", "LLM", "decision-making", "alignment", "deliberation", "consensus"],
  openGraph: {
    title: "Superviber",
    description: "AI agents that deliberate to consensus.",
    type: "website",
    url: "https://superviber.com",
    images: ["/images/logo.png"],
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
        <Navigation />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

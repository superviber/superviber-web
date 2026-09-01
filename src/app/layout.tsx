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
    images: ["/images/sv-icon.png"],
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

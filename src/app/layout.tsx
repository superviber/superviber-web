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
  title: "SuperViber - Feel the Music, See the Words",
  description: "Experience music like never before with synchronized lyrics that move with the beat.",
  keywords: ["music", "lyrics", "karaoke", "playlist", "synchronized"],
  openGraph: {
    title: "SuperViber",
    description: "Feel the music. See the words.",
    type: "website",
    url: "https://superviber.com",
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

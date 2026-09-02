import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alignment Dialogue Demo | NVIDIA Investment Decision",
  description: "Watch 8 investment experts deliberate on a $50K portfolio decision, moving from initial perspectives through 4 rounds to convergent consensus.",
  keywords: ["alignment dialogue demo", "multi-agent deliberation", "investment analysis", "NVIDIA", "portfolio decision"],
  openGraph: {
    title: "Alignment Dialogue Demo - NVIDIA Investment Decision",
    description: "Watch 8 investment experts deliberate on a portfolio decision through 4 rounds to convergent consensus.",
    type: "website",
    url: "https://superviber.com/alignment/demo",
    siteName: "Superviber",
    images: [
      {
        url: "/images/og-demo.jpg",
        width: 1200,
        height: 630,
        alt: "Alignment dialogue demo — 8 experts, 4 rounds, one decision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alignment Dialogue Demo - NVIDIA Investment Decision",
    description: "Watch 8 investment experts deliberate on a portfolio decision through 4 rounds to convergent consensus.",
    images: ["/images/og-demo.jpg"],
  },
  alternates: {
    canonical: "https://superviber.com/alignment/demo"
  }
};

export default function AlignmentDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

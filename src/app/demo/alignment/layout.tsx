import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alignment Dialogue Demo - SuperViber",
  description: "Watch 12 investment experts deliberate on a $50K portfolio decision, moving from 8-2 skeptical to 12-0 convergence across 4 rounds.",
};

export default function AlignmentDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

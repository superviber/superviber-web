// Redirect layout - metadata not needed since we redirect immediately
export default function OldAlignmentDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

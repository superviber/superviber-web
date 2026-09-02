import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // A package-lock.json in the parent directory makes Turbopack infer the
    // workspace root one level up, which it warns about on every build. Pin
    // the root to this project.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

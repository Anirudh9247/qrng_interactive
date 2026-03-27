import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "recharts",
      "lucide-react",
      "framer-motion",
      "@react-three/fiber",
      "@react-three/drei"
    ]
  }
};

export default nextConfig;

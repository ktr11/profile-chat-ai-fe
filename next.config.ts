import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack panics when following the profile-chat-ai-docs symlink that points outside the project root.
  // Use Webpack instead until the Turbopack issue is resolved.
  turbopack: undefined,
};

export default nextConfig;

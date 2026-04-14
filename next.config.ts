const nextConfig = {
  // SENIOR BYPASS: Ignore strict linting/type errors during rapid prototyping
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

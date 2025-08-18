/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  compiler: {
    styledJsx: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
  swcMinify: true,
  output: process.env.BUILD_OUTPUT === 'export' ? 'export' : undefined,
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  // 明确配置路径映射以确保Vercel环境中正常工作
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
    };
    return config;
  },
}

// 只在需要分析时才使用 bundle analyzer
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
    module.exports = withBundleAnalyzer(nextConfig);
  } catch (e) {
    console.warn('Bundle analyzer not available, continuing without it');
    module.exports = nextConfig;
  }
} else {
  module.exports = nextConfig;
}
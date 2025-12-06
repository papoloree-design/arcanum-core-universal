/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_KERNEL_URL: process.env.NEXT_PUBLIC_KERNEL_URL || 'http://localhost:4000',
    NEXT_PUBLIC_IDENTITY_URL: process.env.NEXT_PUBLIC_IDENTITY_URL || 'http://localhost:4100'
  }
}

module.exports = nextConfig

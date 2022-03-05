const withPwa = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
}

module.exports = withPwa(nextConfig)

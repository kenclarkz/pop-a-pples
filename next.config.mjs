import { createRequire } from 'module'

/**
 * The GitHub Pages base path is derived from the package.json `name` so this
 * template works in ANY repository without editing config files. To override,
 * set NEXT_PUBLIC_BASE_PATH (e.g. in CI or when previewing locally).
 */
const require = createRequire(import.meta.url)
const pkgName = require('./package.json').name
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || `/${pkgName}`).replace(/\/+$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: `${basePath}/`,
  env: {
    // Inlined into client bundles so `lib/paths.ts` works in the browser too.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]
    return config
  },
}

export default nextConfig

/**
 * GitHub Pages serves this project from `https://kenclarkz.github.io/<repo>/`,
 * so every asset/link must be prefixed with the repo base path. Next's Link and
 * Image components handle this automatically via `basePath`; this helper does
 * the same for raw asset URLs passed to three.js loaders, <img>, fetch, etc.
 *
 * The base path defaults to `/<package.json name>` (injected by next.config.mjs
 * via `NEXT_PUBLIC_BASE_PATH`) so the template works in any repository.
 */
export const BASE_PATH = (
  process.env.NEXT_PUBLIC_BASE_PATH || ''
).replace(/\/+$/, '')

export function asset(path: string): string {
  if (!path) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean.startsWith(BASE_PATH) ? clean : `${BASE_PATH}${clean}`
}

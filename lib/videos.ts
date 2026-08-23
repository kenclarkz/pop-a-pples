/**
 * Helpers for resolving video uploads whose file extension uses any letter
 * casing (`.mp4`, `.MP4`, `.Mp4`, …) or an alternate container (`.webm`,
 * `.mov`). GitHub Pages serves files verbatim, so a clip uploaded as
 * `Cherry.Mp4` is NOT found when the site requests `cherry.mp4` — instead of
 * failing, callers try each candidate URL in order until one loads.
 */

/** Alternate casings tried for the `.mp4` extension, in order. */
const MP4_CASE_VARIANTS = ['.MP4', '.Mp4', '.mP4'] as const

/** Non-mp4 containers accepted as last-resort fallbacks. */
const OTHER_EXTENSIONS = ['.webm', '.mov'] as const

/** Strips the extension (last `.` after the final `/`) from a URL/path. */
export function stripExtension(url: string): string {
  return url.replace(/\.[^./]+$/, '')
}

/**
 * Builds every plausible URL for an upload, starting with the path as given.
 * Example for `…/cherry.mp4`:
 * […/cherry.mp4, …/cherry.MP4, …/cherry.Mp4, …/cherry.mP4,
 *  …/cherry.webm, …/cherry.mov]
 */
export function buildVideoCandidates(src: string): string[] {
  if (!src) return []
  const base = stripExtension(src)
  const list: string[] = [src]
  for (const ext of [...MP4_CASE_VARIANTS, ...OTHER_EXTENSIONS]) {
    const url = `${base}${ext}`
    if (!list.includes(url)) list.push(url)
  }
  return list
}

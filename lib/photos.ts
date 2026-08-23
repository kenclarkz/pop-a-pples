'use client'

import { useEffect, useMemo, useState } from 'react'
import { PRODUCT_PHOTO_DIR, type CategoryId } from '@/data/products'
import { asset } from '@/lib/paths'

/** Extensions tried, in order, when looking for an uploaded product photo. */
const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const

/**
 * Builds every plausible URL for an uploaded photo, e.g. for
 * `gourmet-apples` / `classic-caramel-apple`:
 * […/photos/gourmet-apples/classic-caramel-apple.jpg,
 *  …/classic-caramel-apple.jpeg, …/.png, …/.webp]
 */
export function buildPhotoCandidates(
  category: CategoryId,
  id: string
): string[] {
  return PHOTO_EXTENSIONS.map((ext) =>
    asset(`${PRODUCT_PHOTO_DIR}/${category}/${id}${ext}`)
  )
}

/**
 * Detects an owner-uploaded product photo in
 * `/public/assets/products/photos/<category>/` and returns its URL, or null
 * when no upload exists (the placeholder art stays in use). Mirrors how
 * ProductVideo probes for video uploads with any extension casing.
 */
export function useProductPhoto(
  category: CategoryId | undefined,
  id: string | undefined
): string | null {
  const candidates = useMemo(
    () => (category && id ? buildPhotoCandidates(category, id) : []),
    [category, id]
  )
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!candidates.length || typeof window === 'undefined') {
      setPhotoUrl(null)
      return
    }
    let cancelled = false
    ;(async () => {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD' })
          if (!cancelled && res.ok) {
            setPhotoUrl(url)
            return
          }
        } catch {
          /* keep probing */
        }
      }
      if (!cancelled) setPhotoUrl(null)
    })()
    return () => {
      cancelled = true
    }
  }, [candidates])

  return photoUrl
}

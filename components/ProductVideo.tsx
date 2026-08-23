'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { buildVideoCandidates } from '@/lib/videos'

interface ProductVideoProps {
  /** Video source URL (already base-path prefixed) */
  src?: string
  /** Poster frame — also the permanent fallback when no video exists */
  poster: string
  alt: string
  className?: string
}

/**
 * Looping product video that plays while scrolled into view and pauses
 * off-screen. If the video file is missing or fails to decode, the poster
 * image is rendered instead so cards never look broken. When the default
 * source 404s (e.g. the upload used `Cherry.MP4`, `Cherry.Mp4`, `.webm`
 * or `.mov`), those variants are tried before falling back to the poster.
 */
export function ProductVideo({ src, poster, alt, className }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [candidateIndex, setCandidateIndex] = useState(0)

  const candidates = useMemo(() => buildVideoCandidates(src ?? ''), [src])

  useEffect(() => {
    setCandidateIndex(0)
  }, [candidates])

  const exhausted = candidateIndex >= candidates.length
  const currentSrc = exhausted ? undefined : candidates[candidateIndex]

  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentSrc) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [currentSrc])

  if (!src || !currentSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt={alt} className={cn('h-full w-full object-cover', className)} loading="lazy" />
    )
  }

  return (
    <video
      key={currentSrc}
      ref={videoRef}
      className={cn('h-full w-full object-cover', className)}
      src={currentSrc}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload="metadata"
      onError={() => setCandidateIndex((i) => i + 1)}
    />
  )
}

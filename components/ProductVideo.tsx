'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

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
 * image is rendered instead so cards never look broken.
 */
export function ProductVideo({ src, poster, alt, className }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || failed || !src) return

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
  }, [failed, src])

  if (!src || failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt={alt} className={cn('h-full w-full object-cover', className)} loading="lazy" />
    )
  }

  return (
    <video
      ref={videoRef}
      className={cn('h-full w-full object-cover', className)}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload="metadata"
      onError={() => setFailed(true)}
    />
  )
}

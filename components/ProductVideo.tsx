'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
 * Extension variants tried in order when the default `.mp4` source fails.
 * Every letter-casing of the mp4 extension is covered (`.MP4`, `.Mp4`,
 * `.mP4`) because GitHub Pages is case-sensitive, plus common alternate
 * formats (`.webm`, `.mov`) — so uploads play without renaming.
 */
const FALLBACK_EXTENSIONS = ['.MP4', '.Mp4', '.mP4', '.webm', '.mov'] as const

/**
 * Looping product video that plays while scrolled into view and pauses
 * off-screen. If the video file is missing or fails to decode, the poster
 * image is rendered instead so cards never look broken. When the default
 * source 404s (e.g. the upload used a differently-cased extension), every
 * mp4 casing and common alternate formats are tried before falling back
 * to the poster.
 */
export function ProductVideo({ src, poster, alt, className }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [candidateIndex, setCandidateIndex] = useState(0)

  const candidates = useMemo(() => {
    if (!src) return []
    const base = src.replace(/\.[^./]+$/, '')
    const list: string[] = [src]
    for (const ext of FALLBACK_EXTENSIONS) {
      const url = `${base}${ext}`
      if (!list.includes(url)) list.push(url)
    }
    return list
  }, [src])

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

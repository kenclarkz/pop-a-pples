'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { asset } from '@/lib/paths'
import { cn } from '@/lib/utils'
import { buildVideoCandidates } from '@/lib/videos'
import { useIsMobile } from '@/lib/assets'
import { site } from '@/data/site'

const SCRUB_VH = 300

// Canonical (lowercase) paths — uploads using any extension casing are
// detected below by probing each case variant before committing to a source.
const HEVC_BASE = asset('/assets/video/POP.mp4')
const H264_BASE = asset('/assets/video/POP-h264.mp4')
const POSTER_SRC = asset('/assets/video/POP-poster.jpg')
const HERO_PHOTO = asset('/assets/journey/hero.png')

/**
 * Full-screen hero that scrubs with the page scroll.
 *
 * Preferred: a video (`POP.mp4` + `POP-h264.mp4`) whose `currentTime` is
 * mapped linearly to scroll position, so the clip plays forward and back with
 * the wheel. Seeks are throttled to one per animation frame and only when the
 * target time actually changes.
 *
 * Mobile optimisation: H.264 is offered first (broadest device support), the
 * clip is `preload="metadata"` so low-end phones don't download the whole file,
 * seeks are less frequent to keep the scrub smooth on weaker GPUs, and the
 * video is scaled up with `object-contain` to avoid letterbox bars in portrait.
 *
 * Uploads: each canonical path is probed across common extension casings
 * (`POP.MP4`, `POP.Mp4`, …), so dropping a hero video in with any letter
 * casing works without renaming.
 *
 * Fallback: if no video files exist (fresh template), the hero photo from
 * `public/assets/journey/hero.png` is shown with a slow Ken Burns zoom so the
 * page still feels alive until a video is dropped in.
 */
export default function ScrollVideo() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroSrcs, setHeroSrcs] = useState<{
    hevc: string | null
    h264: string | null
  } | null>(null)
  const isMobile = useIsMobile()

  // Detect which hero video files exist in /public, regardless of the
  // letter casing used for the extension in the uploaded filename.
  useEffect(() => {
    let cancelled = false

    const probeSlot = async (base: string): Promise<string | null> => {
      for (const candidate of buildVideoCandidates(base)) {
        try {
          const res = await fetch(candidate, { method: 'HEAD' })
          if (res.ok) return candidate
        } catch {
          /* network hiccup — try the next variant */
        }
      }
      return null
    }

    Promise.all([probeSlot(HEVC_BASE), probeSlot(H264_BASE)]).then(
      ([hevc, h264]) => {
        if (!cancelled) setHeroSrcs({ hevc, h264 })
      }
    )

    return () => {
      cancelled = true
    }
  }, [])

  const hevcSrc = heroSrcs?.hevc ?? null
  const h264Src = heroSrcs?.h264 ?? null
  const isPhoto = heroSrcs !== null && !hevcSrc && !h264Src

  useEffect(() => {
    const video = videoRef.current
    // No <video> mounted while probing or in photo-fallback mode.
    if (!video || typeof window === 'undefined') return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // Mobile: fewer, coarser seeks keep the scrub smooth on low-end devices.
    const seekThreshold = isMobile ? 0.05 : 0.02

    let raf = 0
    let lastTime = -1
    let started = false

    const markReady = () => setReady(true)
    video.addEventListener('loadeddata', markReady)
    video.addEventListener('canplay', markReady)

    // Mobile browsers won't paint a paused video's frame until playback has
    // started once; give it a brief muted play so scrubbing renders every seek.
    const unlock = () => {
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          markReady()
          setTimeout(() => video.pause(), 60)
        }).catch(() => {})
      }
    }
    unlock()

    // Never trap the visitor behind the loader (e.g. blocked media, data saver).
    const failSafe = window.setTimeout(markReady, 12000)

    const update = () => {
      raf = requestAnimationFrame(update)

      if (video.readyState >= 2) setReady(true)

      if (reduced) return

      const dur = video.duration
      if (!Number.isFinite(dur) || dur <= 0) return

      const total =
        (wrapRef.current?.offsetHeight ?? 0) - window.innerHeight
      if (total <= 0 || video.readyState < 1) return

      const p = Math.min(1, Math.max(0, window.scrollY / total))
      const t = p * dur
      if (Math.abs(t - lastTime) > seekThreshold) {
        lastTime = t
        video.currentTime = t
      }
      if (window.scrollY > 12 && !started) {
        started = true
        setScrolled(true)
      }
    }
    raf = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(failSafe)
      video.removeEventListener('loadeddata', markReady)
      video.removeEventListener('canplay', markReady)
    }
    // Re-run when the resolved sources mount the <video> element.
  }, [isMobile, hevcSrc, h264Src])

  const showLoader = !isPhoto && !ready

  return (
    <>
      <div ref={wrapRef} style={{ height: isPhoto ? '150svh' : `${SCRUB_VH}svh` }} aria-hidden />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-espresso">
        {isPhoto ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_PHOTO}
              alt=""
              className="kenburns h-full w-full object-cover"
              onLoad={() => setReady(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/20 to-espresso" />
          </div>
        ) : hevcSrc || h264Src ? (
          <video
            /* Keyed by the resolved URLs so a late detection remounts the
               element and triggers a fresh load. */
            key={`${hevcSrc ?? ''}|${h264Src ?? ''}`}
            ref={videoRef}
            className="h-full w-full object-contain md:object-cover scale-[1.15] md:scale-90"
            playsInline
            muted
            disablePictureInPicture
            disableRemotePlayback
            preload={isMobile ? 'metadata' : 'auto'}
            poster={POSTER_SRC}
          >
            {/* H.264 first on mobile for the widest device support; HEVC on
                desktop for Safari efficiency. Both slots can resolve to the
                same upload (in any extension casing), so the browser tries
                each in turn and plays whichever codec it can decode. */}
            {isMobile && h264Src && <source src={h264Src} type="video/mp4" />}
            {hevcSrc && <source src={hevcSrc} type="video/mp4" />}
            {!isMobile && h264Src && <source src={h264Src} type="video/mp4" />}
          </video>
        ) : null}

        {/* Brand loader until the first frame is decodable */}
        {showLoader && (
          <div className="absolute inset-0 flex items-center justify-center bg-espresso">
            <div className="text-center">
              <Image
                src={asset('/assets/brand/logo.png')}
                alt=""
                width={72}
                height={72}
                className="mx-auto mb-6 rounded-full object-cover animate-pulse"
              />
              <p className="font-serif text-2xl text-cream">{site.name}</p>
              <p className="mt-2 text-sm text-cream/50 uppercase tracking-[0.2em]">
                {site.tagline}
              </p>
            </div>
          </div>
        )}

        {/* Scroll hint, fades once the visitor starts scrolling */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-10 flex justify-center transition-opacity duration-700',
            scrolled ? 'opacity-0' : 'opacity-100'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[0.62rem] uppercase tracking-[0.3em] text-cream/60">
              {isPhoto ? 'Scroll to explore' : 'Scroll to play'}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gold animate-bounce"
              style={{ animationDuration: '1.8s' }}
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

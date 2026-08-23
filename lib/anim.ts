import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  // Mobile browsers fire resize when the URL bar hides/shows during scroll,
  // which triggers ScrollTrigger.refresh() storms and makes in-flight reveal
  // animations jump. Ignore those resizes (real rotations/orientation changes
  // still refresh).
  ScrollTrigger.config({ ignoreMobileResize: true })
}

export { gsap, ScrollTrigger, useGSAP }

export const ease = {
  expo: 'power4.inOut',
  out: 'power3.out',
  inOut: 'power2.inOut',
}

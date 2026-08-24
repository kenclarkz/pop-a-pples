'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/data/products'
import { gsap } from '@/lib/anim'
import { cn } from '@/lib/utils'

interface ProductRailProps {
  products: Product[]
  label: string
}

/**
 * Horizontal, side-scrolling rail of product cards.
 *
 * Replaces the vertical grid on the menu page — browse left ↔ right instead
 * of up ↓ down. Supports mouse drag, native touch swipe, arrow buttons,
 * keyboard scrolling (focus the rail) and converts vertical wheel input into
 * sideways motion while the rail can still move, handing the scroll back to
 * the page at either end.
 */
export function ProductRail({ products, label }: ProductRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateEdges = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(max > 4 && el.scrollLeft < max - 4)
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${
        max > 0 ? Math.min(1, el.scrollLeft / max) : 1
      })`
    }
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el || typeof window === 'undefined') return

    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)

    // Vertical wheel → sideways glide while the rail can consume it.
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return // pinch zoom
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return // native pan-x
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      const before = el.scrollLeft
      el.scrollLeft = before + e.deltaY
      if (el.scrollLeft !== before) {
        e.preventDefault()
        e.stopPropagation() // keep Lenis from scrolling the page too
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })

    // Drag-to-scroll for mouse users (touch scrolls natively).
    let dragging = false
    let dragged = false
    let startX = 0
    let startScroll = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      dragged = false
      startX = e.clientX
      startScroll = el.scrollLeft
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (!dragged && Math.abs(dx) > 5) {
        dragged = true
        el.setPointerCapture(e.pointerId)
        el.classList.add('is-dragging')
      }
      if (dragged) el.scrollLeft = startScroll - dx
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      el.classList.remove('is-dragging')
      if (dragged && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
    }
    // Swallow the click that follows a drag so cards/buttons don't fire.
    const onClickCapture = (e: MouseEvent) => {
      if (!dragged) return
      dragged = false
      e.preventDefault()
      e.stopPropagation()
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('click', onClickCapture, true)

    // Cinematic entrance — cards drift in from the right as the rail appears.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-product-card]'),
        { autoAlpha: 0, x: 64 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      )
    }, el)

    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('click', onClickCapture, true)
      ctx.revert()
    }
  }, [products.length, updateEdges])

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  return (
    <div className="relative" data-product-rail>
      <div
        ref={railRef}
        role="region"
        aria-label={`${label} — side-scrolling menu`}
        tabIndex={0}
        className="product-rail group/rail relative -mx-6 flex snap-x items-stretch gap-5 overflow-x-auto rounded-3xl px-6 pb-3 pt-1 outline-none no-scrollbar cursor-grab focus-visible:ring-1 focus-visible:ring-gold/60 [overscroll-behavior-x:contain] lg:gap-7"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className={cn(
              'w-[62vw] shrink-0 snap-start sm:w-[270px] lg:w-[290px]',
              product.featured && !product.seasonal && 'sm:w-[300px] lg:w-[325px]'
            )}
          />
        ))}
        {products.length === 0 && (
          <div className="flex min-h-[300px] w-full items-center justify-center text-center text-cream/50">
            <div>
              <p className="font-serif text-xl mb-2">Nothing here yet</p>
              <p className="text-sm">New treats are always in the works.</p>
            </div>
          </div>
        )}
      </div>

      {/* Edge arrows (mouse/desktop) */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label={`Scroll ${label} backwards`}
        className={cn(
          'absolute left-1 top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-espresso/80 text-cream shadow-lg backdrop-blur transition-all duration-300 md:flex',
          canPrev ? 'opacity-90 hover:border-gold hover:text-gold' : 'pointer-events-none opacity-0'
        )}
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label={`Scroll ${label} forwards`}
        className={cn(
          'absolute right-1 top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-espresso/80 text-cream shadow-lg backdrop-blur transition-all duration-300 md:flex',
          canNext ? 'opacity-90 hover:border-gold hover:text-gold' : 'pointer-events-none opacity-0'
        )}
      >
        <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* Rail progress */}
      <div className="mt-6 h-px w-full overflow-hidden bg-cream/10">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gold"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden
        />
      </div>
    </div>
  )
}

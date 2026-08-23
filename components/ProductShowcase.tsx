'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag, Expand } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { gsap } from '@/lib/anim'
import { cn } from '@/lib/utils'
import { formatPrice, type Product } from '@/data/products'
import { PriceDisplay } from '@/components/PriceDisplay'
import { ProductVideo } from '@/components/ProductVideo'
import { ProductExpandedView } from '@/components/ProductExpandedView'

interface ProductShowcaseProps {
  products: Product[]
  /** 1-based position of this section on the menu */
  sectionIndex: number
  /** Section label, e.g. "Gourmet Apples" */
  title: string
  /** Section id — used for heading anchors */
  sectionId: string
  description: string
}

/**
 * Cinematic menu showcase — a large product film/image as the centerpiece
 * with subtle 3D tilt (pointer) and parallax (scroll) movement. Tapping the
 * stage or the product name opens the expanded product view.
 *
 * Videos come from /assets/products/videos/<category>/<id>.mp4 via
 * ProductVideo, which falls back to the product poster image when a clip
 * doesn't exist yet.
 */
export function ProductShowcase({
  products,
  sectionIndex,
  title,
  sectionId,
  description,
}: ProductShowcaseProps) {
  const [activeId, setActiveId] = useState(products[0]?.id ?? '')
  const [expanded, setExpanded] = useState(false)
  const active = useMemo(
    () => products.find((p) => p.id === activeId) ?? products[0],
    [products, activeId]
  )

  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)

  const { add } = useCart()
  const [selectedSize, setSelectedSize] = useState(active?.sizes[0] ?? '')

  useEffect(() => {
    setSelectedSize(active?.sizes[0] ?? '')
  }, [active])

  const step = (dir: 1 | -1) => {
    if (!active || products.length < 2) return
    const idx = products.findIndex((p) => p.id === active.id)
    setActiveId(products[(idx + dir + products.length) % products.length].id)
  }

  /* --- Subtle 3D tilt following the pointer (fine pointers only) ------- */
  useEffect(() => {
    const stage = stageRef.current
    const inner = tiltRef.current
    if (!stage || !inner || typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let raf = 0
    let inView = false
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const tick = () => {
      current.x += (target.x - current.x) * 0.075
      current.y += (target.y - current.y) * 0.075
      inner.style.transform = `rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!raf && inView) raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    io.observe(stage)

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      target.y = px * 7
      target.x = -py * 6
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
    }

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    start()

    return () => {
      io.disconnect()
      stop()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  /* --- Scroll parallax --------------------------------------------------- */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to('[data-parallax-media]', {
        y: -34,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-parallax-glow]', {
        y: 56,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  /* --- Entrance (once, on scroll into view) ------------------------------ */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-showcase-fade]',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  /* --- Transition when switching products -------------------------------- */
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const el = rootRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-showcase-fade]',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' }
      )
      gsap.fromTo(
        '[data-showcase-media]',
        { autoAlpha: 0.25, scale: 1.045 },
        { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'power2.out', overwrite: 'auto' }
      )
    }, el)
    return () => ctx.revert()
  }, [active?.id])

  if (!active) {
    return (
      <div className="py-16 text-center text-cream/50">
        <p className="font-serif text-xl">Nothing here yet — check back soon.</p>
      </div>
    )
  }

  const activeIdx = Math.max(0, products.findIndex((p) => p.id === active.id))
  const badge =
    active.badge ?? (active.isNew ? 'New' : active.seasonal ? 'Seasonal' : null)
  const unitPrice = active.sizePrice?.[selectedSize] ?? active.price

  return (
    <div ref={rootRef}>
      {/* Section header */}
      <header className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p data-showcase-fade className="eyebrow">
            {String(sectionIndex).padStart(2, '0')} · {String(activeIdx + 1).padStart(2, '0')}
            {' / '}
            {String(products.length).padStart(2, '0')}
          </p>
          <h2
            data-showcase-fade
            id={`${sectionId}-title`}
            className="display mt-3 text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
          <p data-showcase-fade className="mt-4 max-w-xl leading-relaxed text-cream/60">
            {description}
          </p>
        </div>

        {/* Prev / next */}
        <div data-showcase-fade className="flex items-center gap-3">
          <button
            onClick={() => step(-1)}
            aria-label="Previous product"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:border-gold hover:text-gold"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => step(1)}
            aria-label="Next product"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:border-gold hover:text-gold"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Stage + info */}
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        {/* Media stage */}
        <div ref={stageRef} className="relative [perspective:1400px]">
          {/* Glow behind the stage */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              data-parallax-glow
              className="absolute left-[8%] top-[12%] h-[65%] w-[84%] rounded-full bg-crimson/15 blur-[110px]"
            />
          </div>

          <button
            onClick={() => setExpanded(true)}
            aria-label={`Open ${active.name}`}
            data-parallax-media
            data-showcase-media
            className="group relative block w-full cursor-pointer overflow-hidden rounded-[2rem] border border-cream/10 bg-cream/[0.03] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] outline-none transition-colors duration-500 focus-visible:border-gold hover:border-gold/40"
          >
            <div ref={tiltRef} className="[transform-style:preserve-3d] will-change-transform">
              <div className="aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/4.4]">
                <ProductVideo
                  key={active.id}
                  src={active.video}
                  poster={active.image}
                  alt={active.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Scrims */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/90 via-transparent to-black/25" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{ background: 'radial-gradient(60% 55% at 50% 38%, rgba(201,169,106,0.14), transparent)' }}
              />

              {/* Badge */}
              {badge && (
                <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-espresso/60 px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.22em] text-gold backdrop-blur-md">
                  {badge}
                </span>
              )}

              {/* Explore hint */}
              <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-espresso/50 text-cream/80 backdrop-blur-md transition-colors duration-300 group-hover:border-gold group-hover:text-gold">
                <Expand className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </span>

              {/* Name overlay */}
              <span className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4 text-left">
                <span>
                  <span className="eyebrow block">{title}</span>
                  <span className="text-shadow-soft mt-1.5 block font-serif text-2xl font-light leading-tight sm:text-3xl">
                    {active.name}
                  </span>
                </span>
                <span className="hidden shrink-0 rounded-full border border-cream/15 bg-espresso/50 px-4 py-2 text-[0.6rem] uppercase tracking-[0.22em] text-cream/70 backdrop-blur-md transition-colors duration-300 group-hover:border-gold group-hover:text-gold sm:block">
                  View
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Info panel */}
        <div data-showcase-fade className="order-first lg:order-last">
          <p className="eyebrow">{title}</p>
          <h3 className="display mt-3 text-3xl font-light leading-tight sm:text-4xl lg:text-[2.9rem]">
            <button
              onClick={() => setExpanded(true)}
              className="cursor-pointer text-left transition-colors duration-300 hover:text-gold"
              aria-label={`View details for ${active.name}`}
            >
              {active.name}
            </button>
          </h3>
          <p className="mt-2 font-serif text-lg italic text-gold/90">{active.tagline}</p>
          <p className="mt-4 max-w-lg leading-relaxed text-cream/65">{active.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <PriceDisplay
              price={unitPrice}
              compareAt={active.compareAt}
              className="[&_span:last-child]:font-serif [&_span:last-child]:font-normal [&_span:last-child]:text-3xl"
            />
            {active.rating && (
              <span className="text-xs tracking-[0.15em] text-cream/45">★ {active.rating.toFixed(1)}</span>
            )}
          </div>

          {/* Sizes */}
          {active.sizes.length > 1 && (
            <div className="mt-6">
              <p className="eyebrow mb-3">Size</p>
              <div className="flex flex-wrap gap-2.5">
                {active.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={cn(
                      'min-h-[44px] rounded-full border px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.18em] transition-all duration-300',
                      selectedSize === size
                        ? 'border-gold bg-gold text-espresso shadow-[0_6px_24px_-6px_rgba(201,169,106,0.55)]'
                        : 'border-cream/15 bg-cream/5 text-cream/70 hover:border-gold/60 hover:text-gold'
                    )}
                  >
                    {size}
                    {active.sizePrice?.[size] !== undefined && (
                      <span className="ml-2 normal-case tracking-normal opacity-70">
                        {formatPrice(active.sizePrice[size]!)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() =>
                add({
                  id: active.id,
                  name: active.name,
                  price: unitPrice,
                  size: selectedSize,
                  image: active.image,
                })
              }
              className="btn-primary min-h-[52px] flex-1"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2} />
              Add to Order
            </button>
            <button onClick={() => setExpanded(true)} className="btn-ghost min-h-[52px]">
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Filmstrip */}
      <nav
        data-showcase-fade
        aria-label={`${title} products`}
        className="no-scrollbar mt-10 flex gap-3 overflow-x-auto pb-2 sm:mt-14 sm:gap-4 lg:flex-wrap lg:justify-center"
      >
        {products.map((product, i) => (
          <button
            key={product.id}
            onClick={() => setActiveId(product.id)}
            aria-current={product.id === active.id ? 'true' : undefined}
            aria-label={`Show ${product.name}`}
            className={cn(
              'group relative shrink-0 overflow-hidden rounded-2xl border transition-all duration-500',
              product.id === active.id
                ? 'border-gold shadow-[0_10px_36px_-10px_rgba(201,169,106,0.55)]'
                : 'border-cream/10 opacity-55 grayscale-[35%] hover:border-gold/50 hover:opacity-90 hover:grayscale-0'
            )}
          >
            <span className="relative block h-24 w-20 sm:h-28 sm:w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 bg-espresso/70 px-1.5 py-1 text-center text-[0.55rem] uppercase tracking-[0.14em] backdrop-blur-sm',
                  product.id === active.id ? 'text-gold' : 'text-cream/60'
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </span>
          </button>
        ))}
      </nav>

      {/* Expanded view */}
      {expanded && (
        <ProductExpandedView
          product={active}
          sectionLabel={title}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  )
}

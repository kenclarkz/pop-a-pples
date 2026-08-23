'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Truck, Shield } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { getLenis } from '@/lib/lenis'
import { gsap } from '@/lib/anim'
import { cn } from '@/lib/utils'
import { formatPrice, type Product } from '@/data/products'
import { PriceDisplay } from '@/components/PriceDisplay'
import { ProductVideo } from '@/components/ProductVideo'

interface ProductExpandedViewProps {
  product: Product
  sectionLabel: string
  onClose: () => void
}

/**
 * Full-screen cinematic product view. Opens when a product is tapped on the
 * menu. Mobile-first: an iOS-style bottom sheet; on desktop a centred,
 * two-column stage with the product film as the centerpiece.
 */
export function ProductExpandedView({ product, sectionLabel, onClose }: ProductExpandedViewProps) {
  const { add } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [qty, setQty] = useState(1)
  const backdropRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock background scroll (Lenis + native) while open.
  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = prevOverflow
    }
  }, [])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Cinematic entrance.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }
      )
      gsap.fromTo(
        sheetRef.current,
        { yPercent: 10, autoAlpha: 0, scale: 0.985 },
        { yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' }
      )
      gsap.fromTo(
        '[data-expanded-stagger]',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, delay: 0.15, ease: 'power3.out' }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const handleAdd = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.sizePrice?.[selectedSize] ?? product.price,
      size: selectedSize,
      image: product.image,
      quantity: qty,
    })
    onClose()
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-espresso-dark/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet / dialog */}
      <div className="absolute inset-0 flex items-end justify-center md:items-center md:p-8">
        <div
          ref={sheetRef}
          data-lenis-prevent
          className={cn(
            'relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain',
            'rounded-t-[2rem] border border-cream/10 bg-espresso shadow-[0_-24px_80px_-20px_rgba(0,0,0,0.8)]',
            'md:max-h-[88vh] md:flex-row md:overflow-hidden md:rounded-[2rem]',
            'invisible'
          )}
        >
          {/* Media — the centerpiece */}
          <div className="relative h-[46svh] shrink-0 overflow-hidden md:h-auto md:min-h-[480px] md:w-1/2">
            <ProductVideo
              src={product.video}
              poster={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {/* Cinematic scrims */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-espresso" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

            {/* Drag handle hint (mobile) */}
            <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-cream/40 md:hidden" aria-hidden />

            {/* Close */}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close product view"
              className="absolute right-4 top-4 z-10 rounded-full border border-cream/15 bg-espresso/70 p-3 text-cream/80 backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Floating price chip (mobile) */}
            <div className="absolute bottom-4 left-6 md:hidden">
              <p className="eyebrow mb-1">{sectionLabel}</p>
              <PriceDisplay
                price={product.sizePrice?.[selectedSize] ?? product.price}
                compareAt={product.compareAt}
                className="[&_span:last-child]:text-3xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 md:overflow-y-auto md:py-12">
            <div data-expanded-stagger className="hidden md:block">
              <p className="eyebrow">{sectionLabel}</p>
              <PriceDisplay
                price={product.sizePrice?.[selectedSize] ?? product.price}
                compareAt={product.compareAt}
                className="mt-2 [&_span:last-child]:text-3xl [&_span:last-child]:font-serif"
              />
            </div>

            <div data-expanded-stagger>
              <h2 className="display text-3xl font-light leading-tight sm:text-4xl lg:text-[2.75rem]">
                {product.name}
              </h2>
              <p className="mt-2 font-serif text-lg italic text-gold/90">{product.tagline}</p>
            </div>

            <p data-expanded-stagger className="leading-relaxed text-cream/70">
              {product.description}
            </p>

            {/* Size */}
            {product.sizes.length > 0 && (
              <div data-expanded-stagger>
                <p className="eyebrow mb-3">Size</p>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                      className={cn(
                        'min-h-[44px] px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-300',
                        'rounded-full border',
                        selectedSize === size
                          ? 'border-gold bg-gold text-espresso shadow-[0_6px_24px_-6px_rgba(201,169,106,0.55)]'
                          : 'border-cream/15 bg-cream/5 text-cream/70 hover:border-gold/60 hover:text-gold'
                      )}
                    >
                      {size}
                      {product.sizePrice?.[size] !== undefined && (
                        <span className="ml-2 normal-case tracking-normal opacity-70">
                          {formatPrice(product.sizePrice[size]!)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + CTA */}
            <div data-expanded-stagger className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="eyebrow">Qty</p>
                <div className="flex items-center gap-1 rounded-full border border-cream/15 bg-cream/5 p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="rounded-full p-2.5 text-cream/70 transition-colors hover:text-gold disabled:opacity-40"
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="rounded-full p-2.5 text-cream/70 transition-colors hover:text-gold"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <button onClick={handleAdd} className="btn-primary w-full py-4 text-sm sm:text-base">
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                Add to Order — {formatPrice((product.sizePrice?.[selectedSize] ?? product.price) * qty)}
              </button>
            </div>

            {/* Ingredients */}
            <div data-expanded-stagger className="border-t border-cream/10 pt-5">
              <p className="eyebrow mb-3">Key Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full border border-cream/10 bg-cream/5 px-3 py-1.5 text-xs text-cream/80"
                  >
                    {ing}
                  </span>
                ))}
              </div>
              {product.allergens && product.allergens.length > 0 && (
                <p className="mt-3 text-xs text-cream/50">
                  <span className="font-medium uppercase tracking-[0.15em]">Allergens:</span>{' '}
                  {product.allergens.join(', ')}
                </p>
              )}
            </div>

            <div data-expanded-stagger className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-cream/50">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4" strokeWidth={1.5} /> Free shipping on $100+
              </span>
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4" strokeWidth={1.5} /> Secure checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

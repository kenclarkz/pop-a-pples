'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Sparkles, Truck, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice, Product } from '@/data/products'
import { PriceDisplay } from '@/components/PriceDisplay'
import { ProductVideo } from '@/components/ProductVideo'
import { useProductPhoto } from '@/lib/photos'

interface ProductCardProps {
  product: Product
  /** Extra layout classes (e.g. width/snap when rendered inside a rail) */
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [showQuickView, setShowQuickView] = useState(false)
  // A real photo dropped into /assets/products/photos/<category>/ replaces
  // the generated placeholder as poster/fallback for the product video.
  const photo = useProductPhoto(product.category, product.id)
  const poster = photo ?? product.image

  const badgeContent = product.badge
    ? product.badge
    : product.isNew
    ? 'New'
    : product.seasonal
    ? 'Seasonal'
    : product.featured
    ? 'Featured'
    : null

  return (
    <article
      data-product-card
      className={cn(
        'group relative overflow-hidden rounded-3xl bg-cream/[0.03] border border-cream/10 transition-colors duration-700 hover:border-gold/30',
        className
      )}
    >
      {/* Video */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductVideo
          src={product.video}
          poster={poster}
          alt={product.name}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="px-3 py-1 bg-gold/20 text-gold text-[0.6rem] uppercase tracking-[0.2em] rounded-full">
              Featured
            </span>
          )}
          {product.seasonal && (
            <span className="px-3 py-1 bg-blush/20 text-blush text-[0.6rem] uppercase tracking-[0.2em] rounded-full">
              Seasonal
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 bg-sage/20 text-sage text-[0.6rem] uppercase tracking-[0.2em] rounded-full">
              New
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-espresso/80 backdrop-blur text-cream/70 hover:text-gold hover:bg-espresso transition-all" aria-label="Add to wishlist">
          <Heart className="w-4 h-4" strokeWidth={1.5} />
        </button>
        {/* Quick view */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-ghost px-4 py-1.5 text-xs whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
          Quick View
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow text-[0.6rem]">{product.category.replace('-', ' ')}</p>
          <PriceDisplay price={product.sizePrice?.[selectedSize] ?? product.price} compareAt={product.compareAt} />
        </div>

        <h3 className="font-serif text-xl font-light leading-tight group-hover:text-gold transition-colors">
          <Link href={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
            {product.name}
          </Link>
        </h3>

        <p className="text-cream/60 text-sm line-clamp-2">{product.tagline}</p>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-1.5" aria-label="Key ingredients">
          {product.ingredients.slice(0, 4).map((ing, i) => (
            <span key={i} className="px-2.5 py-1 bg-cream/5 border border-cream/10 rounded-full text-[0.6rem] text-cream/70">
              {ing}
            </span>
          ))}
          {product.ingredients.length > 4 && (
            <span className="px-2.5 py-1 bg-cream/5 border border-cream/10 rounded-full text-[0.6rem] text-cream/50">
              +{product.ingredients.length - 4} more
            </span>
          )}
        </div>

        {/* Size selector */}
        {product.sizes.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[0.65rem] uppercase tracking-[0.15em] transition-all',
                  selectedSize === size
                    ? 'bg-gold text-espresso shadow-[0_4px_16px_-4px_rgba(201,137,75,0.5)]'
                    : 'bg-cream/5 border border-cream/10 text-cream/70 hover:border-gold hover:text-gold'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal product={product} poster={poster} onClose={() => setShowQuickView(false)} />
      )}
    </article>
  )
}

function QuickViewModal({ product, poster, onClose }: { product: Product; poster: string; onClose: () => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="qv-title">
      <div className="bg-espresso border border-cream/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="eyebrow mb-2">{product.category.replace('-', ' ')}</p>
              <h2 id="qv-title" className="font-serif text-3xl font-light">{product.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-cream/50 hover:text-gold transition-colors rounded-full hover:bg-cream/5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream/5 relative">
              <ProductVideo src={product.video} poster={poster} alt={product.name} />
            </div>
            <div className="space-y-4">
              <PriceDisplay price={product.sizePrice?.[selectedSize] ?? product.price} compareAt={product.compareAt} className="text-2xl" />
              <p className="text-cream/70">{product.description}</p>

              <div>
                <p className="eyebrow mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm uppercase tracking-[0.1em] transition-all',
                        selectedSize === size
                          ? 'bg-gold text-espresso'
                          : 'bg-cream/5 border border-cream/10 text-cream/70 hover:border-gold hover:text-gold'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-cream/50 border-t border-cream/10 pt-4">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4" strokeWidth={2} /> Local delivery &amp; pickup</div>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4" strokeWidth={2} /> Available for pickup &amp; events</div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <details className="group border-t border-cream/10 pt-6">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="eyebrow">Key Ingredients</span>
              <svg className="w-5 h-5 text-cream/50 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1.5 bg-cream/5 border border-cream/10 rounded-full text-sm text-cream/80">
                  {ing}
                </span>
              ))}
            </div>
            {product.allergens && product.allergens.length > 0 && (
              <p className="mt-3 text-sm text-cream/50">
                <span className="font-medium">Allergens:</span> {product.allergens.join(', ')}
              </p>
            )}
          </details>
        </div>
      </div>
    </div>
  )
}
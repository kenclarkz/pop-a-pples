'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  MENU_SECTIONS,
  getProductsBySection,
  type CategoryId,
} from '@/data/products'
import { ProductShowcase } from '@/components/ProductShowcase'
import { Reveal } from '@/components/Reveal'
import { asset } from '@/lib/paths'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'
import { Tag, Shield, Truck, Heart } from 'lucide-react'

export default function ProductsPage() {
  const [activeSection, setActiveSection] = useState<CategoryId>(
    MENU_SECTIONS[0].id
  )

  // Highlight the sub-section currently in view while scrolling.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as CategoryId)
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    for (const { id } of MENU_SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-espresso via-espresso to-espresso-dark" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("${asset('/assets/brand/hero-pattern.svg')}")` }} />
        <div className="relative z-10 max-w-4xl text-center">
          <Reveal className="eyebrow">The Menu</Reveal>
          <Reveal delay={0.1} className="display mt-3 text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.05] mb-6">
            Three ways to<br />beat the heat.
          </Reveal>
          <Reveal delay={0.2} className="text-lg sm:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Step into the showcase — every item on its own cinematic stage.
            Tap a product to open the full experience, pick a size, and
            we&apos;ll have it ready for delivery or pickup.
          </Reveal>
          <Reveal delay={0.3} className="flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-2 text-cream/60 text-sm">
              <Truck className="w-5 h-5" strokeWidth={2} /> Free shipping on $100+
            </span>
            <span className="flex items-center gap-2 text-cream/60 text-sm">
              <Shield className="w-5 h-5" strokeWidth={2} /> Secure checkout
            </span>
          </Reveal>
          <Reveal delay={0.4}>
            <button onClick={() => scrollToSection(MENU_SECTIONS[0].id)} className="btn-primary mt-8">
              Explore the Menu
            </button>
          </Reveal>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* Sub-section navigation — sticks under the main nav while scrolling */}
      <nav
        aria-label="Menu sub-sections"
        className="sticky top-16 sm:top-20 z-40 border-y border-cream/10 bg-espresso/80 px-6 py-4 backdrop-blur"
      >
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
          {MENU_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              aria-current={activeSection === section.id ? 'true' : undefined}
              className={cn(
                'whitespace-nowrap rounded-full px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] font-medium transition-all duration-300',
                activeSection === section.id
                  ? 'bg-gold text-espresso shadow-[0_4px_20px_-4px_rgba(201,137,75,0.5)]'
                  : 'border border-cream/10 bg-cream/5 text-cream/70 hover:border-gold hover:text-gold'
              )}
            >
              {section.label}
            </button>
          ))}
          <span className="ml-auto hidden whitespace-nowrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.25em] text-cream/40 md:flex">
            Tap a product to explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </nav>

      {/* The three menu sub-sections — each a cinematic showcase */}
      {MENU_SECTIONS.map((section, i) => {
        const items = getProductsBySection(section.id)
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className={cn(
              'relative overflow-x-clip border-t border-cream/10 px-4 py-20 sm:px-6 sm:py-28',
              i % 2 === 1 && 'bg-espresso-dark/40'
            )}
          >
            <div className="mx-auto max-w-7xl">
              <ProductShowcase
                products={items}
                sectionIndex={i + 1}
                title={section.label}
                sectionId={section.id}
                description={section.description}
              />
            </div>
          </section>
        )
      })}

      {/* CTA Section */}
      <section className="border-t border-cream/10 bg-espresso-dark px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="eyebrow">Need Something Special?</Reveal>
          <Reveal delay={0.1} className="display mt-3 text-3xl sm:text-4xl font-light leading-tight mb-6">
            Custom cakes, catering orders & corporate gifts
          </Reveal>
          <Reveal delay={0.2} className="mb-8 max-w-xl mx-auto text-cream/60">
            Planning an event? We create bespoke apple boxes, branded gift sets,
            lemonade carts, and wholesale orders for cafés. Minimum 48 hours notice.
          </Reveal>
          <Reveal delay={0.3} className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-primary">Start a Custom Order</Link>
            <a href={`mailto:${site.email}`} className="btn-ghost">Email Us</a>
          </Reveal>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-cream/10 px-6 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          {[
            { icon: Truck, label: 'Free Shipping', desc: 'On orders over $100' },
            { icon: Shield, label: 'Secure Checkout', desc: 'Stripe encrypted payments' },
            { icon: Heart, label: 'Made Fresh', desc: 'Prepared to order daily' },
            { icon: Tag, label: 'Gift Ready', desc: 'Beautiful packaging included' },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1} className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream/5 text-gold">
                <item.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-cream">{item.label}</p>
              <p className="text-sm text-cream/50">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  MENU_SECTIONS,
  getProductsBySection,
  type CategoryId,
} from '@/data/products'
import { ProductRail } from '@/components/ProductRail'
import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'
import { Tag, Shield, Truck, Heart, ChevronsLeftRight } from 'lucide-react'

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
    <main className="min-h-screen pt-14 lg:pt-16">
      {/* Sub-section navigation — sticks under the main nav while scrolling */}
      <nav
        aria-label="Menu sub-sections"
        className="sticky top-14 lg:top-16 z-40 px-6 py-4 border-y border-cream/10 bg-espresso/80 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          {MENU_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              aria-current={activeSection === section.id ? 'true' : undefined}
              className={cn(
                'whitespace-nowrap px-5 py-2.5 rounded-full text-[0.7rem] uppercase tracking-[0.2em] font-medium transition-all duration-300',
                activeSection === section.id
                  ? 'bg-gold text-espresso shadow-[0_4px_20px_-4px_rgba(201,137,75,0.5)]'
                  : 'bg-cream/5 border border-cream/10 text-cream/70 hover:border-gold hover:text-gold'
              )}
            >
              {section.label}
            </button>
          ))}
          <span className="ml-auto hidden md:flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.25em] text-cream/40 whitespace-nowrap">
            Side-scroll to browse
            <ChevronsLeftRight className="w-4 h-4" strokeWidth={1.5} />
          </span>
        </div>
      </nav>

      {/* The three menu sub-sections */}
      {MENU_SECTIONS.map((section, i) => {
        const items = getProductsBySection(section.id)
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className={cn(
              'relative px-6 py-20 sm:py-28 border-t border-cream/10',
              i % 2 === 1 && 'bg-espresso-dark/40'
            )}
          >
            <div className="max-w-7xl mx-auto">
              {/* Section header */}
              <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <Reveal className="eyebrow">
                    {String(i + 1).padStart(2, '0')} · {site.name}
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h2
                      id={`${section.id}-title`}
                      className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mt-3"
                    >
                      {section.label}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="text-cream/60 max-w-xl mt-4 leading-relaxed">
                      {section.description}
                    </p>
                  </Reveal>
                </div>
                <Reveal delay={0.25} className="shrink-0">
                  <span className="px-4 py-2 rounded-full bg-cream/5 border border-cream/10 text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </Reveal>
              </header>

              {/* Product videos — side-scrolling rail */}
              <ProductRail products={items} label={section.label} />
            </div>
          </section>
        )
      })}

      {/* CTA Section */}
      <section className="px-6 py-20 bg-espresso-dark border-t border-cream/10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal className="eyebrow">Need Something Special?</Reveal>
          <Reveal delay={0.1} className="display mt-3 text-3xl sm:text-4xl font-light leading-tight mb-6">
            Custom cakes, catering orders & corporate gifts
          </Reveal>
          <Reveal delay={0.2} className="text-cream/60 mb-8 max-w-xl mx-auto">
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
      <section className="px-6 py-12 border-t border-cream/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Truck, label: 'Local Delivery', desc: 'Delivery & pickup available' },
            { icon: Shield, label: 'Made Fresh', desc: 'Hand-coated daily in house' },
            { icon: Heart, label: 'Made to Order', desc: 'Prepared for your event' },
            { icon: Tag, label: 'Gift Ready', desc: 'Beautiful packaging included' },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-cream/5 flex items-center justify-center text-gold">
                <item.icon className="w-7 h-7" strokeWidth={1.5} />
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

import { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'
import { Sparkles, Heart, Leaf, Award, Truck, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Story',
  description: "The story behind Pop-a-pples — a luxury gourmet apples brand born from obsession with the perfect hand-coated apple.",
}

const values = [
  { icon: Heart, title: 'Obsessive Quality', desc: 'We taste every batch. If it\'s not perfect, it doesn\'t leave the kitchen.' },
  { icon: Leaf, title: 'Honest Ingredients', desc: 'Orchard-fresh fruit, real butter, real chocolate. No shortcuts, ever.' },
  { icon: Award, title: 'Craft Over Scale', desc: 'Every apple is hand-dipped, hand-scattered, and hand-boxed. Always.' },
  { icon: Sparkles, title: 'Moments Matter', desc: 'We\'re not selling sweets. We\'re helping you create memories.' },
]

const timeline = [
  { year: '2019', title: 'The First Apple', desc: 'Founder Daniela burns her first caramel in a tiny Santa Barbara apartment kitchen. She tries again. And again.' },
  { year: '2020', title: 'The Orchard', desc: 'A weekend farmers market stall sells out in 47 minutes. She starts working directly with a local orchard.' },
  { year: '2021', title: 'The Kitchen', desc: 'A 1,200 sq ft kitchen opens on Orchard Lane. Two copper kettles. One mission.' },
  { year: '2023', title: 'National Shipping', desc: 'Overnight cold-chain delivery launches. Apples arrive chilled, perfect, nationwide.' },
  { year: '2024', title: 'The Journey', desc: 'This experience goes live — so everyone can witness the alchemy of an apple becoming a centrepiece.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-espresso via-espresso to-espresso-dark" />
        <div className="relative z-10 max-w-4xl text-center">
          <Reveal className="eyebrow">Our Story</Reveal>
          <Reveal delay={0.1} className="display mt-3 text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.05] mb-6">
            Picked at peak.<br />Never a day early.
          </Reveal>
          <Reveal delay={0.2} className="text-lg sm:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed">
            Pop-a-pples began with a simple question: what if we made caramel
            apples the way they used to — no shortcuts, no waxy fillers, just
            honest fruit and a lot of patience?
          </Reveal>
        </div>
      </section>

      {/* Founder Story */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal className="eyebrow">The Beginning</Reveal>
              <Reveal delay={0.1} className="display mt-3 text-3xl sm:text-4xl font-light leading-tight mb-6">
                It started with a burnt batch.
              </Reveal>
              <Reveal delay={0.2} className="prose prose-invert max-w-none text-cream/70 leading-relaxed space-y-4">
                <p>
                  Daniela Reyes grew up picking apples in her grandfather&apos;s
                  orchard. No measuring cups. No timers. Just intuition and a
                  copper kettle that had been in the family for three
                  generations.
                </p>
                <p>
                  When she moved to Santa Barbara, she couldn&apos;t find caramel
                  apples that tasted like home. The store-bought ones were waxed,
                  overly sweet, missing that deep, buttery caramel complexity. So
                  she started making her own.
                </p>
                <p>
                  The first fifty batches ended in the bin. Burnt caramel.
                  Coating too thick. Apples past their prime. But batch
                  fifty-one — that one was perfect. Glossy, crackling, with a
                  caramel that sang.
                </p>
                <p>
                  She brought them to the Saturday farmers market. They sold out
                  before noon. People asked for the recipe. She smiled and said,
                  <em>&ldquo;It&apos;s not a recipe. It&apos;s a ritual.&rdquo;</em>
                </p>
              </Reveal>
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream/5">
              <Reveal delay={0.3}>
                <svg viewBox="0 0 900 1100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Founder Daniela in her kitchen">
                  <rect width="900" height="1100" fill="#1B120C"/>
                  <ellipse cx="450" cy="940" rx="380" ry="80" fill="#2B1B10"/>
                  <defs>
                    <radialGradient id="appleGrad" cx="50%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#D9502F"/>
                      <stop offset="100%" stopColor="#A62E20"/>
                    </radialGradient>
                    <linearGradient id="caramelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D9A36A"/>
                      <stop offset="100%" stopColor="#A96A2F"/>
                    </linearGradient>
                  </defs>
                  <path d="M250 560 q-10 -250 200 -250 q210 0 200 250 q10 320 -200 320 q-200 0 -200 -320 z" fill="url(#appleGrad)"/>
                  <ellipse cx="520" cy="480" rx="120" ry="200" fill="#FFFFFF" opacity="0.10"/>
                  <rect x="430" y="250" width="40" height="120" rx="18" fill="#6B4226" transform="rotate(12 450 310)"/>
                  <path d="M460 300 Q 560 220 640 260" stroke="#4E9C4E" stroke-width="34" fill="none" stroke-linecap="round"/>
                  <path d="M330 640 q-30 240 -10 330 q20 90 120 110" stroke="url(#caramelGrad)" stroke-width="42" fill="none" stroke-linecap="round"/>
                  <path d="M560 660 q20 200 0 300" stroke="url(#caramelGrad)" stroke-width="36" fill="none" stroke-linecap="round"/>
                  <text x="450" y="1030" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fill="#C9A96A" opacity="0.6">Grandpa&apos;s Orchard</text>
                </svg>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-20 bg-espresso-dark border-y border-cream/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal className="eyebrow">The Journey</Reveal>
            <Reveal delay={0.1} className="display mt-3 text-3xl sm:text-4xl font-light">
              From orchard to nationwide
            </Reveal>
          </div>
          <div className="relative">
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-cream/10" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.08} className="relative flex lg:flex-row gap-8">
                  <div className="absolute left-8 lg:left-[calc(50%-120px)] top-4 w-6 h-6 rounded-full bg-gold border-4 border-espresso z-10 lg:-translate-x-full" />
                  <div className={cn(
                    'w-[calc(50%-140px)] lg:w-[calc(50%-140px)] px-6 py-4',
                    i % 2 === 0 ? 'lg:ml-auto text-right' : 'lg:mr-auto'
                  )}>
                    <span className="eyebrow">{item.year}</span>
                    <h3 className="font-serif text-2xl font-light mt-2 mb-2">{item.title}</h3>
                    <p className="text-cream/70">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal className="eyebrow">Our Values</Reveal>
            <Reveal delay={0.1} className="display mt-3 text-3xl sm:text-4xl font-light">
              What we stand for
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1} className="group p-8 rounded-3xl bg-cream/5 border border-cream/10 hover:border-gold/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-cream/5 flex items-center justify-center text-gold mb-6 group-hover:bg-gold/10 transition-colors">
                  <v.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-light mb-3">{v.title}</h3>
                <p className="text-cream/60 leading-relaxed">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-b from-espresso to-espresso-dark border-t border-cream/10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal className="eyebrow">Ready to Taste?</Reveal>
          <Reveal delay={0.1} className="display mt-3 text-3xl sm:text-4xl font-light leading-tight mb-6">
            Experience the journey yourself
          </Reveal>
          <Reveal delay={0.2} className="text-cream/60 mb-8 max-w-xl mx-auto">
            Order an apple today and taste the difference honest fruit and a little patience make.
          </Reveal>
          <Reveal delay={0.3} className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/products" className="btn-primary">Order Now</Link>
            <Link href="/contact" className="btn-ghost">Visit the Shop</Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

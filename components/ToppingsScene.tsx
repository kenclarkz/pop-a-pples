'use client'

import { useRef } from 'react'
import { SceneShell } from '@/components/SceneShell'
import { usePinnedScene, useSceneText } from '@/lib/usePinnedScene'

export default function ToppingsScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { progressRef } = usePinnedScene(sectionRef, { length: 1.6 })

  useSceneText(sectionRef, progressRef)

  return (
    <SceneShell ref={sectionRef} id="toppings" chapter="The Toppings" extra={0.6}>
      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 pt-12 pb-16 text-center pointer-events-none sm:pt-20">
        <div>
          <p data-reveal className="eyebrow">Chapter 04 — The Toppings</p>
          <h2 data-reveal data-reveal-delay="1" className="display mt-3 text-3xl sm:text-5xl font-light leading-[1.1] max-w-2xl">
            Finished with intention.
          </h2>
        </div>
        <p data-reveal data-fade="late" className="text-cream/50 text-sm uppercase tracking-[0.2em]">
          A scatter of crunch&hellip;
        </p>
      </div>
    </SceneShell>
  )
}

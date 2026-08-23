import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import ScrollVideo from '@/components/ScrollVideo'
import ScrollController from '@/components/ScrollController'

export default function Home() {
  return (
    <ScrollController>
      <ScrollVideo />
      <Link
        href="/products"
        className="btn-primary fixed bottom-6 left-1/2 z-[55] -translate-x-1/2 whitespace-nowrap sm:bottom-8"
        aria-label="View the menu"
      >
        <UtensilsCrossed className="h-4 w-4" strokeWidth={1.8} />
        View the Menu
      </Link>
    </ScrollController>
  )
}

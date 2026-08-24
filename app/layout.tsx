import type { Metadata, Viewport } from 'next'
import './globals.css'
import { asset, BASE_PATH } from '@/lib/paths'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: "Pop-a-pples — Gourmet Apples, Hand-Coated Daily",
    template: "%s — Pop-a-pples",
  },
  description:
    'A luxury gourmet apples brand. Cinematic storytelling, hand-coated apples and unforgettable moments — made fresh from orchard-picked fruit.',
  keywords: ['apples', 'caramel apples', 'gourmet apples', 'candy apples', 'handmade dessert', 'luxury sweets'],
  icons: { icon: asset('/assets/brand/app-icon.jpeg') },
  openGraph: {
    title: "Pop-a-pples — Gourmet Apples, Hand-Coated Daily",
    description:
      'A luxury gourmet apples brand. Cinematic storytelling, hand-coated apples and unforgettable moments.',
    type: 'website',
    url: `https://kenclarkz.github.io${BASE_PATH}/`,
    images: [`https://kenclarkz.github.io${BASE_PATH}/assets/brand/logo.png`],
  },
}

export const viewport: Viewport = {
  themeColor: '#1B120C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-espresso">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-espresso text-cream">
        <div className="grain" aria-hidden />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}

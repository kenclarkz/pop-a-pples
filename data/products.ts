/**
 * Product catalog for Pop-a-pples.
 *
 * To add a new product, append one object to `products` below.
 * Drop a matching image into `/public/assets/products/<id>.png` (or run
 * `node tools/generate-placeholders.mjs` to create a placeholder SVG).
 *
 * Optional future-proof fields you can add per product:
 *   - discount, compareAt   -> sale pricing
 *   - available             -> inventory availability
 *   - dietary               -> labels such as "gluten-free"
 *   - prepDays              -> lead time for catering orders
 */

import { asset } from '@/lib/paths'

export type CategoryId =
  | 'all'
  | 'classic'
  | 'specialty'
  | 'seasonal'
  | 'party'
  | 'gift'

export interface Category {
  id: CategoryId
  label: string
  description: string
}

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  /** base price in USD (whole dollars) */
  price: number
  compareAt?: number
  category: Exclude<CategoryId, 'all'>
  sizes: string[]
  sizePrice?: Partial<Record<string, number>>
  image: string
  ingredients: string[]
  featured?: boolean
  seasonal?: boolean
  isNew?: boolean
  badge?: string
  rating?: number
  allergens?: string[]
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', description: 'Everything we make' },
  {
    id: 'classic',
    label: 'Classic Apples',
    description: 'The originals — shiny, sticky, timeless.',
  },
  {
    id: 'specialty',
    label: 'Specialty Apples',
    description: 'Modern coatings, serious flavour.',
  },
  {
    id: 'seasonal',
    label: 'Seasonal Flavours',
    description: 'Here for a moment. Gone soon.',
  },
  {
    id: 'party',
    label: 'Party Boxes',
    description: 'Crowd-pleasers for every celebration.',
  },
  {
    id: 'gift',
    label: 'Gift Boxes',
    description: 'Beautifully boxed, ready to share.',
  },
]

export const products: Product[] = [
  {
    id: 'classic-caramel-apple',
    name: 'Classic Caramel Apple',
    tagline: 'The one that started it all.',
    description:
      'A crisp Honeycrisp apple hand-dipped in slow-cooked, buttery caramel and finished with a whisper of flaky salt.',
    price: 9,
    category: 'classic',
    sizes: ['Standard', 'Jumbo'],
    sizePrice: { Standard: 9, Jumbo: 12 },
    image: asset('/assets/products/classic-caramel-apple.svg'),
    ingredients: ['Honeycrisp Apple', 'Butter Caramel', 'Flaky Sea Salt'],
    featured: true,
    badge: 'Best Seller',
    rating: 4.9,
    allergens: ['Milk'],
  },
  {
    id: 'candy-apple',
    name: 'Classic Candy Apple',
    tagline: 'Crackling, glossy, impossibly red.',
    description:
      'The fairground icon — a tart Granny Smith sealed under a brittle ruby candy shell that shatters with every bite.',
    price: 8,
    category: 'classic',
    sizes: ['Standard', 'Jumbo'],
    image: asset('/assets/products/candy-apple.svg'),
    ingredients: ['Granny Smith Apple', 'Candy Shell', 'Red Food Colour'],
    featured: true,
    rating: 4.8,
  },
  {
    id: 'dark-chocolate-apple',
    name: 'Dark Chocolate & Sea Salt',
    tagline: 'For the cocoa obsessed.',
    description:
      'Hand-coated in 72% single-origin chocolate, dusted with smoked sea salt and a faint ribbon of salted caramel.',
    price: 11,
    category: 'specialty',
    sizes: ['Standard', 'Jumbo'],
    image: asset('/assets/products/dark-chocolate-apple.svg'),
    ingredients: ['Fuji Apple', '72% Chocolate', 'Smoked Sea Salt', 'Caramel'],
    rating: 4.9,
    allergens: ['Milk', 'Soy'],
  },
  {
    id: 'toffee-crunch-apple',
    name: 'Toffee Crunch Apple',
    tagline: 'New — roasted, buttery, nutty.',
    description:
      'Caramel-dipped, then rolled through a crunchy blend of roasted toffee, almonds and buttery shortbread.',
    price: 12,
    category: 'specialty',
    sizes: ['Standard', 'Jumbo'],
    image: asset('/assets/products/toffee-crunch-apple.svg'),
    ingredients: ['Fuji Apple', 'Caramel', 'Toffee', 'Roasted Almonds'],
    isNew: true,
    rating: 4.8,
    allergens: ['Milk', 'Tree Nuts', 'Wheat'],
  },
  {
    id: 'confetti-apple',
    name: 'White Chocolate Confetti',
    tagline: 'Sweet, bright and impossibly cheerful.',
    description:
      'Silky white chocolate swirled over a crisp apple, scattered with a confetti of rainbow sprinkles.',
    price: 10,
    category: 'specialty',
    sizes: ['Standard', 'Jumbo'],
    image: asset('/assets/products/confetti-apple.svg'),
    ingredients: ['Honeycrisp Apple', 'White Chocolate', 'Sprinkles'],
    rating: 4.7,
    allergens: ['Milk', 'Soy'],
  },
  {
    id: 'pumpkin-spice-apple',
    name: 'Pumpkin Spice Apple',
    tagline: 'Autumn, on a stick.',
    description:
      'A warm spiced caramel coating kissed with pumpkin, cinnamon and nutmeg, rolled in ginger cookie crumble.',
    price: 12,
    category: 'seasonal',
    sizes: ['Standard', 'Jumbo'],
    image: asset('/assets/products/pumpkin-spice-apple.svg'),
    ingredients: ['Fuji Apple', 'Spiced Caramel', 'Ginger Crumble', 'Pumpkin'],
    seasonal: true,
    rating: 4.9,
    allergens: ['Milk', 'Wheat'],
  },
  {
    id: 'candy-cane-apple',
    name: 'Candy Cane Apple',
    tagline: 'Peppermint frost, winter glow.',
    description:
      'A frosty white chocolate shell flecked with crushed peppermint candy cane over a crisp, tart apple.',
    price: 11,
    category: 'seasonal',
    sizes: ['Standard', 'Jumbo'],
    image: asset('/assets/products/candy-cane-apple.svg'),
    ingredients: ['Granny Smith Apple', 'White Chocolate', 'Candy Cane'],
    seasonal: true,
    rating: 4.7,
    allergens: ['Milk', 'Soy'],
  },
  {
    id: 'party-apple-box',
    name: 'The Orchard Party Box',
    tagline: 'The centrepiece apple spread.',
    description:
      'A grand wooden crate of hand-coated apples in rotating flavours — caramel, chocolate and candy — built to feed a crowd and steal the table.',
    price: 48,
    category: 'party',
    sizes: ['Serves 8', 'Serves 16'],
    sizePrice: { 'Serves 8': 48, 'Serves 16': 88 },
    image: asset('/assets/products/party-apple-box.svg'),
    ingredients: ['Mixed Apples', 'Caramel', 'Chocolate', 'Candy Shell'],
    featured: true,
    badge: 'Celebration',
    rating: 5.0,
    allergens: ['Milk', 'Soy'],
  },
  {
    id: 'apple-gift-box',
    name: 'The Apple Gift Box',
    tagline: 'Six perfect little moments.',
    description:
      'A curated box of miniature coated apples in rotating flavours, ribboned and ready to gift. Perfect for corporate and celebration orders.',
    price: 28,
    category: 'gift',
    sizes: ['6 pieces', '12 pieces'],
    sizePrice: { '6 pieces': 28, '12 pieces': 52 },
    image: asset('/assets/products/apple-gift-box.svg'),
    ingredients: ['Mini Apples', 'Seasonal Coatings', 'Caramel'],
    rating: 4.8,
    allergens: ['Milk', 'Tree Nuts (varies)'],
  },
]

export const getProduct = (id: string) => products.find((p) => p.id === id)

export const getFeatured = () => products.filter((p) => p.featured)

export const getSeasonal = () => products.filter((p) => p.seasonal)

export const getCategory = (id: string) =>
  CATEGORIES.find((c) => c.id === id)

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

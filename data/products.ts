/**
 * Product catalog for Pop-a-pples.
 *
 * The menu is split into three sub-sections (see MENU_SECTIONS):
 * Gourmet Apples, Lemonade and Italian Ice.
 *
 * To add a new product, append one object to `products` below.
 * Drop a matching poster image into `/public/assets/products/<id>.png`
 * (or run `node tools/generate-placeholders.mjs`), a looping product
 * video into `/public/assets/products/videos/<category>/<id>.mp4`, and a
 * real photo into `/public/assets/products/photos/<category>/<id>.jpg`.
 *
 * Optional future-proof fields you can add per product:
 *   - discount, compareAt   -> sale pricing
 *   - available             -> inventory availability
 *   - dietary               -> labels such as "gluten-free"
 *   - prepDays              -> lead time for catering orders
 */

import { asset } from '@/lib/paths'

export type CategoryId = 'gourmet-apples' | 'lemonade' | 'italian-ice'

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
  category: CategoryId
  sizes: string[]
  sizePrice?: Partial<Record<string, number>>
  /** Poster frame shown before/until the product video loads */
  image: string
  /** Looping product video — defaults to /assets/products/videos/<category>/<id>.mp4
   *  (uploads with any extension casing — .MP4, .Mp4, … — plus .webm/.mov are
   *  detected automatically at runtime) */
  video?: string
  ingredients: string[]
  featured?: boolean
  seasonal?: boolean
  isNew?: boolean
  badge?: string
  rating?: number
  allergens?: string[]
}

/** Where product videos live inside /public (one sub-folder per menu category) */
export const PRODUCT_VIDEO_DIR = '/assets/products/videos'

/**
 * Where real product photos live inside /public (same one-subfolder-per-
 * category layout). A photo named `<product-id>.jpg|jpeg|png|webp` here is
 * auto-detected at runtime and used as the poster/fallback image instead of
 * the placeholder art in /assets/products.
 */
export const PRODUCT_PHOTO_DIR = '/assets/products/photos'

/**
 * The three menu sub-sections. Each renders as its own full-height,
 * scrollable section on the menu page (`/products#<id>`).
 */
export const MENU_SECTIONS: Category[] = [
  {
    id: 'gourmet-apples',
    label: 'Gourmet Apples',
    description:
      'Hand-picked apples, hand-dipped in caramel, chocolate and candy.',
  },
  {
    id: 'lemonade',
    label: 'Lemonade',
    description: 'Fresh-squeezed to order — sunshine by the cup.',
  },
  {
    id: 'italian-ice',
    label: 'Italian Ice',
    description: 'Slow-churned, fruit-forward, served frosty.',
  },
]

export const products: Product[] = [
  {
    id: 'rockstar',
    name: 'Rockstar',
    tagline: 'Sweet, loud and crackling with sparkle.',
    description:
      'A glossy candy shell studded with shards of rock candy that crackle and shine — the apple that steals the spotlight.',
    price: 19,
    category: 'gourmet-apples',
    sizes: ['Standard'],
    image: asset('/assets/products/rockstar.svg'),
    ingredients: ['Granny Smith Apple', 'Candy Shell', 'Rock Candy Crystals'],
    isNew: true,
    rating: 4.8,
  },
  {
    id: 'mvp',
    name: 'MVP',
    tagline: 'The Most Valuable Apple — fully loaded.',
    description:
      'Caramel and chocolate stacked high over a crisp apple and finished with a shower of rainbow sprinkles. Champion stuff.',
    price: 17,
    category: 'gourmet-apples',
    sizes: ['Standard'],
    image: asset('/assets/products/mvp.svg'),
    ingredients: ['Fuji Apple', 'Caramel', 'Milk Chocolate', 'Sprinkles'],
    isNew: true,
    rating: 4.9,
    allergens: ['Milk', 'Soy'],
  },
  /* --- Lemonade ------------------------------------------------------- */
  {
    id: 'mango-lemonade',
    name: 'Mango Lemonade',
    tagline: 'Tropical sunshine by the cup.',
    description:
      'Fresh-squeezed lemonade swirled with ripe mango purée — bright, juicy and endlessly refreshing.',
    price: 5,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 5, '24 oz': 8 },
    image: asset('/assets/products/mango-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Mango', 'Cane Sugar'],
    featured: true,
    badge: 'Best Seller',
    rating: 4.9,
  },
  {
    id: 'strawberry-lemonade',
    name: 'Strawberry Lemonade',
    tagline: 'Berry bright, perfectly tart.',
    description:
      'Our classic lemonade swirled with house macerated strawberries and finished with a berry ice float.',
    price: 5,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 5, '24 oz': 8 },
    image: asset('/assets/products/strawberry-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Strawberries', 'Cane Sugar'],
    rating: 4.8,
  },
  {
    id: 'blueberry-lemonade',
    name: 'Blueberry Lemonade',
    tagline: 'Deep purple, wildly fresh.',
    description:
      'Crushed blueberries folded into hand-squeezed lemonade for a jammy-sweet pour with a tart finish.',
    price: 5,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 5, '24 oz': 8 },
    image: asset('/assets/products/blueberry-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Blueberries', 'Cane Sugar'],
    rating: 4.8,
  },
  {
    id: 'strawberry-mango-lemonade',
    name: 'Strawberry Mango Lemonade',
    tagline: 'Two fruits, one perfect pour.',
    description:
      'Strawberries and mango layered into our fresh-squeezed lemonade — sweet, tangy and sunset-coloured.',
    price: 5,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 5, '24 oz': 8 },
    image: asset('/assets/products/strawberry-mango-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Strawberries', 'Mango', 'Cane Sugar'],
    isNew: true,
    rating: 4.9,
  },
  {
    id: 'mango-blueberry-lemonade',
    name: 'Mango Blueberry Lemonade',
    tagline: 'Golden top, purple bottom.',
    description:
      'Mango purée floated over blueberry lemonade for a two-tone sip that turns sweeter with every layer.',
    price: 5,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 5, '24 oz': 8 },
    image: asset('/assets/products/mango-blueberry-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Mango', 'Blueberries', 'Cane Sugar'],
    isNew: true,
    rating: 4.9,
  },
  {
    id: 'strawberry-blueberry-lemonade',
    name: 'Strawberry Blueberry Lemonade',
    tagline: 'A berry patch in a cup.',
    description:
      'Double-berry lemonade with macerated strawberries and crushed blueberries over plenty of crushed ice.',
    price: 5,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 5, '24 oz': 8 },
    image: asset('/assets/products/strawberry-blueberry-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Strawberries', 'Blueberries', 'Cane Sugar'],
    isNew: true,
    rating: 4.9,
  },

  /* --- Italian Ice ---------------------------------------------------- */
  {
    id: 'sunrise-strawberry',
    name: 'Sunrise Strawberry',
    tagline: 'Berry bright, sunrise sweet.',
    description:
      'Sun-ripened strawberries slow-churned into a rosy, frosty ice with a squeeze of lime to keep every spoonful glowing.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/sunrise-strawberry.svg'),
    ingredients: ['Strawberries', 'Lime', 'Cane Sugar'],
    featured: true,
    rating: 4.9,
  },
  {
    id: 'lemon-drop',
    name: 'Lemon Drop',
    tagline: 'Tart, sugary, electric.',
    description:
      'Slow-churned lemon ice with real zest in every spoonful — dairy-free, gloriously tart and served straight from the freezer.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/lemon-drop.svg'),
    ingredients: ['Fresh Lemons', 'Zest', 'Cane Sugar'],
    rating: 4.9,
  },
  {
    id: 'miami-mango',
    name: 'Miami Mango',
    tagline: 'Tropical sunshine, frozen solid.',
    description:
      'Ataulfo mango whipped into silk-smooth ice — pure tropical sunshine with a bright citrus finish.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/miami-mango.svg'),
    ingredients: ['Ataulfo Mango', 'Citrus', 'Cane Sugar'],
    rating: 4.9,
  },
  {
    id: 'caramel-apple-ice',
    name: 'Caramel Apple',
    tagline: 'The orchard classic, churned frosty.',
    description:
      'Crisp apple ice rippled with buttery caramel — all the joy of a caramel apple in a spoonful of frost.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/caramel-apple-ice.svg'),
    ingredients: ['Apple', 'Caramel Swirl', 'Cane Sugar'],
    rating: 4.8,
    allergens: ['Milk'],
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    tagline: 'Carnival clouds, straight from the freezer.',
    description:
      'Spun-sugar sweetness whipped into a pastel-swirled ice that tastes like the fairground on a summer night.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/cotton-candy.svg'),
    ingredients: ['Cane Sugar', 'Blue Raspberry', 'Vanilla'],
    isNew: true,
    rating: 4.7,
  },
  {
    id: 'twisted-berry',
    name: 'Twisted Berry',
    tagline: 'A berry medley with a twist.',
    description:
      'Strawberries, blackberries and raspberries twisted together into a deep-purple ice bursting with brambly brightness.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/twisted-berry.svg'),
    ingredients: ['Strawberries', 'Blackberries', 'Raspberries'],
    rating: 4.8,
  },
  {
    id: 'island-pina-colada',
    name: 'Island Piña Colada',
    tagline: 'Pineapple, coconut, paradise.',
    description:
      'Golden pineapple swirled with creamy coconut into a frosty island escape — no passport required.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 8 },
    image: asset('/assets/products/island-pina-colada.svg'),
    ingredients: ['Pineapple', 'Coconut Cream', 'Cane Sugar'],
    seasonal: true,
    rating: 4.8,
    allergens: ['Coconut'],
  },
]

// Every product gets a video slot by convention: drop an mp4 named after
// the product id into the category's sub-folder of
// public/assets/products/videos/ and it just plays. (Uppercase extensions
// like .MP4 and .webm/.mov uploads are handled by ProductVideo's fallback.)
for (const product of products) {
  product.video =
    product.video ??
    asset(`${PRODUCT_VIDEO_DIR}/${product.category}/${product.id}.mp4`)
}

export const getProduct = (id: string) => products.find((p) => p.id === id)

export const getFeatured = () => products.filter((p) => p.featured)

export const getSeasonal = () => products.filter((p) => p.seasonal)

export const getCategory = (id: string) =>
  MENU_SECTIONS.find((c) => c.id === id)

export const getProductsBySection = (id: CategoryId) =>
  products.filter((p) => p.category === id)

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

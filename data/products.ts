/**
 * Product catalog for Pop-a-pples.
 *
 * The menu is split into three sub-sections (see MENU_SECTIONS):
 * Gourmet Apples, Lemonade and Italian Ice.
 *
 * To add a new product, append one object to `products` below.
 * Drop a matching poster image into `/public/assets/products/<id>.png`
 * (or run `node tools/generate-placeholders.mjs`) and a looping product
 * video into `/public/assets/products/videos/<category>/<id>.mp4`.
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
   *  (.MP4/.webm/.mov variants are detected automatically at runtime) */
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
    id: 'classic-caramel-apple',
    name: 'Classic Caramel Apple',
    tagline: 'The one that started it all.',
    description:
      'A crisp Honeycrisp apple hand-dipped in slow-cooked, buttery caramel and finished with a whisper of flaky salt.',
    price: 9,
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
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
    category: 'gourmet-apples',
    sizes: ['6 pieces', '12 pieces'],
    sizePrice: { '6 pieces': 28, '12 pieces': 52 },
    image: asset('/assets/products/apple-gift-box.svg'),
    ingredients: ['Mini Apples', 'Seasonal Coatings', 'Caramel'],
    rating: 4.8,
    allergens: ['Milk', 'Tree Nuts (varies)'],
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
    id: 'lemon-italian-ice',
    name: 'Lemon Italian Ice',
    tagline: 'Frosty, silky, electric.',
    description:
      'Slow-churned lemon ice with real zest in every spoonful — dairy-free, gloriously tart and served straight from the freezer.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 14 },
    image: asset('/assets/products/lemon-italian-ice.svg'),
    ingredients: ['Fresh Lemons', 'Zest', 'Cane Sugar'],
    featured: true,
    rating: 4.9,
  },
  {
    id: 'cherry-italian-ice',
    name: 'Cherry Italian Ice',
    tagline: 'Deep red, double cherry.',
    description:
      'Ripe dark cherries blended into a velvety ice with a squeeze of lime to keep every bite bright.',
    price: 5,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 5, Pint: 14 },
    image: asset('/assets/products/cherry-italian-ice.svg'),
    ingredients: ['Dark Cherries', 'Lime', 'Cane Sugar'],
    rating: 4.8,
  },
  {
    id: 'mango-chile-italian-ice',
    name: 'Mango Chile Italian Ice',
    tagline: 'Sweet heat, frozen solid.',
    description:
      'Ataulfo mango whipped into silk-smooth ice and dusted with a whisper of chile-lime salt. Sweet first, gentle warmth after.',
    price: 6,
    category: 'italian-ice',
    sizes: ['Single', 'Pint'],
    sizePrice: { Single: 6, Pint: 16 },
    image: asset('/assets/products/mango-chile-italian-ice.svg'),
    ingredients: ['Ataulfo Mango', 'Chile-Lime Salt', 'Lime'],
    seasonal: true,
    rating: 4.9,
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

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
    id: 'classic-lemonade',
    name: 'Classic Squeezed Lemonade',
    tagline: 'Sunshine in a cup.',
    description:
      'Hand-squeezed lemons, pure cane sugar and cold spring water over crushed ice — the orchard-stand original.',
    price: 6,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 6, '24 oz': 8 },
    image: asset('/assets/products/classic-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Cane Sugar', 'Spring Water'],
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
    price: 7,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 7, '24 oz': 9 },
    image: asset('/assets/products/strawberry-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Strawberries', 'Cane Sugar'],
    isNew: true,
    rating: 4.8,
  },
  {
    id: 'lavender-lemonade',
    name: 'Lavender Lemonade',
    tagline: 'Calm, floral, quietly fancy.',
    description:
      'Steeped culinary lavender lends a soft perfume to fresh lemon juice — lightly sweetened and endlessly sippable.',
    price: 7,
    category: 'lemonade',
    sizes: ['16 oz', '24 oz'],
    sizePrice: { '16 oz': 7, '24 oz': 9 },
    image: asset('/assets/products/lavender-lemonade.svg'),
    ingredients: ['Fresh Lemons', 'Culinary Lavender', 'Honey'],
    rating: 4.7,
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

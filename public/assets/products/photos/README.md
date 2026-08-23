# Product Photos

Real photos of every item on the menu (`/products`) live here. A photo is
shown as the product's poster/fallback image (before a video loads, or when
no video exists) instead of the generated placeholder art.

## Folders

One **sub-folder per menu category** (the sub-sections on the menu page):

```
public/assets/products/photos/
├── gourmet-apples/    # Gourmet Apples photos
├── lemonade/          # Lemonade photos
└── italian-ice/       # Italian Ice photos
```

## Naming

One `<product-id>.jpg` per product inside its category folder — the file name
must match the product `id` in `data/products.ts` exactly:

> **Tip:** the site picks up any of these extensions automatically —
> `.jpg`, `.jpeg`, `.png`, `.webp` — so phone uploads work without renaming.

| Product                  | Category       | File                                              |
| ------------------------ | -------------- | ------------------------------------------------- |
| classic-caramel-apple    | gourmet-apples | `gourmet-apples/classic-caramel-apple.jpg`        |
| candy-apple              | gourmet-apples | `gourmet-apples/candy-apple.jpg`                  |
| dark-chocolate-apple     | gourmet-apples | `gourmet-apples/dark-chocolate-apple.jpg`         |
| toffee-crunch-apple      | gourmet-apples | `gourmet-apples/toffee-crunch-apple.jpg`          |
| confetti-apple           | gourmet-apples | `gourmet-apples/confetti-apple.jpg`               |
| pumpkin-spice-apple      | gourmet-apples | `gourmet-apples/pumpkin-spice-apple.jpg`          |
| candy-cane-apple         | gourmet-apples | `gourmet-apples/candy-cane-apple.jpg`             |
| party-apple-box          | gourmet-apples | `gourmet-apples/party-apple-box.jpg`              |
| apple-gift-box           | gourmet-apples | `gourmet-apples/apple-gift-box.jpg`               |
| mango-lemonade           | lemonade       | `lemonade/mango-lemonade.jpg`                     |
| strawberry-lemonade      | lemonade       | `lemonade/strawberry-lemonade.jpg`                |
| blueberry-lemonade       | lemonade       | `lemonade/blueberry-lemonade.jpg`                 |
| strawberry-mango-lemonade | lemonade      | `lemonade/strawberry-mango-lemonade.jpg`          |
| mango-blueberry-lemonade | lemonade       | `lemonade/mango-blueberry-lemonade.jpg`           |
| strawberry-blueberry-lemonade | lemonade  | `lemonade/strawberry-blueberry-lemonade.jpg`      |
| sunrise-strawberry       | italian-ice    | `italian-ice/sunrise-strawberry.jpg`              |
| lemon-drop               | italian-ice    | `italian-ice/lemon-drop.jpg`                      |
| miami-mango              | italian-ice    | `italian-ice/miami-mango.jpg`                     |
| caramel-apple-ice        | italian-ice    | `italian-ice/caramel-apple-ice.jpg`               |
| cotton-candy             | italian-ice    | `italian-ice/cotton-candy.jpg`                    |
| twisted-berry            | italian-ice    | `italian-ice/twisted-berry.jpg`                   |
| island-pina-colada       | italian-ice    | `italian-ice/island-pina-colada.jpg`              |

The folder names must match the category ids in `data/products.ts`
(`MENU_SECTIONS`). Adding a new menu section automatically expects a matching
sub-folder here.

## Photo specs (recommended)

- Format: JPG or PNG, landscape or portrait (cards crop to 4:5 portrait)
- Resolution: ~1080 × 1350 (4:5 portrait) or square 1:1
- Keep each photo under ~500 KB so the menu stays fast

Until a photo exists for a product, its placeholder art from
`public/assets/products/<id>.svg` is displayed — no code changes needed either
way. Photos are detected automatically at runtime and take precedence over
placeholders.

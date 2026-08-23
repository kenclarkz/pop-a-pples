# Product Videos

Every item on the menu page (`/products`) is shown as a looping video.

## Folders

Videos are organised in **one sub-folder per menu category** (the sub-sections
on the menu page), so clips are easy to find:

```
public/assets/products/videos/
├── gourmet-apples/    # Gourmet Apples videos
├── lemonade/          # Lemonade videos
└── italian-ice/       # Italian Ice videos
```

## Naming

One `<product-id>.mp4` per product inside its category folder — the file name
must match the product `id` in `data/products.ts` exactly:

> **Tip:** lowercase `.mp4` is preferred, but the site also picks up any
> extension casing automatically — `.MP4`, `.Mp4`, `.mP4` — as well as other
> formats like `.webm` / `.mov`, so uploads play without renaming.

| Product                  | Category       | File                                              |
| ------------------------ | -------------- | ------------------------------------------------- |
| classic-caramel-apple    | gourmet-apples | `gourmet-apples/classic-caramel-apple.mp4`        |
| candy-apple              | gourmet-apples | `gourmet-apples/candy-apple.mp4`                  |
| dark-chocolate-apple     | gourmet-apples | `gourmet-apples/dark-chocolate-apple.mp4`         |
| toffee-crunch-apple      | gourmet-apples | `gourmet-apples/toffee-crunch-apple.mp4`          |
| confetti-apple           | gourmet-apples | `gourmet-apples/confetti-apple.mp4`               |
| pumpkin-spice-apple      | gourmet-apples | `gourmet-apples/pumpkin-spice-apple.mp4`          |
| candy-cane-apple         | gourmet-apples | `gourmet-apples/candy-cane-apple.mp4`             |
| mango-lemonade           | lemonade       | `lemonade/mango-lemonade.mp4`                     |
| strawberry-lemonade      | lemonade       | `lemonade/strawberry-lemonade.mp4`                |
| lavender-lemonade        | lemonade       | `lemonade/lavender-lemonade.mp4`                  |
| sunrise-strawberry       | italian-ice    | `italian-ice/sunrise-strawberry.mp4`              |
| lemon-drop               | italian-ice    | `italian-ice/lemon-drop.mp4`                      |
| miami-mango              | italian-ice    | `italian-ice/miami-mango.mp4`                     |
| caramel-apple-ice        | italian-ice    | `italian-ice/caramel-apple-ice.mp4`               |
| cotton-candy             | italian-ice    | `italian-ice/cotton-candy.mp4`                    |
| twisted-berry            | italian-ice    | `italian-ice/twisted-berry.mp4`                   |
| island-pina-colada       | italian-ice    | `italian-ice/island-pina-colada.mp4`              |

The folder names must match the category ids in `data/products.ts`
(`MENU_SECTIONS`). Adding a new menu section automatically expects a matching
sub-folder here.

## Video specs (recommended)

- Format: MP4 (H.264), ~5–15 seconds, seamless loop
- Resolution: 1080 × 1350 (4:5 portrait) or square 1:1
- No audio track (videos are muted and autoplay on scroll)
- Keep each clip under ~8 MB so the menu stays fast

Until a video exists for a product, its poster image is displayed instead — a
real photo from `../photos/<category>/<id>.jpg|jpeg|png|webp` when one has
been uploaded, otherwise the generated placeholder
`public/assets/products/<id>.svg|png|jpg`. No code changes are needed either way.

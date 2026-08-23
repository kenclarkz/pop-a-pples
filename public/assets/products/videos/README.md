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

| Product                  | Category       | File                                              |
| ------------------------ | -------------- | ------------------------------------------------- |
| classic-caramel-apple    | gourmet-apples | `gourmet-apples/classic-caramel-apple.mp4`        |
| candy-apple              | gourmet-apples | `gourmet-apples/candy-apple.mp4`                  |
| dark-chocolate-apple     | gourmet-apples | `gourmet-apples/dark-chocolate-apple.mp4`         |
| toffee-crunch-apple      | gourmet-apples | `gourmet-apples/toffee-crunch-apple.mp4`          |
| confetti-apple           | gourmet-apples | `gourmet-apples/confetti-apple.mp4`               |
| pumpkin-spice-apple      | gourmet-apples | `gourmet-apples/pumpkin-spice-apple.mp4`          |
| candy-cane-apple         | gourmet-apples | `gourmet-apples/candy-cane-apple.mp4`             |
| party-apple-box          | gourmet-apples | `gourmet-apples/party-apple-box.mp4`              |
| apple-gift-box           | gourmet-apples | `gourmet-apples/apple-gift-box.mp4`               |
| classic-lemonade         | lemonade       | `lemonade/classic-lemonade.mp4`                   |
| strawberry-lemonade      | lemonade       | `lemonade/strawberry-lemonade.mp4`                |
| lavender-lemonade        | lemonade       | `lemonade/lavender-lemonade.mp4`                  |
| lemon-italian-ice        | italian-ice    | `italian-ice/lemon-italian-ice.mp4`               |
| cherry-italian-ice       | italian-ice    | `italian-ice/cherry-italian-ice.mp4`              |
| mango-chile-italian-ice  | italian-ice    | `italian-ice/mango-chile-italian-ice.mp4`         |
| sunrise-strawberry-ice   | italian-ice    | `italian-ice/sunrise-strawberry-ice.mp4`          |

The folder names must match the category ids in `data/products.ts`
(`MENU_SECTIONS`). Adding a new menu section automatically expects a matching
sub-folder here.

## Video specs (recommended)

- Format: MP4 (H.264), ~5–15 seconds, seamless loop
- Resolution: 1080 × 1350 (4:5 portrait) or square 1:1
- No audio track (videos are muted and autoplay on scroll)
- Keep each clip under ~8 MB so the menu stays fast

Until a video exists for a product, its poster image from
`public/assets/products/<id>.svg|png|jpg` is displayed instead — no code
changes needed either way.

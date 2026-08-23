# Product Videos

Every item on the menu page (`/products`) is shown as a looping video.

## Folder

```
public/assets/products/videos/
```

## Naming

One `<product-id>.mp4` per product — the file name must match the product
`id` in `data/products.ts` exactly:

| Product                  | File                                  |
| ------------------------ | ------------------------------------- |
| classic-caramel-apple    | `classic-caramel-apple.mp4`           |
| candy-apple              | `candy-apple.mp4`                     |
| dark-chocolate-apple     | `dark-chocolate-apple.mp4`            |
| toffee-crunch-apple      | `toffee-crunch-apple.mp4`             |
| confetti-apple           | `confetti-apple.mp4`                  |
| pumpkin-spice-apple      | `pumpkin-spice-apple.mp4`             |
| candy-cane-apple         | `candy-cane-apple.mp4`                |
| party-apple-box          | `party-apple-box.mp4`                 |
| apple-gift-box           | `apple-gift-box.mp4`                  |
| classic-lemonade         | `classic-lemonade.mp4`                |
| strawberry-lemonade      | `strawberry-lemonade.mp4`             |
| lavender-lemonade        | `lavender-lemonade.mp4`               |
| lemon-italian-ice        | `lemon-italian-ice.mp4`               |
| cherry-italian-ice       | `cherry-italian-ice.mp4`              |
| mango-chile-italian-ice  | `mango-chile-italian-ice.mp4`         |

## Video specs (recommended)

- Format: MP4 (H.264), ~5–15 seconds, seamless loop
- Resolution: 1080 × 1350 (4:5 portrait) or square 1:1
- No audio track (videos are muted and autoplay on scroll)
- Keep each clip under ~8 MB so the menu stays fast

Until a video exists for a product, its poster image from
`public/assets/products/<id>.svg|png|jpg` is displayed instead — no code
changes needed either way.

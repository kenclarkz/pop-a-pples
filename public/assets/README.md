# Public Assets

This folder contains all static assets served directly by Next.js.

## Structure

```
public/assets/
├── brand/
│   ├── logo.svg               # Vector logo (used for the OG/social card)
│   ├── logo.png               # Business logo (nav, footer, favicon source)
│   └── mark.svg               # Logo mark
├── products/                  # Product poster images (generated placeholders)
│   ├── classic-caramel-apple.svg
│   ├── candy-apple.svg
│   ├── candy-cane-apple.svg
│   ├── confetti-apple.svg
│   ├── dark-chocolate-apple.svg
│   ├── toffee-crunch-apple.svg
│   ├── pumpkin-spice-apple.svg
│   ├── party-apple-box.svg
│   ├── apple-gift-box.svg
│   ├── mango-lemonade.svg
│   ├── strawberry-lemonade.svg
│   ├── lavender-lemonade.svg
│   ├── sunrise-strawberry.svg
│   ├── lemon-drop.svg
│   ├── miami-mango.svg
│   ├── caramel-apple-ice.svg
│   ├── cotton-candy.svg
│   ├── twisted-berry.svg
│   ├── island-pina-colada.svg
│   └── videos/                # Looping menu videos in category sub-folders
│       ├── gourmet-apples/    #   one <product-id>.mp4 each (see videos/README.md)
│       ├── lemonade/
│       └── italian-ice/
├── photos/                      # Real product photos in category sub-folders
│   ├── gourmet-apples/          #   one <product-id>.jpg|jpeg|png|webp each
│   │                            #   (see photos/README.md) — auto-detected
│   │                            #   as the poster/fallback for the product video
│   ├── lemonade/
│   └── italian-ice/
├── journey/                   # Chapter photos for the scroll journey
│   ├── hero.png/.svg          # Scene 1 — The Apple (full-screen backdrop)
│   ├── orchard.png/.svg       # Scene 2 — The Orchard
│   ├── dip.png/.svg           # Scene 3 — The Dip
│   ├── toppings.png/.svg      # Scene 4 — The Toppings
│   ├── set.png/.svg           # Scene 5 — The Set
│   └── (reveal needs no photo — it's the 3D scene)
├── apple/                     # 3D reveal apple GLB
│   └── apple.glb              # Drop your Blender export here
├── video/                     # Hero scrub video
│   ├── POP.mp4                # HEVC/H.265 (Safari)
│   ├── POP-h264.mp4           # H.264 fallback (mobile/desktop/Android)
│   └── POP-poster.jpg         # Poster frame
└── sequences/                 # PNG sequences / MP4 clips (see its README)
```

## Automatic Asset Detection

Components use `<ModelOrFallback>` (3D) and asset-existence checks (photos/video)
that probe for files at runtime via `fetch(..., { method: 'HEAD' })`.

**To replace a placeholder:**
1. Drop your real asset in the correct folder with the exact filename above
2. The component automatically uses the real asset instead of the procedural/placeholder
3. No code changes needed

Placeholder media is regenerated with `node tools/generate-placeholders.mjs`.

## Blender Export Guidelines

See [BLENDER_GUIDE.md](../../BLENDER_GUIDE.md) for complete specifications:
- Units: **Meters** (1 Blender unit = 1 meter)
- Scale reference: reveal apple ~0.12m tall (caramel-apple size, on its stem axis)
- Pivot point: apple body base at y=0
- Materials: Standard Principled BSDF (our lighting rig overrides)
- No lights/cameras needed in GLB

## Hero Video Notes

The hero falls back to a Ken Burns zoom on `public/assets/journey/hero.png`
when no video is present, so the homepage always looks finished.

## PNG Sequences

For scroll-scrubbed cinematics:
```
public/assets/sequences/<scene>/
  ├── frame-0001.png
  ├── frame-0002.png
  └── ...
```

Name frames sequentially with zero-padded numbers. Update `frameCount` in the
corresponding sequence component.

## Cache Headers (Vercel/Netlify)

Assets in `public/` are served with long-term caching:
```
Cache-Control: public, max-age=31536000, immutable
```

## Development

Assets in `public/` are served at `/assets/...` during `npm run dev` and copied
to the build output.

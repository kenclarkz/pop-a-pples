# Pop-a-pples — Blender Asset Integration Guide

This document explains how to replace procedural 3D placeholders with production Blender assets (GLB models, PNG image sequences, MP4 cinematic clips).

---

## 📁 Asset Folder Structure

```
public/assets/
├── apple/
│   ├── apple.glb              # Reveal apple (Scene 6 — full-screen 3D)
│   └── README.md
├── journey/
│   ├── hero.png               # Scene 1 photo backdrop (or PNG/WebP)
│   ├── orchard.png            # Scene 2 photo backdrop
│   ├── dip.png                # Scene 3 photo backdrop
│   ├── toppings.png           # Scene 4 photo backdrop
│   ├── set.png                # Scene 5 photo backdrop
│   └── (reveal uses the 3D scene — no photo needed)
├── products/
│   ├── classic-caramel-apple.svg  # Product card images (SVG/PNG)
│   ├── candy-apple.svg
│   ├── candy-cane-apple.svg
│   ├── confetti-apple.svg
│   ├── dark-chocolate-apple.svg
│   ├── toffee-crunch-apple.svg
│   ├── pumpkin-spice-apple.svg
│   ├── party-apple-box.svg
│   ├── apple-gift-box.svg
│   └── README.md
├── video/
│   ├── POP.mp4                # Hero scrub video (HEVC)
│   ├── POP-h264.mp4           # Hero scrub video (H.264)
│   └── POP-poster.jpg
└── sequences/
    ├── apple-arrive/          # PNG sequence or MP4 for Scene 1
    │   ├── frame-0001.png
    │   └── ...
    ├── orchard/               # Scene 2 sequence
    ├── dip/                   # Scene 3 sequence
    ├── toppings/              # Scene 4 sequence
    ├── set/                   # Scene 5 sequence
    ├── reveal/                # Scene 6 sequence
    └── README.md
```

---

## 🔄 How Asset Replacement Works

### 1. GLB Models (Automatic Detection)

The 3D reveal wraps its mesh in `<ModelOrFallback>`:

```tsx
// components/Flan3D.tsx (the reveal canvas)
<ModelOrFallback url="/assets/apple/apple.glb">
  <ProceduralCaramelApple />
</ModelOrFallback>
```

**To use a Blender GLB:**
1. Export your model as `.glb` (glTF Binary) from Blender
2. Place it at `public/assets/apple/apple.glb`
3. The component will **automatically detect** it at runtime (HEAD request)
4. If found → renders the GLB; if not → falls back to procedural mesh

**Requirements for GLB:**
- Units: **meters** (1 Blender unit = 1 meter)
- Scale: reveal apple ~0.12m tall (a hand-held caramel apple)
- Pivot: apple body base at y=0 (stem pointing up)
- Materials: use standard PBR (Principled BSDF) — they'll be overridden by our lighting rig
- No need for lights/cameras in the GLB — we provide our own

### 2. Chapter Photo Backdrops (Automatic Detection)

Each scroll chapter checks for a photo at `public/assets/journey/<slug>.{png,jpg,jpeg,webp}`.
If present it renders full-screen (with a gradient vignette) behind the chapter copy;
otherwise it uses the generated placeholder SVG/PNG. Drop a photo in and it replaces
the placeholder instantly — no code changes.

### 3. PNG Image Sequences (Scroll-Scrubbed Cinematics)

For fully pre-rendered cinematic sequences driven by scroll:

```tsx
// components/sequence/ImageSequencePlayer.tsx
import { useFrame } from '@react-three/fiber'
import { usePinnedScene } from '@/lib/usePinnedScene'

export function ImageSequencePlayer({ folder, frameCount, digits = 4 }) {
  const { progressRef } = usePinnedScene(containerRef, { end: '+=250%' })
  const [texture, setTexture] = useState(null)

  useFrame(() => {
    const p = progressRef.current
    const frame = Math.min(frameCount - 1, Math.floor(p * frameCount))
    const url = `/assets/sequences/${folder}/frame-${String(frame + 1).padStart(digits, '0')}.png`
    // Load texture if changed...
  })

  return <mesh><planeGeometry/><meshBasicMaterial map={texture}/></mesh>
}
```

**To use:**
1. Render your Blender animation as PNG sequence (transparent background preferred)
2. Name frames: `frame-0001.png`, `frame-0002.png`, …
3. Place in `public/assets/sequences/<scene-name>/`
4. Update `frameCount` in the component
5. The sequence scrubs perfectly with scroll progress

### 4. MP4 Cinematic Clips

For non-interactive cinematic playback (e.g., hero background):

```tsx
// components/sequence/VideoBackground.tsx
export function VideoBackground({ src, className }) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
    />
  )
}
```

Place MP4 in `public/assets/sequences/` and reference it.

---

## 🎨 Blender Production Guidelines

### Modeling
| Asset | Target Scale | Poly Budget (LOD0) | Notes |
|-------|--------------|-------------------|-------|
| Apple (reveal) | 0.12m tall | ~8k tris | Separate meshes: apple body, stem, leaf, caramel cap, drips |

### Materials (Blender Principled BSDF)
| Surface | Base Color | Roughness | Transmission | Clearcoat | Notes |
|---------|------------|-----------|--------------|-----------|-------|
| Apple skin (crimson) | `#B5202E` | 0.35 | 0.0 | 0.6 | Subsurface: 0.2, radius 0.03 |
| Stem | `#5C3A21` | 0.7 | 0.0 | 0.0 | —
| Leaf | `#3C7F3C` | 0.5 | 0.0 | 0.3 | —
| Caramel (cap/drips) | `#C8894B` | 0.12 | 0.15 | 0.95 | Thickness 0.4, IOR 1.52 |
| Toppings (crunch) | `#A8873F` | 0.5 | 0.0 | 0.0 | Small bumps/particles |

### Lighting Setup (for reference renders)
We use a custom studio rig in-code (no HDR needed). For Blender lookdev:
- Key: Area light 5m, 5000K, 500W, 45°
- Fill: Area light 3m, 6500K, 100W, opposite side
- Rim: Strip light behind, 4000K, 200W
- Environment: Studio HDRI (optional) or our procedural `StudioEnv`

### Animation Export
- **Frame rate**: 30 fps
- **Duration per scene**: ~8–12 seconds at 30fps = 240–360 frames
- **Export**: PNG sequence (RGBA) or MP4 (H.264, high bitrate)
- **Camera**: Match our camera paths (see Scene Camera Paths below)

---

## 📹 Scene Camera Paths (for Blender Animation)

All cameras use **vertical FOV 35°**. Coordinates in meters, Y-up. The apple is a
hand-held scale object (~0.12m), so the camera is close-in.

### Scene 1: The Apple (0–100% progress)
| Progress | Position (x, y, z) | Look At | Notes |
|----------|-------------------|---------|-------|
| 0% | (0, 0.16, 0.64) | (0, 0.07, 0) | Wide hero |
| 30% | (-0.03, 0.16, 0.52) | (0, 0.07, 0) | Drift left |
| 60% | (-0.05, 0.15, 0.44) | (0, 0.07, 0) | Close hero |
| 100% | (-0.05, 0.15, 0.42) | (0, 0.07, 0) | Final rest |

Apple rotates Y: 0 → 0.6 rad over full progress.

### Scene 2: The Orchard
Camera orbits slowly around the apple (radius 0.56 → 0.47, height 0.1 → 0.11).

### Scene 3: The Dip
| Progress | Position | Look At | Notes |
|----------|----------|---------|-------|
| 0% | (0, 0.15, 0.32) | (0, 0.09, 0) | Front view |
| 50% | (0.03, 0.15, 0.2) | (0, 0.09, 0) | Side |
| 75% | (0, 0.14, 0.1) | (0, 0.09, 0) | Caramel close-up |
| 100% | (0, 0.14, 0.25) | (0, 0.09, 0) | Pull back |

### Scene 4: The Toppings
Camera arcs from the caramel pot (z=0.36) to the apple (z=0.13), height 0.14 → 0.12.

### Scene 5: The Set
| Progress | Position | Look At |
|----------|----------|---------|
| 0% | (0, 0.12, 0.42) | (0, 0.08, 0.01) |
| 50% | (0, 0.13, 0.3) | (0, 0.08, 0.01) |
| 100% | (0, 0.12, 0.36) | (0, 0.09, 0.01) |

### Scene 6: The Reveal
Slow orbit: radius 0.6, height 0.12, 360° over full progress.

---

## 🛠️ Development Workflow

### 1. Local Development with Assets
```bash
# Place GLB files in public/assets/... — they hot-reload on save
npm run dev
```

### 2. Preload Assets (Optional)
In `components/three/GlbModel.tsx`:
```tsx
useGLTF.preload('/assets/apple/apple.glb')
```

### 3. Testing Fallbacks
Rename or remove a GLB/photo to verify the procedural/placeholder fallback renders correctly.

### 4. Performance Budgets
| Device | Target FPS | DPR | Particles | Shadow Map |
|--------|------------|-----|-----------|------------|
| Desktop | 60 | 1.75 | Full | 1024 |
| Mobile | 60 | 1.5 | 50% | 512 |
| Low-end | 30 | 1.0 | 25% | 256 |

The `GatedCanvas` component auto-pauses rendering when off-screen.

---

## 📦 Deploying to Production

### Vercel (Recommended)
```bash
vercel --prod
```
- Assets in `public/` are served from Vercel Edge Network
- GLB/PNG/MP4 cached with `Cache-Control: public, max-age=31536000, immutable`

### Static Export (GitHub Pages / Netlify)
```bash
# next.config.mjs
output: 'export',
images: { unoptimized: true }
```
```bash
npm run build
```
- Works for GLB/PNG/MP4 in `public/`
- No server-side features (cart uses localStorage only)

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🔧 Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| GLB not loading | Wrong path / 404 | Check `public/assets/` path matches exactly; case-sensitive on Linux |
| GLB renders black | Missing normals / flipped faces | In Blender: `Mesh → Normals → Recalculate Outside` |
| GLB too big/small | Unit mismatch | Blender: Scene Units → Metric → Meters; apply scale (Ctrl+A) |
| PNG sequence stutters | Too many frames / large files | Compress PNGs (oxipng), reduce frame count, use WebP sequence |
| MP4 won't autoplay | Browser policy | Must be `muted`, `playsInline`, no audio track |
| Shadows pixelated | Low shadow map res | Increase `ContactShadows resolution` prop (max 1024) |
| Mobile crashes | OOM / too many tris | Enable `useIsMobile()` quality scaling; reduce GLB LOD |

---

## 📚 Further Reading

- [Three.js GLTFLoader docs](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [React Three Fiber GLB loading](https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)

---

*Generated for Pop-a-pples — last updated 2026*

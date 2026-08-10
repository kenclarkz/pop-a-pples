# Image Sequences & Cinematic Clips

Place PNG sequences or MP4 files here for fully pre-rendered cinematic playback.

## Folder Structure
```
sequences/
├── apple-arrive/        # Scene 1 — The Apple
│   ├── frame-0001.png
│   ├── frame-0002.png
│   └── ...
├── orchard/             # Scene 2 — The Orchard
├── dip/                 # Scene 3 — The Dip
├── toppings/            # Scene 4 — The Toppings
├── set/                 # Scene 5 — The Set
└── reveal/              # Scene 6 — The Reveal (3D)
```

## PNG Sequence Specifications
- **Format**: PNG (RGBA) or WebP
- **Resolution**: 1920×1080 (or 3840×2160 for 4K)
- **Frame rate**: 30 fps
- **Duration**: ~8–12 seconds per scene (240–360 frames)
- **Background**: Transparent (for compositing over our gradient) or with baked background
- **Naming**: `frame-0001.png`, `frame-0002.png`, ... (zero-padded to 4 digits)

## MP4 Specifications
- **Codec**: H.264 (High Profile)
- **Resolution**: 1920×1080 or 3840×2160
- **Frame rate**: 30 fps
- **Bitrate**: 15–25 Mbps (1080p) / 35–50 Mbps (4K)
- **Audio**: None (or muted)
- **Filename**: `cinematic.mp4` in each scene folder

## Integration
To use a sequence, update the corresponding scene component to use `ImageSequencePlayer` or `VideoBackground` from `components/sequence/` (create these components based on the patterns in `BLENDER_GUIDE.md`).

Example for scroll-scrubbed PNG sequence:
```tsx
import { usePinnedScene } from '@/lib/usePinnedScene'

function AppleArriveSequence() {
  const { progressRef } = usePinnedScene(ref, { end: '+=240%' })
  const frame = Math.min(300, Math.floor(progressRef.current * 300))
  return <img src={`/assets/sequences/apple-arrive/frame-${String(frame+1).padStart(4,'0')}.png`} />
}
```

## Performance Tips
- Compress PNGs with `oxipng -o 4` or use WebP
- For mobile, serve lower-res sequences via `srcSet` or separate folders
- Consider lazy-loading: only load sequence when section is near viewport
- Total sequence size target: <50MB per scene for smooth streaming

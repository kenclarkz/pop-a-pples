# Hero Scroll Video

The homepage hero is a scroll-scrubbed video — it plays forward and back as
you scroll. Drop your clip here:

```
public/assets/video/POP.mp4
```

`components/ScrollVideo.tsx` auto-detects the file and maps its `currentTime`
to scroll position. If the file is missing or unplayable, the hero falls back
to a Ken Burns zoom on `public/assets/journey/hero.png`.

## Tips for a smooth, mobile-friendly clip

- **Aspect ratio**: 16:9 landscape fills the full screen on desktop
  (`object-cover`); mobile uses a contained, slightly zoomed frame
  (`object-contain` with 1.3× scale) so nothing is cropped.
- **Codec**: H.264 (High Profile) plays everywhere. HEVC plays on Safari/iPhone
  but needs an H.264 copy elsewhere — a single `POP.mp4` in H.264 is the safest.
- **Bitrate**: keep it reasonable (~10–20 Mbps at 1080p) so mobile scrub
  stays smooth on cellular connections.
- **Duration**: ~8–12 s reads best at the current scrub distances.
- **No audio track** (the clip is muted in the UI).

The scrub distance is shorter on mobile (`170svh` vs `300svh` on desktop) and
Lenis touch smoothing is enabled (`lib/lenis.ts`), so the video tracks the
finger smoothly on phones.

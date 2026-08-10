/**
 * Generates all placeholder media for the Pop-a-pples template:
 *
 *   - brand mark + logo (SVG + PNG + favicon)
 *   - journey chapter backdrops (SVG + PNG)
 *   - product card images (SVG)
 *
 * Usage:
 *   node tools/generate-placeholders.mjs
 *
 * PNGs (needed by the journey texture loader + favicon) are rasterised from
 * the SVGs using macOS `sips` when available, otherwise skipped.
 *
 * Swap any of these for real photography / 3D renders whenever you like — the
 * site auto-detects the real assets by filename.
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = join(ROOT, 'public', 'assets')

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const C = {
  bgTop: '#241509',
  bgBottom: '#120C08',
  cream: '#F6EFE3',
  gold: '#C9A96A',
  red: '#C8402E',
  redLight: '#D9502F',
  redDark: '#A62E20',
  caramel: '#C8894B',
  caramelLight: '#D9A36A',
  caramelDark: '#A96A2F',
  cocoa: '#4A3224',
  espresso: '#1B120C',
  leaf: '#4E9C4E',
  leafDark: '#3C7F3C',
  stem: '#6B4226',
  chocolate: '#3A2215',
  white: '#FBF7EE',
  blush: '#E9C3B0',
}

/* ------------------------------------------------------------------ */
/* SVG building blocks                                                 */
/* ------------------------------------------------------------------ */

const APPLE_PATH =
  'M100 155 C 60 155 30 120 30 82 C 30 40 70 22 100 55 C 130 22 170 40 170 82 C 170 120 140 155 100 155 Z'

function background(w, h) {
  return `
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="80%">
      <stop offset="0%" stop-color="${C.bgTop}"/>
      <stop offset="100%" stop-color="${C.bgBottom}"/>
    </radialGradient>
    <radialGradient id="halo" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${C.red}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${C.red}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#halo)"/>`
}

function appleShape({ cx = 0, cy = 0, s = 1, body = C.red, shade = C.redLight, stem = true, leaf = true } = {}) {
  return `
    <g transform="translate(${cx} ${cy}) scale(${s})">
      <path d="${APPLE_PATH}" fill="${body}" transform="translate(-100 -100)"/>
      <path d="${APPLE_PATH}" fill="${shade}" transform="translate(-88 -106) scale(0.9)"/>
      ${stem ? `<rect x="-4" y="-150" width="9" height="40" rx="4.5" fill="${C.stem}" transform="rotate(12)"/>` : ''}
      ${leaf ? `<path d="M0 -130 Q -45 -185 -90 -170 Q -45 -150 0 -130 Z" fill="${C.leaf}"/>` : ''}
    </g>`
}

function caramelDrips({ x = 0, y = 0, s = 1, w = 8, len = 40, color = C.caramel } = {}) {
  return Array.from({ length: 5 }, (_, i) => {
    const dx = (i - 2) * 14
    const l = len + ((i * 7) % 24)
    return `<rect x="${x + dx - w / 2}" y="${y}" width="${w}" height="${l}" rx="${w / 2}" fill="${color}" transform="scale(${s})" style="transform-origin:center"/>`
  }).join('\n')
}

function sprinkles({ cx = 0, cy = 0, colors = ['#F6EFE3', '#C9A96A', '#4E9C4E', '#C8402E'], n = 18, r = 90 } = {}) {
  const out = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rr = r * (0.55 + 0.45 * Math.abs(Math.sin(i * 2.7)))
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    const c = colors[i % colors.length]
    out.push(`<rect x="${x - 3}" y="${y - 1}" width="6" height="2" rx="1" fill="${c}" transform="rotate(${(i * 47) % 180} ${x} ${y})"/>`)
  }
  return out.join('\n')
}

function appleMark(size, { bg = true } = {}) {
  const inner = size * 0.78
  const s = inner / 200
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
${bg ? `<rect width="${size}" height="${size}" fill="${C.espresso}"/>` : ''}
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.46}" fill="${C.bgTop}" stroke="${C.gold}" stroke-width="${size * 0.02}"/>
${appleShape({ cx: size / 2, cy: size / 2 + size * 0.04, s })}
</svg>`
}

function productSvg(id, label, render) {
  const W = 600
  const safeLabel = String(label).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
${background(W, W)}
${render(W)}
  <text x="300" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="${C.gold}" opacity="0.75">${safeLabel}</text>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

function generateBrand() {
  const dir = join(ASSETS, 'brand')
  mkdirSync(dir, { recursive: true })
  const logo = appleMark(512)
  writeFileSync(join(dir, 'logo.svg'), logo)
  writeFileSync(join(dir, 'mark.svg'), appleMark(64, { bg: false }))
  rasterise(join(dir, 'logo.svg'), 512)
  rasterise(join(dir, 'logo.svg'), 256, join(ROOT, 'app', 'icon.png'))
}

function generateJourney() {
  const dir = join(ASSETS, 'journey')
  mkdirSync(dir, { recursive: true })
  const W = 1600
  const H = 900
  const scenes = {
    hero: (W) => `
      ${appleShape({ cx: W / 2, cy: H * 0.52, s: 4.4 })}
      ${caramelDrips({ x: W / 2 - 90, y: H * 0.5, s: 4.4, w: 8, len: 46, color: C.caramel })}
      <ellipse cx="${W / 2}" cy="${H * 0.86}" rx="${W * 0.28}" ry="${H * 0.05}" fill="${C.cocoa}" opacity="0.55"/>
      <text x="${W / 2}" y="${H * 0.16}" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="${C.cream}" opacity="0.85">Chapter 01 — The Apple</text>
      <text x="${W / 2}" y="${H * 0.22}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="20" letter-spacing="6" fill="${C.gold}" opacity="0.6">POP-A-PPLES</text>`,
    orchard: (W) => `
      <g transform="translate(${W * 0.18} ${H * 0.4}) rotate(-28)">${appleShape({ s: 1.7 })}</g>
      <g transform="translate(${W * 0.82} ${H * 0.34}) rotate(24) scale(1.3)">${appleShape({ s: 1.3, body: C.caramel, shade: C.caramelLight })}</g>
      ${appleShape({ cx: W / 2, cy: H * 0.52, s: 3.4 })}
      <path d="M0 ${H} L${W * 0.25} ${H * 0.82} L${W * 0.5} ${H} Z" fill="${C.leafDark}" opacity="0.5"/>
      <path d="M${W} ${H} L${W * 0.7} ${H * 0.85} L${W * 0.45} ${H} Z" fill="${C.leaf}" opacity="0.35"/>
      <text x="${W / 2}" y="${H * 0.16}" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="${C.cream}" opacity="0.85">Chapter 02 — The Orchard</text>`,
    dip: (W) => `
      <rect x="${W * 0.18}" y="${H * 0.62}" width="${W * 0.64}" height="${H * 0.2}" rx="40" fill="${C.caramel}" opacity="0.9"/>
      ${appleShape({ cx: W / 2, cy: H * 0.4, s: 3.6 })}
      <rect x="${W / 2 - 12}" y="${H * 0.06}" width="24" height="${H * 0.3}" rx="12" fill="${C.stem}"/>
      <text x="${W / 2}" y="${H * 0.86}" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="${C.cream}" opacity="0.85">Chapter 03 — The Dip</text>`,
    toppings: (W) => `
      ${appleShape({ cx: W / 2, cy: H * 0.48, s: 3.9 })}
      ${sprinkles({ cx: W / 2, cy: H * 0.48, n: 26, r: 240 })}
      <g transform="translate(${W / 2 - 210} ${H * 0.48}) rotate(-20)"><rect width="70" height="48" rx="12" fill="${C.caramelDark}" opacity="0.9"/></g>
      <g transform="translate(${W / 2 + 170} ${H * 0.5}) rotate(18)"><rect width="64" height="44" rx="12" fill="${C.chocolate}" opacity="0.9"/></g>
      <text x="${W / 2}" y="${H * 0.16}" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="${C.cream}" opacity="0.85">Chapter 04 — The Toppings</text>`,
    set: (W) => `
      <ellipse cx="${W / 2}" cy="${H * 0.78}" rx="${W * 0.34}" ry="${H * 0.05}" fill="${C.cocoa}" opacity="0.5"/>
      ${appleShape({ cx: W / 2, cy: H * 0.5, s: 3.9 })}
      <rect x="${W * 0.36}" y="${H * 0.12}" width="${W * 0.28}" height="${H * 0.03}" rx="14" fill="${C.gold}" opacity="0.35"/>
      <rect x="${W * 0.4}" y="${H * 0.18}" width="${W * 0.2}" height="${H * 0.025}" rx="12" fill="${C.gold}" opacity="0.25"/>
      <text x="${W / 2}" y="${H * 0.9}" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="${C.cream}" opacity="0.85">Chapter 05 — The Set</text>`,
  }
  for (const [slug, render] of Object.entries(scenes)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${background(W, H)}\n${render(W)}\n</svg>`
    const p = join(dir, `${slug}.svg`)
    writeFileSync(p, svg)
    rasterise(p, 1600)
  }
}

function generateProducts() {
  const dir = join(ASSETS, 'products')
  mkdirSync(dir, { recursive: true })
  const P = [
    {
      id: 'classic-caramel-apple',
      label: 'Classic Caramel',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: C.red, shade: C.redLight })}
        ${caramelDrips({ x: W / 2 - 34, y: W * 0.42, s: 1.95, w: 7, len: 42, color: C.caramel })}
        <g fill="${C.cream}" opacity="0.9">
          <circle cx="${W / 2 - 40}" cy="${W * 0.62}" r="2.5"/><circle cx="${W / 2 + 30}" cy="${W * 0.6}" r="2.5"/>
          <circle cx="${W / 2 + 5}" cy="${W * 0.66}" r="2.5"/><circle cx="${W / 2 - 12}" cy="${W * 0.63}" r="2"/>
        </g>`,
    },
    {
      id: 'candy-apple',
      label: 'Candy Apple',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: C.red, shade: C.redLight })}
        <path d="M${W / 2 - 120} ${W * 0.32} Q${W / 2 - 70} ${W * 0.18} ${W / 2 - 20} ${W * 0.24}" stroke="${C.cream}" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.5"/>
        <path d="M${W / 2 + 80} ${W * 0.4} Q${W / 2 + 120} ${W * 0.3} ${W / 2 + 150} ${W * 0.38}" stroke="${C.cream}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.35"/>`,
    },
    {
      id: 'dark-chocolate-apple',
      label: 'Dark Chocolate & Sea Salt',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: C.chocolate, shade: C.cocoa })}
        <path d="M${W / 2 - 90} ${W * 0.42} Q${W / 2 - 40} ${W * 0.5} ${W / 2 + 10} ${W * 0.42}" stroke="${C.white}" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.75"/>
        <path d="M${W / 2 + 30} ${W * 0.5} Q${W / 2 + 80} ${W * 0.58} ${W / 2 + 130} ${W * 0.5}" stroke="${C.white}" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.55"/>
        <g fill="${C.cream}" opacity="0.9">
          <circle cx="${W / 2 - 70}" cy="${W * 0.6}" r="2.5"/><circle cx="${W / 2 + 60}" cy="${W * 0.66}" r="2.5"/><circle cx="${W / 2}" cy="${W * 0.7}" r="2.5"/>
        </g>`,
    },
    {
      id: 'toffee-crunch-apple',
      label: 'Toffee Crunch',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: C.caramel, shade: C.caramelLight })}
        ${[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2
          const x = W / 2 + Math.cos(a) * 150
          const y = W * 0.44 + Math.sin(a) * 150
          return `<rect x="${x - 18}" y="${y - 12}" width="36" height="24" rx="7" fill="${C.caramelDark}" transform="rotate(${i * 41} ${x} ${y})" opacity="0.9"/>`
        }).join('')}`,
    },
    {
      id: 'confetti-apple',
      label: 'White Chocolate Confetti',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: C.white, shade: '#E7DDC8' })}
        ${sprinkles({ cx: W / 2, cy: W * 0.44, n: 24, r: 150 })}
        ${sprinkles({ cx: W / 2, cy: W * 0.44, n: 12, r: 90 })}`,
    },
    {
      id: 'pumpkin-spice-apple',
      label: 'Pumpkin Spice',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: '#C0692E', shade: C.caramelLight })}
        ${sprinkles({ cx: W / 2, cy: W * 0.44, colors: ['#6B4226', '#C8894B', '#4E9C4E', '#A62E20'], n: 16, r: 150 })}
        <g transform="translate(${W / 2 + 120} ${W * 0.28}) rotate(20)"><path d="M0 0 Q 40 -40 80 0 Q 40 40 0 0 Z" fill="${C.leaf}"/></g>`,
    },
    {
      id: 'candy-cane-apple',
      label: 'Candy Cane',
      render: (W) => `
        ${appleShape({ cx: W / 2, cy: W * 0.44, s: 1.95, body: C.white, shade: '#E7DDC8' })}
        <g clip-path="url(#candyClip)">
          <rect x="${W / 2 - 190}" y="${W * 0.34}" width="380" height="26" fill="${C.red}" opacity="0.85"/>
          <rect x="${W / 2 - 190}" y="${W * 0.44}" width="380" height="26" fill="${C.red}" opacity="0.85"/>
          <rect x="${W / 2 - 190}" y="${W * 0.54}" width="380" height="26" fill="${C.red}" opacity="0.85"/>
          <clipPath id="candyClip"><path d="${APPLE_PATH}" transform="translate(${W / 2 - 100} ${W * 0.44 - 100}) scale(1.95)"/></clipPath>
        </g>`,
    },
    {
      id: 'party-apple-box',
      label: 'The Orchard Party Box',
      render: (W) => `
        <rect x="${W * 0.16}" y="${W * 0.3}" width="${W * 0.68}" height="${W * 0.46}" rx="22" fill="${C.caramelDark}"/>
        <rect x="${W * 0.18}" y="${W * 0.34}" width="${W * 0.64}" height="${W * 0.4}" rx="16" fill="${C.stem}"/>
        ${[0, 1, 2, 3, 4].map((i) => {
          const col = i % 3
          const row = Math.floor(i / 3)
          const x = W * 0.3 + col * W * 0.2
          const y = W * 0.5 - row * W * 0.16
          const body = [C.red, C.caramel, C.chocolate][i % 3]
          return appleShape({ cx: x, cy: y, s: 0.42, body, shade: C.redLight })
        }).join('')}
        <text x="${W / 2}" y="${W * 0.86}" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="${C.gold}" opacity="0.9">Party Box</text>`,
    },
    {
      id: 'apple-gift-box',
      label: 'The Apple Gift Box',
      render: (W) => `
        <rect x="${W * 0.2}" y="${W * 0.44}" width="${W * 0.6}" height="${W * 0.34}" rx="14" fill="${C.caramelLight}"/>
        <rect x="${W * 0.43}" y="${W * 0.42}" width="${W * 0.14}" height="${W * 0.38}" fill="${C.red}"/>
        <rect x="${W * 0.2}" y="${W * 0.56}" width="${W * 0.6}" height="${W * 0.08}" fill="${C.red}"/>
        <path d="M${W * 0.5} ${W * 0.44} Q ${W * 0.5} ${W * 0.3} ${W * 0.62} ${W * 0.24}" stroke="${C.gold}" stroke-width="8" stroke-linecap="round" fill="none"/>
        ${appleShape({ cx: W * 0.32, cy: W * 0.3, s: 0.7, body: C.red, shade: C.redLight })}
        ${appleShape({ cx: W * 0.62, cy: W * 0.34, s: 0.55, body: C.caramel, shade: C.caramelLight })}`,
    },
  ]

  for (const p of P) {
    writeFileSync(join(dir, `${p.id}.svg`), productSvg(p.id, p.label, p.render))
  }
}

/* ------------------------------------------------------------------ */
/* Rasterisation (macOS sips — preserves aspect ratio)                 */
/* ------------------------------------------------------------------ */

function rasterise(svgPath, size, outPath = null) {
  const target = outPath || svgPath.replace(/\.svg$/, '.png')
  try {
    execSync(`sips -s format png -Z ${size} "${svgPath}" --out "${target}"`, { stdio: 'ignore' })
    console.log(`  png  -> ${target}`)
  } catch {
    console.warn(`  ! sips unavailable — skipping rasterisation of ${svgPath}`)
  }
}

/* ------------------------------------------------------------------ */

console.log('Generating brand assets…')
generateBrand()
console.log('Generating journey backdrops…')
generateJourney()
console.log('Generating product images…')
generateProducts()
console.log('Done.')

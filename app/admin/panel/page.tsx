'use client'

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Loader2,
  LogOut,
  Save,
  UploadCloud,
  Video,
  Image as ImageIcon,
  X,
  Info,
} from 'lucide-react'
import { BASE_PATH } from '@/lib/paths'
import { cn } from '@/lib/utils'

const AUTH_KEY = 'popa-pples-admin-auth'
const TOKEN_KEY = 'popa-pples-admin-token'
const REPO_KEY = 'popa-pples-admin-repo'
const BRANCH = 'main'

const VIDEO_TARGETS = [
  { path: 'public/assets/video/POP.mp4', label: 'POP.mp4 — primary hero video' },
  { path: 'public/assets/video/POP-h264.mp4', label: 'POP-h264.mp4 — mobile/compatibility copy' },
]
const POSTER_TARGET = 'public/assets/video/POP-poster.jpg'
const SITE_FILE = 'data/site.ts'
const MAX_VIDEO_BYTES = 70 * 1024 * 1024

type Status = { type: 'ok' | 'error' | 'info'; text: string } | null

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

function b64ToUtf8(b64: string): string {
  const bin = atob(b64)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function utf8ToB64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach((b) => {
    bin += String.fromCharCode(b)
  })
  return btoa(bin)
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function ghGet(owner: string, repo: string, path: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Request failed (${res.status})`)
  }
  return res.json()
}

async function ghPut(
  owner: string,
  repo: string,
  path: string,
  token: string,
  contentB64: string,
  message: string
) {
  const existing = await ghGet(owner, repo, path, token)
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: contentB64,
        branch: BRANCH,
        ...(existing ? { sha: existing.sha } : {}),
      }),
    }
  )
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Upload failed (${res.status})`)
  }
  return res.json()
}

function setField(source: string, field: string, value: string) {
  const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const re = new RegExp(`(${field}:\\s*['"])[^'"]*(['"])`)
  return source.replace(re, `$1${escaped}$2`)
}

function extractField(source: string, field: string): string {
  const m = source.match(new RegExp(`${field}:\\s*['"]([^'"]*)['"]`))
  return m ? m[1] : ''
}

const isVideoFile = (f: File) =>
  f.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|m4a)$/i.test(f.name)
const isImageFile = (f: File) =>
  f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name)

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function StatusBanner({ status }: { status: Status }) {
  if (!status) return null
  const isOk = status.type === 'ok'
  const isErr = status.type === 'error'
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm',
        isOk && 'border-leaf/30 bg-leaf/10 text-leaf',
        isErr && 'border-crimson/30 bg-crimson/10 text-crimson-light',
        status.type === 'info' && 'border-gold/30 bg-gold/10 text-gold'
      )}
      role={isErr ? 'alert' : 'status'}
    >
      {isOk && <CheckCircle2 className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />}
      {isErr && <AlertTriangle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />}
      {status.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />}
      <span>{status.text}</span>
    </div>
  )
}

function Dropzone({
  icon,
  title,
  hint,
  file,
  onFile,
  dragging,
  setDragging,
  disabled,
}: {
  icon: React.ReactNode
  title: string
  hint: string
  file: File | null
  onFile: (f: File | null) => void
  dragging: boolean
  setDragging: (v: boolean) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'group rounded-3xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-all duration-300',
        dragging
          ? 'border-gold bg-gold/10'
          : 'border-cream/20 bg-cream/[0.02] hover:border-gold/60 hover:bg-cream/[0.05]',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={title.toLowerCase().includes('video') ? 'video/*,.mp4,.mov,.webm' : 'image/*,.jpg,.jpeg,.png,.webp'}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          {icon}
          <div className="text-left">
            <p className="text-cream text-sm font-medium break-all">{file.name}</p>
            <p className="text-xs text-cream/50 mt-0.5">{formatBytes(file.size)}</p>
          </div>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
              onFile(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                onFile(null)
              }
            }}
            className="ml-2 p-2 rounded-full text-cream/50 hover:text-crimson hover:bg-crimson/10 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </span>
        </div>
      ) : (
        <>
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-cream/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <p className="text-cream text-sm font-medium">{title}</p>
          <p className="text-xs text-cream/40 mt-1">{hint}</p>
        </>
      )}
    </div>
  )
}

export default function AdminPanelPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)

  const [token, setToken] = useState('')
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [configSaved, setConfigSaved] = useState(false)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [draggingVideo, setDraggingVideo] = useState(false)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [draggingPoster, setDraggingPoster] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<Status>(null)

  const [loadingSite, setLoadingSite] = useState(false)
  const [savingSite, setSavingSite] = useState(false)
  const [siteStatus, setSiteStatus] = useState<Status>(null)
  const [siteLoaded, setSiteLoaded] = useState(false)
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    setAuthed(readStorage(AUTH_KEY) === '1' ? true : false)
  }, [])

  useEffect(() => {
    if (authed === false) router.replace('/admin')
  }, [authed, router])

  useEffect(() => {
    const savedToken = readStorage(TOKEN_KEY)
    const savedRepo = readStorage(REPO_KEY)
    setToken(savedToken || '')
    setConfigSaved(Boolean(savedToken))
    if (savedRepo) {
      try {
        const r = JSON.parse(savedRepo)
        setOwner(r.owner || '')
        setRepo(r.repo || '')
      } catch {
        /* ignore */
      }
    } else if (typeof window !== 'undefined') {
      const host = window.location.hostname.replace(/\.github\.io$/i, '')
      const base = BASE_PATH.replace(/^\/+/, '').replace(/\/+$/, '')
      if (host) setOwner(host)
      if (base) setRepo(base)
    }
  }, [])

  const hasConfig = Boolean(token.trim() && owner.trim() && repo.trim())

  const saveConfig = () => {
    const t = token.trim()
    const o = owner.trim()
    const r = repo.trim()
    if (!t || !o || !r) {
      setUploadStatus({ type: 'error', text: 'Token, owner and repo are all required.' })
      return
    }
    writeStorage(TOKEN_KEY, t)
    writeStorage(REPO_KEY, JSON.stringify({ owner: o, repo: r }))
    setConfigSaved(true)
    setUploadStatus({ type: 'ok', text: 'GitHub connection saved on this device.' })
  }

  const loadSiteInfo = useCallback(async () => {
    if (!hasConfig) return
    setLoadingSite(true)
    setSiteStatus(null)
    try {
      const file = await ghGet(owner.trim(), repo.trim(), SITE_FILE, token.trim())
      if (!file) throw new Error(`${SITE_FILE} was not found in the repository.`)
      const text = b64ToUtf8(file.content)
      setName(extractField(text, 'name'))
      setTagline(extractField(text, 'tagline'))
      setEmail(extractField(text, 'email'))
      setPhone(extractField(text, 'phone'))
      setAddress(extractField(text, 'address'))
      setSiteLoaded(true)
      setSiteStatus({ type: 'info', text: 'Loaded current site info from GitHub.' })
    } catch (err) {
      setSiteStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not load site info.',
      })
    } finally {
      setLoadingSite(false)
    }
  }, [owner, repo, token, hasConfig])

  useEffect(() => {
    if (hasConfig) loadSiteInfo()
  }, [hasConfig, loadSiteInfo])

  const saveSiteInfo = async () => {
    if (!hasConfig) return
    setSavingSite(true)
    setSiteStatus(null)
    try {
      const current = await ghGet(owner.trim(), repo.trim(), SITE_FILE, token.trim())
      if (!current) throw new Error(`${SITE_FILE} was not found in the repository.`)
      let next = setField(b64ToUtf8(current.content), 'name', name)
      next = setField(next, 'tagline', tagline)
      next = setField(next, 'email', email)
      next = setField(next, 'phone', phone)
      next = setField(next, 'address', address)
      await ghPut(owner.trim(), repo.trim(), SITE_FILE, token.trim(), utf8ToB64(next), 'Update site info via admin panel')
      setSiteStatus({
        type: 'ok',
        text: 'Site info saved to GitHub. The live site will rebuild automatically.',
      })
    } catch (err) {
      setSiteStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not save site info.',
      })
    } finally {
      setSavingSite(false)
    }
  }

  const uploadVideo = async () => {
    if (!videoFile) return
    if (!hasConfig) {
      setUploadStatus({ type: 'error', text: 'Connect GitHub first (token + owner + repo).' })
      return
    }
    if (videoFile.size > MAX_VIDEO_BYTES) {
      setUploadStatus({
        type: 'error',
        text: `File is ${formatBytes(videoFile.size)}. GitHub limits uploads to ~70 MB — please use a smaller video.`,
      })
      return
    }
    setUploading(true)
    setUploadStatus(null)
    try {
      const b64 = await fileToBase64(videoFile)
      const message = `Update hero video (${videoFile.name}) via admin panel`
      for (const target of VIDEO_TARGETS) {
        await ghPut(owner.trim(), repo.trim(), target.path, token.trim(), b64, message)
      }
      setUploadStatus({
        type: 'ok',
        text: `"${videoFile.name}" saved to GitHub as the new hero video. The site rebuilds and updates automatically.`,
      })
      setVideoFile(null)
    } catch (err) {
      setUploadStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not upload video.',
      })
    } finally {
      setUploading(false)
    }
  }

  const uploadPoster = async () => {
    if (!posterFile) return
    if (!hasConfig) {
      setUploadStatus({ type: 'error', text: 'Connect GitHub first (token + owner + repo).' })
      return
    }
    if (posterFile.size > 5 * 1024 * 1024) {
      setUploadStatus({ type: 'error', text: 'Poster must be smaller than 5 MB.' })
      return
    }
    setUploading(true)
    setUploadStatus(null)
    try {
      const b64 = await fileToBase64(posterFile)
      await ghPut(
        owner.trim(),
        repo.trim(),
        POSTER_TARGET,
        token.trim(),
        b64,
        `Update video poster (${posterFile.name}) via admin panel`
      )
      setUploadStatus({
        type: 'ok',
        text: `"${posterFile.name}" saved to GitHub as the video poster.`,
      })
      setPosterFile(null)
    } catch (err) {
      setUploadStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not upload poster.',
      })
    } finally {
      setUploading(false)
    }
  }

  const logout = () => {
    try {
      window.localStorage.removeItem(AUTH_KEY)
    } catch {
      /* ignore */
    }
    router.push('/admin')
  }

  if (authed === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-espresso">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </main>
    )
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-espresso">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-espresso relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-espresso via-espresso to-espresso-dark" aria-hidden />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-crimson/15 flex items-center justify-center text-crimson">
              <KeyRound className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="display text-2xl font-light leading-none">Admin Panel</h1>
              <p className="text-xs text-cream/50 mt-1 uppercase tracking-[0.2em]">Manage your website</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-cream/60 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              View site
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-cream/60 hover:text-crimson transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Log out
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {/* GitHub connection */}
          <section className="rounded-3xl border border-cream/10 bg-cream/[0.03] p-6 lg:p-8">
            <h2 className="eyebrow mb-1">1 · GitHub Connection</h2>
            <p className="text-sm text-cream/60 mb-6">
              Uploads are saved straight to your repository, which rebuilds and redeploys the site.
              Use a personal access token with <span className="text-gold">repo</span> scope.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block md:col-span-2">
                <span className="eyebrow block mb-2">GitHub token</span>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value)
                    setConfigSaved(false)
                  }}
                  placeholder="github_pat_..."
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </label>
              <label className="block">
                <span className="eyebrow block mb-2">Repository owner</span>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="kenclarkz"
                  className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </label>
              <label className="block">
                <span className="eyebrow block mb-2">Repository name</span>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="pop-a-pples"
                  className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </label>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={saveConfig} className="btn-ghost px-6 py-2.5">
                <Save className="w-4 h-4" strokeWidth={1.5} />
                Save connection
              </button>
              {configSaved && (
                <span className="inline-flex items-center gap-1.5 text-xs text-leaf">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                  Saved on this device
                </span>
              )}
            </div>
          </section>

          {/* Hero video */}
          <section className="rounded-3xl border border-cream/10 bg-cream/[0.03] p-6 lg:p-8">
            <h2 className="eyebrow mb-1">2 · Hero Video (scrolling homepage)</h2>
            <p className="text-sm text-cream/60 mb-6">
              Drag and drop a video to replace the scroll-scrubbed video on the main page. It is
              saved to GitHub as <span className="text-gold">POP.mp4</span> so it keeps working on
              every device. Keep it under ~70 MB.
            </p>

            <Dropzone
              icon={<Video className="w-7 h-7" strokeWidth={1.5} />}
              title="Drop your video here"
              hint="or click to browse — MP4, MOV, WebM"
              file={videoFile}
              onFile={(f) => {
                if (!f) {
                  setVideoFile(null)
                  return
                }
                if (isVideoFile(f)) {
                  setVideoFile(f)
                  setUploadStatus(null)
                } else {
                  setUploadStatus({ type: 'error', text: 'That file does not look like a video.' })
                }
              }}
              dragging={draggingVideo}
              setDragging={setDraggingVideo}
              disabled={uploading}
            />

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="eyebrow mb-3">Video poster (optional)</h3>
                <Dropzone
                  icon={<ImageIcon className="w-6 h-6" strokeWidth={1.5} />}
                  title="Poster frame"
                  hint="JPG or PNG shown before the video loads"
                  file={posterFile}
                  onFile={(f) => {
                    if (!f) {
                      setPosterFile(null)
                      return
                    }
                    if (isImageFile(f)) {
                      setPosterFile(f)
                      setUploadStatus(null)
                    } else {
                      setUploadStatus({ type: 'error', text: 'That file does not look like an image.' })
                    }
                  }}
                  dragging={draggingPoster}
                  setDragging={setDraggingPoster}
                  disabled={uploading}
                />
              </div>
              <div className="flex flex-col justify-end gap-3">
                <button
                  onClick={uploadVideo}
                  disabled={!videoFile || uploading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving to GitHub…
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" strokeWidth={1.5} />
                      {videoFile ? 'Save video to GitHub' : 'Select a video first'}
                    </>
                  )}
                </button>
                <button
                  onClick={uploadPoster}
                  disabled={!posterFile || uploading}
                  className="btn-ghost w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Working…' : 'Save poster to GitHub'}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <StatusBanner status={uploadStatus} />
            </div>
          </section>

          {/* Site info */}
          <section className="rounded-3xl border border-cream/10 bg-cream/[0.03] p-6 lg:p-8">
            <h2 className="eyebrow mb-1">3 · Site Info</h2>
            <p className="text-sm text-cream/60 mb-6">
              Edit the basics — name, tagline, contact details. Saves to{' '}
              <span className="text-gold">data/site.ts</span> in GitHub.
            </p>

            {loadingSite && (
              <div className="flex items-center gap-2 text-cream/50 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading current site info…
              </div>
            )}

            {!loadingSite && (
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="eyebrow block mb-2">Site name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-2">Tagline</span>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-2">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-2">Phone</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="eyebrow block mb-2">Address</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </label>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <button
                onClick={saveSiteInfo}
                disabled={savingSite || !siteLoaded}
                className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingSite ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" strokeWidth={1.5} />
                    Save site info
                  </>
                )}
              </button>
              <StatusBanner status={siteStatus} />
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-3xl border border-cream/10 bg-cream/[0.03] p-6 lg:p-8">
            <h2 className="eyebrow mb-3">How changes go live</h2>
            <ul className="space-y-3 text-sm text-cream/60 leading-relaxed">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                Your uploads are committed straight to the repository on GitHub.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                The Pages deployment workflow rebuilds the site automatically on every push.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                The new video appears on the homepage once the rebuild finishes (usually a few minutes).
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

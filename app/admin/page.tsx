'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { site } from '@/data/site'

const ADMIN_USER = 'kenny'
const ADMIN_PASS = 'qwerty'
const AUTH_KEY = 'popa-pples-admin-auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    window.setTimeout(() => {
      if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
        try {
          localStorage.setItem(AUTH_KEY, '1')
        } catch {
          /* storage unavailable — fall through anyway */
        }
        router.push('/admin/panel')
      } else {
        setError('Incorrect username or password.')
        setSubmitting(false)
      }
    }, 400)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-espresso relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-espresso via-espresso to-espresso-dark" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #C8402E 0, transparent 40%), radial-gradient(circle at 80% 70%, #C9A96A 0, transparent 40%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to {site.name}
        </Link>

        <div className="rounded-3xl border border-cream/10 bg-cream/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-2xl bg-crimson/15 text-crimson mb-6">
            <Lock className="w-7 h-7" strokeWidth={1.5} />
          </div>

          <h1 className="display text-center text-3xl font-light mb-2">Admin Login</h1>
          <p className="text-center text-sm text-cream/50 mb-8">
            Restricted area — manage the website content.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="admin-username" className="eyebrow block mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40 pointer-events-none"
                  strokeWidth={1.5}
                />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Your username"
                  className="w-full pl-11 pr-4 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="eyebrow block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40 pointer-events-none"
                  strokeWidth={1.5}
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="w-full pl-11 pr-11 py-3 bg-cream/5 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-cream/40 hover:text-gold transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-crimson-light bg-crimson/10 border border-crimson/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-60"
            >
              {submitting ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-cream/30 uppercase tracking-[0.2em]">
          Authorized access only
        </p>
      </div>
    </main>
  )
}

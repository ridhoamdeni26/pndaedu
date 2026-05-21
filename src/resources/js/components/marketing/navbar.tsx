import { useEffect, useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register, dashboard } from '@/routes';

const NAV_LINKS: NavLink[] = [
  { href: '/',              label: 'Beranda' },
  { href: '/classes',       label: 'Kelas Kami' },
  { href: '/placement-test',label: 'Placement Test' },
  { href: '/study-tour',    label: 'Study Tour',       emoji: '✈️' },
  { href: '/college-china', label: 'Kuliah di China',  emoji: '🎓' },
  { href: '/about-us',      label: 'Tentang Kami' },
  { href: '/news',          label: 'News' },
] as const;

interface NavbarProps {
  auth?: {
    user?: {
      name: string
      email: string
      avatar?: string
    } | null
  }
  cartCount?: number
  darkMode?: boolean
  toggleDark?: () => void
}

interface NavLink {
  href: string
  label: string
  emoji?: string
  badge?: string
}

/** Panda SVG logo — matches the HTML preview exactly */
function PandaLogo({ size = 24, inverted = false }: { size?: number; inverted?: boolean }) {
  const bg  = inverted ? '#0B0B0F' : '#FAF7F2'
  const fg  = inverted ? '#FAF7F2' : '#0B0B0F'
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <circle cx="16" cy="17" r="11" fill={bg} />
      <ellipse cx="8"    cy="10"   rx="3.2" ry="3.5" fill={fg} />
      <ellipse cx="24"   cy="10"   rx="3.2" ry="3.5" fill={fg} />
      <ellipse cx="11.5" cy="16"   rx="2.2" ry="2.8" fill={fg} />
      <ellipse cx="20.5" cy="16"   rx="2.2" ry="2.8" fill={fg} />
      <circle  cx="11.5" cy="16.5" r="0.8"            fill={bg} />
      <circle  cx="20.5" cy="16.5" r="0.8"            fill={bg} />
      <ellipse cx="16"   cy="20"   rx="1.5" ry="1"   fill={fg} />
      <path d="M14.5 21.5 Q16 23 17.5 21.5" stroke={fg} strokeWidth="0.8" fill="none" />
    </svg>
  )
}

/** Cart icon with animated badge */
function CartIcon({ count }: { count: number }) {
  return (
    <div className="relative">
      <motion.svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
        aria-hidden="true"
        animate={count > 0 ? { rotate: [0, -12, 12, -6, 0] } : {}}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19h6"
        />
      </motion.svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Dark / light mode toggle button */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      className="
        flex h-9 w-9 items-center justify-center rounded-xl border
        border-zinc-200 dark:border-zinc-700
        text-zinc-500 dark:text-zinc-400
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        transition-colors duration-200
      "
    >
      {dark ? (
        // Sun icon
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

/** User avatar initials circle */
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-400 text-[10px] font-bold text-white">
      {initials}
    </div>
  )
}

export default function Navbar({
  auth,
  cartCount = 0,
  darkMode = false,
  toggleDark,
}: NavbarProps) {
  const { url } = usePage()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  type SharedProps = { auth: { user: { name: string } | null }; currentTeam: { slug: string } | null };
  const { currentTeam } = usePage().props as SharedProps;
  const dashboardHref = currentTeam ? dashboard.url(currentTeam.slug) : '/dashboard';

  // ── scroll listener ────────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── close mobile on route change ───────────────────────────
  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [url])

  // ── close user menu on outside click ──────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── active link helper ─────────────────────────────────────
  const isActive = (href: string) => {
    if (href === '/') return url === '/'
    return url.startsWith(href)
  }

  const user = auth?.user ?? null

  // ─────────────────────────────────────────────────────────
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-3'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── NAV PILL ──────────────────────────────────────── */}
        <nav
          className={`
            flex items-center justify-between gap-4 rounded-2xl px-4 py-3
            border transition-all duration-500 md:px-6
            ${scrolled
              ? 'border-zinc-200/60 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/90'
              : 'border-zinc-200/40 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/50'
            }
          `}
        >
          {/* ── LOGO ────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Panda Mandarin Education — Beranda"
          >
            <div className="
              flex h-9 w-9 items-center justify-center rounded-xl
              bg-zinc-900 dark:bg-zinc-100
              transition-transform duration-300 group-hover:rotate-[-8deg]
            ">
              <PandaLogo size={22} inverted />
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-[13px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Panda Mandarin
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                Education · 教育
              </p>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ─────────────────────────── */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[13px] font-medium
                  transition-all duration-200
                  ${isActive(link.href)
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }
                `}
              >
                {link.emoji && <span className="text-[12px] leading-none">{link.emoji}</span>}
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* ── RIGHT ACTIONS ─────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle dark={darkMode} onToggle={toggleDark ?? (() => {})} />

            {/* Cart */}
            <Link
              href="/checkout"
              aria-label={`Keranjang — ${cartCount} item`}
              className="
                flex h-9 w-9 items-center justify-center rounded-xl border
                border-zinc-200 dark:border-zinc-700
                text-zinc-500 dark:text-zinc-400
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                transition-colors duration-200
              "
            >
              <CartIcon count={cartCount} />
            </Link>

            {/* Auth — authenticated */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="
                    hidden md:flex items-center gap-2 rounded-xl border
                    border-zinc-200 dark:border-zinc-700
                    px-3 py-2 text-sm font-medium
                    text-zinc-700 dark:text-zinc-300
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition-colors duration-200
                  "
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <UserAvatar name={user.name} />
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <svg
                    className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div className="
                    absolute right-0 top-full mt-2 w-52
                    overflow-hidden rounded-2xl border border-zinc-200
                    bg-white shadow-xl shadow-black/8 dark:border-zinc-700 dark:bg-zinc-900
                    animate-in slide-in-from-top-2 duration-200
                  ">
                    <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      {[
                        { href: '/dashboard',        label: '📊 Dashboard' },
                        { href: '/dashboard/kelas',  label: '📚 Kelas Saya' },
                        { href: '/dashboard/profil', label: '👤 Profil' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="
                            flex items-center rounded-xl px-3 py-2.5 text-sm text-zinc-700
                            hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800
                            transition-colors duration-150
                          "
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                      <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="
                          flex w-full items-center rounded-xl px-3 py-2.5 text-sm
                          text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30
                          transition-colors duration-150
                        "
                      >
                        🚪 Keluar
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth — guest */
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href={login.url()}
                  className="
                    rounded-xl px-4 py-2 text-[13px] font-medium
                    text-zinc-700 dark:text-zinc-300
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition-colors duration-200
                  "
                >
                  Masuk
                </Link>
                <Link
                  href={register.url()}
                  className="
                    rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white
                    hover:opacity-90 transition-opacity duration-200
                    dark:bg-zinc-100 dark:text-zinc-900
                  "
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              className="
                flex h-9 w-9 items-center justify-center rounded-xl border
                border-zinc-200 dark:border-zinc-700
                text-zinc-500 dark:text-zinc-400
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                transition-colors duration-200 lg:hidden
              "
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* ── MOBILE DROPDOWN ──────────────────────────────── */}
        {mobileOpen && (
          <div className="
            mt-2 overflow-hidden rounded-2xl border border-zinc-200
            bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900
            animate-in slide-in-from-top-4 duration-300 lg:hidden
          ">
            {/* Nav links */}
            <div className="p-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium
                    transition-colors duration-150
                    ${isActive(link.href)
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                      : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  {link.emoji && <span>{link.emoji}</span>}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth section */}
            <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800">
                    <UserAvatar name={user.name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                      <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <Link href={dashboardHref} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
                    📊 Dashboard
                  </Link>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                  >
                    🚪 Keluar
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl border border-zinc-200 py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-zinc-900 py-2.5 text-center text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900 transition-opacity"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

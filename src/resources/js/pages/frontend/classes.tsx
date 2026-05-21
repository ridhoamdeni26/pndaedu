'use client';

import { useState, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { CourseClass } from '@/types/home';
import { CLASSES } from '@/data/home';
import { ClassCard } from '@/components/marketing/home/class-card';

const ConsultModal = lazy(() => import('@/components/marketing/home/consult-modal').then(m => ({ default: m.ConsultModal })));
const CartDrawer   = lazy(() => import('@/components/marketing/home/cart-drawer').then(m   => ({ default: m.CartDrawer })));

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PAGE_SIZE = 9;
const LOAD_MORE = 6;

type CategoryFilter = 'all' | 'adult' | 'kids' | 'bisnis';
type TypeFilter     = 'all' | 'online' | 'offline' | 'home-private';
type PricingFilter  = 'all' | 'group' | 'semi-private' | 'private';
type SortOption     = 'default' | 'price-asc' | 'price-desc' | 'seats-asc' | 'start-soon';

const CAT_OPTIONS: { value: CategoryFilter; label: string }[] = [
    { value: 'all',    label: '🎓 Semua'  },
    { value: 'adult',  label: '👤 Dewasa' },
    { value: 'kids',   label: '👶 Kids'   },
    { value: 'bisnis', label: '💼 Bisnis' },
];
const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
    { value: 'all',          label: '🌐 Semua'       },
    { value: 'online',       label: '💻 Online'       },
    { value: 'offline',      label: '🏫 Offline'      },
    { value: 'home-private', label: '🏠 Home Private' },
];
const PRICING_OPTIONS: { value: PricingFilter; label: string }[] = [
    { value: 'all',          label: '💡 Semua Tipe'   },
    { value: 'group',        label: '👥 Group'         },
    { value: 'semi-private', label: '🤝 Semi Private'  },
    { value: 'private',      label: '✨ Private'        },
];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'default',    label: '↕ Default'       },
    { value: 'price-asc',  label: '↑ Termurah'      },
    { value: 'price-desc', label: '↓ Termahal'      },
    { value: 'seats-asc',  label: '🔥 Hampir Penuh'  },
    { value: 'start-soon', label: '📅 Mau Mulai'    },
];

/* ── Background floating hanzi ──────────────────────────────── */
interface BgChar { char: string; top: string; left?: string; right?: string; size: number; dur: number; delay: number; opacity: number; }
const BG_CHARS: BgChar[] = [
    { char: '学', top: '10%', left: '2.5%',  size: 110, dur: 22, delay: 0,   opacity: 0.032 },
    { char: '汉', top: '68%', left: '2%',    size: 82,  dur: 28, delay: 4,   opacity: 0.025 },
    { char: '语', top: '18%', right: '2.5%', size: 96,  dur: 24, delay: 2,   opacity: 0.028 },
    { char: '习', top: '64%', right: '2%',   size: 72,  dur: 20, delay: 6,   opacity: 0.022 },
    { char: '华', top: '42%', left: '1.5%',  size: 62,  dur: 26, delay: 3,   opacity: 0.02  },
    { char: '文', top: '44%', right: '1%',   size: 58,  dur: 30, delay: 8,   opacity: 0.018 },
];

/* ── Card skeleton ──────────────────────────────────────────── */
function CardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-[#0F1E38]">
            <div className="sk aspect-video w-full rounded-none" style={{ borderRadius: 0 }} />
            <div className="space-y-3 p-4">
                <div className="sk h-3.5 w-20 rounded-full" />
                <div className="sk h-5 w-3/4" />
                <div className="sk h-4 w-full" />
                <div className="sk h-4 w-2/3" />
                <div className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="sk h-8 w-8 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                        <div className="sk h-3 w-28" />
                        <div className="sk h-2.5 w-20" />
                    </div>
                </div>
                <div className="sk h-24 w-full rounded-xl" />
                <div className="sk h-6 w-28" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="sk h-10 rounded-xl" />
                    <div className="sk h-10 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

/* ── Empty state ────────────────────────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
    return (
        <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="col-span-full flex flex-col items-center gap-5 rounded-3xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-700/60"
        >
            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl"
            >
                🔍
            </motion.div>
            <div>
                <p className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Tidak ada kelas yang sesuai
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Coba ubah filter atau kata kunci pencarian.
                </p>
            </div>
            <motion.button
                onClick={onReset}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-red-500/25 transition-colors hover:bg-red-600"
            >
                Reset Filter
            </motion.button>
        </motion.div>
    );
}

/* ── Filter pill group ──────────────────────────────────────── */
function PillGroup<T extends string>({
    options,
    active,
    onChange,
    layoutId,
    activeColor,
}: {
    options: { value: T; label: string }[];
    active: T;
    onChange: (v: T) => void;
    layoutId: string;
    activeColor: string;
}) {
    return (
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200/80 bg-white p-1 shadow-sm dark:border-zinc-700/50 dark:bg-[#0F1E38]">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className="relative rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition-colors duration-150"
                    style={{ color: active === opt.value ? '#fff' : undefined }}
                >
                    {active === opt.value && (
                        <motion.span
                            layoutId={layoutId}
                            className="absolute inset-0 rounded-lg"
                            style={{ background: activeColor }}
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                    )}
                    <span className={`relative z-10 ${active === opt.value ? '' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {opt.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ClassesPage() {
    const [category,      setCategory]      = useState<CategoryFilter>('all');
    const [type,          setType]          = useState<TypeFilter>('all');
    const [pricing,       setPricing]       = useState<PricingFilter>('all');
    const [sort,          setSort]          = useState<SortOption>('default');
    const [searchInput,   setSearchInput]   = useState('');
    const [search,        setSearch]        = useState('');       // debounced
    const [visibleCount,  setVisibleCount]  = useState(PAGE_SIZE);
    const [isFiltering,   setIsFiltering]   = useState(false);
    const [loadingMore,   setLoadingMore]   = useState(false);
    const [consultClass,  setConsultClass]  = useState<CourseClass | null>(null);
    const [cartItems,     setCartItems]     = useState<CourseClass[]>([]);
    const [cartOpen,      setCartOpen]      = useState(false);

    const heroRef    = useRef<HTMLDivElement>(null);
    const heroInView = useInView(heroRef, { once: true });
    const filterRef  = useRef<number | null>(null);
    const debounceRef = useRef<number | null>(null);

    /* Restore cart from localStorage */
    useEffect(() => {
        try {
            const raw = localStorage.getItem('panda-cart');
            if (raw) setCartItems(JSON.parse(raw));
        } catch { /* */ }
        const tid = window.setTimeout(() => void import('@/components/marketing/home/consult-modal'), 2000);
        return () => window.clearTimeout(tid);
    }, []);

    /* Debounce search input */
    useEffect(() => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => setSearch(searchInput), 320);
        return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
    }, [searchInput]);

    /* Filtered & sorted data */
    const filtered = useMemo(() => {
        let r = [...CLASSES];
        if (category !== 'all') r = r.filter(c => c.cat === category);
        if (type !== 'all')     r = r.filter(c => c.type === type);
        if (pricing !== 'all')  r = r.filter(c => c.pricingTier === pricing);
        if (search.trim()) {
            const q = search.toLowerCase();
            r = r.filter(c =>
                c.title.toLowerCase().includes(q) ||
                c.subtitle.toLowerCase().includes(q) ||
                c.level.toLowerCase().includes(q),
            );
        }
        if (sort === 'price-asc')  r.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') r.sort((a, b) => b.price - a.price);
        if (sort === 'seats-asc') {
            r.sort((a, b) => {
                const aFull = a.enrolled >= a.maxS;
                const bFull = b.enrolled >= b.maxS;
                if (aFull && !bFull) return 1;
                if (!aFull && bFull) return -1;
                return (a.maxS - a.enrolled) - (b.maxS - b.enrolled);
            });
        }
        if (sort === 'start-soon') {
            r.sort((a, b) => {
                const aS = a.batch.start;
                const bS = b.batch.start;
                if (!aS && !bS) return 0;
                if (!aS) return 1;
                if (!bS) return -1;
                return aS.localeCompare(bS);
            });
        }
        return r;
    }, [category, type, pricing, sort, search]);

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    /* Apply filter with skeleton flash */
    function applyFilter<T>(setter: (v: T) => void, value: T) {
        if (filterRef.current) window.clearTimeout(filterRef.current);
        setter(value);
        setVisibleCount(PAGE_SIZE);
        setIsFiltering(true);
        filterRef.current = window.setTimeout(() => setIsFiltering(false), 340);
    }

    function handleReset() {
        if (filterRef.current) window.clearTimeout(filterRef.current);
        setCategory('all');
        setType('all');
        setPricing('all');
        setSort('default');
        setSearchInput('');
        setSearch('');
        setVisibleCount(PAGE_SIZE);
        setIsFiltering(true);
        filterRef.current = window.setTimeout(() => setIsFiltering(false), 340);
    }

    function handleLoadMore() {
        setLoadingMore(true);
        window.setTimeout(() => {
            setVisibleCount(p => p + LOAD_MORE);
            setLoadingMore(false);
        }, 480);
    }

    function handleAddCart(cls: CourseClass) {
        setCartItems(prev => {
            if (prev.some(c => c.id === cls.id)) return prev;
            const next = [...prev, cls];
            localStorage.setItem('panda-cart', JSON.stringify(next));
            window.dispatchEvent(new CustomEvent('panda-cart-changed'));
            return next;
        });
        setCartOpen(true);
    }

    function handleRemoveCart(id: number) {
        setCartItems(prev => {
            const next = prev.filter(c => c.id !== id);
            localStorage.setItem('panda-cart', JSON.stringify(next));
            window.dispatchEvent(new CustomEvent('panda-cart-changed'));
            return next;
        });
    }

    const hasActiveFilters = category !== 'all' || type !== 'all' || pricing !== 'all' || sort !== 'default' || search;

    return (
        <>
            <Head title="Kelas Kami — Panda Mandarin Education" />

            <style>{`
                @keyframes shimmer { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
                .sk {
                    background: linear-gradient(90deg,#eee9e3 25%,#e4ddd7 50%,#eee9e3 75%);
                    background-size: 1600px 100%;
                    animation: shimmer 2s ease-in-out infinite;
                    border-radius: 10px;
                    display: block;
                }
                .dark .sk {
                    background: linear-gradient(90deg,#18243a 25%,#243044 50%,#18243a 75%);
                    background-size: 1600px 100%;
                }
                html { scroll-behavior: smooth; }
            `}</style>

            {/* ═══════════════════════════════════════
                HERO
            ═══════════════════════════════════════ */}
            <div
                ref={heroRef}
                className="relative overflow-hidden bg-[#FDFAF6] pb-10 pt-28 dark:bg-[#080F1C] md:pt-36"
            >
                {/* ── Background ── */}
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    {/* Dot grid — light */}
                    <div
                        className="absolute inset-0 opacity-[0.035] dark:hidden"
                        style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.8) 1px,transparent 1px)', backgroundSize: '30px 30px' }}
                    />
                    {/* Dot grid — dark */}
                    <div
                        className="absolute inset-0 hidden opacity-[0.065] dark:block"
                        style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.6) 1px,transparent 1px)', backgroundSize: '30px 30px' }}
                    />

                    {/* Aurora blobs */}
                    <motion.div
                        animate={{ x: [0, 44, 0], y: [0, -28, 0], scale: [1, 1.22, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -left-24 -top-24 h-96 w-96 rounded-full"
                        style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.14),transparent 70%)', filter: 'blur(72px)' }}
                    />
                    <motion.div
                        animate={{ x: [0, -36, 0], y: [0, 24, 0], scale: [1, 1.16, 1] }}
                        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                        className="absolute -right-20 top-20 h-80 w-80 rounded-full"
                        style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.18),transparent 70%)', filter: 'blur(64px)' }}
                    />
                    <motion.div
                        animate={{ opacity: [0.1, 0.28, 0.1], scale: [1, 1.3, 1] }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                        className="absolute bottom-0 left-1/3 h-72 w-96 rounded-full"
                        style={{ background: 'radial-gradient(ellipse,rgba(16,185,129,0.09),transparent 70%)', filter: 'blur(60px)' }}
                    />
                    <motion.div
                        animate={{ x: [0, 26, 0], y: [0, -18, 0], opacity: [0.08, 0.2, 0.08] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
                        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ background: 'radial-gradient(circle,rgba(245,158,11,0.1),transparent 70%)', filter: 'blur(55px)' }}
                    />

                    {/* Floating hanzi */}
                    {BG_CHARS.map((c, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -16, 0], rotate: [0, i % 2 === 0 ? 4 : -4, 0] }}
                            transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                            className="absolute select-none font-bold leading-none text-black dark:text-white"
                            style={{
                                top: c.top, left: c.left, right: c.right,
                                fontSize: c.size, fontFamily: 'var(--font-hanzi)', opacity: c.opacity,
                            }}
                            aria-hidden
                        >
                            {c.char}
                        </motion.div>
                    ))}

                    {/* Giant watermark hanzi */}
                    <div
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none text-red-400 opacity-[0.03] dark:opacity-[0.05]"
                        style={{ fontSize: 320, fontFamily: 'var(--font-hanzi)' }}
                        aria-hidden
                    >
                        学
                    </div>

                    {/* Diagonal shimmer */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(212,165,116,0.06) 50%,transparent 60%)' }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 7 }}
                    />
                </div>

                {/* ── Hero content ── */}
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200/70 bg-red-50/60 px-4 py-1.5 dark:border-red-900/40 dark:bg-red-950/30"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-1.5 w-1.5 rounded-full bg-red-500"
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                            Panda Education · {CLASSES.length} Kelas Tersedia
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 26 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
                        className="mb-5 text-4xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl lg:text-6xl"
                    >
                        Temukan Kelas{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg,#E63946 0%,#D4A574 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Mandarin
                        </span>
                        <br className="hidden sm:block" />
                        {' '}yang Tepat Untukmu
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
                        className="mb-8 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-lg"
                    >
                        Mulai dari dasar hingga mahir — tersedia kelas online, offline, dan privat.
                        Filter sesuai kebutuhanmu dan daftar sekarang.
                    </motion.p>

                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.24, ease: EASE }}
                        className="mb-8 max-w-lg"
                    >
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari kelas... (HSK, Business, Kids, dll)"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-11 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-[#0F1E38] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-red-700"
                            />
                            <AnimatePresence>
                                {searchInput && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                        onClick={() => { setSearchInput(''); setSearch(''); }}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-[11px] text-zinc-500 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600"
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Quick stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
                        className="flex flex-wrap gap-3"
                    >
                        {[
                            { icon: '🎓', label: 'Total Kelas',  value: CLASSES.length },
                            { icon: '💻', label: 'Online',       value: CLASSES.filter(c => c.type === 'online').length },
                            { icon: '🏫', label: 'Offline',      value: CLASSES.filter(c => c.type === 'offline').length },
                            { icon: '✨', label: 'Private',      value: CLASSES.filter(c => c.isPrivate).length },
                            { icon: '👶', label: 'Kids',         value: CLASSES.filter(c => c.cat === 'kids').length },
                        ].map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.36 + i * 0.06, ease: EASE }}
                                className="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/80 px-3.5 py-2 backdrop-blur-sm dark:border-zinc-700/50 dark:bg-[#0F1E38]/80"
                            >
                                <span className="text-base">{s.icon}</span>
                                <div>
                                    <p className="text-sm font-black leading-none text-zinc-900 dark:text-zinc-100">{s.value}</p>
                                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">{s.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                STICKY FILTER BAR
            ═══════════════════════════════════════ */}
            <div className="sticky top-17 z-20 border-b border-zinc-200/70 bg-[#FDFAF6]/92 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-[#080F1C]/94">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-2 py-2.5 md:flex-row md:flex-wrap md:items-center md:gap-2.5 md:py-3">

                        {/* Filter pills
                            Mobile : single scrollable horizontal strip (overflow-x-auto, no wrap)
                            Desktop: `md:contents` collapses the wrapper so pills participate
                                     directly in the parent flex row alongside count+reset */}
                        <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden md:contents">
                            <div className="shrink-0">
                                <PillGroup
                                    options={CAT_OPTIONS}
                                    active={category}
                                    onChange={v => applyFilter(setCategory, v)}
                                    layoutId="cat-pill"
                                    activeColor="#E63946"
                                />
                            </div>
                            <div className="shrink-0">
                                <PillGroup
                                    options={TYPE_OPTIONS}
                                    active={type}
                                    onChange={v => applyFilter(setType, v)}
                                    layoutId="type-pill"
                                    activeColor="#0EA5E9"
                                />
                            </div>
                            <div className="shrink-0">
                                <PillGroup
                                    options={PRICING_OPTIONS}
                                    active={pricing}
                                    onChange={v => applyFilter(setPricing, v)}
                                    layoutId="pricing-pill"
                                    activeColor="#8B5CF6"
                                />
                            </div>
                            <div className="shrink-0">
                                <PillGroup
                                    options={SORT_OPTIONS}
                                    active={sort}
                                    onChange={v => applyFilter(setSort, v)}
                                    layoutId="sort-pill"
                                    activeColor="#F59E0B"
                                />
                            </div>
                        </div>

                        {/* Results count + reset — always visible below strip on mobile,
                            pushed to the right on desktop via ml-auto */}
                        <div className="flex shrink-0 items-center gap-3 md:ml-auto">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={filtered.length}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.18 }}
                                    className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500"
                                >
                                    {filtered.length} kelas
                                </motion.span>
                            </AnimatePresence>

                            <AnimatePresence>
                                {hasActiveFilters && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.85 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={handleReset}
                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                                    >
                                        Reset ✕
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                CARD GRID
            ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-[#FDFAF6] py-10 dark:bg-[#080F1C]">

                {/* Background continuation glows */}
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <motion.div
                        animate={{ x: [0, -28, 0], y: [0, 20, 0], scale: [1, 1.14, 1] }}
                        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
                        className="absolute -right-16 top-32 h-72 w-72 rounded-full"
                        style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.07),transparent 70%)', filter: 'blur(60px)' }}
                    />
                    <motion.div
                        animate={{ x: [0, 22, 0], y: [0, -16, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute -left-16 bottom-40 h-64 w-64 rounded-full"
                        style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.06),transparent 70%)', filter: 'blur(55px)' }}
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Contextual sort hint */}
                    <AnimatePresence>
                        {(sort === 'seats-asc' || sort === 'start-soon') && !isFiltering && (
                            <motion.div
                                key={sort}
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="mb-4 overflow-hidden"
                            >
                                <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                                    sort === 'seats-asc'
                                        ? 'border-red-200/70 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20'
                                        : 'border-sky-200/70 bg-sky-50/60 dark:border-sky-900/40 dark:bg-sky-950/20'
                                }`}>
                                    <span className="mt-0.5 text-lg leading-none">
                                        {sort === 'seats-asc' ? '🔥' : '📅'}
                                    </span>
                                    <div>
                                        <p className={`text-[12px] font-bold ${
                                            sort === 'seats-asc'
                                                ? 'text-red-700 dark:text-red-400'
                                                : 'text-sky-700 dark:text-sky-400'
                                        }`}>
                                            {sort === 'seats-asc'
                                                ? 'Diurutkan: Sisa bangku paling sedikit dahulu'
                                                : 'Diurutkan: Kelas yang paling segera mulai dahulu'}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                            {sort === 'seats-asc'
                                                ? 'Segera daftar sebelum bangku habis — kelas hampir penuh tampil paling atas.'
                                                : 'Lihat jadwal terdekat yang masih buka pendaftaran dan amankan tempat lebih cepat.'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results info */}
                    <div className="mb-6 flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`${filtered.length}-${visibleCount}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="text-sm text-zinc-500 dark:text-zinc-400"
                            >
                                Menampilkan{' '}
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                    {Math.min(visibleCount, filtered.length)}
                                </span>{' '}
                                dari{' '}
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                    {filtered.length}
                                </span>{' '}
                                kelas
                                {search && (
                                    <span className="text-zinc-400"> untuk &ldquo;{search}&rdquo;</span>
                                )}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Grid — skeleton / empty / cards */}
                    <AnimatePresence mode="wait">
                        {isFiltering ? (
                            <motion.div
                                key="skeleton-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                            </motion.div>
                        ) : filtered.length === 0 ? (
                            <EmptyState onReset={handleReset} />
                        ) : (
                            <motion.div
                                key={`${category}-${type}-${sort}-${search}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.28, ease: EASE }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {visible.map((cls, i) => (
                                    <ClassCard
                                        key={cls.id}
                                        cls={cls}
                                        index={i}
                                        onConsult={setConsultClass}
                                        onAddCart={handleAddCart}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Load more skeleton rows */}
                    <AnimatePresence>
                        {loadingMore && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                                key={`${category}-${type}-${pricing}-${sort}-${search}`}
                            >
                                {[...Array(Math.min(LOAD_MORE, filtered.length - visibleCount))].map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Load more / all-loaded */}
                    {!isFiltering && filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                            className="mt-12 flex flex-col items-center gap-4"
                        >
                            {/* Progress bar */}
                            <div className="relative h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800/60">
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full bg-red-400"
                                    animate={{ width: `${(Math.min(visibleCount, filtered.length) / filtered.length) * 100}%` }}
                                    transition={{ duration: 0.65, ease: EASE }}
                                />
                            </div>
                            <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                                {Math.min(visibleCount, filtered.length)} / {filtered.length}
                            </p>

                            {hasMore ? (
                                <motion.button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    whileHover={loadingMore ? {} : { y: -3, scale: 1.02 }}
                                    whileTap={loadingMore ? {} : { scale: 0.97 }}
                                    className="group flex items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-red-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-[#0F1E38] dark:text-zinc-300 dark:hover:border-red-800"
                                >
                                    {loadingMore ? (
                                        <>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                                                className="block h-4 w-4 rounded-full border-2 border-red-400 border-t-transparent"
                                            />
                                            Memuat...
                                        </>
                                    ) : (
                                        <>
                                            Muat {Math.min(LOAD_MORE, filtered.length - visibleCount)} Kelas Lagi
                                            <svg
                                                className="h-4 w-4 text-red-500 transition-transform duration-200 group-hover:translate-y-0.5"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.88 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                    className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/60 bg-emerald-50/70 px-5 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/25"
                                >
                                    <span className="text-emerald-500">✓</span>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        Semua {filtered.length} kelas sudah ditampilkan
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    <div className="pb-20" />
                </div>
            </section>

            {/* ── Modals ── */}
            {consultClass && (
                <Suspense fallback={null}>
                    <ConsultModal cls={consultClass} onClose={() => setConsultClass(null)} />
                </Suspense>
            )}

            <Suspense fallback={null}>
                <CartDrawer
                    open={cartOpen}
                    items={cartItems}
                    onClose={() => setCartOpen(false)}
                    onRemove={handleRemoveCart}
                />
            </Suspense>
        </>
    );
}

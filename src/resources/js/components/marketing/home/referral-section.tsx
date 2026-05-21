'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from '@inertiajs/react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Cashback data ───────────────────────────────────────── */

interface CashbackItem   { name: string; referrer: number; friend: number; }
interface CashbackCategory {
    id: string; icon: string; label: string; sublabel: string;
    hex: string; items: CashbackItem[]; featured?: boolean;
}

const CATEGORIES: CashbackCategory[] = [
    {
        id: 'group', icon: '👥', label: 'Kelas Grup', sublabel: 'Online & Offline', hex: '#10B981',
        items: [
            { name: 'HSK 1–3 · Bisnis Beginner · Convo Inter', referrer: 50,  friend: 25 },
            { name: 'Bisnis Inter · HSK 4–5',                  referrer: 100, friend: 50 },
        ],
    },
    {
        id: 'private', icon: '🎯', label: 'Private Class', sublabel: 'Traditional & Simplified', hex: '#8B5CF6',
        items: [
            { name: 'Private 8×  Pertemuan',  referrer: 50,  friend: 25 },
            { name: 'Private 12× Pertemuan',  referrer: 75,  friend: 30 },
            { name: 'Private 24× Pertemuan',  referrer: 100, friend: 50 },
        ],
    },
    {
        id: 'semi', icon: '⭐', label: 'Semi Private', sublabel: 'Semua Level & Kelas', hex: '#F59E0B',
        items: [{ name: 'Semua Kelas Semi Private', referrer: 150, friend: 75 }],
        featured: true,
    },
    {
        id: 'kids', icon: '🌟', label: 'Kids Program', sublabel: 'Program YCT Anak & Remaja', hex: '#EC4899',
        items: [
            { name: 'Grup YCT 1–2', referrer: 50,  friend: 25 },
            { name: 'Grup YCT 3–4', referrer: 100, friend: 50 },
        ],
    },
];

const STEPS = [
    { num: '01', bg: 'linear-gradient(135deg,#34d399,#059669)', title: 'Daftar & Dapat Kode',   desc: 'Hubungi admin atau input saat checkout. Kode referral unikmu aktif dalam 5 menit.' },
    { num: '02', bg: 'linear-gradient(135deg,#fbbf24,#d97706)', title: 'Bagikan ke Teman',      desc: 'Kirim kode via WhatsApp atau media sosial. Temanmu input saat checkout & dapat diskon langsung.' },
    { num: '03', bg: 'linear-gradient(135deg,#E63946,#c0392b)', title: 'Cashback Cair! 💸',     desc: 'Begitu pembayaran dikonfirmasi, cashback langsung ditransfer ke rekening dalam 3×24 jam.' },
];

/* ─── Background: animated referral network SVG ───────────── */

const NET_NODES = [
    { cx: 8,  cy: 20 }, { cx: 22, cy: 68 }, { cx: 38, cy: 10 },
    { cx: 52, cy: 78 }, { cx: 68, cy: 18 }, { cx: 82, cy: 62 },
    { cx: 55, cy: 42 }, { cx: 18, cy: 44 },
];
const NET_EDGES = [
    [0,2],[0,7],[2,4],[1,7],[1,3],[3,6],[4,6],[4,5],[5,6],[6,3],[7,6],
];

function ReferralNetwork() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
        >
            {NET_EDGES.map(([a, b], i) => (
                <motion.line
                    key={`e${i}`}
                    x1={NET_NODES[a].cx} y1={NET_NODES[a].cy}
                    x2={NET_NODES[b].cx} y2={NET_NODES[b].cy}
                    stroke="#10B981"
                    strokeWidth="0.25"
                    strokeOpacity="0.2"
                    strokeDasharray="1.5 1"
                    animate={{ strokeDashoffset: [0, -5] }}
                    transition={{ duration: 2.2 + i * 0.2, repeat: Infinity, ease: 'linear' }}
                />
            ))}

            {NET_NODES.map((n, i) => (
                <g key={`n${i}`}>
                    <motion.circle
                        cx={n.cx} cy={n.cy}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="0.18"
                        strokeOpacity="0.35"
                        animate={{ r: [0, 3.5, 3.5], opacity: [0.6, 0, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.38 }}
                    />
                    <motion.circle
                        cx={n.cx} cy={n.cy}
                        fill="#10B981"
                        fillOpacity="0.3"
                        animate={{ r: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.38 }}
                    />
                </g>
            ))}
        </svg>
    );
}

/* ─── Floating themed hanzi ───────────────────────────────── */
interface BgChar { char: string; top: string; left?: string; right?: string; size: number; dur: number; delay: number; opacity: number; }
const BG_CHARS: BgChar[] = [
    { char: '友', top: '10%', left: '3%',   size: 88, dur: 22, delay: 0,   opacity: 0.055 },
    { char: '赚', top: '72%', left: '2%',   size: 68, dur: 18, delay: 3.5, opacity: 0.045 },
    { char: '礼', top: '18%', right: '3%',  size: 80, dur: 26, delay: 1.5, opacity: 0.05  },
    { char: '利', top: '68%', right: '2%',  size: 62, dur: 20, delay: 5,   opacity: 0.042 },
    { char: '赢', top: '42%', left: '1.5%', size: 54, dur: 24, delay: 2,   opacity: 0.038 },
    { char: '享', top: '45%', right: '1%',  size: 50, dur: 28, delay: 7,   opacity: 0.035 },
];

/* ─── Animated count-up ───────────────────────────────────── */

function CountUp({ to, inView }: { to: number; inView: boolean }) {
    const val = useMotionValue(0);
    const display = useTransform(val, (v) => String(Math.round(v)));
    useEffect(() => {
        if (!inView) return;
        const ctrl = animate(val, to, { duration: 1.5, ease: 'easeOut' });
        return () => ctrl.stop();
    }, [inView]); // eslint-disable-line
    return <motion.span>{display}</motion.span>;
}

/* ─── Cashback category card ──────────────────────────────── */

function CategoryCard({ cat, delay }: { cat: CashbackCategory; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, delay, ease: EASE }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-2xl border p-5 ${
                cat.featured
                    ? 'border-amber-200/80 bg-amber-50/70 dark:border-amber-600/25 dark:bg-amber-900/15'
                    : 'border-zinc-200 bg-white dark:border-slate-700/60 dark:bg-[#0F1E38]'
            }`}
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
        >
            {/* Top accent line */}
            <div
                className="absolute left-0 top-0 h-0.5 w-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: cat.hex }}
            />

            {/* Corner glow on featured */}
            {cat.featured && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
                    style={{ background: cat.hex }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}

            {/* Card header */}
            <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <motion.div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-base"
                        style={{ background: `${cat.hex}18` }}
                        whileHover={{ scale: 1.1, rotate: [0, -6, 6, 0], transition: { duration: 0.4 } }}
                    >
                        {cat.icon}
                    </motion.div>
                    <div>
                        <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">{cat.label}</p>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{cat.sublabel}</p>
                    </div>
                </div>
                {cat.featured && (
                    <span
                        className="shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white"
                        style={{ background: 'linear-gradient(135deg,#F59E0B,#d97706)' }}
                    >
                        Terbesar
                    </span>
                )}
            </div>

            {/* Column headers */}
            <div className="relative z-10 mb-2 grid grid-cols-[1fr_56px_56px] gap-x-2 px-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Kelas</span>
                <span className="text-right font-mono text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Kamu</span>
                <span className="text-right font-mono text-[9px] uppercase tracking-wider text-sky-600 dark:text-sky-400">Teman</span>
            </div>

            {/* Rows */}
            <div className="relative z-10 space-y-1.5">
                {cat.items.map((item) => (
                    <div
                        key={item.name}
                        className="grid grid-cols-[1fr_56px_56px] items-center gap-x-2 rounded-xl border border-black/5 px-2 py-2.5 transition-colors duration-200 hover:bg-zinc-50 dark:border-white/[0.06] dark:hover:bg-white/5"
                    >
                        <span className="text-[12px] leading-snug text-zinc-500 dark:text-zinc-400">{item.name}</span>
                        <span className="text-right font-mono text-[13px] font-black tabular-nums text-emerald-500">
                            {item.referrer}K
                        </span>
                        <span className="text-right font-mono text-[13px] font-black tabular-nums text-sky-500">
                            {item.friend}K
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/* ─── Section ─────────────────────────────────────────────── */

export function ReferralSection() {
    const headingRef    = useRef<HTMLDivElement>(null);
    const heroRef       = useRef<HTMLDivElement>(null);
    const headingInView = useInView(headingRef, { once: true, margin: '-60px' });
    const heroInView    = useInView(heroRef,    { once: true, margin: '-80px' });

    return (
        <section className="relative overflow-hidden bg-[#FDFAF6] py-20 dark:bg-[#080F1C] md:py-28">

            {/* ══════════════════════════════════════
                BACKGROUND
            ══════════════════════════════════════ */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>

                {/* Dot grid — light mode */}
                <div
                    className="absolute inset-0 opacity-[0.04] dark:hidden"
                    style={{
                        backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.8) 1px,transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
                {/* Dot grid — dark mode */}
                <div
                    className="absolute inset-0 hidden opacity-[0.07] dark:block"
                    style={{
                        backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.65) 1px,transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />

                {/* Referral network — animated SVG */}
                <ReferralNetwork />

                {/* Aurora blobs */}
                <motion.div
                    animate={{ x: [0, 32, 0], y: [0, -22, 0], scale: [1, 1.18, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -left-24 -top-16 h-96 w-96 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)', filter: 'blur(70px)' }}
                />
                <motion.div
                    animate={{ x: [0, -28, 0], y: [0, 18, 0], scale: [1, 1.14, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                    className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.16),transparent 70%)', filter: 'blur(80px)' }}
                />
                <motion.div
                    animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.22, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.08),transparent 70%)', filter: 'blur(65px)' }}
                />
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 14, 0], opacity: [0.12, 0.28, 0.12] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
                    className="absolute -right-16 top-20 h-80 w-80 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(245,158,11,0.12),transparent 70%)', filter: 'blur(75px)' }}
                />

                {/* Floating hanzi — reward themed */}
                {BG_CHARS.map((c, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -18, 0], rotate: [0, i % 2 === 0 ? 4 : -4, 0] }}
                        transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                        className="absolute select-none font-bold leading-none text-black dark:text-white"
                        style={{
                            top: c.top, left: c.left, right: c.right,
                            fontSize: c.size, fontFamily: 'var(--font-hanzi)', opacity: c.opacity,
                        }}
                    >
                        {c.char}
                    </motion.div>
                ))}

                {/* Floating money/gift emoji icons */}
                {(['💰', '🎁', '💸', '🤝'] as const).map((emoji, i) => (
                    <motion.div
                        key={emoji}
                        className="absolute select-none text-3xl"
                        style={{
                            top: `${[15, 65, 30, 75][i]}%`,
                            left: `${[88, 91, 93, 85][i]}%`,
                            opacity: 0.08,
                        }}
                        animate={{ y: [0, -14, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
                        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
                        aria-hidden
                    >
                        {emoji}
                    </motion.div>
                ))}

                {/* Diagonal warm shimmer */}
                <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(212,165,116,0.07) 50%,transparent 60%)' }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 8 }}
                />
            </div>

            {/* ═══════════════════════════
                CONTENT
            ═══════════════════════════ */}
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Heading ── */}
                <div
                    ref={headingRef}
                    className="mb-12 text-center"
                    style={{
                        opacity: headingInView ? 1 : 0,
                        transform: headingInView ? 'none' : 'translateY(24px)',
                        transition: 'opacity 0.65s ease, transform 0.65s ease',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={headingInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        />
                        Panda Referral Program
                    </motion.div>

                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl lg:text-5xl">
                        {['Ajak', 'teman,'].map((w, i) => (
                            <motion.span
                                key={w}
                                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                                animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
                                className="mr-2 inline-block"
                            >
                                {w}
                            </motion.span>
                        ))}
                        <motion.span
                            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                            animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                            className="inline-block"
                            style={{
                                background: 'linear-gradient(135deg,#10B981,#D4A574)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            keduanya untung.
                        </motion.span>
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={headingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
                        className="mx-auto mt-4 max-w-lg text-base text-zinc-500 dark:text-zinc-400"
                    >
                        Cashback langsung ditransfer ke rekening kamu — tanpa batas referral, tanpa minimum target.
                    </motion.p>
                </div>

                {/* ── Hero dual-benefit cards ── */}
                <div ref={heroRef} className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_64px_1fr]">

                    {/* Referrer */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.65, ease: EASE }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm dark:border-emerald-800/40 dark:bg-[#0F1E38] md:p-7"
                    >
                        <motion.div
                            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
                            style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.15),transparent 70%)', filter: 'blur(28px)' }}
                            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div className="relative z-10">
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                                Kamu — Pemilik Kode
                            </p>
                            <div className="mb-1 flex items-baseline gap-1.5">
                                <span className="font-mono text-sm font-bold text-emerald-500">Rp</span>
                                <span className="text-5xl font-black tabular-nums text-emerald-500">
                                    <CountUp to={150} inView={heroInView} />
                                </span>
                                <span className="text-2xl font-black text-emerald-500">K</span>
                            </div>
                            <p className="mb-4 text-sm text-zinc-400 dark:text-zinc-500">Cashback per referral · hingga</p>
                            <div
                                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2"
                                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                            >
                                <svg className="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Langsung transfer ke rekening
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Separator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                        className="hidden items-center justify-center lg:flex"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-14 w-px bg-linear-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white font-mono text-[11px] font-bold text-zinc-400 shadow-sm dark:border-zinc-700 dark:bg-[#0F1E38] dark:text-zinc-500">
                                &amp;
                            </div>
                            <div className="h-14 w-px bg-linear-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
                        </div>
                    </motion.div>

                    {/* Friend */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-white p-6 shadow-sm dark:border-sky-800/40 dark:bg-[#0F1E38] md:p-7"
                    >
                        <motion.div
                            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
                            style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.12),transparent 70%)', filter: 'blur(28px)' }}
                            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                        />
                        <div className="relative z-10">
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                                Teman — Penerima Kode
                            </p>
                            <div className="mb-1 flex items-baseline gap-1.5">
                                <span className="font-mono text-sm font-bold text-sky-500">Rp</span>
                                <span className="text-5xl font-black tabular-nums text-sky-500">
                                    <CountUp to={75} inView={heroInView} />
                                </span>
                                <span className="text-2xl font-black text-sky-500">K</span>
                            </div>
                            <p className="mb-4 text-sm text-zinc-400 dark:text-zinc-500">Diskon saat checkout · hingga</p>
                            <div
                                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2"
                                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}
                            >
                                <svg className="h-3.5 w-3.5 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2h2z" />
                                </svg>
                                <span className="font-mono text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                                    Potongan harga otomatis
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Cashback breakdown ── */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2"
                    >
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                            Rincian Cashback per Kategori
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">Cashback kamu</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-sky-400" />
                                <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">Diskon teman</span>
                            </span>
                        </div>
                    </motion.div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {CATEGORIES.map((cat, i) => (
                            <CategoryCard key={cat.id} cat={cat} delay={0.04 + i * 0.09} />
                        ))}
                    </div>
                </div>

                {/* ── How it works ── */}
                <div className="mb-10">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500"
                    >
                        Cara Kerja
                    </motion.p>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: EASE }}
                                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                                className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-[#0F1E38]"
                            >
                                {i < STEPS.length - 1 && (
                                    <div className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path
                                                d="M4 10h12M11 5l5 5-5 5"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-zinc-300 dark:text-zinc-600"
                                            />
                                        </svg>
                                    </div>
                                )}
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black text-white"
                                        style={{ background: step.bg }}
                                    >
                                        {step.num}
                                    </div>
                                    <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">{step.title}</p>
                                </div>
                                <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── CTA bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-emerald-900/40 dark:bg-[#0F1E38] md:p-8"
                >
                    {/* Soft emerald corner glow */}
                    <div
                        className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.2),transparent 70%)', filter: 'blur(30px)' }}
                    />
                    {/* Dark mode: stronger emerald ambient */}
                    <div
                        className="pointer-events-none absolute -right-10 -bottom-10 hidden h-48 w-48 rounded-full opacity-20 dark:block"
                        style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.3),transparent 70%)', filter: 'blur(40px)' }}
                    />
                    <div className="relative z-10">
                        <div className="mb-2 flex items-center gap-2">
                            <motion.span
                                animate={{ rotate: [-5, 5, -5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="text-xl"
                            >
                                🐼
                            </motion.span>
                            <p className="text-base font-bold text-zinc-800 dark:text-zinc-100 sm:text-lg">
                                Siap jadi Panda Affiliate?
                            </p>
                        </div>
                        <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Gratis daftar · Tidak ada target minimum · Cashback langsung ke rekening bankmu.
                        </p>
                    </div>
                    <div className="relative z-10 flex shrink-0 flex-wrap gap-3">
                        <a
                            href="https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Admin+Panda!+Saya+ingin+daftar+Program+Referral+Panda."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold text-white shadow-md shadow-emerald-200/50 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-300/30 dark:shadow-emerald-900/40"
                            style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}
                        >
                            🎁 Daftar Sekarang
                        </a>
                        <Link
                            href="/referral"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-[13px] font-semibold text-zinc-600 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:bg-slate-800/60 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                        >
                            Pelajari Lebih Lanjut
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

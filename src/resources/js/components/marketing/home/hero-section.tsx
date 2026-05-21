'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { register, dashboard } from '@/routes';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Rotating word hook ─────────────────────────────────────── */

const ROTATING_WORDS = ['menyenangkan', 'terbukti', 'efektif', 'terstruktur', 'seru'];

function useRotatingWord(words: string[], interval = 2600) {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((p) => (p + 1) % words.length), interval);
        return () => clearInterval(t);
    }, [words.length, interval]);
    return words[i];
}

/* ─── Data ───────────────────────────────────────────────────── */


const AVATAR_STACK = [
    { initials: 'AY', gradient: 'linear-gradient(135deg,#fb923c,#f472b6)', hanzi: false },
    { initials: 'LH', gradient: 'linear-gradient(135deg,#818cf8,#a78bfa)', hanzi: false },
    { initials: '王', gradient: '#ef4444',                                  hanzi: true  },
    { initials: 'MS', gradient: 'linear-gradient(135deg,#fbbf24,#f87171)', hanzi: false },
    { initials: 'SR', gradient: 'linear-gradient(135deg,#34d399,#2dd4bf)', hanzi: false },
];

const FLOATING_HANZI = [
    { char: '学', size: 240, color: 'rgba(230,57,70,0.05)',   top: '8%',    left: '1%',   rotate: 5,  dur: 8,   delay: 0   },
    { char: '习', size: 180, color: 'rgba(230,57,70,0.035)',  top: '25%',   right: '1%',  rotate: -5, dur: 10,  delay: 1.5 },
    { char: '中', size: 140, color: 'rgba(212,165,116,0.06)', bottom: '15%',left: '18%',  rotate: 3,  dur: 9,   delay: 2.5 },
    { char: '文', size: 110, color: 'rgba(99,102,241,0.04)',  top: '60%',   right: '16%', rotate: -4, dur: 7,   delay: 0.8 },
];

const WAVE_BARS = [30, 70, 100, 60, 45, 80, 95, 55];

/* ─── HeroSection ────────────────────────────────────────────── */

export function HeroSection() {
    interface SharedProps { auth: { user: { name: string } | null }; currentTeam: { slug: string } | null; }
    const sectionRef = useRef<HTMLElement>(null);
    const { auth, currentTeam } = usePage().props as SharedProps;
    const dashboardHref = currentTeam ? dashboard.url(currentTeam.slug) : '/dashboard';
    const word = useRotatingWord(ROTATING_WORDS);

    /* Parallax scroll */
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
    const blob1Y      = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
    const blob2Y      = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
    const blob3Y      = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
    const ringY       = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
    const hanziY      = useTransform(scrollYProgress, [0, 1], ['0%', '-38%']);
    const hanziY2     = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
    const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY    = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
    const mockupY     = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

    return (
        <section
            ref={sectionRef}
            className="relative flex h-[100dvh] items-center overflow-hidden bg-[#FDFAF6] dark:bg-[#080F1C]"
        >

            {/* ══════════════════════════════════════════════════════ */}
            {/* ── Background Layer ── */}
            {/* ══════════════════════════════════════════════════════ */}

            {/* Dot grid — fades on scroll */}
            <motion.div style={{ opacity: gridOpacity }} className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.1] dark:opacity-[0.045]"
                    style={{
                        backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.25) 1px,transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </motion.div>

            {/* Large morphing ring — parallax wrapper */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                <motion.div
                    style={{ y: ringY }}
                    className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <motion.div
                        animate={{
                            rotate: 360,
                            borderRadius: ['45% 55% 60% 40%/40% 45% 55% 60%', '55% 45% 40% 60%/60% 55% 45% 40%', '45% 55% 60% 40%/40% 45% 55% 60%'],
                        }}
                        transition={{
                            rotate: { duration: 90, repeat: Infinity, ease: 'linear' },
                            borderRadius: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
                        }}
                        className="h-175 w-175"
                        style={{ border: '1.5px solid rgba(230,57,70,0.07)' }}
                    />
                </motion.div>

                {/* Second ring — counter-rotate */}
                <div className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        className="h-105 w-105"
                        style={{ border: '1px solid rgba(212,165,116,0.09)', borderRadius: '60% 40% 45% 55%/55% 60% 40% 45%' }}
                    />
                </div>
            </div>

            {/* Aurora — red left */}
            <motion.div style={{ y: blob1Y }} className="pointer-events-none absolute -left-40 -top-20 h-[660px] w-[660px]">
                <motion.div
                    animate={{ x: [0, 48, 0], scale: [1, 1.18, 1] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full w-full rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.13),transparent 70%)', filter: 'blur(70px)' }}
                />
            </motion.div>

            {/* Aurora — amber bottom-right */}
            <motion.div style={{ y: blob2Y }} className="pointer-events-none absolute -bottom-20 -right-40 h-[680px] w-[680px]">
                <motion.div
                    animate={{ x: [0, -34, 0], y: [0, 28, 0], scale: [1, 1.14, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    className="h-full w-full rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.11),transparent 70%)', filter: 'blur(70px)' }}
                />
            </motion.div>

            {/* Aurora — indigo center */}
            <motion.div style={{ y: blob3Y }} className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
                <motion.div
                    animate={{ opacity: [0.12, 0.32, 0.12], scale: [1, 1.28, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="h-full w-full rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.09),transparent 70%)', filter: 'blur(55px)' }}
                />
            </motion.div>

            {/* Floating hanzi — two parallax speeds */}
            {FLOATING_HANZI.map((h, i) => (
                <motion.div
                    key={i}
                    style={{
                        y: i % 2 === 0 ? hanziY : hanziY2,
                        position: 'absolute',
                        top: h.top,
                        left: (h as { left?: string }).left,
                        right: (h as { right?: string }).right,
                        bottom: (h as { bottom?: string }).bottom,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    <motion.span
                        animate={{ y: [0, -22, 0], rotate: [0, h.rotate, 0] }}
                        transition={{ duration: h.dur, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
                        className="block font-bold leading-none"
                        style={{ fontSize: h.size, color: h.color, fontFamily: "'Noto Serif SC',serif" }}
                        aria-hidden
                    >
                        {h.char}
                    </motion.span>
                </motion.div>
            ))}

            {/* ══════════════════════════════════════════════════════ */}
            {/* ── Content ── */}
            {/* ══════════════════════════════════════════════════════ */}

            <motion.div
                style={{ y: contentY }}
                className="relative mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 lg:px-8"
            >
                <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">

                    {/* ════════════════════════════════════════════ */}
                    {/* ── Left column — full redesign ── */}
                    {/* ════════════════════════════════════════════ */}
                    <div className="relative flex flex-col justify-center lg:col-span-6">

                        {/* Left accent bar */}
                        <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
                            className="absolute -left-5 top-2 bottom-2 hidden w-[3px] origin-top rounded-full lg:block"
                            style={{ background: 'linear-gradient(180deg,transparent,#E63946 30%,#D4A574 70%,transparent)' }}
                        />

                        {/* ── Top row: brand + badge ── */}
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            {/* Brand */}
                            <motion.div
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                                className="flex items-center gap-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-500"
                            >
                                <span className="text-base" style={{ fontFamily: "'Noto Serif SC',serif" }}>🐼</span>
                                <span>Panda Mandarin</span>
                                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                <span
                                    className="font-semibold"
                                    style={{
                                        background: 'linear-gradient(135deg,#E63946,#D4A574)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Est. 2014
                                </span>
                            </motion.div>

                            {/* Live batch badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
                                className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80 dark:text-zinc-300"
                            >
                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                                </span>
                                Batch Juni 2026 — Dibuka!
                                <span className="rounded-full bg-red-500 px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-wide text-white">Baru</span>
                            </motion.div>
                        </div>

                        {/* ── Heading ── */}
                        <div className="mb-5 overflow-hidden">
                            {/* Line 1 — "Kuasai" */}
                            <motion.div
                                initial={{ y: '110%', opacity: 0 }}
                                animate={{ y: '0%', opacity: 1 }}
                                transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
                                className="font-black leading-[0.95] tracking-tight text-zinc-900 dark:text-zinc-100"
                                style={{ fontSize: 'clamp(40px, 5.8vw, 76px)' }}
                            >
                                Kuasai
                            </motion.div>

                            {/* Line 2 — "Mandarin" outline + fill */}
                            <motion.div
                                initial={{ y: '110%', opacity: 0 }}
                                animate={{ y: '0%', opacity: 1 }}
                                transition={{ duration: 0.85, delay: 0.38, ease: EASE }}
                                className="font-black leading-[0.95] tracking-tight"
                                style={{
                                    fontSize: 'clamp(52px, 7.5vw, 96px)',
                                    background: 'linear-gradient(135deg,#E63946 0%,#f97316 50%,#D4A574 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Mandarin
                            </motion.div>

                            {/* Line 3 — "dengan cara yang + rotating word" */}
                            <motion.div
                                initial={{ y: '110%', opacity: 0 }}
                                animate={{ y: '0%', opacity: 1 }}
                                transition={{ duration: 0.85, delay: 0.5, ease: EASE }}
                                className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1"
                                style={{ fontSize: 'clamp(16px, 1.9vw, 26px)' }}
                            >
                                <span className="font-medium text-zinc-500 dark:text-zinc-500">dengan cara yang</span>

                                {/* Rotating word — pill background */}
                                <span className="relative inline-flex items-center overflow-hidden rounded-xl px-4 py-1.5 font-bold text-white"
                                    style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
                                >
                                    {/* Shimmer on the pill */}
                                    <motion.span
                                        animate={{ x: ['-120%', '220%'] }}
                                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                                        className="pointer-events-none absolute inset-0 -skew-x-12"
                                        style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)' }}
                                    />
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={word}
                                            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                                            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                                            exit={{   opacity: 0, y: -20, filter: 'blur(4px)' }}
                                            transition={{ duration: 0.38, ease: EASE }}
                                            className="relative z-10 inline-block"
                                        >
                                            {word}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </motion.div>

                            {/* Chinese line */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.72, ease: EASE }}
                                className="mt-3 font-normal"
                                style={{ fontFamily: "'Noto Serif SC',serif", color: '#b0b0b8', fontSize: 'clamp(14px, 1.4vw, 20px)', letterSpacing: '0.1em' }}
                            >
                                从零基础到流利会话 · 一步一步
                            </motion.div>
                        </div>

                        {/* ── Description ── */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.78, ease: EASE }}
                            className="mb-6 max-w-lg text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400"
                        >
                            <strong className="font-semibold text-zinc-800 dark:text-zinc-200">5.000+ alumni</strong> telah berkarir di perusahaan China, raih{' '}
                            <strong className="font-semibold text-red-500">beasiswa Tsinghua & PKU</strong>, dan menjadi guru profesional.
                            Mulai dari usia 5 tahun!
                        </motion.p>

                        {/* ── CTA buttons ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.96, ease: EASE }}
                            className="mb-7 flex flex-wrap gap-3"
                        >
                            {/* Primary */}
                            <Link
                                href="/placement-test"
                                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30"
                                style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
                            >
                                <motion.span
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                                    className="pointer-events-none absolute inset-0 -skew-x-12"
                                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }}
                                />
                                <span>🎯</span>
                                <span>Placement Test Gratis</span>
                                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>

                            {/* Secondary */}
                            {auth?.user ? (
                                <Link
                                    href={dashboardHref}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-zinc-800 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-zinc-100 dark:hover:bg-slate-900"
                                >
                                    <span>📊</span><span>Dashboard</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/classes"
                                    className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-zinc-800 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-zinc-100 dark:hover:bg-slate-900"
                                >
                                    <span>📚</span><span>Lihat Kelas</span>
                                </Link>
                            )}
                        </motion.div>

                        {/* ── Social proof — glassmorphism card ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 1.02, ease: EASE }}
                            className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/60 px-4 py-3.5 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-900/50"
                        >
                            {/* Subtle inner glow */}
                            <div
                                className="pointer-events-none absolute inset-0 rounded-2xl"
                                style={{ background: 'radial-gradient(ellipse at 0% 50%,rgba(230,57,70,0.05),transparent 65%)' }}
                            />

                            <div className="relative flex items-center gap-4">
                                {/* Avatar stack */}
                                <div className="flex shrink-0 -space-x-2.5">
                                    {AVATAR_STACK.map((a, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 1.08 + idx * 0.07, duration: 0.38, ease: EASE }}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow dark:border-slate-900"
                                            style={{ background: a.gradient, fontFamily: a.hanzi ? "'Noto Serif SC',serif" : undefined }}
                                        >
                                            {a.initials}
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.44, duration: 0.38, ease: EASE }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-zinc-800 text-[8px] font-bold text-zinc-100 shadow dark:border-slate-900"
                                    >
                                        +5k
                                    </motion.div>
                                </div>

                                {/* Divider */}
                                <div className="h-9 w-px shrink-0 bg-zinc-200 dark:bg-slate-700" />

                                {/* Stars + rating */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1.5 + i * 0.07, type: 'spring', stiffness: 520, damping: 18 }}
                                                    className="text-[15px] leading-none text-amber-400"
                                                >★</motion.span>
                                            ))}
                                        </div>
                                        <span className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">4.9</span>
                                        <span className="text-xs text-zinc-400 dark:text-zinc-600">/ 5.0</span>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                                        Dipercaya <strong className="font-semibold text-zinc-700 dark:text-zinc-300">5.000+ alumni</strong> sukses
                                    </p>
                                </div>

                                {/* Verified badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.88, duration: 0.4, ease: EASE }}
                                    className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-900/40 dark:bg-emerald-950/30 sm:flex"
                                >
                                    <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Terpercaya</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ════════════════════════════════════════════ */}
                    {/* ── Right column — App mockup (unchanged) ── */}
                    {/* ════════════════════════════════════════════ */}
                    <motion.div
                        style={{ y: mockupY }}
                        initial={{ opacity: 0, scale: 0.9, x: 24 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.85, delay: 0.35, ease: EASE }}
                        className="relative lg:col-span-6"
                    >
                        <div className="relative mx-auto max-w-[420px] lg:ml-auto">
                            {/* Glow halo */}
                            <div
                                className="pointer-events-none absolute -inset-10 rounded-[3rem]"
                                style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.14),rgba(212,165,116,0.08),transparent)', filter: 'blur(36px)' }}
                            />

                            {/* App window */}
                            <motion.div
                                whileHover={{ scale: 1.012, transition: { duration: 0.3, ease: 'easeOut' } }}
                                className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                {/* Window chrome */}
                                <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/80 px-5 py-3.5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-800/60">
                                    <div className="flex gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 text-center font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
                                        panda.live · kelas
                                    </div>
                                    <div className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
                                        style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                                        ✓ Live
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Lesson screen */}
                                    <div
                                        className="relative mb-4 aspect-video overflow-hidden rounded-2xl"
                                        style={{ background: 'linear-gradient(135deg,#ffe4e6,#fff7ed,#fef3c7)' }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <motion.div
                                                    animate={{ scale: [1, 1.06, 1] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                    className="font-bold leading-none"
                                                    style={{ fontFamily: "'Noto Serif SC',serif", fontSize: 90, color: 'rgba(30,27,28,0.75)' }}
                                                >
                                                    你好
                                                </motion.div>
                                                <div className="mt-1 font-mono text-sm text-zinc-500">nǐ hǎo · halo</div>
                                            </div>
                                        </div>

                                        {/* Teacher */}
                                        <div className="absolute left-3 top-3 flex items-center gap-2">
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow"
                                                style={{ background: 'linear-gradient(135deg,#f43f5e,#fb923c)', fontFamily: "'Noto Serif SC',serif" }}
                                            >王</div>
                                            <div>
                                                <div className="text-[11px] font-semibold text-zinc-800">Wáng Lǎoshī</div>
                                                <div className="font-mono text-[9px] text-zinc-500">HSK 1 · Unit 5</div>
                                            </div>
                                        </div>

                                        {/* Wave bars */}
                                        <div className="absolute bottom-3 left-3 flex h-6 items-end gap-0.5">
                                            {WAVE_BARS.map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 rounded-full bg-red-400"
                                                    style={{ height: `${h}%`, animation: `wave 1s ${i * 0.08}s infinite ease-in-out` }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div>
                                        <div className="mb-1.5 flex justify-between text-xs">
                                            <span className="text-zinc-500 dark:text-zinc-500">Progress minggu ini</span>
                                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">82%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: 'linear-gradient(90deg,#E63946,#D4A574)' }}
                                                initial={{ width: '0%' }}
                                                animate={{ width: '82%' }}
                                                transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
                                            />
                                        </div>
                                        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-zinc-500 dark:text-zinc-600">
                                            <span>5 sesi selesai</span>
                                            <span>+250 XP 🔥</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating badge — top left */}
                            <motion.div
                                initial={{ opacity: 0, x: -16, y: 8 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
                                className="absolute -left-8 top-10 hidden items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95 sm:flex"
                                style={{ animation: 'float 7s ease-in-out 1s infinite' }}
                            >
                                <div className="text-xl">🎖️</div>
                                <div>
                                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">HSK 4 Passed!</div>
                                    <div className="font-mono text-[9px] text-zinc-500">Score: 268/300</div>
                                </div>
                            </motion.div>

                            {/* Floating badge — bottom right */}
                            <motion.div
                                initial={{ opacity: 0, x: 16, y: 8 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
                                className="absolute -right-4 bottom-8 hidden items-center gap-2 rounded-2xl bg-red-500 px-3 py-2.5 shadow-xl sm:flex"
                                style={{ animation: 'float 5s ease-in-out 2s infinite' }}
                            >
                                <div className="text-lg">🎓</div>
                                <div>
                                    <div className="text-[11px] font-bold text-white">CSC Beasiswa Full</div>
                                    <div className="font-mono text-[9px] text-red-200">Tsinghua University</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>

        </section>
    );
}

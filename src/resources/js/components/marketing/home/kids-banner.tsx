'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@inertiajs/react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FloatingChar {
    char: string;
    top: string;
    left?: string;
    right?: string;
    size: number;
    delay: number;
    dur: number;
    rotate: number;
}

const FLOATING_CHARS: FloatingChar[] = [
    { char: '小', top: '12%',  left: '4%',   size: 72, delay: 0,   dur: 6,   rotate: 4  },
    { char: '好', top: '58%',  left: '6%',   size: 56, delay: 1.5, dur: 8,   rotate: -5 },
    { char: '爱', top: '15%',  right: '5%',  size: 64, delay: 0.8, dur: 7,   rotate: 4  },
    { char: '玩', top: '62%',  right: '4%',  size: 50, delay: 2,   dur: 5.5, rotate: -4 },
    { char: '乐', top: '38%',  left: '2%',   size: 44, delay: 1.2, dur: 9,   rotate: 3  },
    { char: '学', top: '35%',  right: '2%',  size: 44, delay: 2.5, dur: 7.5, rotate: -3 },
];

const FEATURES = [
    { emoji: '🎵', label: 'Lagu & Nyanyian' },
    { emoji: '🎮', label: 'Game Interaktif' },
    { emoji: '🎨', label: 'Animasi Lucu' },
    { emoji: '📖', label: 'Cerita Seru' },
];

export function KidsBanner() {
    const ref    = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden py-20 md:py-28"
            style={{ background: 'linear-gradient(155deg, #5C2D3A 0%, #7A4035 32%, #8A5E42 62%, #704A3B 100%)' }}
        >
            {/* ── Background ── */}
            {/* Dot grid — softened */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />

            {/* Ambient glows — softer white halos */}
            <div
                className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%)', filter: 'blur(44px)' }}
            />
            <div
                className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.08),transparent 70%)', filter: 'blur(44px)' }}
            />

            {/* Slow animated warm orbs */}
            <motion.div
                animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.18, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(255,200,160,0.1),transparent 70%)', filter: 'blur(50px)' }}
            />
            <motion.div
                animate={{ x: [0, -25, 0], y: [0, 18, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="pointer-events-none absolute right-1/4 top-1/3 h-56 w-56 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.13),transparent 70%)', filter: 'blur(40px)' }}
            />
            {/* Subtle rose shimmer — lower left */}
            <motion.div
                animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
                className="pointer-events-none absolute -bottom-10 left-1/4 h-64 w-64 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(255,180,140,0.1),transparent 70%)', filter: 'blur(45px)' }}
            />

            {/* Floating hanzi characters */}
            {FLOATING_CHARS.map((c, i) => (
                <motion.div
                    key={i}
                    animate={{ y: [0, -18, 0], rotate: [0, c.rotate, 0] }}
                    transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                    className="pointer-events-none absolute select-none font-bold leading-none text-white/[0.18]"
                    style={{
                        top: c.top,
                        left: c.left,
                        right: c.right,
                        fontSize: c.size,
                        fontFamily: 'var(--font-hanzi)',
                    }}
                    aria-hidden
                >
                    {c.char}
                </motion.div>
            ))}

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

                    {/* ── Left — Panda + floating badges ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.75, ease: EASE }}
                        className="relative flex items-center justify-center py-8"
                    >
                        {/* Pulsing ring behind panda */}
                        <motion.div
                            animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="pointer-events-none absolute h-64 w-64 rounded-full md:h-80 md:w-80"
                            style={{ background: 'radial-gradient(circle,rgba(255,220,190,0.22),transparent 65%)', filter: 'blur(28px)' }}
                        />
                        {/* Outer soft ring */}
                        <motion.div
                            animate={{ scale: [1.1, 1.35, 1.1], opacity: [0.08, 0.16, 0.08] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="pointer-events-none absolute h-72 w-72 rounded-full border border-white/20 md:h-96 md:w-96"
                        />

                        {/* Main panda */}
                        <motion.div
                            animate={{ y: [0, -22, 0], rotate: [0, -3, 3, -1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative z-10 select-none leading-none"
                            style={{ fontSize: 'clamp(120px, 18vw, 200px)' }}
                        >
                            🐼
                        </motion.div>

                        {/* Floating badge — top right */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                            className="absolute right-0 top-4 z-20 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white shadow-xl md:-right-4"
                            style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.32)' }}
                        >
                            <span>🏆</span>
                            <span>Juara Lomba</span>
                        </motion.div>

                        {/* Floating badge — bottom left */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
                            className="absolute bottom-4 left-0 z-20 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white shadow-xl md:-left-4"
                            style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.32)' }}
                        >
                            <span>⭐</span>
                            <span>500+ Siswa Kids</span>
                        </motion.div>

                        {/* Floating rating badge — bottom right */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
                            className="absolute bottom-0 right-4 z-20 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-white shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.32)' }}
                        >
                            <span>🎵</span>
                            <span>4.9 ★</span>
                        </motion.div>
                    </motion.div>

                    {/* ── Right — Content ── */}
                    <div className="text-center lg:text-left">

                        {/* Eyebrow badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}
                        >
                            <span>🐼</span>
                            <span>Kids Program · Usia 5–12 Tahun</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 22 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
                        >
                            Kids, ayo belajar{' '}
                            <span className="underline decoration-white/40 underline-offset-[6px]">
                                Mandarin
                            </span>{' '}
                            bareng Panda! 🎉
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.65, delay: 0.18, ease: EASE }}
                            className="mb-7 text-base leading-relaxed text-white/85 md:text-lg"
                        >
                            Metode belajar yang menyenangkan dengan lagu, game, dan animasi lucu.
                            Anak-anak belajar Mandarin{' '}
                            <strong className="font-bold text-white">tanpa terasa belajar!</strong>
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
                            className="mb-8 flex flex-wrap justify-center gap-2 lg:justify-start"
                        >
                            {FEATURES.map((f, i) => (
                                <motion.span
                                    key={f.label}
                                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                                    animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.32 + i * 0.08, ease: EASE }}
                                    whileHover={{ scale: 1.07, y: -3, transition: { duration: 0.2 } }}
                                    className="flex cursor-default items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
                                    style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' }}
                                >
                                    <span>{f.emoji}</span>
                                    <span>{f.label}</span>
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
                            className="flex flex-wrap justify-center gap-3 lg:justify-start"
                        >
                            <Link
                                href="/classes?filter=kids"
                                className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-[15px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/25"
                                style={{ color: '#7A3D35' }}
                            >
                                <span>👶</span>
                                Lihat Kelas Kids
                                <svg
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <Link
                                href="/placement-test"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/12 hover:-translate-y-0.5"
                            >
                                🎯 Free Trial Class
                            </Link>
                        </motion.div>

                        {/* Social proof strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.56 }}
                            className="mt-6 flex items-center justify-center gap-3 lg:justify-start"
                        >
                            <div className="flex -space-x-2">
                                {['🌟', '🎀', '🦋', '🌈'].map((e, i) => (
                                    <div
                                        key={i}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/30 text-sm"
                                        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
                                    >
                                        {e}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-white/80">
                                <strong className="font-bold text-white">500+</strong> anak sudah bergabung 🎉
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

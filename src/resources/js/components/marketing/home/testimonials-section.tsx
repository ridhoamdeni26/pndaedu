'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TESTIMONIALS } from '@/data/home';
import type { Testimonial } from '@/types/home';

/* ─── Marquee tracks ──────────────────────────────────────── */
const TRACK_A: Testimonial[] = [...TESTIMONIALS, ...TESTIMONIALS];
const TRACK_B: Testimonial[] = [...[...TESTIMONIALS].reverse(), ...[...TESTIMONIALS].reverse()];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Education-themed background data ─────────────────────── */

/* Floating hanzi — learning / achievement themed */
interface BgChar { char: string; top: string; left?: string; right?: string; size: number; dur: number; delay: number; opacity: number; }
const BG_CHARS: BgChar[] = [
    { char: '学', top: '8%',  left: '3%',   size: 110, dur: 24, delay: 0,   opacity: 0.055 },
    { char: '师', top: '70%', left: '2%',   size: 80,  dur: 20, delay: 3.5, opacity: 0.045 },
    { char: '文', top: '20%', right: '3%',  size: 96,  dur: 28, delay: 1.5, opacity: 0.05  },
    { char: '书', top: '65%', right: '2%',  size: 72,  dur: 18, delay: 5,   opacity: 0.042 },
    { char: '华', top: '40%', left: '1.5%', size: 60,  dur: 22, delay: 2,   opacity: 0.038 },
    { char: '才', top: '48%', right: '1%',  size: 58,  dur: 30, delay: 7,   opacity: 0.035 },
    { char: '志', top: '85%', right: '5%',  size: 50,  dur: 16, delay: 4,   opacity: 0.04  },
    { char: '成', top: '5%',  right: '18%', size: 44,  dur: 26, delay: 8,   opacity: 0.03  },
];

/* HSK level floating badges */
interface HskBadge { text: string; hex: string; top: string; left?: string; right?: string; dur: number; delay: number; }
const HSK_BADGES: HskBadge[] = [
    { text: 'HSK 1', hex: '#10B981', top: '16%', left: '8%',   dur: 11, delay: 0   },
    { text: 'HSK 2', hex: '#F59E0B', top: '10%', right: '8%',  dur: 14, delay: 1.8 },
    { text: 'HSK 3', hex: '#8B5CF6', top: '60%', left: '6%',   dur: 9,  delay: 3.2 },
    { text: 'HSK 4', hex: '#0EA5E9', top: '68%', right: '6%',  dur: 12, delay: 0.8 },
    { text: 'HSK 5', hex: '#EC4899', top: '36%', left: '5%',   dur: 16, delay: 4.5 },
    { text: 'HSK 6', hex: '#E63946', top: '32%', right: '5%',  dur: 13, delay: 2.5 },
];

/* ─── Star rating ─────────────────────────────────────────── */
function Stars() {
    return (
        <div className="flex gap-0.5" aria-label="5 stars">
            {[0,1,2,3,4].map((i) => (
                <svg key={i} className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20" aria-hidden>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );
}

/* ─── Single card ─────────────────────────────────────────── */
function TestimonialCard({ t }: { t: Testimonial }) {
    const [imgError, setImgError] = useState(false);
    const accentHex = t.accentHex ?? '#E63946';

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
            className="group relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-slate-600/25 bg-[#142238] p-5 sm:w-85"
            style={{ willChange: 'transform' }}
        >
            {/* Colored top accent line */}
            <div
                className="absolute left-0 top-0 h-0.75 w-full opacity-80"
                style={{ background: accentHex }}
            />

            {/* Hover glow */}
            <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(400px circle at 50% 0%, ${accentHex}10, transparent 70%)` }}
            />

            {/* Stars */}
            <div className="mb-4 mt-1">
                <Stars />
            </div>

            {/* Opening quote */}
            <div
                className="mb-1 font-serif text-5xl leading-none"
                style={{ color: accentHex, opacity: 0.25 }}
                aria-hidden
            >
                "
            </div>

            {/* Quote */}
            <p className="mb-5 text-[13px] leading-relaxed text-zinc-300">
                {t.quote}
            </p>

            {/* Author row */}
            <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0">
                    {!imgError && t.avatar ? (
                        <img
                            src={t.avatar}
                            alt={t.name}
                            onError={() => setImgError(true)}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                            loading="lazy"
                        />
                    ) : (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-xs font-bold text-white`}>
                            {t.initials}
                        </div>
                    )}
                    <span
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#142238]"
                        style={{ background: accentHex }}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-100">{t.name}</p>
                    <p className="truncate font-mono text-[10px] text-zinc-500">{t.achievement}</p>
                </div>

                <span
                    className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider"
                    style={{ background: `${accentHex}18`, color: accentHex }}
                >
                    {t.level}
                </span>
            </div>
        </motion.div>
    );
}

/* ─── Marquee row ─────────────────────────────────────────── */
function MarqueeRow({ items, direction, duration }: {
    items: Testimonial[];
    direction: 'left' | 'right';
    duration: number;
}) {
    const [paused, setPaused] = useState(false);

    return (
        <div
            className="relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 sm:w-40"
                 style={{ background: 'linear-gradient(to right, #0C1A2E, transparent)' }} />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 sm:w-40"
                 style={{ background: 'linear-gradient(to left, #0C1A2E, transparent)' }} />

            <div
                className="flex w-max gap-4"
                style={{
                    animationName: direction === 'left' ? 'marquee-left' : 'marquee-right',
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: paused ? 'paused' : 'running',
                }}
            >
                {items.map((t, i) => (
                    <TestimonialCard key={`${t.initials}-${i}`} t={t} />
                ))}
            </div>
        </div>
    );
}

/* ─── Section ─────────────────────────────────────────────── */
export function TestimonialsSection() {
    const headingRef = useRef<HTMLDivElement>(null);
    const inView = useInView(headingRef, { once: true, margin: '-80px' });

    return (
        <section className="relative overflow-hidden py-20 md:py-28" style={{ background: '#0C1A2E' }}>

            {/* ══════════════════════════════════════
                BACKGROUND — education theme
            ══════════════════════════════════════ */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>

                {/* ── 方格纸 calligraphy practice grid ── */}
                {/* Outer grid lines */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: [
                            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
                            'linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                            'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px)',
                            'linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)',
                        ].join(','),
                        backgroundSize: '64px 64px, 64px 64px, 32px 32px, 32px 32px',
                    }}
                />
                {/* Diagonal guide lines (米字格 米 character guide) — very faint */}
                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage: [
                            'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 45.25px)',
                            'repeating-linear-gradient(-45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 45.25px)',
                        ].join(','),
                        backgroundSize: '64px 64px',
                    }}
                />

                {/* ── Aurora blobs ── */}
                <motion.div
                    animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.88, 0.5] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.18),transparent 70%)', filter: 'blur(60px)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0.72, 0.4], x: [0, -24, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    className="absolute bottom-0 left-1/2 h-72 w-150 -translate-x-1/2 translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.2),transparent 70%)', filter: 'blur(60px)' }}
                />
                <motion.div
                    animate={{ x: [0, 28, 0], y: [0, -16, 0], opacity: [0.12, 0.26, 0.12] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
                    className="absolute -left-24 top-1/3 h-80 w-80 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(194,68,10,0.2),transparent 70%)', filter: 'blur(70px)' }}
                />
                <motion.div
                    animate={{ x: [0, -18, 0], y: [0, 22, 0], opacity: [0.1, 0.22, 0.1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute -right-20 top-1/4 h-72 w-72 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(245,158,11,0.16),transparent 70%)', filter: 'blur(65px)' }}
                />

                {/* ── Large floating hanzi ── */}
                {BG_CHARS.map((c, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -20, 0], rotate: [0, c.delay % 2 === 0 ? 4 : -4, 0] }}
                        transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                        className="absolute select-none font-bold leading-none text-white"
                        style={{
                            top: c.top,
                            left: c.left,
                            right: c.right,
                            fontSize: c.size,
                            fontFamily: 'var(--font-hanzi)',
                            opacity: c.opacity,
                        }}
                    >
                        {c.char}
                    </motion.div>
                ))}

                {/* ── HSK level floating badges ── */}
                {HSK_BADGES.map((b) => (
                    <motion.div
                        key={b.text}
                        animate={{ y: [0, -10, 0], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
                        className="absolute hidden items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold lg:flex"
                        style={{
                            top: b.top,
                            left: b.left,
                            right: b.right,
                            borderColor: `${b.hex}35`,
                            background: `${b.hex}12`,
                            color: b.hex,
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        <motion.span
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: b.delay }}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: b.hex }}
                        />
                        {b.text}
                    </motion.div>
                ))}

                {/* ── Ink brush stroke — decorative top-left arc ── */}
                <motion.svg
                    className="absolute -left-10 top-0 h-72 w-72 opacity-[0.06]"
                    viewBox="0 0 200 200"
                    fill="none"
                    animate={{ opacity: [0.04, 0.09, 0.04], rotate: [0, 3, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <path
                        d="M 20 160 Q 40 20 160 40 Q 180 50 170 80 Q 155 110 120 100 Q 80 88 70 120 Q 60 150 90 165"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                    />
                </motion.svg>

                {/* ── Second ink stroke — bottom right ── */}
                <motion.svg
                    className="absolute -right-8 bottom-10 h-64 w-64 opacity-[0.05]"
                    viewBox="0 0 200 200"
                    fill="none"
                    animate={{ opacity: [0.03, 0.07, 0.03], rotate: [0, -4, 0] }}
                    transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                >
                    <path
                        d="M 170 40 Q 160 80 130 90 Q 100 100 110 130 Q 118 155 95 170 Q 70 185 50 160"
                        stroke="rgba(212,165,116,1)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="none"
                    />
                </motion.svg>

                {/* ── Animated writing brush dot trail ── */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={`dot-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: 3 + i * 1.5,
                            height: 3 + i * 1.5,
                            background: 'rgba(230,57,70,0.5)',
                            top: `${22 + i * 8}%`,
                            right: `${12 + i * 2}%`,
                        }}
                        animate={{
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.55,
                            ease: 'easeInOut',
                        }}
                    />
                ))}

                {/* ── Diagonal sweep shimmer ── */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.025) 50%, transparent 60%)',
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
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
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'none' : 'translateY(24px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 backdrop-blur-sm"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-1.5 w-1.5 rounded-full bg-amber-400"
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                            Cerita Sukses
                        </span>
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        {['Mereka', 'mulai', 'dari', 'sini,'].map((word, i) => (
                            <motion.span
                                key={word + i}
                                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                                animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                                transition={{ duration: 0.5, delay: 0.08 + i * 0.08, ease: EASE }}
                                className="mr-2 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                        <br className="hidden sm:block" />
                        {'sekarang '.split('').length > 0 && (
                            <motion.span
                                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                                animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                                transition={{ duration: 0.5, delay: 0.44, ease: EASE }}
                                className="mr-2 inline-block"
                            >
                                sekarang
                            </motion.span>
                        )}
                        <motion.span
                            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                            transition={{ duration: 0.5, delay: 0.54, ease: EASE }}
                            className="inline-block"
                            style={{
                                background: 'linear-gradient(135deg,#fc6d75 0%,#fbbf24 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            luar biasa.
                        </motion.span>
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.64, ease: EASE }}
                        className="mx-auto mt-4 max-w-lg text-base text-zinc-500"
                    >
                        5.000+ alumni telah membuktikan. Kini giliran kamu menulis cerita suksesmu.
                    </motion.p>
                </div>

                {/* ── Stats row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                    className="mb-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8"
                >
                    {[
                        { val: '5.000+', label: 'Alumni Aktif',         hex: '#fc6d75' },
                        { val: '95%',    label: 'Lulus HSK Ujian Pertama', hex: '#fbbf24' },
                        { val: '200+',   label: 'Penerima Beasiswa',    hex: '#34d399' },
                        { val: '4.9★',   label: 'Rating Google',        hex: '#a78bfa' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE }}
                            className="text-center"
                        >
                            <div
                                className="text-xl font-bold sm:text-2xl"
                                style={{ color: s.hex, textShadow: `0 0 24px ${s.hex}50` }}
                            >
                                {s.val}
                            </div>
                            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* ── Marquee rows ── */}
            <div className="space-y-4">
                <MarqueeRow items={TRACK_A} direction="left"  duration={38} />
                <div className="hidden sm:block">
                    <MarqueeRow items={TRACK_B} direction="right" duration={44} />
                </div>
            </div>

            {/* ── Bottom CTA ── */}
            <div className="mx-auto mt-14 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="inline-flex flex-wrap items-center justify-center gap-3"
                >
                    <a
                        href="https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Panda!+Saya+ingin+mulai+belajar+Mandarin."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-red-500/20"
                        style={{ background: 'linear-gradient(135deg,#E63946,#c2410c)' }}
                    >
                        Mulai Perjalananmu Sekarang
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                    <a
                        href="/placement-test"
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:text-white"
                    >
                        🎯 Coba Placement Test Gratis
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

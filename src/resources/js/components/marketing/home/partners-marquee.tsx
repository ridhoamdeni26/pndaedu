'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Partner data ────────────────────────────────────────── */

interface Partner {
    short: string;   // 清华
    full: string;    // 清华大学 (shown as tooltip / full context)
    latin: string;   // Tsinghua University
    city: string;    // Beijing
    char: string;    // decorative bg character
    hex: string;     // accent colour
}

const PARTNERS: Partner[] = [
    { short: '清华', full: '清华大学',    latin: 'Tsinghua University',  city: 'Beijing',  char: '华', hex: '#7c3aed' },
    { short: '北大', full: '北京大学',    latin: 'Peking University',    city: 'Beijing',  char: '北', hex: '#0369a1' },
    { short: '复旦', full: '复旦大学',    latin: 'Fudan University',     city: 'Shanghai', char: '复', hex: '#be123c' },
    { short: '交大', full: '上海交大',    latin: 'Shanghai Jiao Tong',   city: 'Shanghai', char: '交', hex: '#b45309' },
    { short: '浙大', full: '浙江大学',    latin: 'Zhejiang University',  city: 'Hangzhou', char: '浙', hex: '#065f46' },
    { short: '北语', full: '北京语言大学', latin: 'BLCU',                city: 'Beijing',  char: '语', hex: '#9d174d' },
    { short: '南大', full: '南京大学',    latin: 'Nanjing University',   city: 'Nanjing',  char: '南', hex: '#3730a3' },
    { short: '天大', full: '天津大学',    latin: 'Tianjin University',   city: 'Tianjin',  char: '天', hex: '#c2410c' },
];

/* duplicate for seamless loop */
const TRACK_A: Partner[] = [...PARTNERS, ...PARTNERS];
const TRACK_B: Partner[] = [...[...PARTNERS].reverse(), ...[...PARTNERS].reverse()];

/* ─── Single university card ──────────────────────────────── */

function PartnerCard({ p }: { p: Partner }) {
    return (
        <motion.div
            title={p.full}
            whileHover={{ y: -6, scale: 1.05, transition: { duration: 0.2, ease: 'easeOut' } }}
            className="group relative w-[192px] shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900"
        >
            {/* Left accent stripe — grows on hover */}
            <div
                className="absolute left-0 top-3 h-[calc(100%-24px)] w-[3px] rounded-r-full transition-all duration-300 group-hover:top-2 group-hover:h-[calc(100%-16px)]"
                style={{ background: p.hex, opacity: 0.55 }}
            />

            {/* Background decorative character — reveals on hover */}
            <div
                className="pointer-events-none absolute -right-1 -top-1 select-none font-bold leading-none transition-opacity duration-500 group-hover:opacity-[0.12]"
                style={{ fontFamily: 'var(--font-hanzi)', fontSize: '72px', color: p.hex, opacity: 0.045 }}
                aria-hidden
            >
                {p.char}
            </div>

            {/* Colour wash on hover */}
            <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${p.hex}0c, transparent 55%)` }}
            />

            {/* Content */}
            <div className="relative z-10 pl-3">
                {/* Chinese name — hero element */}
                <p
                    className="font-bold leading-none text-zinc-900 dark:text-zinc-100"
                    style={{ fontFamily: 'var(--font-hanzi)', fontSize: '22px' }}
                >
                    {p.short}
                </p>

                {/* Latin name */}
                <p className="mt-1.5 text-[11px] font-medium leading-snug text-zinc-500 dark:text-zinc-400">
                    {p.latin}
                </p>

                {/* City dot + label */}
                <div className="mt-2.5 flex items-center gap-1.5">
                    <span
                        className="h-[5px] w-[5px] rounded-full"
                        style={{ background: p.hex, opacity: 0.7 }}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
                        {p.city}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Scrolling row ───────────────────────────────────────── */

function MarqueeRow({
    items,
    direction,
    duration,
}: {
    items: Partner[];
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
            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-linear-to-r from-[#FDFAF6] to-transparent dark:from-[#080F1C] sm:w-40" />
            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-linear-to-l from-[#FDFAF6] to-transparent dark:from-[#080F1C] sm:w-40" />

            <div
                className="flex w-max gap-3 px-3 py-2"
                style={{
                    animationName: direction === 'left' ? 'marquee-left' : 'marquee-right',
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: paused ? 'paused' : 'running',
                }}
            >
                {items.map((p, i) => (
                    <PartnerCard key={`${p.short}-${i}`} p={p} />
                ))}
            </div>
        </div>
    );
}

/* ─── Section ─────────────────────────────────────────────── */

export function PartnersMarquee() {
    const headingRef = useRef<HTMLDivElement>(null);
    const inView = useInView(headingRef, { once: true, margin: '-80px' });

    return (
        <section className="dot-grid overflow-hidden border-y border-amber-100/80 bg-[#FDFAF6] py-16 dark:border-slate-800/60 dark:bg-[#080F1C] md:py-24">

            {/* ── Header ── */}
            <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    ref={headingRef}
                    className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'none' : 'translateY(22px)',
                        transition: 'opacity 0.65s ease, transform 0.65s ease',
                    }}
                >
                    {/* Left — label + heading */}
                    <div className="max-w-md">
                        {/* Dual-script label — the crafted touch */}
                        <div className="mb-4 flex items-center gap-3">
                            <span
                                className="font-bold text-zinc-800 dark:text-zinc-200"
                                style={{ fontFamily: 'var(--font-hanzi)', fontSize: '13px', letterSpacing: '0.05em' }}
                            >
                                合作大学
                            </span>
                            <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">
                                Mitra Resmi
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold leading-snug text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                            Pintu menuju kampus{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg,#E63946 0%,#D4A574 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                terbaik China
                            </span>{' '}
                            ada di sini.
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                            Alumni Panda telah lolos ke 8 universitas prestisius — dari Beijing hingga Shanghai — dengan beasiswa penuh.
                        </p>
                    </div>

                    {/* Right — stat + CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
                        className="flex shrink-0 flex-col items-start gap-1 sm:items-end"
                    >
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-black tabular-nums text-zinc-900 dark:text-zinc-100">
                                200
                            </span>
                            <span
                                className="text-2xl font-black"
                                style={{
                                    background: 'linear-gradient(135deg,#E63946,#D4A574)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                +
                            </span>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-600">
                            Alumni berhasil lolos
                        </p>
                        <a
                            href="/college-china"
                            className="group mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                            Pelajari caranya
                            <svg
                                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* ── Marquee rows — full bleed, no max-w ── */}
            <div className="space-y-3">
                <MarqueeRow items={TRACK_A} direction="left"  duration={38} />
                <MarqueeRow items={TRACK_B} direction="right" duration={46} />
            </div>

            {/* ── Bottom university count strip ── */}
            <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-700">
                        Termasuk
                    </span>
                    {PARTNERS.map((p, i) => (
                        <span key={p.short} className="flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-600">
                            <span
                                className="font-bold"
                                style={{ fontFamily: 'var(--font-hanzi)', color: p.hex, opacity: 0.8 }}
                            >
                                {p.short}
                            </span>
                            {i < PARTNERS.length - 1 && (
                                <span className="text-zinc-300 dark:text-zinc-800">·</span>
                            )}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

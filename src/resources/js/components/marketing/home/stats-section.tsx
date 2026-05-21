'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Counter } from './counter';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATS = [
    {
        emoji: '🎓',
        target: 5000,
        suffix: '+',
        label: 'Alumni Sukses',
        desc: 'Berkarir & kuliah di perusahaan China',
        hex: '#fc6d75',
    },
    {
        emoji: '📈',
        target: 95,
        suffix: '%',
        label: 'HSK Pass Rate',
        desc: 'Lulus ujian di percobaan pertama',
        hex: '#fbbf24',
    },
    {
        emoji: '👩‍🏫',
        target: 20,
        suffix: '+',
        label: 'Native Teachers',
        desc: 'Alumni Tsinghua, PKU & BLCU China',
        hex: '#34d399',
    },
    {
        emoji: '⭐',
        target: 10,
        suffix: '+',
        label: 'Tahun Pengalaman',
        desc: 'Berdiri & terpercaya sejak 2014',
        hex: '#a78bfa',
    },
] as const;

export function StatsSection() {
    const ref    = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-y py-12 md:py-16"
            style={{ background: '#0C1A2E', borderColor: '#1A3050' }}
        >
            {/* ── Animated aurora blobs ── */}
            <motion.div
                animate={{ x: [0, 45, 0], y: [0, -22, 0], scale: [1, 1.22, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -left-20 -top-10 h-80 w-80 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.32),transparent 70%)', filter: 'blur(55px)' }}
            />
            {/* Warm amber — replaces cold indigo */}
            <motion.div
                animate={{ x: [0, -32, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="pointer-events-none absolute -bottom-10 -right-16 h-80 w-80 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.28),transparent 70%)', filter: 'blur(55px)' }}
            />
            {/* Central amber pulse */}
            <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.18, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(ellipse,rgba(212,165,116,0.16),transparent 70%)', filter: 'blur(40px)' }}
            />
            {/* Terracotta — upper right */}
            <motion.div
                animate={{ x: [0, -20, 0], y: [0, 18, 0], opacity: [0.18, 0.35, 0.18] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
                className="pointer-events-none absolute -right-12 top-0 h-56 w-56 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(194,68,10,0.22),transparent 70%)', filter: 'blur(50px)' }}
            />

            {/* Grid + shimmer */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
                    backgroundSize: '52px 52px',
                }}
            />
            <div
                className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }}
            />

            {/* ── Cards ── */}
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 36 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.13, ease: EASE }}
                            whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
                            className="group relative overflow-hidden rounded-3xl border"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                borderColor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            {/* Top color wash */}
                            <div
                                className="pointer-events-none absolute left-0 right-0 top-0 h-24 rounded-t-[inherit]"
                                style={{ background: `linear-gradient(180deg,${s.hex}22,transparent)` }}
                            />

                            {/* Hover glow overlay */}
                            <div
                                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{ background: `radial-gradient(circle at 50% 0%,${s.hex}12,transparent 70%)` }}
                            />

                            {/* Pulsing corner dot */}
                            <motion.span
                                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                                className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full"
                                style={{ background: s.hex }}
                            />

                            <div className="relative z-10 p-5 pb-7 md:p-6 md:pb-8">
                                {/* Icon */}
                                <motion.div
                                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                                    style={{
                                        background: `${s.hex}1e`,
                                        boxShadow: `0 0 20px ${s.hex}28`,
                                    }}
                                    animate={{ boxShadow: [`0 0 20px ${s.hex}28`, `0 0 32px ${s.hex}44`, `0 0 20px ${s.hex}28`] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                                    whileHover={{ scale: 1.12, rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                                >
                                    {s.emoji}
                                </motion.div>

                                {/* Number */}
                                <div
                                    className="mb-1 text-4xl font-black leading-none md:text-5xl"
                                    style={{ color: 'white', textShadow: `0 0 28px ${s.hex}65` }}
                                >
                                    <Counter target={s.target} suffix={s.suffix} />
                                </div>

                                {/* Label */}
                                <div
                                    className="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                                    style={{ color: s.hex }}
                                >
                                    {s.label}
                                </div>

                                {/* Description */}
                                <p
                                    className="mt-1.5 text-[11.5px] leading-relaxed"
                                    style={{ color: 'rgba(148,163,184,0.75)' }}
                                >
                                    {s.desc}
                                </p>
                            </div>

                            {/* Bottom accent bar — animated fill on scroll */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[inherit]"
                                style={{ background: 'rgba(255,255,255,0.06)' }}
                            >
                                <motion.div
                                    className="h-full"
                                    style={{ background: `linear-gradient(90deg,${s.hex},${s.hex}66)`, borderRadius: 'inherit' }}
                                    initial={{ width: '0%' }}
                                    animate={inView ? { width: '100%' } : { width: '0%' }}
                                    transition={{ duration: 1.5, delay: i * 0.18 + 0.5, ease: EASE }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { register } from '@/routes';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATS = [
    { val: '5.000+', label: 'Alumni Aktif',    glow: '#fc6d75' },
    { val: '95%',    label: 'Lulus HSK',        glow: '#fbbf24' },
    { val: '200+',   label: 'Beasiswa',         glow: '#34d399' },
    { val: '4.9★',   label: 'Rating Google',    glow: '#a78bfa' },
];

const TRUST = ['Trial class gratis', 'Tanpa biaya pendaftaran', 'Garansi uang kembali', 'Jadwal fleksibel'];

export function FinalCta() {
    const ref    = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden py-24 md:py-36"
            style={{ background: '#0C1A2E' }}
        >
            {/* ── Background ── */}
            <div className="pointer-events-none absolute inset-0">
                {/* Central aurora – pulses */}
                <motion.div
                    animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.28, 0.18] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(circle,#E63946,transparent 65%)', filter: 'blur(90px)' }}
                />

                {/* Warm gold – lower right, slow drift (replaces cold indigo) */}
                <motion.div
                    animate={{ x: [0, -24, 0], y: [0, 18, 0], opacity: [0.2, 0.38, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-20 right-0 h-96 w-96 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.45),transparent 65%)', filter: 'blur(70px)' }}
                />

                {/* Terracotta – upper left, slow drift */}
                <motion.div
                    animate={{ x: [0, 22, 0], y: [0, -16, 0], opacity: [0.15, 0.28, 0.15] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -left-16 -top-16 h-72 w-72 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(194,68,10,0.38),transparent 70%)', filter: 'blur(60px)' }}
                />

                {/* Extra rose glow — lower left */}
                <motion.div
                    animate={{ x: [0, 16, 0], y: [0, -10, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
                    className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.22),transparent 70%)', filter: 'blur(55px)' }}
                />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Animated shimmer lines */}
                <motion.div
                    animate={{ opacity: [0.04, 0.12, 0.04] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 top-1/4 h-px"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,1),transparent)' }}
                />
                <motion.div
                    animate={{ opacity: [0.04, 0.09, 0.04] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute left-0 right-0 top-3/4 h-px"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,1),transparent)' }}
                />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                {/* ── Top badge ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-8 flex justify-center"
                >
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 px-5 py-2" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                        <motion.span
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-1.5 w-1.5 rounded-full bg-green-400"
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                            Trial Class Gratis · Tanpa Biaya Pendaftaran
                        </span>
                    </div>
                </motion.div>

                {/* ── Main heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
                    className="mb-5 text-center"
                >
                    <h2
                        className="font-bold leading-tight text-white"
                        style={{ fontSize: 'clamp(36px,5.5vw,70px)' }}
                    >
                        Mulai perjalanan
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg,#fc6d75 0%,#fbbf24 55%,#fb923c 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Mandarin-mu hari ini.
                        </span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
                    className="mx-auto mb-10 max-w-lg text-center text-base leading-relaxed text-zinc-400 md:text-lg"
                >
                    Konsultasi gratis, placement test, dan langsung trial class minggu ini.
                    <br className="hidden sm:block" />
                    Tanpa biaya pendaftaran.
                </motion.p>

                {/* ── Stats ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.28, ease: EASE }}
                    className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                    {STATS.map((s) => (
                        <div
                            key={s.label}
                            className="flex flex-col items-center gap-1 rounded-2xl border border-white/[0.07] py-4 text-center"
                            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                        >
                            <div
                                className="text-2xl font-black text-white md:text-3xl"
                                style={{ textShadow: `0 0 40px ${s.glow}60` }}
                            >
                                {s.val}
                            </div>
                            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* ── CTA buttons ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.38, ease: EASE }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {/* Primary – pulsing glow */}
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-2xl"
                            style={{ background: 'linear-gradient(135deg,#E63946,#c2410c)', filter: 'blur(18px)' }}
                        />
                        <Link
                            href="/placement-test"
                            className="relative z-10 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold text-white transition-all hover:opacity-95 hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg,#E63946,#c2410c)' }}
                        >
                            🎯 Mulai Placement Test
                        </Link>
                    </div>

                    <Link
                        href={register.url()}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
                    >
                        📝 Daftar Gratis
                    </Link>

                    <a
                        href="https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Admin+Panda%2C+saya+ingin+konsultasi+kelas+Mandarin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
                    >
                        💬 Konsultasi WhatsApp
                    </a>
                </motion.div>

                {/* ── Trust badges ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2"
                >
                    {TRUST.map((t) => (
                        <span key={t} className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600">
                            <span className="text-green-500">✓</span>
                            {t}
                        </span>
                    ))}
                </motion.div>

                {/* ── Floating social proof card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
                    className="mx-auto mt-14 max-w-sm"
                >
                    {/* Subtle top glow on card */}
                    <div className="relative">
                        <div
                            className="absolute -inset-x-4 -top-4 h-16 rounded-full opacity-30"
                            style={{ background: 'radial-gradient(ellipse,#E6394640,transparent 70%)', filter: 'blur(20px)' }}
                        />
                        <div
                            className="relative flex items-center gap-4 rounded-2xl border border-white/[0.08] px-5 py-4"
                            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}
                        >
                            {/* Avatar */}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-orange-400 text-sm font-bold text-white">
                                SR
                            </div>

                            {/* Name + achievement */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-semibold text-zinc-200">Siti Rahma</p>
                                <p className="truncate font-mono text-[10px] text-zinc-500">
                                    Beasiswa CSC Penuh — Tsinghua University
                                </p>
                            </div>

                            {/* Stars */}
                            <div className="shrink-0 text-xs tracking-tight text-amber-400">★★★★★</div>
                        </div>
                    </div>

                    {/* Caption */}
                    <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                        Bergabung dengan 5.000+ alumni Panda
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

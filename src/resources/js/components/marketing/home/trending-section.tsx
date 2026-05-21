'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@inertiajs/react';
import type { CourseClass } from '@/types/home';
import { CLASSES } from '@/data/home';
import { daysUntil } from './utils';
import { ClassCard } from './class-card';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SOON_THRESHOLD = 21;

/* ── Categorise classes ─────────────────────────────────────── */

const soonClasses: CourseClass[] = CLASSES
    .filter((c) => {
        if (c.enrolled >= c.maxS) return false;
        const d = daysUntil(c.batch.start);
        return d !== null && d >= 0 && d <= SOON_THRESHOLD;
    })
    .sort((a, b) => (daysUntil(a.batch.start) ?? 999) - (daysUntil(b.batch.start) ?? 999))
    .slice(0, 4);

const soonIds = new Set(soonClasses.map((c) => c.id));

const availableClasses: CourseClass[] = CLASSES
    .filter((c) => c.enrolled < c.maxS && !soonIds.has(c.id))
    .slice(0, 4);

/* ── Sub-section header ─────────────────────────────────────── */

function SubHeader({
    icon,
    title,
    subtitle,
    accent,
    inView,
    delay,
}: {
    icon: string;
    title: string;
    subtitle: string;
    accent: string;
    inView: boolean;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: EASE }}
            className="mb-6 flex items-center gap-4"
        >
            {/* Icon badge */}
            <motion.div
                animate={{ rotate: [0, -6, 6, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm"
                style={{ background: `${accent}18`, boxShadow: `0 0 0 1px ${accent}28` }}
            >
                {icon}
            </motion.div>

            <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-600">{subtitle}</p>
            </div>

            {/* Divider line */}
            <div
                className="hidden flex-1 md:block"
                style={{ height: '1px', background: `linear-gradient(90deg,${accent}40,transparent)` }}
            />
        </motion.div>
    );
}

/* ── Seats-at-a-glance strip (shown per section) ─────────────── */

function SeatsStrip({ classes, inView, delay }: { classes: CourseClass[]; inView: boolean; delay: number }) {
    const urgentCount = classes.filter((c) => {
        const r = c.maxS - c.enrolled;
        return r > 0 && r <= 2;
    }).length;

    if (urgentCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay, ease: EASE }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200/60 bg-red-50 px-3.5 py-1.5 dark:border-red-900/30 dark:bg-red-950/20"
        >
            <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="h-1.5 w-1.5 rounded-full bg-red-500"
            />
            <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                {urgentCount} kelas tersisa ≤ 2 kursi — daftar sekarang!
            </span>
        </motion.div>
    );
}

/* ── Empty state ────────────────────────────────────────────── */

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-200 py-10 text-center dark:border-slate-700">
            <span className="text-3xl">📭</span>
            <p className="text-sm text-zinc-400">Tidak ada kelas {label} saat ini.</p>
            <Link href="/classes" className="text-xs font-semibold text-red-500 hover:text-red-600">
                Lihat semua kelas →
            </Link>
        </div>
    );
}

/* ── Main section ───────────────────────────────────────────── */

interface TrendingSectionProps {
    onConsult: (cls: CourseClass) => void;
    onAddCart: (cls: CourseClass) => void;
}

export function TrendingSection({ onConsult, onAddCart }: TrendingSectionProps) {
    const headingRef = useRef<HTMLDivElement>(null);
    const soonRef    = useRef<HTMLDivElement>(null);
    const availRef   = useRef<HTMLDivElement>(null);

    const inView      = useInView(headingRef, { once: true, margin: '-80px' });
    const soonInView  = useInView(soonRef,    { once: true, margin: '-60px' });
    const availInView = useInView(availRef,   { once: true, margin: '-60px' });

    return (
        <section className="relative overflow-hidden bg-[#FDFAF6] py-20 dark:bg-[#080F1C] md:py-28">

            {/* ── Background ── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.032] dark:opacity-[0.025]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,1) 1px,transparent 1px)',
                    backgroundSize: '52px 52px',
                }}
            />
            <motion.div
                animate={{ x: [0, 28, 0], y: [0, -18, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.08),transparent 70%)', filter: 'blur(55px)' }}
            />
            <motion.div
                animate={{ x: [0, -22, 0], y: [0, 14, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                className="pointer-events-none absolute -right-20 bottom-24 h-80 w-80 rounded-full"
                style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.08),transparent 70%)', filter: 'blur(55px)' }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Section header ── */}
                <div ref={headingRef} className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, ease: EASE }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/60 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900/60"
                        >
                            <motion.span
                                animate={{ scale: [1, 1.35, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-1.5 w-1.5 rounded-full bg-red-500"
                            />
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                                Kelas Tersedia
                            </span>
                        </motion.div>

                        <h2 className="text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
                            Kelas pilihan{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg,#E63946,#D4A574)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                untukmu.
                            </span>
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-600">
                            Tampil kelas aktif & akan segera mulai. Untuk daftar lengkap, kunjungi{' '}
                            <Link href="/classes" className="font-semibold text-red-500 hover:underline">
                                Kelas Kami
                            </Link>
                            .
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 14 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                    >
                        <Link
                            href="/classes"
                            className="group inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-red-200 hover:shadow-md dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-300 dark:hover:border-red-800"
                        >
                            Lihat Semua Kelas
                            <svg
                                className="h-3.5 w-3.5 text-red-500 transition-transform duration-200 group-hover:translate-x-0.5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

                {/* ══════════════════════════════════════════════ */}
                {/* ── SEGERA MULAI ── */}
                {/* ══════════════════════════════════════════════ */}
                <div ref={soonRef} className="mb-14">
                    <SubHeader
                        icon="⚡"
                        title="Segera Mulai"
                        subtitle={`Kelas yang mulai dalam ${SOON_THRESHOLD} hari ke depan — kursi terbatas!`}
                        accent="#E63946"
                        inView={soonInView}
                        delay={0}
                    />

                    <SeatsStrip classes={soonClasses} inView={soonInView} delay={0.1} />

                    {soonClasses.length === 0 ? (
                        <EmptyState label="yang segera mulai" />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {soonClasses.map((cls, i) => (
                                <ClassCard
                                    key={cls.id}
                                    cls={cls}
                                    index={i}
                                    onConsult={onConsult}
                                    onAddCart={onAddCart}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ══════════════════════════════════════════════ */}
                {/* ── MASIH TERSEDIA ── */}
                {/* ══════════════════════════════════════════════ */}
                <div ref={availRef} className="mb-12">
                    <SubHeader
                        icon="✅"
                        title="Masih Tersedia"
                        subtitle="Kelas terbuka — daftar kapan saja sesuai jadwalmu"
                        accent="#10b981"
                        inView={availInView}
                        delay={0}
                    />

                    {availableClasses.length === 0 ? (
                        <EmptyState label="yang tersedia" />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {availableClasses.map((cls, i) => (
                                <ClassCard
                                    key={cls.id}
                                    cls={cls}
                                    index={i}
                                    onConsult={onConsult}
                                    onAddCart={onAddCart}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bottom CTA strip ── */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="flex flex-col gap-4 overflow-hidden rounded-3xl border p-6 sm:flex-row sm:items-center md:p-8"
                    style={{
                        background: 'linear-gradient(135deg,rgba(230,57,70,0.05),rgba(212,165,116,0.04))',
                        borderColor: 'rgba(230,57,70,0.18)',
                    }}
                >
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -5, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                        className="shrink-0 select-none text-5xl"
                    >
                        🎯
                    </motion.div>

                    <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            Belum tahu harus mulai dari mana?
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">
                            Ikuti Placement Test gratis 5 menit — kami rekomendasikan kelas yang paling tepat. Atau cek{' '}
                            <Link href="/classes" className="font-semibold text-red-500 hover:underline">
                                50+ kelas lainnya
                            </Link>{' '}
                            di halaman Kelas Kami.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                        <Link
                            href="/placement-test"
                            className="whitespace-nowrap rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 hover:shadow-red-500/30"
                        >
                            Mulai Placement Test →
                        </Link>
                        <Link
                            href="/classes"
                            className="whitespace-nowrap rounded-2xl border border-zinc-200 px-5 py-3 text-center text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Lihat Kelas Kami
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

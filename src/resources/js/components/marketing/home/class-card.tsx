'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourseClass } from '@/types/home';
import { fmtDate, fmtRp, daysUntil, seatBarBg } from './utils';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function seatChipColor(enrolled: number, maxS: number): { text: string; bg: string; border: string } {
    const remaining = maxS - enrolled;
    if (remaining <= 0)  return { text: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
    if (remaining <= 2)  return { text: '#ef4444', bg: '#fff7f7', border: '#fecaca' };
    if (remaining <= 4)  return { text: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
    return               { text: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' };
}

interface ClassCardProps {
    cls: CourseClass;
    onConsult: (cls: CourseClass) => void;
    onAddCart: (cls: CourseClass) => void;
    index?: number;
}

export function ClassCard({ cls, onConsult, onAddCart, index = 0 }: ClassCardProps) {
    const [added, setAdded] = useState(false);

    const isFull         = cls.enrolled >= cls.maxS;
    const deadline       = daysUntil(cls.batch.deadline);
    const daysUntilStart = daysUntil(cls.batch.start);
    const isUrgent       = deadline !== null && deadline <= 7 && !isFull;
    const isSoon         = !isUrgent && daysUntilStart !== null && daysUntilStart >= 0 && daysUntilStart <= 21;
    const remaining      = cls.maxS - cls.enrolled;
    const seatPct        = Math.min((cls.enrolled / cls.maxS) * 100, 100);
    const isAlmostFull   = remaining > 0 && remaining <= 2;
    const chip           = seatChipColor(cls.enrolled, cls.maxS);

    function handleAddCart() {
        if (added || isFull) return;
        setAdded(true);
        onAddCart(cls);
        setTimeout(() => setAdded(false), 2200);
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
            whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10 dark:bg-[#0F1E38]"
            style={{ borderColor: 'rgba(228,228,231,0.7)' }}
        >
            {/* Hover border glow */}
            <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 1.5px ${cls.thumbTo}88` }}
            />

            {/* ── Thumbnail ── */}
            <div
                className="relative overflow-hidden"
                style={{ background: cls.image ? '#111827' : `linear-gradient(135deg,${cls.thumbFrom},${cls.thumbTo})`, aspectRatio: '16/9' }}
            >
                {/* Photo */}
                {cls.image && (
                    <img
                        src={cls.image}
                        alt={cls.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                )}
                {/* Color tint overlay when photo shown */}
                {cls.image && (
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{ background: `linear-gradient(160deg,${cls.thumbFrom}55 0%,${cls.thumbTo}22 100%)` }}
                    />
                )}
                {/* Mesh dots */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.18]"
                    style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '14px 14px' }}
                />
                {/* Bottom vignette */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/25 to-transparent" />

                {/* Hanzi character — only shown on gradient (no photo) cards */}
                {!cls.image && (
                    <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
                        <motion.span
                            className="font-bold leading-none opacity-[0.18] transition-opacity duration-500 group-hover:opacity-[0.28]"
                            animate={{ scale: [1, 1.07, 1] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                            style={{ fontFamily: "'Noto Serif SC',serif", fontSize: '88px', color: '#0B0B0F' }}
                        >
                            {cls.hanzi}
                        </motion.span>
                    </div>
                )}

                {/* Top badges */}
                <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm ${
                            cls.type === 'online' ? 'bg-sky-500/90' : cls.type === 'home-private' ? 'bg-violet-500/90' : 'bg-amber-500/90'
                        }`}
                    >
                        {cls.type === 'online' ? '🌐' : cls.type === 'home-private' ? '🏠' : '🏫'}{' '}
                        {cls.type === 'online' ? 'Online' : cls.type === 'home-private' ? 'Home Private' : 'Offline'}
                    </span>

                    {isFull ? (
                        <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm">
                            PENUH ✗
                        </span>
                    ) : isAlmostFull ? (
                        <motion.span
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            className="rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm"
                        >
                            🔥 Hot!
                        </motion.span>
                    ) : cls.badge ? (
                        <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm">
                            {cls.badge}
                        </span>
                    ) : null}
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    {/* Left: kids badge */}
                    {cls.age && !isUrgent && (
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-amber-600 shadow-sm">
                            👶 Kids {cls.age}
                        </span>
                    )}

                    {/* Urgent countdown */}
                    {isUrgent && (
                        <motion.div
                            animate={{ opacity: [1, 0.65, 1] }}
                            transition={{ duration: 1.3, repeat: Infinity }}
                            className="flex-1 rounded-xl bg-red-500/90 px-3 py-1.5 text-center text-[10px] font-bold text-white shadow-md backdrop-blur-sm"
                        >
                            ⏰ Daftar dalam {deadline} hari lagi!
                        </motion.div>
                    )}

                    {/* Soon badge (not urgent) */}
                    {isSoon && !cls.age && (
                        <span className="ml-auto rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold text-zinc-700 shadow-sm backdrop-blur-sm">
                            📅 {daysUntilStart} hari lagi
                        </span>
                    )}
                    {isSoon && cls.age && (
                        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold text-zinc-700 shadow-sm backdrop-blur-sm">
                            📅 {daysUntilStart} hari lagi
                        </span>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 flex-col p-4">

                {/* Level + location row */}
                <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 dark:bg-slate-800 dark:text-slate-400">
                        {cls.level}
                    </span>
                    {cls.location && (
                        <span className="text-[10px] text-zinc-400 dark:text-slate-600">
                            📍 {cls.location.split('/')[0].trim()}
                        </span>
                    )}
                </div>

                {/* Title + subtitle */}
                <div className="mb-3">
                    <h3 className="mb-0.5 text-[15px] font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                        {cls.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-slate-500">
                        {cls.subtitle}
                    </p>
                </div>

                {/* Teacher */}
                <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-slate-700/40 dark:bg-slate-800/40">
                    <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cls.teacher.gradient} text-[13px] font-bold text-white shadow-sm`}
                        style={{ fontFamily: "'Noto Serif SC',serif" }}
                    >
                        {cls.teacher.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-100">{cls.teacher.name}</p>
                        <p className="font-mono text-[9.5px] text-zinc-400 dark:text-slate-600">🇨🇳 Native · ✓ Certified</p>
                    </div>
                </div>

                {/* Batch / Semi-private / Private info */}
                {!cls.isPrivate && cls.batch.start ? (
                    <div className="mb-3 space-y-2 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-slate-700/40 dark:bg-slate-800/40">
                        {/* Batch # + seats header */}
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-zinc-700 dark:text-slate-300">
                                Batch #{cls.batch.no}
                            </span>
                            {cls.schedule && (
                                <span className="font-mono text-[9.5px] text-zinc-400 dark:text-slate-600">
                                    🕐 {cls.schedule.split(',')[0]}
                                </span>
                            )}
                        </div>

                        {/* Date row */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <div className="rounded-lg bg-white px-2.5 py-1.5 dark:bg-slate-800">
                                <p className="mb-0.5 font-mono text-[8.5px] uppercase tracking-wide text-zinc-400">Mulai</p>
                                <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{fmtDate(cls.batch.start)}</p>
                            </div>
                            <div className="rounded-lg bg-white px-2.5 py-1.5 dark:bg-slate-800">
                                <p className="mb-0.5 font-mono text-[8.5px] uppercase tracking-wide text-zinc-400">Selesai</p>
                                <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{fmtDate(cls.batch.end)}</p>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                                isUrgent
                                    ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                                    : 'bg-white text-zinc-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                        >
                            <span>⏰</span>
                            <span>Daftar sebelum <strong>{fmtDate(cls.batch.deadline)}</strong></span>
                        </div>

                        {/* Seat progress */}
                        <div>
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-slate-700">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: seatBarBg(cls.enrolled, cls.maxS) }}
                                    initial={{ width: '0%' }}
                                    whileInView={{ width: `${seatPct}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.3, ease: EASE, delay: 0.25 + index * 0.06 }}
                                />
                            </div>
                            <div className="mt-1.5 flex items-center justify-between">
                                <span className="font-mono text-[9.5px] text-zinc-400">
                                    {cls.enrolled}/{cls.maxS} terisi
                                </span>
                                <motion.span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                    style={{ color: chip.text, background: chip.bg, border: `1px solid ${chip.border}` }}
                                    animate={isAlmostFull ? { scale: [1, 1.06, 1] } : {}}
                                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    {remaining <= 0
                                        ? '✗ Penuh'
                                        : remaining === 1
                                          ? '🔴 1 kursi tersisa!'
                                          : `🪑 ${remaining} kursi tersisa`}
                                </motion.span>
                            </div>
                        </div>

                        {/* Schedule (full text) */}
                        {cls.schedule && (
                            <p className="font-mono text-[9.5px] text-zinc-400 dark:text-slate-600">
                                🕐 {cls.schedule}
                            </p>
                        )}
                    </div>
                ) : cls.isPrivate ? (
                    <div
                        className="mb-3 rounded-xl border border-violet-100 p-3 dark:border-violet-800/30"
                        style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.06),rgba(167,139,250,0.04))' }}
                    >
                        <p className="mb-0.5 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                            ✨ Kelas Privat Fleksibel
                        </p>
                        <p className="text-[10px] leading-relaxed text-violet-500 dark:text-violet-400">
                            Jadwal & materi disesuaikan penuh. Booking kapan saja.
                        </p>
                    </div>
                ) : cls.pricingTier === 'semi-private' ? (
                    <div
                        className="mb-3 rounded-xl border border-sky-100 p-3 dark:border-sky-800/30"
                        style={{ background: 'linear-gradient(135deg,rgba(14,165,233,0.06),rgba(99,102,241,0.04))' }}
                    >
                        <p className="mb-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                            👥 Semi Private — Min 2 Murid
                        </p>
                        <p className="text-[10px] leading-relaxed text-sky-500 dark:text-sky-400">
                            1 guru eksklusif, jadwal fleksibel. Daftar sendiri — kami carikan partner belajarmu!
                        </p>
                    </div>
                ) : null}

                {/* Benefits */}
                {cls.benefits && cls.benefits.length > 0 && (
                    <div className="mb-3 space-y-1.5">
                        {cls.benefits.slice(0, 3).map((b, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                                <span className="mt-px shrink-0 text-[10px] text-emerald-500">✓</span>
                                <span className="text-[10.5px] leading-snug text-zinc-500 dark:text-zinc-400">{b}</span>
                            </div>
                        ))}
                        {cls.benefits.length > 3 && (
                            <p className="pl-4 text-[10px] text-zinc-400 dark:text-zinc-500">
                                +{cls.benefits.length - 3} benefit lainnya
                            </p>
                        )}
                    </div>
                )}

                {/* Price */}
                <div className="mb-3 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[18px] font-black leading-none text-zinc-900 dark:text-zinc-100">
                        {fmtRp(cls.price)}
                    </span>
                    {cls.priceMax && cls.priceMax > cls.price && (
                        <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                            – {fmtRp(cls.priceMax)}
                        </span>
                    )}
                    <span className="font-mono text-[10px] text-zinc-400">/ {cls.duration}</span>
                </div>

                {/* ── CTA Buttons ── */}
                <div className={`mt-auto grid gap-2 ${isFull ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {isFull ? (
                        <button
                            onClick={() => onConsult(cls)}
                            className="rounded-xl bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            💬 Konsultasi Batch Berikutnya
                        </button>
                    ) : (
                        <>
                            <motion.button
                                onClick={handleAddCart}
                                className="relative overflow-hidden rounded-xl py-2.5 text-sm font-bold text-white shadow-sm"
                                style={{
                                    background: added
                                        ? '#10b981'
                                        : 'linear-gradient(135deg,#E63946,#c0303b)',
                                    transition: 'background 0.3s ease',
                                }}
                                whileTap={{ scale: 0.95 }}
                                animate={added ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatePresence mode="wait">
                                    {added ? (
                                        <motion.span
                                            key="added"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center gap-1.5"
                                        >
                                            ✓ Ditambahkan!
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="add"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center gap-1.5"
                                        >
                                            🛒 {cls.isPrivate ? 'Booking' : 'Keranjang'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            <button
                                onClick={() => onConsult(cls)}
                                className="rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                💬 Tanya Dulu
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

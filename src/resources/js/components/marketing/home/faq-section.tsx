'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from '@inertiajs/react';
import type { FaqCategory } from '@/types/home';
import { FAQS, FAQ_CATS } from '@/data/home';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function accentColor(cat: FaqCategory): string {
    if (cat === 'kebijakan') return '#8b5cf6';
    if (cat === 'referral') return '#10b981';
    return '#E63946';
}

export function FaqSection() {
    const [activeCat, setActiveCat] = useState<'all' | FaqCategory>('all');
    const [openIdx, setOpenIdx]     = useState<number | null>(null);
    const headingRef                = useRef<HTMLDivElement>(null);
    const inView                    = useInView(headingRef, { once: true, margin: '-80px' });

    const filtered = activeCat === 'all' ? FAQS : FAQS.filter((f) => f.cat === activeCat);

    return (
        <section className="relative overflow-hidden bg-[#FDFAF6] py-20 dark:bg-[#080F1C] md:py-28">

            {/* ── Background ── */}
            <div className="pointer-events-none absolute inset-0">
                {/* Line grid – light mode */}
                <div
                    className="absolute inset-0 dark:hidden"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.05) 1px,transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                {/* Line grid – dark mode */}
                <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                {/* Red glow – top right — animated */}
                <motion.div
                    animate={{ x: [0, -22, 0], y: [0, 18, 0], scale: [1, 1.16, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -right-32 -top-32 h-80 w-80 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.15),transparent 70%)', filter: 'blur(55px)' }}
                />
                {/* Amber glow – bottom left — animated */}
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -14, 0], scale: [1, 1.14, 1] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.14),transparent 70%)', filter: 'blur(50px)' }}
                />
                {/* Center warm gold breathe */}
                <motion.div
                    animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.18, 1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
                    className="absolute left-1/2 top-1/2 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(ellipse,rgba(245,158,11,0.06),transparent 70%)', filter: 'blur(45px)' }}
                />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 sm:px-6">

                {/* ── Header ── */}
                <div
                    ref={headingRef}
                    className="mb-14 text-center"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'none' : 'translateY(24px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/50 px-4 py-1.5 dark:border-slate-700 dark:bg-slate-900/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Info & Kebijakan
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl">
                        Pertanyaan{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg,#E63946 0%,#D4A574 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            yang sering muncul.
                        </span>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                        Termasuk kebijakan kelas, izin, platform VOOV, dan referral program.
                    </p>
                </div>

                {/* ── Category pills ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mb-8 flex flex-wrap gap-2"
                >
                    {FAQ_CATS.map((c) => (
                        <button
                            key={c.key}
                            onClick={() => { setActiveCat(c.key); setOpenIdx(null); }}
                            className="relative rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200"
                            style={{ color: activeCat === c.key ? 'white' : '#71717a' }}
                        >
                            {activeCat === c.key && (
                                <motion.span
                                    layoutId="faq-pill"
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: '#E63946' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                                <span>{c.icon}</span>
                                <span>{c.label}</span>
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* ── FAQ list ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCat}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="space-y-2.5"
                    >
                        {filtered.map((faq, i) => {
                            const isOpen = openIdx === i;
                            const ac     = accentColor(faq.cat);

                            return (
                                <motion.div
                                    key={`${activeCat}-${faq.q}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
                                    className="relative overflow-hidden rounded-2xl border border-amber-100 bg-white dark:border-slate-800 dark:bg-[#0F1E38]"
                                    style={{
                                        boxShadow: isOpen
                                            ? `inset 0 0 0 1.5px ${ac}55, 0 6px 28px ${ac}0f`
                                            : 'inset 0 0 0 1.5px rgba(0,0,0,0)',
                                        transition: 'box-shadow 0.25s ease',
                                    }}
                                >
                                    {/* Left accent stripe */}
                                    <motion.div
                                        className="absolute left-0 top-0 w-0.75 rounded-r-full"
                                        style={{ background: ac, transformOrigin: 'top' }}
                                        initial={false}
                                        animate={{ scaleY: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    />

                                    {/* Question row */}
                                    <button
                                        onClick={() => setOpenIdx(isOpen ? null : i)}
                                        className="flex w-full items-center gap-3.5 px-5 py-4 text-left"
                                    >
                                        <motion.div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[17px]"
                                            style={{ background: `${ac}18` }}
                                            animate={{ scale: isOpen ? 1.08 : 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {faq.icon}
                                        </motion.div>

                                        <span className="flex-1 text-[13.5px] font-semibold leading-snug text-zinc-800 dark:text-zinc-100">
                                            {faq.q}
                                        </span>

                                        <motion.div
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                                            style={{ background: isOpen ? ac : '#f4f4f5' }}
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        >
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke={isOpen ? 'white' : '#71717a'}
                                                viewBox="0 0 24 24"
                                                strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </motion.div>
                                    </button>

                                    {/* Answer (accordion) */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-3 px-5 pb-5 pl-14.25">
                                                    <p className="text-[13px] leading-[1.8] text-zinc-600 dark:text-zinc-400">
                                                        {faq.a}
                                                    </p>

                                                    {faq.cat === 'kebijakan' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.12 }}
                                                            className="rounded-[10px] px-3 py-2.5 text-xs font-medium"
                                                            style={{ background: `${ac}10`, borderLeft: `3px solid ${ac}`, color: ac }}
                                                        >
                                                            💡 Kebijakan ini berlaku mulai batch Juni 2026
                                                        </motion.div>
                                                    )}

                                                    {faq.cat === 'referral' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.12 }}
                                                        >
                                                            <Link
                                                                href="/checkout"
                                                                className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                                                                style={{ background: '#10b981' }}
                                                            >
                                                                🎁 Lihat Kode Referral di Checkout →
                                                            </Link>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* ── Bottom CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                    className="mt-12 flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
                        <p className="text-sm text-zinc-400 dark:text-zinc-600">Masih ada pertanyaan lain?</p>
                        <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <a
                        href="https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Admin+Panda%2C+saya+ingin+bertanya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-xl border border-amber-100 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:border-green-200 hover:shadow-md dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-300 dark:hover:border-green-800"
                    >
                        <svg
                            className="h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Tanya via WhatsApp
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

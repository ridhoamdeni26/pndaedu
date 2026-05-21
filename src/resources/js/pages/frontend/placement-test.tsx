'use client';

import { memo, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLASSES } from '@/data/home';
import type { CourseClass } from '@/types/home';
import { fmtDate, fmtRp } from '@/components/marketing/home/utils';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WA = '6289508275782';

/* ── Page skeleton (shown before JS fully boots) ─────────────── */
const PageSkeleton = memo(function PageSkeleton() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFAF6] px-4 dark:bg-[#080F1C]">
            <div className="flex w-full max-w-md animate-pulse flex-col items-center gap-5">
                <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-36 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-9 w-72 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2 w-full max-w-sm">
                    <div className="h-3.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3.5 w-5/6 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    {[80, 88, 64, 96].map(w => (
                        <div key={w} className="h-7 rounded-full bg-zinc-200 dark:bg-zinc-800" style={{ width: w }} />
                    ))}
                </div>
                <div className="h-14 w-52 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            </div>
        </div>
    );
});

/* ── Types ──────────────────────────────────────────────────── */
type Step       = 'intro' | 'setup' | 'questions' | 'result';
type Purpose    = 'self' | 'kids';
type Experience = 'none' | 'little' | 'some' | 'fluent';

interface Question {
    id: number;
    level: 1 | 2 | 3 | 4;
    hanzi?: string;
    pinyin?: string;
    question: string;
    options: { text: string; correct: boolean }[];
    explanation: string;
}

/* ── Questions ──────────────────────────────────────────────── */
const ALL_QUESTIONS: Question[] = [
    {
        id: 1, level: 1,
        hanzi: '你好', pinyin: 'nǐ hǎo',
        question: 'Apa arti dari ekspresi Mandarin ini?',
        options: [
            { text: 'Halo / Hai', correct: true },
            { text: 'Terima kasih', correct: false },
            { text: 'Selamat tinggal', correct: false },
            { text: 'Maaf / Permisi', correct: false },
        ],
        explanation: '你好 (nǐ hǎo) adalah salam dasar Mandarin yang berarti "Halo" atau "Hai".',
    },
    {
        id: 2, level: 1,
        hanzi: '三', pinyin: 'sān',
        question: 'Aksara ini mewakili angka berapa?',
        options: [
            { text: '1', correct: false },
            { text: '2', correct: false },
            { text: '3', correct: true },
            { text: '4', correct: false },
        ],
        explanation: '三 (sān) = 3. Pola: 一(1), 二(2), 三(3), 四(4), 五(5).',
    },
    {
        id: 3, level: 1,
        question: 'Manakah yang berarti "Terima kasih" dalam Mandarin?',
        options: [
            { text: '你好 (nǐ hǎo)', correct: false },
            { text: '再见 (zàijiàn)', correct: false },
            { text: '谢谢 (xièxiè)', correct: true },
            { text: '对不起 (duìbuqǐ)', correct: false },
        ],
        explanation: '谢谢 (xièxiè) = terima kasih. 再见 = sampai jumpa, 对不起 = maaf.',
    },
    {
        id: 4, level: 2,
        hanzi: '我是学生', pinyin: 'wǒ shì xuéshēng',
        question: 'Apa terjemahan kalimat ini?',
        options: [
            { text: 'Saya adalah guru', correct: false },
            { text: 'Saya adalah siswa / pelajar', correct: true },
            { text: 'Saya suka belajar', correct: false },
            { text: 'Saya ingin jadi guru', correct: false },
        ],
        explanation: '我 = saya, 是 = adalah, 学生 = siswa/pelajar.',
    },
    {
        id: 5, level: 2,
        question: 'Kata mana yang tepat melengkapi: "我 ___ 喝水 (minum air)"?',
        options: [
            { text: '想 (xiǎng) — ingin', correct: true },
            { text: '是 (shì) — adalah', correct: false },
            { text: '有 (yǒu) — punya', correct: false },
            { text: '去 (qù) — pergi', correct: false },
        ],
        explanation: '想 (xiǎng) menyatakan keinginan. 我想喝水 = Saya ingin minum air.',
    },
    {
        id: 6, level: 2,
        hanzi: '我们', pinyin: 'wǒmen',
        question: 'Kata ganti ini merujuk kepada siapa?',
        options: [
            { text: 'Hanya saya (1 orang)', correct: false },
            { text: 'Kamu / Anda', correct: false },
            { text: 'Kita / Kami (lebih dari 1)', correct: true },
            { text: 'Mereka', correct: false },
        ],
        explanation: '我 = saya, 们 (men) = sufiks jamak. 我们 = kita/kami. 你们 = kalian.',
    },
    {
        id: 7, level: 3,
        hanzi: '你最近怎么样？', pinyin: 'nǐ zuìjìn zěnmeyàng?',
        question: 'Apa arti pertanyaan ini?',
        options: [
            { text: 'Kamu tinggal di mana?', correct: false },
            { text: 'Bagaimana kabarmu akhir-akhir ini?', correct: true },
            { text: 'Kamu mau pergi ke mana?', correct: false },
            { text: 'Kamu sudah makan belum?', correct: false },
        ],
        explanation: '最近 = akhir-akhir ini, 怎么样 = bagaimana. Menanyakan kabar terkini.',
    },
    {
        id: 8, level: 3,
        question: 'Kalimat mana yang menggunakan "了 (le)" dengan benar untuk kejadian lampau?',
        options: [
            { text: '我明天去了学校 (besok)', correct: false },
            { text: '我昨天去了学校 (kemarin)', correct: true },
            { text: '我现在去了学校 (sekarang)', correct: false },
            { text: '我去了明天 (urutan salah)', correct: false },
        ],
        explanation: '了 (le) setelah kata kerja menandai tindakan yang sudah selesai. 昨天 = kemarin.',
    },
    {
        id: 9, level: 3,
        question: '"虽然…但是…" (suīrán…dànshì…) mengungkapkan hubungan apa?',
        options: [
            { text: 'Sebab-akibat (karena…maka…)', correct: false },
            { text: 'Kontras / konsesi (walaupun…tetapi…)', correct: true },
            { text: 'Pilihan (baik…maupun…)', correct: false },
            { text: 'Urutan waktu (pertama…lalu…)', correct: false },
        ],
        explanation: '虽然…但是… = walaupun…tetapi… Sangat umum di percakapan dan tulisan HSK 3-4.',
    },
    {
        id: 10, level: 4,
        hanzi: '他虽然很忙，但还是来帮我了。',
        question: 'Terjemahkan kalimat ini:',
        options: [
            { text: 'Dia tidak bisa datang karena terlalu sibuk', correct: false },
            { text: 'Meskipun dia sibuk, dia tetap datang membantu saya', correct: true },
            { text: 'Dia datang membantu karena dia tidak sibuk', correct: false },
            { text: 'Dia membantu saya supaya dia menjadi tidak sibuk', correct: false },
        ],
        explanation: '虽然 = meskipun, 但还是 = tetap saja, 来帮我 = datang membantu saya.',
    },
];

const LEVEL_PTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4 };

function getActiveQuestions(exp: Experience): Question[] {
    if (exp === 'fluent') return ALL_QUESTIONS.filter(q => q.level >= 3);
    if (exp === 'some')   return ALL_QUESTIONS.filter(q => q.level >= 2);
    return ALL_QUESTIONS;
}

function calcResult(answers: (boolean | null)[], questions: Question[]) {
    const correct  = answers.filter(Boolean).length;
    const score    = answers.reduce<number>((s, a, i) => s + (a ? LEVEL_PTS[questions[i].level] : 0), 0);
    const maxScore = questions.reduce((s, q) => s + LEVEL_PTS[q.level], 0);
    return { correct, score, maxScore, pct: maxScore > 0 ? score / maxScore : 0 };
}

function getClassIds(pct: number, purpose: Purpose, exp: Experience): number[] {
    if (purpose === 'kids') return [4, 8];          // Kids: Online + Offline options
    if (exp === 'fluent' && pct >= 0.6) return [5];
    if (exp === 'fluent') return [7];
    if (pct < 0.22) return [1];
    if (pct < 0.42) return [2];
    if (pct < 0.60) return [3];
    if (pct < 0.78) return [7];
    return [5];
}

function getLevelInfo(pct: number, purpose: Purpose, exp: Experience) {
    if (purpose === 'kids')              return { emoji: '🎨', label: 'Kids Mandarin', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/25', border: 'border-pink-200 dark:border-pink-800/40' };
    if (exp === 'fluent' || pct >= 0.78) return { emoji: '🏆', label: 'Mahir — Business', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/25', border: 'border-amber-200 dark:border-amber-800/40' };
    if (pct >= 0.60)                     return { emoji: '📕', label: 'Menengah Atas — HSK 4', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/25', border: 'border-blue-200 dark:border-blue-800/40' };
    if (pct >= 0.42)                     return { emoji: '📘', label: 'Menengah — HSK 3', color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/25', border: 'border-sky-200 dark:border-sky-800/40' };
    if (pct >= 0.22)                     return { emoji: '📗', label: 'Dasar — HSK 2', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/25', border: 'border-emerald-200 dark:border-emerald-800/40' };
    return                               { emoji: '🌱', label: 'Pemula — HSK 1', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/25', border: 'border-green-200 dark:border-green-800/40' };
}

/* ── Score Ring ─────────────────────────────────────────────── */
function ScoreRing({ pct, correct, total }: { pct: number; correct: number; total: number }) {
    const R = 52, C = 2 * Math.PI * R;
    const color = pct >= 0.7 ? '#10b981' : pct >= 0.45 ? '#3b82f6' : pct >= 0.25 ? '#f59e0b' : '#e63946';
    return (
        <div className="relative inline-flex shrink-0 items-center justify-center">
            <svg width="124" height="124" viewBox="0 0 124 124" className="-rotate-90">
                <circle cx="62" cy="62" r={R} fill="none" className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="10" />
                <motion.circle
                    cx="62" cy="62" r={R} fill="none" stroke={color}
                    strokeWidth="10" strokeLinecap="round" strokeDasharray={C}
                    initial={{ strokeDashoffset: C }}
                    animate={{ strokeDashoffset: C * (1 - pct) }}
                    transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
                    className="text-3xl font-black leading-none text-zinc-900 dark:text-zinc-100"
                >
                    {correct}
                </motion.span>
                <span className="font-mono text-[10px] text-zinc-400">dari {total}</span>
            </div>
        </div>
    );
}

/* ── Answer Button ──────────────────────────────────────────── */
const OPT_LABELS = ['A', 'B', 'C', 'D'];

const AnswerButton = memo(function AnswerButton({ text, index, isCorrect, isSelected, isRevealed, onClick }: {
    text: string; index: number; isCorrect: boolean;
    isSelected: boolean; isRevealed: boolean; onClick: () => void;
}) {
    let ring  = 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700/60 dark:bg-[#0F1E38] dark:hover:border-zinc-600';
    let badge = 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400';
    let txt   = 'text-zinc-700 dark:text-zinc-300';

    if (isRevealed) {
        if (isCorrect) {
            ring  = 'border-emerald-400 bg-emerald-50 dark:border-emerald-600/50 dark:bg-emerald-950/30';
            badge = 'bg-emerald-500 text-white';
            txt   = 'font-semibold text-emerald-800 dark:text-emerald-300';
        } else if (isSelected) {
            ring  = 'border-red-400 bg-red-50 dark:border-red-600/50 dark:bg-red-950/30';
            badge = 'bg-red-500 text-white';
            txt   = 'text-red-700 dark:text-red-400';
        } else {
            ring  = 'border-zinc-100 bg-zinc-50 opacity-40 dark:border-zinc-800 dark:bg-zinc-900/30';
        }
    } else if (isSelected) {
        ring  = 'border-zinc-400 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800/60';
        badge = 'bg-zinc-600 text-white dark:bg-zinc-400 dark:text-zinc-900';
    }

    return (
        <motion.button
            onClick={() => !isRevealed && onClick()}
            disabled={isRevealed}
            whileHover={!isRevealed && !isSelected ? { y: -2, transition: { duration: 0.15 } } : {}}
            whileTap={!isRevealed ? { scale: 0.98 } : {}}
            animate={isRevealed && isSelected && !isCorrect ? { x: [0, -5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`w-full rounded-2xl border p-3.5 text-left text-sm transition-all duration-150 ${ring}`}
        >
            <span className="flex items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${badge}`}>
                    {isRevealed && isCorrect ? '✓' : isRevealed && isSelected ? '✗' : OPT_LABELS[index]}
                </span>
                <span className={txt}>{text}</span>
            </span>
        </motion.button>
    );
});

/* ── Recommended Class Card ─────────────────────────────────── */
function RecommendedClassCard({ cls, single = true }: { cls: CourseClass; single?: boolean }) {
    const isFull    = cls.enrolled >= cls.maxS;
    const remaining = cls.maxS - cls.enrolled;
    const seatPct   = Math.min((cls.enrolled / cls.maxS) * 100, 100);
    const waFull    = `https://api.whatsapp.com/send/?phone=${WA}&text=${encodeURIComponent(`Halo Admin Panda! Saya tertarik kelas ${cls.title} namun sedang penuh. Kapan batch berikutnya?`)}`;

    return (
        <div className="overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-lg shadow-black/5 dark:border-zinc-700/40 dark:bg-[#0F1E38]">
            {/* Gradient header strip */}
            <div
                className="relative flex items-center justify-between px-5 py-4"
                style={{ background: `linear-gradient(135deg,${cls.thumbFrom},${cls.thumbTo})` }}
            >
                <div className="min-w-0 flex-1 pr-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm ${cls.type === 'online' ? 'bg-sky-500/80' : 'bg-amber-500/80'}`}>
                        {cls.type === 'online' ? '🌐 Online' : '🏫 Offline'}
                    </span>
                    <h3 className="mt-1.5 truncate text-base font-black text-zinc-900">{cls.title}</h3>
                    <p className="line-clamp-1 text-[12px] text-zinc-700">{cls.subtitle}</p>
                </div>
                <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/50 text-2xl font-bold backdrop-blur-sm"
                    style={{ fontFamily: "'Noto Serif SC',serif" }}
                >
                    {cls.hanzi}
                </div>
            </div>

            <div className="p-5">
                {/* Seat availability */}
                {isFull ? (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">😔</span>
                            <div>
                                <p className="font-bold text-red-700 dark:text-red-400">Kelas Ini Sedang Penuh</p>
                                <p className="mt-0.5 text-[12px] leading-relaxed text-red-600 dark:text-red-400/80">
                                    Jangan khawatir — batch baru biasanya dibuka setiap <strong>4–6 minggu</strong>.
                                    Hubungi admin untuk masuk daftar tunggu.
                                </p>
                                <a
                                    href={waFull}
                                    target="_blank" rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-green-600"
                                >
                                    💬 Tanya Batch Berikutnya
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500 dark:text-zinc-400">Bangku tersedia</span>
                            <span className={`font-bold ${remaining <= 2 ? 'text-red-500' : remaining <= 4 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {remaining} dari {cls.maxS} bangku
                            </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: remaining <= 2 ? 'linear-gradient(90deg,#ef4444,#f87171)' : remaining <= 4 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#10b981,#34d399)' }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${seatPct}%` }}
                                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                            />
                        </div>
                        {remaining <= 3 && (
                            <motion.p animate={{ opacity: [1, 0.55, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[11px] font-semibold text-red-500">
                                🔥 Hampir penuh — segera daftar!
                            </motion.p>
                        )}
                    </div>
                )}

                {/* Batch dates */}
                {!cls.isPrivate && cls.batch.start && (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800/40">
                            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">Mulai</p>
                            <p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100">{fmtDate(cls.batch.start)}</p>
                        </div>
                        <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800/40">
                            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">Daftar sebelum</p>
                            <p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100">{fmtDate(cls.batch.deadline)}</p>
                        </div>
                    </div>
                )}

                {/* Price + CTA */}
                {!isFull && (
                    single ? (
                        /* Single recommendation — full-width checkout button */
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{fmtRp(cls.price)}</p>
                                    <p className="font-mono text-[10px] text-zinc-400">/ {cls.duration}</p>
                                </div>
                            </div>
                            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    href={`/checkout?class=${cls.id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md shadow-red-500/20"
                                    style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
                                >
                                    <span>🎓</span><span>Daftar Sekarang</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        /* Multiple recommendations — compact price + button row */
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{fmtRp(cls.price)}</p>
                                <p className="font-mono text-[10px] text-zinc-400">/ {cls.duration}</p>
                            </div>
                            <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    href={`/checkout?class=${cls.id}`}
                                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-500/20"
                                    style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
                                >
                                    <span>🎓</span><span>Pilih Ini</span>
                                </Link>
                            </motion.div>
                        </div>
                    )
                )}
                {isFull && (
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{fmtRp(cls.price)}</p>
                            <p className="font-mono text-[10px] text-zinc-400">/ {cls.duration}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Intro Screen ───────────────────────────────────────────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45 }}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 text-center"
        >
            {/* Background blobs */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.25),transparent)', filter: 'blur(72px)', animation: 'blob 14s ease-in-out infinite' }} />
                <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full opacity-25" style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.3),transparent)', filter: 'blur(64px)', animation: 'blob 18s ease-in-out infinite 5s' }} />
                <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.2),transparent)', filter: 'blur(60px)', animation: 'blob 22s ease-in-out infinite 9s' }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.8) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="mb-6 text-7xl"
                style={{ animation: 'float 4s ease-in-out infinite' }}
            >
                🐼
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200/70 bg-red-50/70 px-4 py-1.5 dark:border-red-900/40 dark:bg-red-950/30"
            >
                <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                    Panda Education · Gratis
                </span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
                className="mb-3 text-4xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl"
            >
                Placement Test{' '}
                <span style={{ background: 'linear-gradient(135deg,#E63946,#D4A574)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Mandarin
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.45 }}
                className="mb-8 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400"
            >
                Jawab beberapa pertanyaan singkat dan kami akan merekomendasikan
                kelas yang paling sesuai dengan kemampuanmu — instan dan akurat.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.4 }}
                className="mb-10 flex flex-wrap justify-center gap-2.5"
            >
                {[
                    { icon: '⏱️', text: '5–7 menit' },
                    { icon: '🎯', text: 'Hasil Personal' },
                    { icon: '🆓', text: '100% Gratis' },
                    { icon: '📊', text: 'Rekomendasi Instan' },
                ].map(f => (
                    <span key={f.text} className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-[12px] font-medium text-zinc-600 shadow-sm dark:border-zinc-700/50 dark:bg-[#0F1E38] dark:text-zinc-300">
                        <span>{f.icon}</span>{f.text}
                    </span>
                ))}
            </motion.div>

            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.58, duration: 0.4, ease: EASE }}
                onClick={onStart}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-9 py-4 text-[15px] font-bold text-white shadow-lg shadow-red-500/25"
                style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
            >
                <motion.span
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                    className="pointer-events-none absolute inset-0 -skew-x-12"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }}
                />
                <span>🚀</span>
                <span>Mulai Test Sekarang</span>
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </motion.button>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-5 text-[12px] text-zinc-400">
                Tidak perlu daftar akun · Tanpa kartu kredit
            </motion.p>
        </motion.div>
    );
}

/* ── Setup Screen ───────────────────────────────────────────── */
function SetupScreen({
    purpose, experience, onPurpose, onExperience, onStart,
}: {
    purpose: Purpose | null;
    experience: Experience | null;
    onPurpose: (p: Purpose) => void;
    onExperience: (e: Experience) => void;
    onStart: () => void;
}) {
    const canStart = purpose === 'kids' || (purpose === 'self' && experience !== null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mx-auto max-w-xl px-4 pb-20 pt-28"
        >
            {/* Step 1 — Purpose */}
            <div className="mb-8">
                <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-400">Langkah 1 dari 2</p>
                <h2 className="mb-5 text-2xl font-black text-zinc-900 dark:text-zinc-100">Kelas ini untuk siapa? 👤</h2>
                <div className="grid grid-cols-2 gap-3">
                    {([
                        { value: 'self' as Purpose,  emoji: '🙋', label: 'Untuk Saya', sub: 'Usia 18 tahun ke atas' },
                        { value: 'kids' as Purpose, emoji: '👶', label: 'Untuk Anak Saya', sub: 'Usia 5–12 tahun' },
                    ] as const).map(opt => (
                        <motion.button
                            key={opt.value}
                            onClick={() => onPurpose(opt.value)}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex flex-col items-center gap-2.5 rounded-2xl border p-5 text-center transition-all duration-200 ${
                                purpose === opt.value
                                    ? 'border-red-400 bg-red-50 shadow-md shadow-red-500/15 dark:border-red-600/60 dark:bg-red-950/25'
                                    : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700/50 dark:bg-[#0F1E38] dark:hover:border-zinc-600'
                            }`}
                        >
                            <span className="text-3xl">{opt.emoji}</span>
                            <div>
                                <p className={`text-sm font-bold ${purpose === opt.value ? 'text-red-700 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                    {opt.label}
                                </p>
                                <p className="mt-0.5 text-[11px] text-zinc-400">{opt.sub}</p>
                            </div>
                            {purpose === opt.value && (
                                <motion.div
                                    layoutId="purpose-check"
                                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                >✓</motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Step 2 — Experience (self only) */}
            <AnimatePresence>
                {purpose === 'self' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="mb-8"
                    >
                        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-400">Langkah 2 dari 2</p>
                        <h2 className="mb-5 text-2xl font-black text-zinc-900 dark:text-zinc-100">Seberapa familiar dengan Mandarin? 📚</h2>
                        <div className="space-y-2.5">
                            {([
                                { value: 'none'   as Experience, emoji: '😅', label: 'Belum pernah sama sekali', sub: 'Saya benar-benar pemula baru' },
                                { value: 'little' as Experience, emoji: '🌱', label: 'Pernah belajar sedikit', sub: 'Tahu salam dasar seperti 你好' },
                                { value: 'some'   as Experience, emoji: '📖', label: 'Sudah belajar 6–12 bulan', sub: 'Bisa kalimat dasar & sedikit hanzi' },
                                { value: 'fluent' as Experience, emoji: '🗣️', label: 'Bisa percakapan dasar', sub: 'Sudah pernah lulus HSK atau setara' },
                            ] as const).map(opt => (
                                <motion.button
                                    key={opt.value}
                                    onClick={() => onExperience(opt.value)}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150 ${
                                        experience === opt.value
                                            ? 'border-red-400 bg-red-50 dark:border-red-600/60 dark:bg-red-950/25'
                                            : 'border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-[#0F1E38] dark:hover:border-zinc-600'
                                    }`}
                                >
                                    <span className="text-2xl">{opt.emoji}</span>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${experience === opt.value ? 'text-red-700 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                            {opt.label}
                                        </p>
                                        <p className="text-[11px] text-zinc-400">{opt.sub}</p>
                                    </div>
                                    {experience === opt.value && (
                                        <motion.div
                                            layoutId="exp-check"
                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        >✓</motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Start CTA */}
            <AnimatePresence>
                {canStart && (
                    <motion.button
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        onClick={onStart}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full rounded-2xl py-4 text-[15px] font-bold text-white shadow-lg shadow-red-500/20"
                        style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
                    >
                        {purpose === 'kids'
                            ? '🎨 Lihat Rekomendasi Kelas Kids'
                            : `🚀 Mulai Tes — ${getActiveQuestions(experience!).length} Soal`}
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Question Screen ────────────────────────────────────────── */
const LEVEL_COLOR: Record<number, string> = {
    1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    2: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    3: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    4: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};
const LEVEL_LABEL: Record<number, string> = { 1: 'Dasar', 2: 'Menengah Awal', 3: 'Menengah', 4: 'Lanjut' };

function QuestionScreen({ question, currentQ, total, selected, revealed, isLast, onAnswer, onNext }: {
    question: Question; currentQ: number; total: number;
    selected: number | null; revealed: boolean; isLast: boolean;
    onAnswer: (i: number) => void; onNext: () => void;
}) {
    const progressPct  = ((currentQ + (revealed ? 1 : 0)) / total) * 100;
    const correctIdx   = question.options.findIndex(o => o.correct);
    const isCorrectAns = selected !== null && question.options[selected].correct;

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mx-auto max-w-2xl px-4 pb-16 pt-24"
        >
            {/* Progress bar */}
            <div className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-zinc-400">Soal {currentQ + 1} dari {total}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${LEVEL_COLOR[question.level]}`}>
                        {LEVEL_LABEL[question.level]}
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg,#E63946,#f87171)' }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.5, ease: EASE }}
                    />
                </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="mb-5 rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-700/40 dark:bg-[#0F1E38]"
                >
                    {question.hanzi && (
                        <div className="mb-4 text-center">
                            <p
                                className="font-bold leading-snug text-zinc-900 dark:text-zinc-100"
                                style={{ fontFamily: "'Noto Serif SC',serif", fontSize: question.hanzi.length > 5 ? '26px' : '44px' }}
                            >
                                {question.hanzi}
                            </p>
                            {question.pinyin && (
                                <p className="mt-1.5 font-mono text-sm text-zinc-400">{question.pinyin}</p>
                            )}
                        </div>
                    )}
                    <p className="text-base font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {question.question}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Answers */}
            <div className="space-y-2.5">
                {question.options.map((opt, i) => (
                    <AnswerButton
                        key={i}
                        text={opt.text}
                        index={i}
                        isCorrect={i === correctIdx}
                        isSelected={selected === i}
                        isRevealed={revealed}
                        onClick={() => onAnswer(i)}
                    />
                ))}
            </div>

            {/* Explanation + Next */}
            <AnimatePresence>
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
                        className="mt-5 space-y-3"
                    >
                        <div className={`rounded-2xl border p-4 text-sm leading-relaxed ${
                            isCorrectAns
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                                : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300'
                        }`}>
                            <span className="mr-2">{isCorrectAns ? '🎉' : '💡'}</span>
                            {question.explanation}
                        </div>
                        <motion.button
                            onClick={onNext}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-sm"
                            style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)' }}
                        >
                            {isLast ? '✨ Lihat Hasil Placement Test' : 'Lanjut Soal Berikutnya →'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Result Screen ──────────────────────────────────────────── */
function ResultScreen({ purpose, pct, correct, totalQ, recClasses, levelInfo, onRetake }: {
    purpose: Purpose; pct: number; correct: number; totalQ: number;
    recClasses: CourseClass[];
    levelInfo: ReturnType<typeof getLevelInfo>;
    onRetake: () => void;
}) {
    const resultEmoji = purpose === 'kids' ? '🎨' : pct >= 0.7 ? '🏆' : pct >= 0.45 ? '🎯' : '🌱';
    const isMulti     = recClasses.length > 1;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`mx-auto px-4 pb-20 pt-24 ${isMulti ? 'max-w-3xl' : 'max-w-2xl'}`}
        >
            {/* Header */}
            <div className="mb-8 text-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mb-4 text-5xl"
                >
                    {resultEmoji}
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mb-2 text-2xl font-black text-zinc-900 dark:text-zinc-100 md:text-3xl"
                >
                    {purpose === 'kids' ? 'Kelas Kids cocok untukmu!' : 'Hasil Placement Test-mu!'}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-zinc-500 dark:text-zinc-400"
                >
                    {purpose === 'kids'
                        ? 'Berdasarkan usia (5–12 tahun), kelas Kids Mandarin adalah pilihan terbaik.'
                        : `Kamu menjawab ${correct} dari ${totalQ} soal dengan benar.`}
                </motion.p>
            </div>

            {/* Score card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                className="mb-6 flex flex-col items-center gap-5 rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-700/40 dark:bg-[#0F1E38] sm:flex-row sm:gap-6"
            >
                {totalQ > 0 && <ScoreRing pct={pct} correct={correct} total={totalQ} />}

                <div className="text-center sm:text-left">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Rekomendasi Level</p>
                    <div className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 ${levelInfo.bg} ${levelInfo.border}`}>
                        <span className="text-xl">{levelInfo.emoji}</span>
                        <span className={`text-sm font-black ${levelInfo.color}`}>{levelInfo.label}</span>
                    </div>
                    {totalQ > 0 && (
                        <p className="mt-3 text-[12px] text-zinc-400 dark:text-zinc-500">
                            Skor{' '}
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">{Math.round(pct * 100)}%</span>
                            {' '}· {correct} benar dari {totalQ} soal
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Recommended class(es) */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease: EASE }}
            >
                <div className="mb-3 flex items-center gap-3">
                    <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        {isMulti ? 'Pilih Format yang Sesuai' : 'Kelas yang Kami Rekomendasikan'}
                    </p>
                    <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                </div>

                {isMulti ? (
                    <>
                        <p className="mb-3 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
                            Keduanya cocok untuk level kamu — pilih yang sesuai jadwal dan preferensimu.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {recClasses.map(cls => (
                                <RecommendedClassCard key={cls.id} cls={cls} single={false} />
                            ))}
                        </div>
                    </>
                ) : (
                    <RecommendedClassCard cls={recClasses[0]} single={true} />
                )}
            </motion.div>

            {/* Secondary actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex flex-wrap justify-center gap-3"
            >
                <Link
                    href="/classes"
                    className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-[#0F1E38] dark:text-zinc-300"
                >
                    🗂️ Lihat Semua Kelas
                </Link>
                <button
                    onClick={onRetake}
                    className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-500 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-[#0F1E38] dark:text-zinc-400"
                >
                    🔄 Ulangi Test
                </button>
            </motion.div>
        </motion.div>
    );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function PlacementTestPage() {
    const [isReady,    setIsReady]    = useState(false);
    const [step,       setStep]       = useState<Step>('intro');
    const [purpose,    setPurpose]    = useState<Purpose | null>(null);
    const [experience, setExperience] = useState<Experience | null>(null);
    const [questions,  setQuestions]  = useState<Question[]>([]);
    const [currentQ,   setCurrentQ]   = useState(0);
    const [answers,    setAnswers]    = useState<(boolean | null)[]>([]);
    const [selected,   setSelected]   = useState<number | null>(null);
    const [revealed,   setRevealed]   = useState(false);

    const question = questions[currentQ];
    const isLast   = currentQ === questions.length - 1;

    const { pct, correct } = questions.length > 0
        ? calcResult(answers, questions)
        : { pct: 0, correct: 0 };

    const classIds  = getClassIds(pct, purpose ?? 'self', experience ?? 'none');
    const recClasses = classIds
        .map(id => CLASSES.find(c => c.id === id))
        .filter((c): c is CourseClass => !!c);
    const levelInfo = getLevelInfo(pct, purpose ?? 'self', experience ?? 'none');

    useEffect(() => { setIsReady(true); }, []);

    function startTest() {
        const qs = purpose === 'kids' ? [] : getActiveQuestions(experience ?? 'none');
        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(null));
        setCurrentQ(0);
        setSelected(null);
        setRevealed(false);
        setStep(purpose === 'kids' ? 'result' : 'questions');
    }

    function handleAnswer(optionIndex: number) {
        if (revealed) return;
        const isCorrect = question.options[optionIndex].correct;
        setSelected(optionIndex);
        setRevealed(true);
        setAnswers(prev => {
            const next = [...prev];
            next[currentQ] = isCorrect;
            return next;
        });
    }

    function handleNext() {
        if (isLast) {
            setStep('result');
        } else {
            setCurrentQ(p => p + 1);
            setSelected(null);
            setRevealed(false);
        }
    }

    function handleRetake() {
        setStep('intro');
        setPurpose(null);
        setExperience(null);
        setQuestions([]);
        setCurrentQ(0);
        setAnswers([]);
        setSelected(null);
        setRevealed(false);
    }

    return (
        <>
            <Head title="Placement Test Gratis — Panda Mandarin Education" />
            <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes blob  { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
            `}</style>

            {!isReady && <PageSkeleton />}

            <div className={`min-h-screen overflow-x-hidden bg-[#FDFAF6] dark:bg-[#080F1C] ${!isReady ? 'invisible' : ''}`}>
                <AnimatePresence mode="wait">
                    {step === 'intro' && (
                        <IntroScreen key="intro" onStart={() => setStep('setup')} />
                    )}
                    {step === 'setup' && (
                        <SetupScreen
                            key="setup"
                            purpose={purpose}
                            experience={experience}
                            onPurpose={setPurpose}
                            onExperience={setExperience}
                            onStart={startTest}
                        />
                    )}
                    {step === 'questions' && question && (
                        <QuestionScreen
                            key="questions"
                            question={question}
                            currentQ={currentQ}
                            total={questions.length}
                            selected={selected}
                            revealed={revealed}
                            isLast={isLast}
                            onAnswer={handleAnswer}
                            onNext={handleNext}
                        />
                    )}
                    {step === 'result' && (
                        <ResultScreen
                            key="result"
                            purpose={purpose ?? 'self'}
                            pct={pct}
                            correct={correct}
                            totalQ={questions.length}
                            recClasses={recClasses}
                            levelInfo={levelInfo}
                            onRetake={handleRetake}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

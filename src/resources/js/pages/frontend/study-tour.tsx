'use client';

import { memo, useEffect, useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WA = '6289508275782';

/* ── Types ─────────────────────────────────────────────────────── */
interface ItineraryDay { day: string; title: string; icon: string; items: string[] }
interface TripEvent {
    id: 'summer' | 'winter';
    season: string; badge: string; badgeGrad: string;
    title: string; subtitle: string;
    dates: string; duration: string;
    quota: number; filled: number;
    price: string; ageLabel: string; ageSub: string;
    destinations: { emoji: string; name: string }[];
    includes: string[];
    accentColor: string; accentGrad: string;
    hanziA: string; hanziB: string;
    seatGrad: string; statusLabel: string; statusColor: string;
    waText: string;
}

/* ── Data ──────────────────────────────────────────────────────── */
const EVENTS: TripEvent[] = [
    {
        id: 'summer',
        season: '☀️ Summer Camp 2026', badge: 'Batch 8 · Juli 2026',
        badgeGrad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        title: 'Summer Camp Beijing–Shanghai',
        subtitle: 'Jelajahi ibukota, rasakan budaya kekaisaran, dan belajar Mandarin langsung di Tsinghua University.',
        dates: '14–23 Juli 2026', duration: '10 hari · 9 malam',
        quota: 20, filled: 13,
        price: 'Rp 19.500.000', ageLabel: '14 tahun+', ageSub: 'Kids dengan ortu OK',
        destinations: [{ emoji: '🏙️', name: 'Beijing' }, { emoji: '🌊', name: 'Shanghai' }, { emoji: '⚔️', name: 'Xian' }],
        includes: ['✈️ Tiket pesawat PP', '🏨 Hotel bintang 4', '🍜 Makan 3×/hari', '🎓 Kelas Mandarin intensif', '🚌 Transport lokal', '🎟️ Tiket wisata', '📋 Visa handling'],
        accentColor: '#f59e0b', accentGrad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        hanziA: '夏', hanziB: '营',
        seatGrad: 'linear-gradient(90deg,#f59e0b,#ef4444)',
        statusLabel: '7 slot tersisa!', statusColor: '#f59e0b',
        waText: 'Halo+Admin+Panda!+Saya+tertarik+Summer+Camp+Beijing-Shanghai+Juli+2026.',
    },
    {
        id: 'winter',
        season: '❄️ Winter Camp 2026', badge: 'Batch 6 · Des 2026',
        badgeGrad: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)',
        title: 'Winter Camp Chengdu–Chongqing',
        subtitle: 'Kunjungi Giant Panda Research Base, pelajari kuliner Sichuan, dan immerse dalam budaya barat daya China.',
        dates: '22–31 Des 2026', duration: '10 hari · 9 malam',
        quota: 18, filled: 5,
        price: 'Rp 17.800.000', ageLabel: 'Semua usia', ageSub: 'Family friendly',
        destinations: [{ emoji: '🐼', name: 'Chengdu' }, { emoji: '🗿', name: 'Leshan' }, { emoji: '🌃', name: 'Chongqing' }],
        includes: ['✈️ Tiket pesawat PP', '🏨 Hotel bintang 4', '🍜 Makan 3×/hari', '🐼 Panda Base ticket', '🎓 Kelas Mandarin', '🚌 Transport lokal', '📋 Visa handling'],
        accentColor: '#0ea5e9', accentGrad: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)',
        hanziA: '冬', hanziB: '营',
        seatGrad: 'linear-gradient(90deg,#0ea5e9,#8b5cf6)',
        statusLabel: '13 slot tersedia', statusColor: '#10b981',
        waText: 'Halo+Admin+Panda!+Saya+tertarik+Winter+Camp+Chengdu+Des+2026.',
    },
];

const ITINERARIES: Record<'summer' | 'winter', { title: string; subtitle: string; accentColor: string; accentGrad: string; days: ItineraryDay[] }> = {
    summer: {
        title: '☀️ Summer Camp — Itinerary', subtitle: 'Beijing · Shanghai · Xian · 14–23 Juli 2026',
        accentColor: '#f59e0b', accentGrad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        days: [
            { day: 'Hari 1', title: 'Tiba di Beijing', icon: '✈️', items: ['Penerbangan dari Jakarta (CGK–PEK)', 'Check-in Hotel bintang 4 di Chaoyang District', 'Welcome dinner & cultural briefing', 'Perkenalan sesama peserta'] },
            { day: 'Hari 2', title: 'Tsinghua University & Kelas Pertama', icon: '🏫', items: ['Campus tour Tsinghua University', 'Kelas Mandarin intensif 4 jam', 'Lunch di kantin kampus bersama mahasiswa lokal', 'Sore: jalan-jalan di Zhongguancun'] },
            { day: 'Hari 3', title: 'Tembok Besar & Forbidden City', icon: '🏯', items: ['Pagi: Great Wall of China (Mutianyu section)', 'Kelas Mandarin sesi percakapan di hotel', 'Sore: Forbidden City (故宫)', 'Malam: Makan malam di Old Beijing Duck Restaurant'] },
            { day: 'Hari 4–5', title: 'Beijing Cultural Immersion', icon: '🎭', items: ['Hutong walking tour & rickshaw ride', 'Kelas kaligrafi dan bahasa Mandarin', 'Summer Palace (颐和园)', 'Temple of Heaven (天坛)', 'Wangfujing Night Market'] },
            { day: 'Hari 6', title: 'High Speed Train ke Xian', icon: '🚄', items: ['Naik bullet train Beijing–Xian (4.5 jam)', 'Check-in hotel di Xian', 'Sore: Ancient City Wall cycling tour', 'Malam: Tang Dynasty cultural show'] },
            { day: 'Hari 7', title: 'Xian — Terracotta Warriors', icon: '⚔️', items: ['Museum Terracotta Army (秦始皇兵马俑)', 'Kelas Mandarin — sejarah & budaya', 'Siang: Muslim Quarter food tour', 'Malam: Datang Everbright City night market'] },
            { day: 'Hari 8', title: 'Flight ke Shanghai', icon: '🌆', items: ['Penerbangan Xian–Shanghai', 'Check-in hotel di Pudong', 'Sore: The Bund waterfront walk', 'Malam: Shanghai skyline dari Oriental Pearl Tower'] },
            { day: 'Hari 9', title: 'Shanghai Modern & Traditional', icon: '🏙️', items: ['Kelas Mandarin terakhir — presentasi progres', 'Xintiandi old town area', 'Nanjing Road shopping', 'Yu Garden (豫园)', 'Farewell dinner & certificate ceremony'] },
            { day: 'Hari 10', title: 'Pulang ke Jakarta', icon: '🏠', items: ['Check-out hotel', 'Penerbangan Shanghai–Jakarta (PVG–CGK)', 'Tiba di Jakarta sore hari', 'Kenangan tak terlupakan! 🎉'] },
        ],
    },
    winter: {
        title: '❄️ Winter Camp — Itinerary', subtitle: 'Chengdu · Chongqing · 22–31 Desember 2026',
        accentColor: '#0ea5e9', accentGrad: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)',
        days: [
            { day: 'Hari 1', title: 'Tiba di Chengdu', icon: '✈️', items: ['Penerbangan dari Jakarta (CGK–CTU)', 'Check-in Hotel bintang 4 di Chengdu', 'Welcome dinner — Hotpot Sichuan pertama kali!', 'Briefing perjalanan & safety'] },
            { day: 'Hari 2', title: 'Giant Panda Research Base', icon: '🐼', items: ['Giant Panda Breeding Research Base (pagi — panda masih aktif!)', 'Kelas Mandarin intensif — tema hewan & alam', 'Sore: Chengdu University visit', 'Malam: Face-changing opera show (川剧变脸)'] },
            { day: 'Hari 3', title: 'Leshan Giant Buddha', icon: '🗿', items: ['Day trip ke Leshan Giant Buddha (乐山大佛)', 'Boat tour menyusuri sungai', 'Kelas Mandarin sesi percakapan', 'Kuliner: Mapo Tofu authentic'] },
            { day: 'Hari 4–5', title: 'Chengdu Cultural Deep Dive', icon: '🎎', items: ['Jinli Ancient Street', 'Wenshu Monastery (文殊院)', 'Kelas memasak masakan Sichuan', 'Wuhou Shrine (武侯祠)', 'Kelas Mandarin — budaya & tradisi'] },
            { day: 'Hari 6', title: 'High Speed Train ke Chongqing', icon: '🚄', items: ['Naik bullet train Chengdu–Chongqing (1 jam)', 'Check-in hotel di Chongqing', 'Sore: Jiefangbei pedestrian street', 'Malam: Chongqing hotpot di tepi sungai'] },
            { day: 'Hari 7', title: 'Chongqing — Mountain City', icon: '🌃', items: ['Ciqikou Ancient Town', 'Eling Park panoramic view', 'Kelas Mandarin — dialek & variasi regional', 'Malam: Hongyadong lit up cave complex'] },
            { day: 'Hari 8–9', title: 'Christmas in Chongqing & Farewell', icon: '🎄', items: ['Christmas celebration bersama', 'Yangtze River cruise', 'Kelas Mandarin terakhir — presentasi & assessment', 'Certificate ceremony & farewell dinner', 'Gifts & souvenir hunting'] },
            { day: 'Hari 10', title: 'Pulang ke Jakarta', icon: '🏠', items: ['Check-out hotel', 'Penerbangan Chongqing–Jakarta', 'Kembali ke rumah bawa kenangan & kemampuan Mandarin baru! 🏠'] },
        ],
    },
};

const HIGHLIGHTS = [
    { icon: '🎓', num: '01', tag: 'Pendidikan',  accentFrom: '#f59e0b', accentTo: '#ef4444', fromRgb: '245,158,11',  toRgb: '239,68,68',   title: 'Kelas Intensif di China',   desc: 'Belajar Mandarin langsung di kampus top seperti Tsinghua University — bukan di kelas biasa.' },
    { icon: '🏛️', num: '02', tag: 'Budaya',      accentFrom: '#8b5cf6', accentTo: '#6366f1', fromRgb: '139,92,246',  toRgb: '99,102,241',  title: 'Destinasi Bersejarah',      desc: 'Tembok Besar, Forbidden City, Giant Panda Base — destinasi yang mengajarkan budaya langsung.' },
    { icon: '🍜', num: '03', tag: 'Kuliner',      accentFrom: '#ef4444', accentTo: '#f97316', fromRgb: '239,68,68',   toRgb: '249,115,22',  title: 'Food Tour Authentic',       desc: 'Cicipi kuliner Sichuan, hotpot Chongqing, dan masakan Beijing yang sesungguhnya.' },
    { icon: '👨‍👩‍👧‍👦', num: '04', tag: 'Keluarga', accentFrom: '#10b981', accentTo: '#06b6d4', fromRgb: '16,185,129',  toRgb: '6,182,212',   title: 'All Ages Welcome',          desc: 'Trip didesain untuk semua usia — solo, keluarga, hingga grup teman. Kids 5 tahun+ OK.' },
    { icon: '✈️', num: '05', tag: 'Perjalanan',   accentFrom: '#0ea5e9', accentTo: '#6366f1', fromRgb: '14,165,233',  toRgb: '99,102,241',  title: 'Full Package All-In',       desc: 'Tiket pesawat, hotel bintang 4, makan 3×/hari, transport, visa — semua sudah termasuk.' },
    { icon: '🛡️', num: '06', tag: 'Layanan',     accentFrom: '#f43f5e', accentTo: '#ec4899', fromRgb: '244,63,94',   toRgb: '236,72,153',  title: 'Pendampingan Penuh',        desc: 'Tour leader berpengalaman dari Panda mendampingi dari keberangkatan hingga pulang.' },
];

const TESTIMONIALS = [
    { name: 'Rizky Darmawan', batch: 'Summer Camp Beijing 2025', initials: 'RD', grad: 'linear-gradient(135deg,#f43f5e,#fb923c)', quote: 'Pengalaman paling memorable! Belajar Mandarin di kampus Tsinghua langsung, terus ketemu temen baru dari seluruh Indonesia. 10/10 wajib coba!' },
    { name: 'Nadia Kusuma', batch: 'Winter Camp Chengdu 2025', initials: 'NK', grad: 'linear-gradient(135deg,#34d399,#2dd4bf)', quote: 'Lihat panda langsung itu mimpi yang jadi kenyataan. Plus Mandarin saya improve banget cuma dalam 10 hari karena semua serba Mandarin!' },
    { name: 'Bpk. Bambang + Keluarga', batch: 'Summer Camp 2024 — Family Trip', initials: 'BB', grad: 'linear-gradient(135deg,#818cf8,#a78bfa)', quote: 'Berangkat berlima termasuk anak usia 8 & 12 tahun. Semua sudah diatur Panda dari A sampai Z. Anak-anak sekarang makin semangat belajar!' },
];

const HERO_CHARS = [
    { char: '学', style: { top: '10%', left: '2.5%' }, size: 110, dur: 22, delay: 0, opacity: 0.032, rot: 4 },
    { char: '游', style: { top: '15%', right: '3%' }, size: 130, dur: 18, delay: 1.5, opacity: 0.038, rot: -3 },
    { char: '行', style: { top: '62%', left: '2%' }, size: 85, dur: 28, delay: 4, opacity: 0.025, rot: 3 },
    { char: '华', style: { top: '44%', right: '2%' }, size: 70, dur: 24, delay: 6, opacity: 0.022, rot: -4 },
];

/* ── Dark mode hook ─────────────────────────────────────────── */
function useDarkMode() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    useEffect(() => {
        const obs = new MutationObserver(() =>
            setDark(document.documentElement.classList.contains('dark'))
        );
        obs.observe(document.documentElement, { attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE — lazy section hook + wrapper
═══════════════════════════════════════════════════════════════ */

/** Fires once when the sentinel div is within `rootMargin` of the viewport.
 *  Never resets — section stays rendered after first reveal. */
function useLazySection(rootMargin = '260px') {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || visible) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
            { rootMargin },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin, visible]);
    return { ref, visible };
}

function LazySection({
    children,
    skeleton,
    rootMargin = '260px',
}: {
    children: React.ReactNode;
    skeleton: React.ReactNode;
    rootMargin?: string;
}) {
    const { ref, visible } = useLazySection(rootMargin);
    return <div ref={ref}>{visible ? children : skeleton}</div>;
}

/* ═══════════════════════════════════════════════════════════════
   SKELETON COMPONENTS
   Each skeleton mirrors the approximate height of the real section
   so the page doesn't jump when content replaces it.
═══════════════════════════════════════════════════════════════ */

function Sk({ className = '', style }: { className?: string; style?: CSSProperties }) {
    return <div className={`sk-shimmer rounded-xl ${className}`} style={style} />;
}

function WhyPandaSkeleton() {
    return (
        <div className="bg-[#FDFAF6] py-24 dark:bg-[#05080F] md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center gap-4">
                    <Sk className="h-6 w-44 rounded-full" />
                    <Sk className="h-10 w-72" />
                    <Sk className="h-4 w-60" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <Sk
                            key={i}
                            className={`rounded-[22px] ${i === 0 || i === 5 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                            style={{ height: 176 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function EventsSkeleton() {
    return (
        <div className="relative bg-[#F8F9FF] dark:bg-[#080A14] py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center gap-4">
                    <Sk className="h-6 w-44 rounded-full" />
                    <Sk className="h-10 w-80" />
                    <Sk className="h-4 w-56" />
                    <div className="mt-2 flex gap-3">
                        <Sk className="h-7 w-36 rounded-full" />
                        <Sk className="h-7 w-32 rounded-full" />
                        <Sk className="h-7 w-28 rounded-full" />
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    {[0, 1].map(i => (
                        <div key={i} className="overflow-hidden rounded-3xl">
                            <Sk className="rounded-b-none rounded-t-3xl" style={{ height: 260 }} />
                            <div className="space-y-3 rounded-b-3xl bg-white p-6">
                                <Sk className="h-6 w-3/4" />
                                <Sk className="h-4 w-full" />
                                <Sk className="h-4 w-2/3" />
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {[0, 1, 2, 3].map(j => <Sk key={j} className="rounded-2xl" style={{ height: 64 }} />)}
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {[0, 1, 2, 3].map(j => <Sk key={j} className="h-7 w-28 rounded-full" />)}
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Sk className="h-12 rounded-2xl" />
                                    <Sk className="h-12 rounded-2xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AlumniSkeleton() {
    const tiles = [
        { col: 'col-span-2', h: 210 }, { col: '', h: 210 }, { col: '', h: 210 },
        { col: '', h: 190 }, { col: '', h: 190 }, { col: 'col-span-2', h: 190 },
    ];
    return (
        <div className="bg-[#FDFAF6] py-20 dark:bg-[#0B0B0F] md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 flex flex-col items-center gap-4">
                    <Sk className="h-6 w-36 rounded-full" />
                    <Sk className="h-10 w-80" />
                    <Sk className="h-4 w-48" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {tiles.map((t, i) => (
                        <Sk key={i} className={`rounded-2xl ${t.col}`} style={{ height: t.h }} />
                    ))}
                </div>
                <div className="my-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2, 3].map(i => <Sk key={i} className="h-20 rounded-2xl" />)}
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                    {[0, 1, 2].map(i => <Sk key={i} className="h-52 rounded-3xl" />)}
                </div>
            </div>
        </div>
    );
}

function FinalCtaSkeleton() {
    return (
        <div className="bg-[#FDFAF6] dark:bg-[#07090F] py-24 md:py-32">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <div className="flex flex-col items-center gap-4">
                    <Sk className="h-16 w-16 rounded-2xl" />
                    <Sk className="h-9 w-64" />
                    <Sk className="h-5 w-80" />
                    <Sk className="h-5 w-72" />
                    <div className="mt-2 flex gap-3">
                        <Sk className="h-14 w-52 rounded-2xl" />
                        <Sk className="h-14 w-48 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Itinerary Modal — soft light card UI ───────────────────── */
const ItineraryModal = memo(function ItineraryModal({ type, onClose }: { type: 'summer' | 'winter'; onClose: () => void }) {
    const data = ITINERARIES[type];
    const isSummer = type === 'summer';
    const isDark = useDarkMode();

    const headerBg = isSummer
        ? isDark ? 'linear-gradient(135deg,#1a1008 0%,#1a0c0a 100%)' : 'linear-gradient(135deg,#fef9ec 0%,#fff1f2 100%)'
        : isDark ? 'linear-gradient(135deg,#080f1c 0%,#0e0c22 100%)' : 'linear-gradient(135deg,#eff6ff 0%,#f5f3ff 100%)';

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/38 backdrop-blur-[6px]" />

            <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.38, ease: EASE }}
                onClick={e => e.stopPropagation()}
                className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white dark:bg-zinc-900 sm:rounded-3xl"
                style={{
                    maxHeight: '90vh',
                    boxShadow: isDark ? '0 32px 72px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)' : '0 32px 72px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08)',
                }}
            >
                {/* Soft pastel header */}
                <div className="relative shrink-0 overflow-hidden px-6 pb-5 pt-5" style={{ background: headerBg }}>
                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-50"
                        style={{ background: `radial-gradient(circle,${data.accentColor}35,transparent 70%)`, filter: 'blur(28px)' }} />

                    <div className="relative flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <div
                                className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                style={{ background: `${data.accentColor}18`, color: data.accentColor }}
                            >
                                {isSummer ? '☀️' : '❄️'} {isSummer ? 'Summer Camp' : 'Winter Camp'} · Itinerary
                            </div>
                            <h3 className="text-[18px] font-black leading-tight text-zinc-900 dark:text-white">
                                {isSummer ? 'Beijing · Shanghai · Xian' : 'Chengdu · Leshan · Chongqing'}
                            </h3>
                            <p className="mt-1 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">{data.subtitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 shadow-sm transition-colors hover:bg-white dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative mt-3.5 flex flex-wrap gap-2">
                        {[
                            { icon: '📅', text: `${data.days.length} Hari` },
                            { icon: '🌙', text: `${data.days.length - 1} Malam` },
                            { icon: '🏙️', text: '3 Kota' },
                        ].map(c => (
                            <span
                                key={c.text}
                                className="flex items-center gap-1 rounded-full border bg-white/70 dark:bg-zinc-800/70 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 backdrop-blur-sm"
                                style={{ borderColor: `${data.accentColor}28` }}
                            >
                                {c.icon} {c.text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Scrollable timeline */}
                <div className="relative flex-1 overflow-y-auto" style={{ background: isDark ? '#111318' : '#F9F9F8' }}>
                    <div className="pointer-events-none sticky top-0 z-10 h-4" style={{ background: isDark ? 'linear-gradient(to bottom,#111318,transparent)' : 'linear-gradient(to bottom,#F9F9F8,transparent)' }} />
                    <div className="px-5 pb-6 pt-2">
                        {data.days.map((d, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.055, duration: 0.38, ease: EASE }}
                                className="flex gap-3"
                            >
                                <div className="flex shrink-0 flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.055 + 0.08, type: 'spring', stiffness: 380, damping: 22 }}
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg shadow-sm"
                                        style={{
                                            background: `linear-gradient(135deg,${data.accentColor}18,${data.accentColor}08)`,
                                            border: `1.5px solid ${data.accentColor}28`,
                                        }}
                                    >
                                        {d.icon}
                                    </motion.div>
                                    {i < data.days.length - 1 && (
                                        <div className="mt-1.5 w-px flex-1 min-h-[18px]"
                                            style={{ background: `linear-gradient(to bottom,${data.accentColor}28,transparent)` }} />
                                    )}
                                </div>

                                <motion.div
                                    whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(0,0,0,0.08)', transition: { duration: 0.18 } }}
                                    className="mb-3 flex-1 overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/80 p-4 shadow-sm"
                                >
                                    <div className="mb-2.5 flex items-center gap-2">
                                        <span
                                            className="rounded-full px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider"
                                            style={{ background: `${data.accentColor}12`, color: data.accentColor }}
                                        >
                                            {d.day}
                                        </span>
                                        <h4 className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">{d.title}</h4>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {d.items.map((item, j) => (
                                            <motion.li
                                                key={j}
                                                initial={{ opacity: 0, x: -6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.055 + j * 0.025 + 0.14, duration: 0.22, ease: EASE }}
                                                className="flex gap-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400"
                                            >
                                                <span className="mt-[3px] shrink-0 text-[8px]" style={{ color: data.accentColor }}>●</span>
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 px-5 py-4">
                    <motion.a
                        href={`https://api.whatsapp.com/send/?phone=${WA}&text=${EVENTS.find(e => e.id === type)?.waText}`}
                        target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.97 }}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
                        style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.28)' }}
                    >
                        💬 Daftar via WhatsApp
                    </motion.a>
                </div>
            </motion.div>
        </motion.div>
    );
});

/* ── Event Card — vivid gradient header + clean white body ──── */
const EventCard = memo(function EventCard({ event, onItinerary, index, isDark }: { event: TripEvent; onItinerary: () => void; index: number; isDark: boolean }) {
    const seatPct   = (event.filled / event.quota) * 100;
    const remaining = event.quota - event.filled;
    const shadowRgb = index === 0 ? '245,158,11' : '14,165,233';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: EASE }}
            whileHover={{ y: -10, transition: { duration: 0.25 } }}
            className="flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-900"
            style={{ boxShadow: isDark ? `0 20px 60px rgba(${shadowRgb},0.12), 0 4px 20px rgba(0,0,0,0.4)` : `0 20px 60px rgba(${shadowRgb},0.18), 0 4px 20px rgba(0,0,0,0.08)` }}
        >
            {/* Vivid gradient header */}
            <div className="relative overflow-hidden" style={{ height: 260, background: event.accentGrad }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 30%,rgba(255,255,255,0.18),transparent 60%)' }} />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-6 select-none">
                    <motion.span
                        animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ fontFamily: "'Noto Serif SC',serif", fontSize: 110, fontWeight: 700, lineHeight: 1, color: 'rgba(255,255,255,0.18)' }}
                    >{event.hanziA}</motion.span>
                    <motion.span
                        animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        style={{ fontFamily: "'Noto Serif SC',serif", fontSize: 110, fontWeight: 700, lineHeight: 1, color: 'rgba(255,255,255,0.1)' }}
                    >{event.hanziB}</motion.span>
                </div>

                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 45%,rgba(0,0,0,0.28))' }} />

                <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        {event.season}
                    </span>
                </div>
                <div className="absolute right-4 top-4">
                    <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        {event.badge}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                    {event.destinations.map(d => (
                        <span key={d.name} className="rounded-lg border border-white/20 bg-black/20 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                            {d.emoji} {d.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col bg-white dark:bg-zinc-900 p-6">
                <h3 className="mb-1.5 text-xl font-black text-zinc-900 dark:text-white">{event.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{event.subtitle}</p>

                <div className="mb-5 grid grid-cols-2 gap-2.5">
                    {[
                        { label: 'Tanggal', value: event.dates, sub: event.duration },
                        { label: 'Kuota', value: `${event.quota} peserta`, sub: <span style={{ color: event.statusColor, fontWeight: 600 }}>{event.statusLabel}</span> },
                        { label: 'Harga', value: event.price, sub: 'all-in per orang' },
                        { label: 'Usia', value: event.ageLabel, sub: event.ageSub },
                    ].map(item => (
                        <div key={item.label} className="rounded-2xl border border-zinc-100 dark:border-zinc-700/50 bg-zinc-50/80 dark:bg-zinc-800/60 p-3">
                            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">{item.label}</p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.value}</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-5">
                    <p className="mb-2 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Sudah termasuk:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {event.includes.map(inc => (
                            <span key={inc} className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                                {inc}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-zinc-400">{event.filled}/{event.quota} terisi</span>
                        <span className="font-bold" style={{ color: event.statusColor }}>{remaining} slot tersisa</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700/50">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: event.seatGrad }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${seatPct}%` }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
                        />
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={onItinerary}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                        📅 Lihat Itinerary
                    </motion.button>
                    <motion.a
                        href={`https://api.whatsapp.com/send/?phone=${WA}&text=${event.waText}`}
                        target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center rounded-2xl py-3 text-sm font-bold text-white"
                        style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.38)' }}
                    >
                        💬 Daftar Sekarang
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
});

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */
export default function StudyTourPage() {
    const isDark = useDarkMode();
    const [activeItinerary, setActiveItinerary] = useState<'summer' | 'winter' | null>(null);

    return (
        <>
            <Head title="Study Tour ke China 2026 — Panda Mandarin Education" />

            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track { animation: marqueeScroll 28s linear infinite; }
                .marquee-track:hover { animation-play-state: paused; }

                /* Shimmer for skeleton loaders */
                @keyframes sk-shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .sk-shimmer {
                    background: linear-gradient(90deg,#ede9e3 25%,#f5f2ee 50%,#ede9e3 75%);
                    background-size: 200% 100%;
                    animation: sk-shimmer 1.6s ease-in-out infinite;
                }
                .dark .sk-shimmer {
                    background: linear-gradient(90deg,#1c1f2b 25%,#252836 50%,#1c1f2b 75%);
                    background-size: 200% 100%;
                }

                /* Smooth scroll for the whole page */
                html { scroll-behavior: smooth; }

                /* Offset anchored sections by navbar height */
                #events { scroll-margin-top: 80px; }
            `}</style>

            {/* MotionConfig: respects prefers-reduced-motion OS setting */}
            <MotionConfig reducedMotion="user">
                <div className="overflow-x-hidden">

                    {/* ══════════════════════════════════════════════
                        HERO — always rendered, no lazy loading needed
                    ══════════════════════════════════════════════ */}
                    <div className="relative overflow-hidden bg-[#FDFAF6] dark:bg-[#07090F] pb-12 pt-28 md:pt-36">

                        <div className="pointer-events-none absolute inset-0" aria-hidden>
                            <div className="absolute inset-0 opacity-[0.035]"
                                style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.8) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />

                            <motion.div
                                animate={{ x: [0, 44, 0], y: [0, -28, 0], scale: [1, 1.22, 1] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -left-24 -top-24 h-96 w-96 rounded-full"
                                style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.13),transparent 70%)', filter: 'blur(72px)' }}
                            />
                            <motion.div
                                animate={{ x: [0, -36, 0], y: [0, 24, 0], scale: [1, 1.16, 1] }}
                                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                                className="absolute -right-20 top-20 h-80 w-80 rounded-full"
                                style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.18),transparent 70%)', filter: 'blur(64px)' }}
                            />
                            <motion.div
                                animate={{ opacity: [0.08, 0.22, 0.08], scale: [1, 1.3, 1] }}
                                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                                className="absolute bottom-0 left-1/3 h-72 w-96 rounded-full"
                                style={{ background: 'radial-gradient(ellipse,rgba(99,102,241,0.12),transparent 70%)', filter: 'blur(60px)' }}
                            />

                            {HERO_CHARS.map((c, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -16, 0], rotate: [0, c.rot, 0] }}
                                    transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                                    className="absolute select-none font-bold leading-none text-zinc-900 dark:text-white"
                                    style={{ ...c.style, fontSize: c.size, opacity: c.opacity, fontFamily: 'var(--font-hanzi)' }}
                                    aria-hidden
                                >{c.char}</motion.div>
                            ))}

                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black leading-none text-red-400 dark:text-red-500 opacity-[0.03]"
                                style={{ fontSize: 320, fontFamily: 'var(--font-hanzi)' }} aria-hidden>游</div>

                            <motion.div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(212,165,116,0.06) 50%,transparent 60%)' }}
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 7 }}
                            />
                        </div>

                        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: EASE }}
                                className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200/70 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/30 px-4 py-1.5"
                            >
                                <motion.span
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-1.5 w-1.5 rounded-full bg-red-500"
                                />
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                                    2× per tahun · Summer & Winter Camp
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 26 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
                                className="mb-5 text-4xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl"
                            >
                                Study Tour ke{' '}
                                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#E63946 0%,#D4A574 100%)' }}>
                                    China
                                </span>{' '}🇨🇳
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
                                className="mb-8 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-lg"
                            >
                                Bukan sekadar liburan — ini pengalaman belajar langsung di negeri asalnya Mandarin.
                                Kunjungi universitas, belajar bersama penutur asli, dan rasakan budaya China yang sesungguhnya.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.24, ease: EASE }}
                                className="mb-10 flex flex-wrap gap-3"
                            >
                                <motion.a
                                    href="#events"
                                    whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-[15px] font-bold text-white shadow-lg"
                                    style={{ background: 'linear-gradient(135deg,#E63946,#c0303b)', boxShadow: '0 8px 28px rgba(230,57,70,0.35)' }}
                                >
                                    ✈️ Lihat Event 2026
                                </motion.a>
                                <motion.a
                                    href={`https://api.whatsapp.com/send/?phone=${WA}&text=Halo+Admin+Panda!+Saya+tertarik+info+Study+Tour+ke+China.`}
                                    target="_blank" rel="noopener noreferrer"
                                    whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-7 py-3.5 text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-zinc-800"
                                >
                                    💬 Tanya Admin
                                </motion.a>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
                                className="flex flex-wrap gap-3"
                            >
                                {[
                                    { icon: '📅', label: 'Per tahun', value: '2×' },
                                    { icon: '🌏', label: 'Hari trip', value: '8–12' },
                                    { icon: '🏙️', label: 'Kota China', value: '5+' },
                                    { icon: '👥', label: 'Alumni', value: '200+' },
                                    { icon: '✈️', label: 'Package', value: 'All-in' },
                                ].map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.36 + i * 0.06, ease: EASE }}
                                        className="flex items-center gap-2 rounded-xl border border-zinc-200/70 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-800/60 px-3.5 py-2 backdrop-blur-sm"
                                    >
                                        <span className="text-base">{s.icon}</span>
                                        <div>
                                            <p className="text-sm font-black leading-none text-zinc-900 dark:text-white">{s.value}</p>
                                            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{s.label}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════
                        MARQUEE — always rendered
                    ══════════════════════════════════════════════ */}
                    <div className="overflow-hidden border-y border-zinc-200/60 dark:border-zinc-800/60 bg-[#FDFAF6] dark:bg-[#07090F] py-4">
                        <div className="marquee-track flex gap-8 whitespace-nowrap">
                            {Array(2).fill(['🏯 Tembok Besar', '🏛️ Forbidden City', '🐼 Panda Base', '⚔️ Terracotta Army', '🌆 Shanghai Bund', '🚄 Bullet Train', '🍜 Hotpot Sichuan', '🎓 Tsinghua Univ', '🌃 Chongqing Night', '🗿 Leshan Buddha']).flat().map((d, i) => (
                                <span key={i} className="flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-600">
                                    {d} <span className="text-zinc-200 dark:text-zinc-700">·</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════
                        WHY PANDA — lazy loaded
                    ══════════════════════════════════════════════ */}
                    <LazySection skeleton={<WhyPandaSkeleton />} rootMargin="300px">
                        <section className="relative overflow-hidden bg-[#FDFAF6] py-24 dark:bg-[#05080F] md:py-32">

                            <div className="pointer-events-none absolute inset-0" aria-hidden>
                                <div className="absolute inset-0 opacity-[0.04] dark:hidden"
                                    style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.7) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
                                <div className="absolute inset-0 hidden opacity-[0.04] dark:block"
                                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

                                <motion.div
                                    animate={{ x: [0, 70, 0], y: [0, -45, 0], scale: [1, 1.35, 1] }}
                                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -left-48 -top-24 h-[620px] w-[620px] rounded-full opacity-[0.28] dark:opacity-[0.65]"
                                    style={{ background: 'radial-gradient(circle,rgba(245,158,11,0.55),transparent 70%)', filter: 'blur(90px)' }}
                                />
                                <motion.div
                                    animate={{ x: [0, -55, 0], y: [0, 40, 0], scale: [1, 1.25, 1] }}
                                    transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
                                    className="absolute -right-48 -top-10 h-[540px] w-[540px] rounded-full opacity-[0.22] dark:opacity-[0.55]"
                                    style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.6),transparent 70%)', filter: 'blur(85px)' }}
                                />
                                <motion.div
                                    animate={{ x: [0, 35, 0], y: [0, -30, 0], scale: [1, 1.3, 1] }}
                                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 13 }}
                                    className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full opacity-[0.2] dark:opacity-[0.45]"
                                    style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.5),transparent 70%)', filter: 'blur(75px)' }}
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.45, 1] }}
                                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                                    className="absolute right-1/4 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full opacity-[0.18] dark:opacity-[0.3]"
                                    style={{ background: 'radial-gradient(circle,rgba(244,63,94,0.55),transparent 70%)', filter: 'blur(65px)' }}
                                />
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(212,165,116,0.04) 50%,transparent 65%)' }}
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatDelay: 10 }}
                                />
                            </div>

                            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.55, ease: EASE }}
                                    className="mb-16 text-center"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.88 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 dark:border-red-900/30 dark:bg-red-950/20"
                                    >
                                        <motion.span
                                            animate={{ scale: [1, 1.6, 1] }}
                                            transition={{ duration: 1.8, repeat: Infinity }}
                                            className="h-1.5 w-1.5 rounded-full bg-red-500"
                                        />
                                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Kenapa Pilih Panda</span>
                                    </motion.div>

                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-5xl">
                                        Bukan sekadar{' '}
                                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#E63946,#D4A574)' }}>
                                            liburan biasa.
                                        </span>
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-500 md:text-base">
                                        Setiap detail dirancang untuk pengalaman belajar dan budaya yang otentik dan tak terlupakan.
                                    </p>
                                </motion.div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {HIGHLIGHTS.map((h, i) => {
                                        const isWide = i === 0 || i === 5;
                                        const grad   = `linear-gradient(135deg,${h.accentFrom},${h.accentTo})`;

                                        return (
                                            <motion.div
                                                key={h.title}
                                                initial={{ opacity: 0, y: 44 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: '-50px' }}
                                                transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
                                                className={isWide ? 'sm:col-span-2 lg:col-span-2' : 'lg:col-span-1'}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.025, transition: { duration: 0.22 } }}
                                                    className="group h-full rounded-[22px] p-[1.5px]"
                                                    style={{ background: grad }}
                                                >
                                                    <div className={`relative h-full overflow-hidden rounded-[21px] bg-white/92 backdrop-blur-xl dark:bg-[#0c0e18] ${isWide ? 'flex items-center gap-6 p-6' : 'flex flex-col p-5'}`}>
                                                        <div
                                                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                                            style={{ background: `radial-gradient(ellipse at top left,rgba(${h.fromRgb},0.07) 0%,transparent 60%)` }}
                                                        />
                                                        <div
                                                            className="pointer-events-none absolute bottom-2 right-4 select-none font-black leading-none text-zinc-900/[0.04] dark:text-white/[0.04]"
                                                            style={{ fontSize: 72 }}
                                                            aria-hidden
                                                        >{h.num}</div>

                                                        <div className={`relative shrink-0 ${isWide ? '' : 'mb-4'}`}>
                                                            <motion.div
                                                                animate={{ scale: [1, 1.35, 1], opacity: [0.18, 0.45, 0.18] }}
                                                                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                                                                className="absolute -inset-3 rounded-full blur-xl dark:opacity-100"
                                                                style={{ background: grad, opacity: 0.35 }}
                                                            />
                                                            <motion.div
                                                                whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                                                                className={`relative flex items-center justify-center rounded-2xl ${isWide ? 'h-16 w-16 text-3xl' : 'h-12 w-12 text-2xl'}`}
                                                                style={{
                                                                    background: `linear-gradient(135deg,rgba(${h.fromRgb},0.14),rgba(${h.toRgb},0.1))`,
                                                                    border: `1px solid rgba(${h.fromRgb},0.28)`,
                                                                    boxShadow: `0 0 20px rgba(${h.fromRgb},0.14)`,
                                                                }}
                                                            >
                                                                {h.icon}
                                                            </motion.div>
                                                        </div>

                                                        <div className="relative min-w-0 flex-1">
                                                            <div className="mb-2.5 flex items-center gap-2">
                                                                <span className="font-mono text-[11px] font-black tracking-wider" style={{ color: h.accentFrom }}>{h.num}</span>
                                                                <span className="rounded-full border border-black/[0.07] bg-black/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.05]">
                                                                    {h.tag}
                                                                </span>
                                                            </div>
                                                            <h3 className={`font-bold text-zinc-900 dark:text-white ${isWide ? 'mb-2 text-lg' : 'mb-1.5 text-[15px]'}`}>{h.title}</h3>
                                                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{h.desc}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </LazySection>

                    {/* ══════════════════════════════════════════════
                        EVENTS — lazy loaded
                    ══════════════════════════════════════════════ */}
                    <LazySection skeleton={<EventsSkeleton />} rootMargin="260px">
                        <section id="events" className="relative overflow-hidden bg-[#F8F9FF] dark:bg-[#080A14] py-24">

                            <div className="pointer-events-none absolute inset-0" aria-hidden>
                                <div className="absolute inset-0 dark:hidden"
                                    style={{ background: 'linear-gradient(135deg,#EFF6FF 0%,#FDFAF6 38%,#FFF1F2 68%,#F0FDF4 100%)' }} />
                                <div className="absolute inset-0 hidden dark:block"
                                    style={{ background: 'linear-gradient(135deg,#080C18 0%,#0E1020 38%,#12080E 68%,#060E10 100%)' }} />
                                <div className="absolute inset-0 opacity-[0.045]"
                                    style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.65) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

                                <motion.div
                                    animate={{ x: [0, 65, 0], y: [0, -42, 0], scale: [1, 1.32, 1] }}
                                    transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -left-36 -top-16 h-[520px] w-[520px] rounded-full"
                                    style={{ background: 'radial-gradient(circle,rgba(251,191,36,0.5),transparent 70%)', filter: 'blur(80px)', opacity: 0.55 }}
                                />
                                <motion.div
                                    animate={{ x: [0, -52, 0], y: [0, 38, 0], scale: [1, 1.26, 1] }}
                                    transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
                                    className="absolute -right-36 -top-8 h-[500px] w-[500px] rounded-full"
                                    style={{ background: 'radial-gradient(circle,rgba(56,189,248,0.5),transparent 70%)', filter: 'blur(80px)', opacity: 0.5 }}
                                />
                                <motion.div
                                    animate={{ x: [0, 38, 0], y: [0, -28, 0], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
                                    className="absolute -bottom-20 left-1/4 h-[440px] w-[440px] rounded-full"
                                    style={{ background: 'radial-gradient(circle,rgba(251,113,133,0.4),transparent 70%)', filter: 'blur(75px)', opacity: 0.45 }}
                                />
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ background: 'linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.35) 50%,transparent 62%)' }}
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 10 }}
                                />
                            </div>

                            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 22 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.55, ease: EASE }}
                                    className="mb-16 text-center"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-4 py-1.5"
                                    >
                                        <motion.span
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 1.8, repeat: Infinity }}
                                            className="h-1.5 w-1.5 rounded-full bg-red-500"
                                        />
                                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                                            Event 2026 · Daftar Sekarang
                                        </span>
                                    </motion.div>

                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-5xl">
                                        Pilih trip yang{' '}
                                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#E63946,#D4A574)' }}>
                                            cocok buat kamu.
                                        </span>
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-base">
                                        Dua batch per tahun — Summer &amp; Winter. Kuota terbatas, daftar lebih awal untuk harga terbaik.
                                    </p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.22, duration: 0.4 }}
                                        className="mt-6 flex flex-wrap justify-center gap-3"
                                    >
                                        {[
                                            { label: '☀️ Summer — Juli 2026',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
                                            { label: '❄️ Winter — Des 2026',   color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)' },
                                            { label: '✈️ All-In Package',      color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
                                        ].map(p => (
                                            <span key={p.label}
                                                className="rounded-full px-4 py-1.5 text-[12px] font-semibold"
                                                style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}>
                                                {p.label}
                                            </span>
                                        ))}
                                    </motion.div>
                                </motion.div>

                                <div className="grid gap-8 md:grid-cols-2">
                                    {EVENTS.map((event, i) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            index={i}
                                            isDark={isDark}
                                            onItinerary={() => setActiveItinerary(event.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </LazySection>

                    {/* ══════════════════════════════════════════════
                        ALUMNI STORIES — lazy loaded
                    ══════════════════════════════════════════════ */}
                    <LazySection skeleton={<AlumniSkeleton />} rootMargin="220px">
                        <section className="relative overflow-hidden bg-[#FDFAF6] py-20 dark:bg-[#0B0B0F] md:py-28">

                            <div className="pointer-events-none absolute inset-0" aria-hidden>
                                <div className="absolute inset-0 opacity-[0.04] dark:hidden"
                                    style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.65) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                                <div className="absolute inset-0 hidden opacity-[0.03] dark:block"
                                    style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

                                <motion.div
                                    animate={{ x: [0, 55, 0], y: [0, -35, 0], scale: [1, 1.28, 1] }}
                                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -left-32 -top-16 h-[500px] w-[500px] rounded-full opacity-[0.32] dark:opacity-[0.18]"
                                    style={{ background: 'radial-gradient(circle,rgba(251,113,133,0.55),transparent 70%)', filter: 'blur(80px)' }}
                                />
                                <motion.div
                                    animate={{ x: [0, -44, 0], y: [0, 30, 0], scale: [1, 1.22, 1] }}
                                    transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
                                    className="absolute -right-24 top-8 h-[440px] w-[440px] rounded-full opacity-[0.26] dark:opacity-[0.14]"
                                    style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.55),transparent 70%)', filter: 'blur(78px)' }}
                                />
                                <motion.div
                                    animate={{ x: [0, 30, 0], y: [0, -22, 0], scale: [1, 1.32, 1] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
                                    className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full opacity-[0.24] dark:opacity-[0.14]"
                                    style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.5),transparent 70%)', filter: 'blur(72px)' }}
                                />
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ background: 'linear-gradient(110deg,transparent 40%,rgba(255,255,255,0.3) 50%,transparent 60%)' }}
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 12 }}
                                />
                            </div>

                            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                                <motion.div
                                    initial={{ opacity: 0, y: 22 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.55, ease: EASE }}
                                    className="mb-14 text-center"
                                >
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 backdrop-blur-sm dark:border-zinc-700/50 dark:bg-zinc-800/50">
                                        <motion.span
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="h-1.5 w-1.5 rounded-full bg-amber-500"
                                        />
                                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">Alumni Stories</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-5xl">
                                        Momen tak terlupakan{' '}
                                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#E63946,#D4A574)' }}>
                                            batch sebelumnya.
                                        </span>
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        Ratusan alumni sudah merasakannya — sekarang giliran kamu.
                                    </p>
                                </motion.div>

                                {/* Gallery */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {([
                                        { hanzi: '长城', label: 'Tembok Besar, Beijing',       col: 'col-span-2', h: 210,
                                          bgL: 'linear-gradient(135deg,#fff1f2,#fecdd3)',       bgD: 'linear-gradient(135deg,#1c1917,#292524)',
                                          hColorL: 'rgba(225,29,72,0.45)',                      hColorD: 'rgba(230,57,70,0.22)', fs: 82 },
                                        { hanzi: '故宫', label: 'Forbidden City',               col: '',           h: 210,
                                          bgL: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',       bgD: 'linear-gradient(135deg,#0c1a2e,#1e1b4b)',
                                          hColorL: 'rgba(109,40,217,0.45)',                     hColorD: 'rgba(139,92,246,0.28)', fs: 62 },
                                        { emoji: '🐼',  label: 'Giant Panda Base, Chengdu',   col: '',           h: 210,
                                          bgL: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',       bgD: 'linear-gradient(135deg,#052e16,#064e3b)', fs: 0 },
                                        { hanzi: '清华', label: 'Tsinghua University',          col: '',           h: 190,
                                          bgL: 'linear-gradient(135deg,#fefce8,#fde68a)',       bgD: 'linear-gradient(135deg,#2d1b00,#451a03)',
                                          hColorL: 'rgba(161,98,7,0.5)',                        hColorD: 'rgba(251,191,36,0.28)', fs: 62 },
                                        { emoji: '🍜',  label: 'Kuliner Sichuan Authentic',    col: '',           h: 190,
                                          bgL: 'linear-gradient(135deg,#fff7ed,#fed7aa)',       bgD: 'linear-gradient(135deg,#0c0a09,#1c1412)', fs: 0 },
                                        { hanzi: '上海', label: 'Shanghai Bund — Malam Hari',  col: 'col-span-2', h: 190, badge: "Winter Camp '25",
                                          bgL: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',       bgD: 'linear-gradient(135deg,#0c1340,#1e1b4b)',
                                          hColorL: 'rgba(2,132,199,0.45)',                      hColorD: 'rgba(14,165,233,0.22)', fs: 82 },
                                    ] as const).map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 28, scale: 0.95 }}
                                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                            viewport={{ once: true, margin: '-40px' }}
                                            transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                                            whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.22 } }}
                                            className={`group relative overflow-hidden rounded-2xl ${item.col}`}
                                            style={{ height: item.h, cursor: 'pointer' }}
                                        >
                                            <div className="absolute inset-0 dark:hidden" style={{ background: item.bgL }} />
                                            <div className="absolute inset-0 hidden dark:block" style={{ background: item.bgD }} />

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {'hanzi' in item && item.hanzi ? (
                                                    <motion.span
                                                        animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
                                                        transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                                                        className="select-none font-bold leading-none"
                                                        style={{ fontFamily: "'Noto Serif SC',serif", fontSize: item.fs }}
                                                    >
                                                        <span className="dark:hidden" style={{ color: 'hColorL' in item ? item.hColorL : undefined }}>{item.hanzi}</span>
                                                        <span className="hidden dark:inline" style={{ color: 'hColorD' in item ? item.hColorD : undefined }}>{item.hanzi}</span>
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        animate={{ scale: [1, 1.12, 1] }}
                                                        transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                                                        className="text-5xl sm:text-6xl"
                                                    >{'emoji' in item ? item.emoji : ''}</motion.span>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 dark:hidden"
                                                style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.2) 0%,transparent 55%)' }} />
                                            <div className="absolute inset-0 hidden dark:block"
                                                style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 55%)' }} />

                                            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                                <span className="flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 backdrop-blur-sm transition-all group-hover:bg-white dark:bg-black/45 dark:text-white">
                                                    📍 {item.label}
                                                </span>
                                                {'badge' in item && item.badge && (
                                                    <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-bold text-zinc-800 backdrop-blur-sm dark:bg-black/45 dark:text-white">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Stats strip */}
                                <motion.div
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                                    className="my-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
                                >
                                    {([
                                        { value: '200+', label: 'Alumni',  icon: '👥', from: '#f43f5e', to: '#fb923c' },
                                        { value: '8',    label: 'Batch',   icon: '🎓', from: '#8b5cf6', to: '#6366f1' },
                                        { value: '5+',   label: 'Kota',    icon: '🏙️', from: '#0ea5e9', to: '#06b6d4' },
                                        { value: '4.9★', label: 'Rating',  icon: '✨', from: '#f59e0b', to: '#eab308' },
                                    ] as const).map((s, i) => (
                                        <motion.div
                                            key={s.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.09, duration: 0.45, ease: EASE }}
                                            whileHover={{ y: -4, scale: 1.04, transition: { duration: 0.18 } }}
                                            className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/85 p-4 backdrop-blur-sm dark:border-zinc-700/50 dark:bg-zinc-800/60"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div
                                                        className="mb-0.5 text-2xl font-black bg-clip-text text-transparent"
                                                        style={{ backgroundImage: `linear-gradient(135deg,${s.from},${s.to})` }}
                                                    >{s.value}</div>
                                                    <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{s.label}</p>
                                                </div>
                                                <motion.span
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 3 + i, repeat: Infinity, repeatDelay: 2 }}
                                                    className="text-2xl"
                                                >{s.icon}</motion.span>
                                            </div>
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1], opacity: [0.07, 0.14, 0.07] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                                                className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full blur-xl"
                                                style={{ background: `radial-gradient(circle,${s.from},transparent)` }}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Testimonials */}
                                <div className="grid gap-5 sm:grid-cols-3">
                                    {TESTIMONIALS.map((t, i) => {
                                        const palette = [
                                            { bgL: 'bg-rose-50/90',    bgD: 'dark:bg-[#1a0608]',   border: 'border-rose-200/70 dark:border-rose-900/30',    quote: '#f43f5e' },
                                            { bgL: 'bg-emerald-50/90', bgD: 'dark:bg-[#051a0e]',   border: 'border-emerald-200/70 dark:border-emerald-900/30', quote: '#10b981' },
                                            { bgL: 'bg-violet-50/90',  bgD: 'dark:bg-[#0d0a1a]',   border: 'border-violet-200/70 dark:border-violet-900/30',   quote: '#8b5cf6' },
                                        ][i];
                                        const enters = [
                                            { initial: { opacity: 0, x: -36, y: 0 } },
                                            { initial: { opacity: 0, x: 0,   y: 36 } },
                                            { initial: { opacity: 0, x: 36,  y: 0 } },
                                        ][i];

                                        return (
                                            <motion.div
                                                key={t.name}
                                                initial={enters.initial}
                                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                                viewport={{ once: true, margin: '-40px' }}
                                                transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
                                                whileHover={{ y: -7, scale: 1.015, transition: { duration: 0.22 } }}
                                                className={`relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-sm ${palette.bgL} ${palette.bgD} ${palette.border}`}
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                                            >
                                                <div className="h-1 w-full flex-shrink-0" style={{ background: t.grad }} />

                                                <div className="flex flex-1 flex-col p-6">
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: i * 0.12 + 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                                                        className="mb-2 font-black leading-none"
                                                        style={{ fontSize: 64, color: palette.quote, opacity: 0.28, fontFamily: 'Georgia, serif', lineHeight: 0.9 }}
                                                        aria-hidden
                                                    >"</motion.div>

                                                    <p className="mb-6 flex-1 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                                                        {t.quote}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="rounded-full p-[2px]" style={{ background: t.grad }}>
                                                                <div
                                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[11px] font-bold dark:bg-zinc-900"
                                                                    style={{ color: palette.quote }}
                                                                >{t.initials}</div>
                                                            </div>
                                                            <div>
                                                                <p className="text-[13px] font-bold text-zinc-900 dark:text-white">{t.name}</p>
                                                                <p className="font-mono text-[10px] text-zinc-500">{t.batch}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-0.5">
                                                            {[0, 1, 2, 3, 4].map(s => (
                                                                <motion.span
                                                                    key={s}
                                                                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                                                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                                                    viewport={{ once: true }}
                                                                    transition={{ delay: i * 0.12 + 0.35 + s * 0.07, type: 'spring', stiffness: 500, damping: 18 }}
                                                                    className="text-[15px] text-amber-400"
                                                                >★</motion.span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </LazySection>

                    {/* ══════════════════════════════════════════════
                        FINAL CTA — lazy loaded
                    ══════════════════════════════════════════════ */}
                    <LazySection skeleton={<FinalCtaSkeleton />} rootMargin="180px">
                        <section className="relative overflow-hidden bg-[#FDFAF6] dark:bg-[#07090F] py-24 md:py-32">
                            <div className="pointer-events-none absolute inset-0" aria-hidden>
                                <div className="absolute inset-0 opacity-[0.025]"
                                    style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.8) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
                                <motion.div
                                    animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full"
                                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.12),transparent 70%)', filter: 'blur(80px)' }}
                                />
                                <motion.div
                                    animate={{ x: [0, -24, 0], y: [0, 16, 0], scale: [1, 1.15, 1] }}
                                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                                    className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full"
                                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.14),transparent 70%)', filter: 'blur(70px)' }}
                                />
                            </div>

                            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.6, ease: EASE }}
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 8, -8, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                                        className="mb-6 text-6xl"
                                    >✈️</motion.div>
                                    <h2 className="mb-4 text-3xl font-black text-zinc-900 dark:text-white md:text-4xl">
                                        Siap berangkat ke{' '}
                                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#E63946,#D4A574)' }}>
                                            China?
                                        </span>
                                    </h2>
                                    <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-lg">
                                        Tempat terbatas setiap batch. Daftar sekarang atau tanya admin untuk simulasi biaya dan cicilan.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <motion.a
                                            href={`https://api.whatsapp.com/send/?phone=${WA}&text=Halo+Admin+Panda!+Saya+ingin+mendaftar+Study+Tour+ke+China.`}
                                            target="_blank" rel="noopener noreferrer"
                                            whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold text-white shadow-lg"
                                            style={{ background: '#25D366', boxShadow: '0 8px 28px rgba(37,211,102,0.35)' }}
                                        >
                                            💬 Daftar via WhatsApp
                                        </motion.a>
                                        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                                            <Link
                                                href="/classes"
                                                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-8 py-4 text-[15px] font-semibold text-zinc-700 dark:text-zinc-300 backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-zinc-800"
                                            >
                                                Lihat Kelas Mandarin →
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    </LazySection>

                </div>
            </MotionConfig>

            {/* Itinerary Modal — outside MotionConfig so it's always crisp */}
            <AnimatePresence>
                {activeItinerary && (
                    <ItineraryModal type={activeItinerary} onClose={() => setActiveItinerary(null)} />
                )}
            </AnimatePresence>
        </>
    );
}

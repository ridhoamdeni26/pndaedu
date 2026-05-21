'use client';

import { memo, useEffect, useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WA = '6289508275782';

/* ── Types ─────────────────────────────────────────────────────── */
interface FaqItem { q: string; a: string }
interface University { name: string; hanzi: string; city: string; emoji: string; color: string }
interface ServiceStep { num: string; icon: string; title: string; desc: string; color: string }

/* ── Dark mode hook ─────────────────────────────────────────────── */
function useDarkMode() {
    const [isDark, setIsDark] = useState(() =>
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    );
    useEffect(() => {
        const el = document.documentElement;
        const obs = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
        obs.observe(el, { attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return isDark;
}

/* ── Data ──────────────────────────────────────────────────────── */
const HERO_CHARS = [
    { char: '留', style: { top: '8%',  left: '2%' },   size: 120, dur: 24, delay: 0,   opacity: 0.08,  rot: 4,  color: '#d97706' },
    { char: '学', style: { top: '18%', right: '3%' },  size: 140, dur: 19, delay: 1.8, opacity: 0.07,  rot: -3, color: '#7c3aed' },
    { char: '大', style: { top: '60%', left: '2%' },   size: 90,  dur: 27, delay: 4,   opacity: 0.065, rot: 3,  color: '#be185d' },
    { char: '学', style: { top: '50%', right: '2%' },  size: 75,  dur: 22, delay: 5.5, opacity: 0.06,  rot: -4, color: '#d97706' },
    { char: '中', style: { top: '32%', left: '1.5%' }, size: 60,  dur: 32, delay: 7,   opacity: 0.05,  rot: -2, color: '#0891b2' },
    { char: '国', style: { top: '75%', right: '3%' },  size: 65,  dur: 26, delay: 9,   opacity: 0.05,  rot: 5,  color: '#7c3aed' },
];

const PARTICLES = [
    { style: { bottom: '15%', left: '8%' },   size: 8, color: 'rgba(217,119,6,0.45)',   maxOpacity: 0.55, travel: 80,  dur: 7,  delay: 0   },
    { style: { bottom: '20%', left: '20%' },  size: 5, color: 'rgba(244,63,94,0.35)',   maxOpacity: 0.45, travel: 100, dur: 9,  delay: 1.8 },
    { style: { bottom: '10%', left: '45%' },  size: 6, color: 'rgba(139,92,246,0.4)',   maxOpacity: 0.5,  travel: 72,  dur: 8,  delay: 3.2 },
    { style: { bottom: '8%',  right: '22%' }, size: 4, color: 'rgba(251,146,60,0.5)',   maxOpacity: 0.6,  travel: 90,  dur: 10, delay: 0.9 },
    { style: { bottom: '25%', right: '8%' },  size: 7, color: 'rgba(217,119,6,0.35)',   maxOpacity: 0.45, travel: 60,  dur: 6,  delay: 2.4 },
    { style: { bottom: '12%', right: '38%' }, size: 5, color: 'rgba(196,181,253,0.45)', maxOpacity: 0.55, travel: 110, dur: 12, delay: 4.6 },
    { style: { bottom: '30%', left: '32%' },  size: 4, color: 'rgba(244,114,182,0.4)',  maxOpacity: 0.5,  travel: 85,  dur: 8,  delay: 5.8 },
    { style: { bottom: '5%',  left: '60%' },  size: 6, color: 'rgba(217,119,6,0.3)',    maxOpacity: 0.4,  travel: 95,  dur: 11, delay: 3.5 },
];

const FEATURE_CARDS = [
    { icon: '🏛️', label: '50+ Universitas Mitra', color: '#8b5cf6' },
    { icon: '🎓', label: '200+ Mahasiswa Diterima', color: '#E63946' },
    { icon: '📋', label: 'Visa & Dokumen Diurus', color: '#f59e0b' },
    { icon: '🏠', label: 'Akomodasi Terjamin', color: '#10b981' },
];

const STATS = [
    { num: '200+', label: 'Mahasiswa Diterima' },
    { num: '50+',  label: 'Universitas Mitra' },
    { num: '95%',  label: 'Success Rate' },
];

const SERVICE_STEPS: ServiceStep[] = [
    {
        num: '01',
        icon: '💬',
        title: 'Konsultasi & Profiling',
        desc: 'Kami diskusi mendalam tentang jurusan, kemampuan bahasa, dan anggaran kamu. Kami cocokkan profil kamu dengan universitas yang paling sesuai.',
        color: '#8b5cf6',
    },
    {
        num: '02',
        icon: '📂',
        title: 'Aplikasi & Dokumen',
        desc: 'Tim kami membantu persiapan semua dokumen — transkrip, surat rekomendasi, personal statement, hingga aplikasi ke universitas pilihan.',
        color: '#E63946',
    },
    {
        num: '03',
        icon: '🛂',
        title: 'Visa & Persiapan',
        desc: 'Kami urus proses visa pelajar (X1/X2), asuransi, dan persiapan keberangkatan. Kamu hanya perlu fokus belajar.',
        color: '#f59e0b',
    },
    {
        num: '04',
        icon: '🏠',
        title: 'Akomodasi & Keberangkatan',
        desc: 'Bantuan cari asrama/apartemen, orientasi kampus, hingga pendampingan awal di China. Kamu tidak sendirian.',
        color: '#10b981',
    },
];

const UNIVERSITIES: University[] = [
    { name: 'Tsinghua University',  hanzi: '清华大学',   city: 'Beijing',      emoji: '🏛️', color: '#8b5cf6' },
    { name: 'Peking University',    hanzi: '北京大学',   city: 'Beijing',      emoji: '📚', color: '#E63946' },
    { name: 'Fudan University',     hanzi: '复旦大学',   city: 'Shanghai',     emoji: '🌆', color: '#0ea5e9' },
    { name: 'Zhejiang University',  hanzi: '浙江大学',   city: 'Hangzhou',     emoji: '🌿', color: '#10b981' },
    { name: 'BLCU',                 hanzi: '北京语言大学', city: 'Beijing',    emoji: '🗣️', color: '#f59e0b' },
    { name: 'Nanjing University',   hanzi: '南京大学',   city: 'Nanjing',      emoji: '🏯', color: '#f43f5e' },
    { name: 'Tianjin University',   hanzi: '天津大学',   city: 'Tianjin',      emoji: '⚙️', color: '#6366f1' },
    { name: '+43 Universitas Lain', hanzi: '更多大学',   city: 'Seluruh China', emoji: '🗺️', color: '#14b8a6' },
];

const PACKAGE_FEATURES = [
    'Konsultasi jurusan & universitas',
    'Persiapan & pengecekan semua dokumen',
    'Pendaftaran ke universitas pilihan',
    'Pengurusan visa pelajar (X1/X2)',
    'Koordinasi akomodasi & asrama',
    'Orientasi & pendampingan awal',
    'Support WhatsApp selama proses',
];

const TUITION_TABLE = [
    { uni: 'Tsinghua / Peking University', range: '¥26.000 – ¥30.000 / tahun' },
    { uni: 'Fudan / Zhejiang University',  range: '¥22.000 – ¥26.000 / tahun' },
    { uni: 'Universitas Daerah (Tier 2)',  range: '¥15.000 – ¥20.000 / tahun' },
    { uni: 'BLCU & Universitas Bahasa',    range: '¥18.000 – ¥22.000 / tahun' },
];

const FAQS: FaqItem[] = [
    {
        q: 'Apakah harus bisa bahasa Mandarin dulu?',
        a: 'Tidak wajib. Banyak universitas menerima program berbahasa Inggris, atau menyediakan jalur persiapan bahasa (1 tahun pre-degree). Kami bantu kamu sesuai kemampuan saat ini.',
    },
    {
        q: 'Berapa lama proses pendaftaran hingga berangkat?',
        a: 'Rata-rata 4–8 bulan dari konsultasi awal hingga keberangkatan, tergantung deadline universitas dan kelengkapan dokumen.',
    },
    {
        q: 'Apakah ada beasiswa yang bisa diakses?',
        a: 'Ya! Ada beasiswa CSC (Chinese Government Scholarship), Konfusius Institut, dan beasiswa internal universitas. Kami bantu identifikasi dan persiapkan aplikasi beasiswa.',
    },
    {
        q: 'Biaya Rp 15 Juta sudah termasuk apa saja?',
        a: 'Termasuk seluruh layanan dari konsultasi hingga keberangkatan (lihat poin paket di sebelah). Biaya kuliah, tiket pesawat, dan biaya hidup di China terpisah.',
    },
];

const TESTIMONIALS = [
    { name: 'Anisa Rahmawati', program: 'S1 Tsinghua University 2024', initials: 'AR', grad: 'linear-gradient(135deg,#8b5cf6,#6366f1)', quote: 'Dari nol tidak tahu prosesnya, tim Panda bantu step by step. Sekarang saya kuliah di Tsinghua jurusan Teknik Informatika. Mimpi yang jadi kenyataan!' },
    { name: 'Dimas Prasetyo',  program: 'S1 BLCU Program Bahasa 2023', initials: 'DP', grad: 'linear-gradient(135deg,#E63946,#f97316)', quote: 'Dokumen saya awalnya tidak lengkap dan deadline mepet. Tim Panda kerja keras bantu urus semuanya. Alhamdulillah berhasil diterima!' },
    { name: 'Siti Marlina',    program: 'S2 Fudan University 2024',    initials: 'SM', grad: 'linear-gradient(135deg,#10b981,#0ea5e9)', quote: 'Panda bantu dari cari universitas sampai urus visa dan asrama. Support-nya luar biasa bahkan setelah saya sudah di Shanghai.' },
];

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE — lazy section hook + wrapper
═══════════════════════════════════════════════════════════════ */

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
═══════════════════════════════════════════════════════════════ */

function Sk({ className = '', style }: { className?: string; style?: CSSProperties }) {
    return <div className={`sk-shimmer rounded-xl ${className}`} style={style} />;
}

function ServiceSkeleton() {
    return (
        <div className="bg-[#FDFAF6] py-24 dark:bg-[#08080E] md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center gap-4">
                    <Sk className="h-6 w-40 rounded-full" />
                    <Sk className="h-10 w-80" />
                    <Sk className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3].map(i => <Sk key={i} className="rounded-[22px]" style={{ height: 260 }} />)}
                </div>
            </div>
        </div>
    );
}

function UniversitiesSkeleton() {
    const isDark = useDarkMode();
    const bg = isDark
        ? 'linear-gradient(135deg,#1A0F05 0%,#1A0810 22%,#110D24 47%,#0A1220 70%,#0A1812 90%,#1A0F05 100%)'
        : 'linear-gradient(135deg,#FFECD2 0%,#FFD6E8 22%,#E8D8FF 47%,#D0EAFF 70%,#D0FFE8 90%,#FFECD2 100%)';
    return (
        <div className="py-24 md:py-32" style={{ background: bg }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center gap-4">
                    <Sk className="h-8 w-52 rounded-full" />
                    <Sk className="h-12 w-80" />
                    <div className="flex gap-3">
                        <Sk className="h-7 w-36 rounded-full" />
                        <Sk className="h-7 w-40 rounded-full" />
                        <Sk className="h-7 w-32 rounded-full" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => <Sk key={i} className="rounded-2xl" style={{ height: 158 }} />)}
                </div>
            </div>
        </div>
    );
}

function PricingSkeleton() {
    const isDark = useDarkMode();
    const bg = isDark
        ? 'linear-gradient(155deg,#0A0810 0%,#100C1E 35%,#120A06 70%,#0A080E 100%)'
        : 'linear-gradient(155deg,#FDFBFF 0%,#F3EEFF 35%,#FFF5E6 70%,#FDF8FF 100%)';
    return (
        <div className="py-24 md:py-32" style={{ background: bg }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 flex flex-col items-center gap-4">
                    <Sk className="h-7 w-36 rounded-full" />
                    <Sk className="h-11 w-72" />
                    <Sk className="h-4 w-56" />
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Sk className="rounded-[28px]" style={{ height: 560 }} />
                    <Sk className="rounded-[28px]" style={{ height: 560 }} />
                </div>
            </div>
        </div>
    );
}

function TestimonialSkeleton() {
    return (
        <div className="bg-[#F5F3F0] py-24 dark:bg-[#0D0A0A] md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center gap-4">
                    <Sk className="h-6 w-44 rounded-full" />
                    <Sk className="h-10 w-72" />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[0, 1, 2].map(i => <Sk key={i} className="rounded-3xl" style={{ height: 240 }} />)}
                </div>
            </div>
        </div>
    );
}

function CtaSkeleton() {
    const isDark = useDarkMode();
    const bg = isDark
        ? 'linear-gradient(135deg,#190E00 0%,#19060C 28%,#0C0818 58%,#071020 82%,#190E00 100%)'
        : 'linear-gradient(135deg,#FFF0D6 0%,#FFDEE8 30%,#EBE0FF 60%,#D8EEFF 90%,#FFF0D6 100%)';
    return (
        <div className="py-24" style={{ background: bg }}>
            <div className="mx-auto max-w-lg px-4">
                <Sk className="mx-auto rounded-[32px]" style={{ height: 380 }} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════════════ */

const FaqAccordion = memo(function FaqAccordion({ items }: { items: FaqItem[] }) {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <div className="flex flex-col gap-3">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-zinc-200/60 bg-white dark:border-white/10 dark:bg-white/5"
                    initial={false}
                >
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{item.q}</span>
                        <motion.span
                            animate={{ rotate: open === i ? 45 : 0 }}
                            transition={{ duration: 0.22 }}
                            className="flex-shrink-0 text-lg text-zinc-400 dark:text-zinc-500"
                        >
                            +
                        </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                        {open === i && (
                            <motion.div
                                key="body"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="overflow-hidden"
                            >
                                <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
});

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function CollegeChinaPage() {
    return (
        <>
            <Head title="Kuliah di China — Panda Mandarin" />
            <style>{`
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
                html { scroll-behavior: smooth; }
                #biaya { scroll-margin-top: 80px; }
                @keyframes aurora-blob {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    33%      { transform: translate(30px,-20px) scale(1.06); }
                    66%      { transform: translate(-20px,25px) scale(0.96); }
                }
                @keyframes float-card {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50%      { transform: translateY(-8px) rotate(0.4deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes warm-pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%      { opacity: 0.7; transform: scale(1.08); }
                }
            `}</style>

            <MotionConfig reducedMotion="user">
                <div className="overflow-x-hidden">

                    {/* ── HERO ───────────────────────────────────────────────── */}
                    <HeroSection />

                    {/* ── SERVICE STEPS ──────────────────────────────────────── */}
                    <LazySection skeleton={<ServiceSkeleton />} rootMargin="300px">
                        <ServiceStepsSection />
                    </LazySection>

                    {/* ── UNIVERSITIES ───────────────────────────────────────── */}
                    <LazySection skeleton={<UniversitiesSkeleton />} rootMargin="280px">
                        <UniversitiesSection />
                    </LazySection>

                    {/* ── PRICING & FAQ ──────────────────────────────────────── */}
                    <LazySection skeleton={<PricingSkeleton />} rootMargin="260px">
                        <PricingSection />
                    </LazySection>

                    {/* ── TESTIMONIALS ───────────────────────────────────────── */}
                    <LazySection skeleton={<TestimonialSkeleton />} rootMargin="220px">
                        <TestimonialsSection />
                    </LazySection>

                    {/* ── FINAL CTA ──────────────────────────────────────────── */}
                    <LazySection skeleton={<CtaSkeleton />} rootMargin="180px">
                        <FinalCtaSection />
                    </LazySection>

                </div>
            </MotionConfig>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════ */

const HeroSection = memo(function HeroSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative h-screen overflow-hidden"
            style={{ background: isDark
                ? 'linear-gradient(150deg,#0F0B1A 0%,#130A18 38%,#0B0A1C 72%,#100D10 100%)'
                : 'linear-gradient(150deg,#FFFCF6 0%,#FFF4F8 38%,#F5F0FF 72%,#FFFBEE 100%)' }}
        >
            {/* Grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.045] dark:opacity-[0.055]"
                style={{
                    backgroundImage: isDark
                        ? 'linear-gradient(rgba(120,80,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(120,80,255,0.4) 1px,transparent 1px)'
                        : 'linear-gradient(rgba(161,108,42,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(161,108,42,0.6) 1px,transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Rotating decorative rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="absolute rounded-full border border-amber-200/30 dark:border-violet-700/20" style={{ width: 700, height: 700, animation: 'spin-slow 60s linear infinite' }} />
                <div className="absolute rounded-full border border-violet-200/25 dark:border-violet-600/15" style={{ width: 500, height: 500, animation: 'spin-slow 45s linear infinite reverse' }} />
                <div className="absolute rounded-full border border-rose-200/20 dark:border-rose-700/15" style={{ width: 320, height: 320, animation: 'spin-slow 30s linear infinite' }} />
            </div>

            {/* Animated blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position: 'absolute', top: '-5%',  left: '-5%',  width: 560, height: 560, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(120,60,240,0.20) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(251,191,36,0.28) 0%,transparent 65%)',  animation: 'aurora-blob 20s ease-in-out infinite', filter: 'blur(72px)' }} />
                <div style={{ position: 'absolute', top: '40%',  right: '-3%', width: 460, height: 460, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(244,63,94,0.15) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(244,114,182,0.22) 0%,transparent 65%)', animation: 'aurora-blob 27s ease-in-out infinite reverse', filter: 'blur(66px)', animationDelay: '-9s' }} />
                <div style={{ position: 'absolute', bottom: '0%',left: '20%',  width: 420, height: 420, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(167,139,250,0.26) 0%,transparent 65%)', animation: 'aurora-blob 33s ease-in-out infinite', filter: 'blur(62px)', animationDelay: '-17s' }} />
                <div style={{ position: 'absolute', top: '22%',  left: '38%',  width: 300, height: 300, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(217,119,6,0.12) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(253,186,116,0.20) 0%,transparent 65%)', animation: 'aurora-blob 25s ease-in-out infinite reverse', filter: 'blur(55px)', animationDelay: '-5s' }} />
                <div style={{ position: 'absolute', top: '55%',  right: '25%', width: 240, height: 240, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(196,181,253,0.18) 0%,transparent 65%)', animation: 'warm-pulse 8s ease-in-out infinite', filter: 'blur(45px)', animationDelay: '-3s' }} />
            </div>

            {/* Floating particles */}
            {PARTICLES.map((p, i) => (
                <motion.div
                    key={i}
                    className="pointer-events-none absolute rounded-full"
                    style={{ ...p.style, background: p.color, width: p.size, height: p.size }}
                    animate={{ y: [0, -p.travel, 0], opacity: [0, p.maxOpacity, 0] }}
                    transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            {/* Floating Hanzi characters */}
            {HERO_CHARS.map((c, i) => (
                <motion.div
                    key={i}
                    className="pointer-events-none absolute select-none font-black"
                    style={{ ...c.style, fontSize: c.size, opacity: c.opacity, rotate: c.rot, color: c.color }}
                    animate={{ y: [0, -16, 0], rotate: [c.rot, c.rot + 2, c.rot] }}
                    transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {c.char}
                </motion.div>
            ))}

            <div className="relative flex h-full items-center pt-20">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

                        {/* Left column */}
                        <div>
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-amber-700/40 dark:bg-amber-900/20"
                            >
                                <motion.span
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                    className="text-sm"
                                >
                                    🎓
                                </motion.span>
                                <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase dark:text-amber-400">Kuliah di China</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
                                className="mb-5 text-4xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl"
                            >
                                Kuliah ke China
                                <br />
                                <motion.span
                                    className="inline-block bg-clip-text text-transparent"
                                    style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#e11d48,#d97706)' }}
                                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                >
                                    bareng Panda
                                </motion.span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
                                className="mb-8 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg"
                            >
                                Dari konsultasi jurusan, aplikasi dokumen, visa, hingga akomodasi — kami dampingi setiap langkah perjalanan akademismu ke universitas terbaik China.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
                                className="flex flex-wrap gap-3"
                            >
                                <motion.a
                                    href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+tertarik+program+Kuliah+di+China.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(37,211,102,0.35)' }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                                >
                                    <span>💬</span> Konsultasi Gratis
                                </motion.a>
                                <motion.a
                                    href="#biaya"
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300"
                                >
                                    Lihat Biaya ↓
                                </motion.a>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.44, ease: EASE }}
                                className="mt-10 flex flex-wrap gap-8"
                            >
                                {STATS.map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 + i * 0.1 }}
                                    >
                                        <div className="text-2xl font-black bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#e11d48)' }}>
                                            {s.num}
                                        </div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right column — feature cards (lg only) */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            {FEATURE_CARDS.map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 36, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.65, delay: 0.28 + i * 0.12, ease: EASE }}
                                    whileHover={{ y: -6, transition: { duration: 0.22 } }}
                                    style={{ animation: `float-card ${4 + i * 0.6}s ease-in-out ${i * 0.5}s infinite` }}
                                    className="rounded-2xl border border-white/90 bg-white/85 p-6 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-white/6"
                                >
                                    <motion.div
                                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                                        style={{ background: `${card.color}20` }}
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 3, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        {card.icon}
                                    </motion.div>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{card.label}</p>
                                    <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: card.color }} />
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   SERVICE STEPS SECTION
═══════════════════════════════════════════════════════════════ */

const ServiceStepsSection = memo(function ServiceStepsSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(160deg,#08080E 0%,#0E0918 48%,#100A06 100%)'
                : 'linear-gradient(160deg,#FDFAF6 0%,#F8F2FF 48%,#FFF8EE 100%)' }}
        >
            {/* Dot-grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
                style={{
                    backgroundImage: 'radial-gradient(circle,#7c3aed 1px,transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Animated background blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 65%)', animation: 'aurora-blob 22s ease-in-out infinite', filter: 'blur(70px)' }} />
                <div style={{ position: 'absolute', bottom: '-8%', left: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.20) 0%,transparent 65%)', animation: 'aurora-blob 28s ease-in-out infinite reverse', filter: 'blur(65px)', animationDelay: '-10s' }} />
                <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,63,94,0.12) 0%,transparent 65%)', animation: 'warm-pulse 10s ease-in-out infinite', filter: 'blur(55px)', animationDelay: '-4s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-16 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className="mb-3 inline-block rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-600 uppercase dark:bg-violet-900/30 dark:text-violet-400"
                    >
                        Proses Kami
                    </motion.span>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        4 Langkah Menuju Kampus Impian di China
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-base text-zinc-500 dark:text-zinc-400">
                        Proses yang transparan dan terstruktur — kamu selalu tahu ada di langkah mana.
                    </p>
                </motion.div>

                {/* Cards + connecting line */}
                <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Connecting dashed line (desktop only) */}
                    <div
                        className="pointer-events-none absolute top-[52px] left-[12.5%] right-[12.5%] hidden h-px lg:block"
                        style={{ background: 'linear-gradient(90deg,#8b5cf6 0%,#E63946 33%,#f59e0b 66%,#10b981 100%)', opacity: 0.25 }}
                    />

                    {SERVICE_STEPS.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 44, scale: 0.94 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                            whileHover={{ y: -10, boxShadow: `0 24px 52px ${step.color}28`, transition: { duration: 0.22 } }}
                            className="relative overflow-hidden rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/4"
                        >
                            {/* Gradient top-border strip */}
                            <div className="absolute inset-x-0 top-0 h-1 rounded-t-[24px]" style={{ background: `linear-gradient(90deg,${step.color},${step.color}88)` }} />

                            {/* Ghost number */}
                            <div className="pointer-events-none absolute -right-2 -bottom-3 select-none text-8xl font-black leading-none opacity-[0.045]" style={{ color: step.color }}>
                                {step.num}
                            </div>

                            {/* Step number pill */}
                            <motion.div
                                initial={{ scale: 0, rotate: -15 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 + i * 0.12 }}
                                className="mb-5 inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-black text-white shadow-sm"
                                style={{ background: step.color }}
                            >
                                {step.num}
                            </motion.div>

                            {/* Icon */}
                            <motion.div
                                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                                style={{ background: `${step.color}18` }}
                                initial={{ rotateY: 90, opacity: 0 }}
                                whileInView={{ rotateY: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: 0.2 + i * 0.12 }}
                                whileHover={{ scale: 1.18, rotate: 6, transition: { duration: 0.18 } }}
                            >
                                {step.icon}
                            </motion.div>

                            <h3 className="mb-2 text-base font-bold text-zinc-900 dark:text-zinc-50">{step.title}</h3>
                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{step.desc}</p>

                            {/* Accent bar */}
                            <motion.div
                                className="mt-5 h-1 rounded-full"
                                style={{ background: `linear-gradient(90deg,${step.color},${step.color}55)` }}
                                initial={{ width: 0 }}
                                whileInView={{ width: 48 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.65, delay: 0.35 + i * 0.12, ease: EASE }}
                            />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   UNIVERSITIES SECTION
═══════════════════════════════════════════════════════════════ */

const SECTION_STATS = [
    { icon: '🏛️', label: '50+ Universitas' },
    { icon: '🎓', label: '200+ Alumni Diterima' },
    { icon: '✅', label: '95% Success Rate' },
];

const UniversitiesSection = memo(function UniversitiesSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(135deg,#1A0F05 0%,#1A0810 22%,#110D24 47%,#0A1220 70%,#0A1812 90%,#1A0F05 100%)'
                : 'linear-gradient(135deg,#FFECD2 0%,#FFD6E8 22%,#E8D8FF 47%,#D0EAFF 70%,#D0FFE8 90%,#FFECD2 100%)' }}
        >
            {/* Animated background blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position: 'absolute', top: '-12%',  left: '-6%',  width: 520, height: 520, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(255,120,50,0.22) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(255,180,90,0.60) 0%,transparent 65%)',  animation: 'aurora-blob 22s ease-in-out infinite',        filter: 'blur(85px)' }} />
                <div style={{ position: 'absolute', top: '-8%',   right: '-8%', width: 480, height: 480, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(255,80,130,0.20) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(255,130,168,0.55) 0%,transparent 65%)', animation: 'aurora-blob 29s ease-in-out infinite reverse',  filter: 'blur(80px)', animationDelay: '-10s' }} />
                <div style={{ position: 'absolute', bottom: '-8%',right: '-6%', width: 440, height: 440, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(100,70,255,0.22) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(155,120,255,0.58) 0%,transparent 65%)', animation: 'aurora-blob 36s ease-in-out infinite',        filter: 'blur(78px)', animationDelay: '-20s' }} />
                <div style={{ position: 'absolute', bottom: '-10%',left: '-4%', width: 400, height: 400, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(20,180,160,0.18) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(50,210,195,0.50) 0%,transparent 65%)',  animation: 'aurora-blob 27s ease-in-out infinite reverse',  filter: 'blur(75px)', animationDelay: '-8s' }} />
                <div style={{ position: 'absolute', top: '38%',   left: '34%', width: 340, height: 340, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(130,100,255,0.16) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(200,178,255,0.45) 0%,transparent 65%)', animation: 'warm-pulse 13s ease-in-out infinite',           filter: 'blur(65px)', animationDelay: '-5s' }} />
            </div>

            {/* Frosted noise layer */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.018]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-14 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/45 px-5 py-2 text-xs font-bold tracking-widest text-rose-600 uppercase shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/8 dark:text-rose-400"
                    >
                        <span>🏛️</span> Universitas Mitra
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
                        className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-5xl"
                    >
                        50+ Universitas Top{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#e11d48,#d97706)' }}>
                            di China
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
                        className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400"
                    >
                        Dari Tsinghua & Peking University hingga universitas daerah yang terjangkau — kami punya koneksi ke semua.
                    </motion.p>

                    {/* Stats pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.26 }}
                        className="mt-7 flex flex-wrap justify-center gap-3"
                    >
                        {SECTION_STATS.map((s, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.3 + i * 0.08 }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/65 bg-white/45 px-4 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/8 dark:text-zinc-300"
                            >
                                <span>{s.icon}</span>{s.label}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {UNIVERSITIES.map((uni, i) => (
                        <motion.div
                            key={uni.name}
                            initial={{ opacity: 0, y: 44, scale: 0.86 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.58, delay: i * 0.07, ease: EASE }}
                            whileHover={{ y: -14, scale: 1.05, transition: { duration: 0.22, ease: 'easeOut' } }}
                            className="group relative overflow-hidden rounded-2xl border border-white/55 bg-white/22 p-5 text-center backdrop-blur-xl dark:border-white/12 dark:bg-white/5"
                            style={{
                                boxShadow: isDark
                                    ? '0 4px 24px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,0.10)'
                                    : '0 4px 24px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,0.75)',
                            }}
                        >
                            {/* Per-card color glow on hover */}
                            <div
                                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-all duration-300 group-hover:opacity-100"
                                style={{ background: `radial-gradient(circle at 50% 35%,${uni.color}28 0%,transparent 68%)`, border: `1px solid ${uni.color}40` }}
                            />

                            {/* Watermark */}
                            <div className="pointer-events-none absolute -right-1 -bottom-2 select-none text-[72px] font-black leading-none opacity-[0.055]" style={{ color: uni.color }}>
                                {uni.hanzi[0]}
                            </div>

                            {/* Icon with pulse ring */}
                            <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
                                style={{ background: `linear-gradient(135deg,${uni.color}32,${uni.color}16)`, border: `1px solid ${uni.color}30`, boxShadow: `0 2px 12px ${uni.color}22` }}
                            >
                                <motion.span
                                    className="text-2xl"
                                    animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.08, 1] }}
                                    transition={{ duration: 5, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}
                                >
                                    {uni.emoji}
                                </motion.span>
                                <motion.div
                                    className="absolute inset-0 rounded-2xl"
                                    animate={{ boxShadow: [`0 0 0 0px ${uni.color}60`, `0 0 0 9px ${uni.color}00`] }}
                                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45 }}
                                />
                            </div>

                            <p className="text-[13px] font-bold leading-tight text-zinc-900 dark:text-zinc-100">{uni.name}</p>

                            <motion.p
                                className="my-1 bg-clip-text text-base font-black text-transparent"
                                style={{ backgroundImage: `linear-gradient(135deg,${uni.color},${uni.color}aa)` }}
                                initial={{ opacity: 0, scale: 0.65 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.18 + i * 0.07 }}
                            >
                                {uni.hanzi}
                            </motion.p>

                            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{uni.city}</p>

                            <motion.div
                                className="mx-auto mt-3 h-0.5 rounded-full opacity-60"
                                style={{ background: `linear-gradient(90deg,transparent,${uni.color},transparent)` }}
                                initial={{ width: 0 }}
                                whileInView={{ width: '60%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: EASE }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.65 }}
                    className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400"
                >
                    … dan{' '}
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">43 universitas lainnya</span>{' '}
                    tersebar di seluruh China.{' '}
                    <a
                        href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+ingin+tahu+daftar+lengkap+universitas+China.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-violet-600 underline decoration-dotted hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        Hubungi kami
                    </a>{' '}
                    untuk daftar lengkap.
                </motion.p>

            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   PRICING & FAQ SECTION
═══════════════════════════════════════════════════════════════ */

const PricingSection = memo(function PricingSection() {
    const isDark = useDarkMode();
    return (
        <section
            id="biaya"
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(155deg,#0A0810 0%,#100C1E 35%,#120A06 70%,#0A080E 100%)'
                : 'linear-gradient(155deg,#FDFBFF 0%,#F3EEFF 35%,#FFF5E6 70%,#FDF8FF 100%)' }}
        >
            {/* Dot grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage: 'radial-gradient(circle,#8b5cf6 1px,transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Animated blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position: 'absolute', top: '-8%',   left: '-4%',  width: 480, height: 480, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(109,40,217,0.22) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(139,92,246,0.28) 0%,transparent 65%)', animation: 'aurora-blob 24s ease-in-out infinite',        filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%',right: '-5%', width: 440, height: 440, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(180,100,20,0.18) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(245,158,11,0.32) 0%,transparent 65%)', animation: 'aurora-blob 30s ease-in-out infinite reverse', filter: 'blur(75px)', animationDelay: '-12s' }} />
                <div style={{ position: 'absolute', top: '42%',   left: '38%',  width: 320, height: 320, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(225,29,72,0.12) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(244,63,94,0.18) 0%,transparent 65%)', animation: 'warm-pulse 12s ease-in-out infinite',          filter: 'blur(65px)', animationDelay: '-6s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="mb-14 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/80 px-5 py-2 text-xs font-bold tracking-widest text-violet-600 uppercase shadow-sm backdrop-blur-sm dark:border-violet-700/40 dark:bg-violet-900/20 dark:text-violet-400"
                    >
                        <motion.span
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        >
                            💰
                        </motion.span>
                        Biaya & Paket
                    </motion.div>

                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-5xl">
                        Transparan{' '}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)' }}
                        >
                            & Terjangkau
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-base text-zinc-500 dark:text-zinc-400">
                        Satu paket lengkap, satu harga. Tidak ada biaya tersembunyi.
                    </p>
                </motion.div>

                {/* 2-col grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

                    {/* ── Left: Pricing card ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: EASE }}
                        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/40 backdrop-blur-xl dark:border-white/12 dark:bg-white/6"
                        style={{ boxShadow: isDark
                            ? '0 8px 48px rgba(0,0,0,0.35), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                            : '0 8px 48px rgba(139,92,246,0.14), inset 0 1.5px 0 rgba(255,255,255,0.88)' }}
                    >
                        {/* Rainbow top strip */}
                        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#8b5cf6,#e11d48,#d97706,#10b981)' }} />

                        <div className="p-7 sm:p-8">
                            {/* Price + badge row */}
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Paket Full Service</p>
                                    <div className="mt-2.5 flex items-end gap-1.5">
                                        <span
                                            className="text-5xl font-black tracking-tight bg-clip-text text-transparent sm:text-6xl"
                                            style={{ backgroundImage: 'linear-gradient(135deg,#8b5cf6,#e11d48)' }}
                                        >
                                            Rp 15 Jt
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">sekali bayar · semua layanan termasuk</p>
                                </div>
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex-shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-black tracking-wider text-white shadow-lg"
                                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#e11d48)' }}
                                >
                                    🔥 Populer
                                </motion.div>
                            </div>

                            {/* Divider */}
                            <div className="mb-6 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.35),transparent)' }} />

                            {/* Feature list — 2-col on wider screens */}
                            <ul className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {PACKAGE_FEATURES.map((feat, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.32, delay: 0.06 + i * 0.055 }}
                                        className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
                                    >
                                        <span
                                            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}
                                        >
                                            ✓
                                        </span>
                                        {feat}
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Tuition table */}
                            <div className="mb-7 overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-white/10">
                                <div
                                    className="border-b border-zinc-200/60 px-4 py-2.5 dark:border-white/10"
                                    style={{ background: isDark ? 'rgba(139,92,246,0.10)' : 'rgba(139,92,246,0.06)' }}
                                >
                                    <p className="text-[11px] font-bold tracking-widest text-violet-600 uppercase dark:text-violet-400">
                                        Estimasi Biaya Kuliah (terpisah)
                                    </p>
                                </div>
                                <div className="divide-y divide-zinc-100 dark:divide-white/5">
                                    {TUITION_TABLE.map((row, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                                            className="flex items-center justify-between gap-3 px-4 py-2.5"
                                        >
                                            <span className="text-xs text-zinc-600 dark:text-zinc-400">{row.uni}</span>
                                            <span className="flex-shrink-0 text-xs font-bold text-zinc-900 dark:text-zinc-100">{row.range}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA with shimmer */}
                            <motion.a
                                href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+tertarik+Paket+Full+Service+Kuliah+di+China.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.03, boxShadow: '0 14px 40px rgba(139,92,246,0.40)' }}
                                whileTap={{ scale: 0.97 }}
                                className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl py-4 text-sm font-bold text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#e11d48)' }}
                            >
                                <motion.span
                                    className="pointer-events-none absolute inset-0"
                                    style={{ background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)' }}
                                    animate={{ x: ['-160%', '160%'] }}
                                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                                />
                                <span className="relative text-base">💬</span>
                                <span className="relative">Daftar Sekarang</span>
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* ── Right: FAQ card ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/40 backdrop-blur-xl dark:border-white/12 dark:bg-white/6"
                        style={{ boxShadow: isDark
                            ? '0 8px 48px rgba(0,0,0,0.35), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                            : '0 8px 48px rgba(245,158,11,0.12), inset 0 1.5px 0 rgba(255,255,255,0.88)' }}
                    >
                        {/* Amber top strip */}
                        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#d97706,#f43f5e,#8b5cf6)' }} />

                        <div className="p-7 sm:p-8">
                            {/* FAQ header */}
                            <div className="mb-7">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">FAQ</p>
                                <h3 className="mt-1 text-xl font-black text-zinc-900 dark:text-zinc-50">Pertanyaan Umum</h3>
                                <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                                    Ada yang ingin ditanyakan? Jawabannya mungkin ada di sini.
                                </p>
                            </div>

                            <FaqAccordion items={FAQS} />

                            {/* Bottom contact prompt */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-7 flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 dark:border-amber-700/30 dark:bg-amber-900/15"
                            >
                                <motion.span
                                    className="flex-shrink-0 text-2xl"
                                    animate={{ rotate: [0, 12, -12, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    🤔
                                </motion.span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Masih ada pertanyaan?</p>
                                    <a
                                        href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+punya+pertanyaan+tentang+program+Kuliah+di+China.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                                    >
                                        Chat dengan tim kami →
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
═══════════════════════════════════════════════════════════════ */

const TestimonialsSection = memo(function TestimonialsSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(160deg,#120A06 0%,#12080E 42%,#0C0818 76%,#060E0C 100%)'
                : 'linear-gradient(160deg,#FFF6F0 0%,#FFF0F8 42%,#F3F0FF 76%,#F0FDF8 100%)' }}
        >
            {/* Animated background blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position: 'absolute', top: '-8%',  left: '-4%',  width: 460, height: 460, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(255,150,60,0.18) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(255,200,120,0.42) 0%,transparent 65%)', animation: 'aurora-blob 24s ease-in-out infinite',         filter: 'blur(82px)' }} />
                <div style={{ position: 'absolute', bottom: '-7%',right: '-5%', width: 420, height: 420, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(160,80,255,0.18) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(200,140,255,0.40) 0%,transparent 65%)', animation: 'aurora-blob 31s ease-in-out infinite reverse',   filter: 'blur(78px)', animationDelay: '-13s' }} />
                <div style={{ position: 'absolute', top: '38%',  right: '14%', width: 340, height: 340, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(255,80,120,0.14) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(255,140,165,0.34) 0%,transparent 65%)', animation: 'warm-pulse 11s ease-in-out infinite',            filter: 'blur(68px)', animationDelay: '-5s' }} />
                <div style={{ position: 'absolute', bottom: '10%',left: '25%', width: 280, height: 280, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(20,180,160,0.12) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(80,200,180,0.28) 0%,transparent 65%)',  animation: 'warm-pulse 15s ease-in-out infinite',            filter: 'blur(60px)', animationDelay: '-8s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-14 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.82 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-5 py-2 text-xs font-bold tracking-widest text-emerald-600 uppercase shadow-sm backdrop-blur-sm dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-400"
                    >
                        <motion.span
                            animate={{ rotate: [0, 20, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        >
                            🌟
                        </motion.span>
                        Alumni Panda
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
                        className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
                    >
                        Mereka Sudah{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#10b981,#0ea5e9,#8b5cf6)' }}>
                            Berhasil
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
                        className="mx-auto mt-4 max-w-lg text-base text-zinc-500 dark:text-zinc-400"
                    >
                        Ratusan mahasiswa Indonesia sudah kuliah di China bersama Panda.
                    </motion.p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 48, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.6, delay: i * 0.13, ease: EASE }}
                            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.22 } }}
                            className="flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/6"
                            style={{ boxShadow: isDark
                                ? '0 4px 28px rgba(0,0,0,0.4), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                                : '0 4px 28px rgba(0,0,0,0.07), inset 0 1.5px 0 rgba(255,255,255,0.88)' }}
                        >
                            {/* Gradient top strip */}
                            <div className="h-1.5 w-full" style={{ background: t.grad }} />

                            <div className="flex flex-1 flex-col p-6">
                                {/* Stars */}
                                <div className="mb-4 flex gap-1">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <motion.span
                                            key={s}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.2 + i * 0.1 + s * 0.07 }}
                                            className="text-sm text-amber-400"
                                        >
                                            ★
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Animated quote mark */}
                                <motion.div
                                    className="mb-2 bg-clip-text text-5xl font-black leading-none text-transparent"
                                    style={{ backgroundImage: t.grad }}
                                    animate={{ opacity: [0.55, 1, 0.55] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 1.4 }}
                                >
                                    "
                                </motion.div>

                                <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{t.quote}"</p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <motion.div
                                            className="absolute -inset-[2px] rounded-full opacity-75"
                                            style={{ background: t.grad }}
                                            animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }}
                                            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.9 }}
                                        />
                                        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white" style={{ background: t.grad }}>
                                            {t.initials}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.name}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{t.program}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA SECTION
═══════════════════════════════════════════════════════════════ */

const FinalCtaSection = memo(function FinalCtaSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(135deg,#190E00 0%,#19060C 28%,#0C0818 58%,#071020 82%,#190E00 100%)'
                : 'linear-gradient(135deg,#FFF0D6 0%,#FFDEE8 28%,#EBE0FF 58%,#D8EEFF 82%,#FFF0D6 100%)' }}
        >
            {/* Animated blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position: 'absolute', top: '-10%', left: '-5%',  width: 500, height: 500, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(200,120,30,0.20) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(255,180,80,0.55) 0%,transparent 65%)',  animation: 'aurora-blob 22s ease-in-out infinite',        filter: 'blur(88px)' }} />
                <div style={{ position: 'absolute', bottom: '-8%',right: '-5%', width: 460, height: 460, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(100,50,255,0.22) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(155,100,255,0.52) 0%,transparent 65%)', animation: 'aurora-blob 29s ease-in-out infinite reverse',  filter: 'blur(84px)', animationDelay: '-12s' }} />
                <div style={{ position: 'absolute', top: '28%',  right: '8%',  width: 340, height: 340, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(255,80,120,0.16) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(255,130,162,0.42) 0%,transparent 65%)', animation: 'warm-pulse 13s ease-in-out infinite',           filter: 'blur(72px)', animationDelay: '-5s' }} />
            </div>

            {/* Rotating decorative rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute rounded-full border border-amber-300/22 dark:border-amber-700/15"
                    style={{ width: 640, height: 640 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute rounded-full border border-violet-300/18 dark:border-violet-700/12"
                    style={{ width: 440, height: 440 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute rounded-full border border-rose-200/15 dark:border-rose-700/10"
                    style={{ width: 260, height: 260 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            <div className="relative mx-auto max-w-lg px-4">

                {/* Glass CTA card */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.72, ease: EASE }}
                    className="overflow-hidden rounded-[36px] border border-white/78 bg-white/58 text-center backdrop-blur-2xl dark:border-white/12 dark:bg-white/6"
                    style={{ boxShadow: isDark
                        ? '0 8px 60px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.08)'
                        : '0 8px 60px rgba(0,0,0,0.10), inset 0 2px 0 rgba(255,255,255,0.94)' }}
                >
                    {/* Rainbow gradient strip */}
                    <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#d97706,#e11d48,#7c3aed,#0ea5e9,#10b981)' }} />

                    <div className="px-8 py-12 sm:px-12">

                        {/* Floating emoji */}
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 280, damping: 15, delay: 0.05 }}
                            className="mb-6"
                        >
                            <motion.span
                                className="inline-block text-6xl"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                🎓
                            </motion.span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.62, delay: 0.12, ease: EASE }}
                            className="mb-4 text-3xl font-black leading-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
                        >
                            Mulai Perjalananmu
                            <br />
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#e11d48,#d97706)' }}>
                                ke China Hari Ini
                            </span>
                        </motion.h2>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="mb-8 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base"
                        >
                            Konsultasi gratis, tanpa komitmen. Tim kami siap membantu menemukan universitas yang paling tepat untukmu.
                        </motion.p>

                        {/* Single WA button with shimmer */}
                        <motion.a
                            href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+tertarik+program+Kuliah+di+China.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.3 }}
                            whileHover={{ scale: 1.06, boxShadow: '0 16px 44px rgba(37,211,102,0.44)' }}
                            whileTap={{ scale: 0.97 }}
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-base font-bold text-white shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                        >
                            {/* Shimmer sweep */}
                            <motion.span
                                className="pointer-events-none absolute inset-0 rounded-full"
                                style={{ background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.24) 50%,transparent 70%)' }}
                                animate={{ x: ['-160%', '160%'] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 1.0 }}
                            />
                            <span className="relative text-xl">💬</span>
                            <span className="relative font-bold">Chat WhatsApp Sekarang</span>
                        </motion.a>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.46 }}
                            className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-400 dark:text-zinc-500"
                        >
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Gratis konsultasi</span>
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Tanpa komitmen</span>
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Respon &lt; 5 menit</span>
                        </motion.div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
});

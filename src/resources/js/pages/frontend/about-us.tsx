'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useTransform, MotionConfig } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WA = '6289508275782';

/* ── Types ─────────────────────────────────────────────────────── */
interface Milestone { year: string; title: string; desc: string; icon: string; color: string }

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

/* ── GSAP counter hook ─────────────────────────────────────────── */
function useGsapCounter(target: number, suffix = '') {
    const ref = useRef<HTMLSpanElement>(null);
    const fired = useRef(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || fired.current) return;
        el.textContent = '0' + suffix;
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || fired.current) return;
            fired.current = true;
            io.disconnect();
            const obj = { value: 0 };
            gsap.to(obj, {
                value: target, duration: 2.2, ease: 'power2.out',
                onUpdate() { if (el) el.textContent = Math.round(obj.value).toLocaleString('id-ID') + suffix; },
            });
        }, { threshold: 0.3 });
        io.observe(el);
        return () => io.disconnect();
    }, [target, suffix]);
    return ref;
}

/* ── Lazy section ──────────────────────────────────────────────── */
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
function LazySection({ children, skeleton, rootMargin = '260px' }: { children: React.ReactNode; skeleton: React.ReactNode; rootMargin?: string }) {
    const { ref, visible } = useLazySection(rootMargin);
    return <div ref={ref}>{visible ? children : skeleton}</div>;
}
/* ── Skeleton atom ─────────────────────────────────────────────── */
function Sk({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
    return <div className={`sk-shimmer rounded-xl ${className}`} style={style} />;
}

/* ── Per-section skeletons ─────────────────────────────────────── */
function StatsSkeleton() {
    return (
        <div className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col items-center gap-3">
                    <Sk className="h-6 w-28 rounded-full" />
                    <Sk className="h-9 w-52" />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                    {Array.from({length:4}).map((_,i) => <Sk key={i} className="h-44 rounded-[24px]" />)}
                </div>
            </div>
        </div>
    );
}
function StorySkeleton() {
    return (
        <div className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
                    <Sk className="h-80 rounded-[32px]" />
                    <div className="flex flex-col justify-center gap-3.5">
                        <Sk className="h-5 w-24 rounded-full" />
                        <Sk className="h-10 w-3/4" />
                        <Sk className="h-4 w-full" />
                        <Sk className="h-4 w-full" />
                        <Sk className="h-4 w-4/5" />
                        <Sk className="mt-2 h-10 w-36 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
function VisionMissionSkeleton() {
    return (
        <div className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 flex flex-col items-center gap-3">
                    <Sk className="h-6 w-24 rounded-full" />
                    <Sk className="h-9 w-44" />
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Sk className="h-72 rounded-[28px]" />
                    <Sk className="h-72 rounded-[28px]" />
                </div>
            </div>
        </div>
    );
}
function TimelineSkeleton() {
    return (
        <div className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-center gap-3">
                    <Sk className="h-6 w-32 rounded-full" />
                    <Sk className="h-9 w-52" />
                    <Sk className="h-4 w-64" />
                </div>
                <div className="flex flex-col gap-8">
                    {Array.from({length:4}).map((_,i) => (
                        <div key={i} className="flex justify-center">
                            <Sk className="h-32 w-full rounded-[22px] md:w-5/12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
function ValuesSkeleton() {
    return (
        <div className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 flex flex-col items-center gap-3">
                    <Sk className="h-6 w-24 rounded-full" />
                    <Sk className="h-9 w-48" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({length:4}).map((_,i) => <Sk key={i} className="h-52 rounded-[24px]" />)}
                </div>
            </div>
        </div>
    );
}
function BranchesSkeleton() {
    return (
        <div className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col items-center gap-3">
                    <Sk className="h-6 w-24 rounded-full" />
                    <Sk className="h-9 w-44" />
                    <Sk className="h-4 w-56" />
                </div>
                <div className="mb-6 grid grid-cols-3 gap-3">
                    {Array.from({length:3}).map((_,i) => <Sk key={i} className="h-[72px] rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                    <Sk className="h-[260px] rounded-[24px] sm:h-80 md:h-[360px] lg:col-span-3" />
                    <Sk className="h-[360px] rounded-[24px] lg:col-span-2" />
                </div>
            </div>
        </div>
    );
}
function CtaSkeleton() {
    return (
        <div className="py-24 md:py-32">
            <div className="mx-auto max-w-2xl px-4">
                <Sk className="h-[380px] rounded-[36px]" />
            </div>
        </div>
    );
}

/* ── Data ──────────────────────────────────────────────────────── */
const HERO_CHARS = [
    { char: '学', style: { top: '12%', left: '3%' },   size: 130, dur: 22, delay: 0,   opacity: 0.10, rot: 8,  color: '#a78bfa' },
    { char: '语', style: { top: '20%', right: '4%' },  size: 100, dur: 18, delay: 2,   opacity: 0.08, rot: -5, color: '#fb7185' },
    { char: '文', style: { top: '55%', left: '2%' },   size: 80,  dur: 25, delay: 4,   opacity: 0.07, rot: 5,  color: '#60a5fa' },
    { char: '教', style: { top: '65%', right: '3%' },  size: 90,  dur: 20, delay: 1.5, opacity: 0.08, rot: -6, color: '#fbbf24' },
    { char: '人', style: { top: '38%', left: '1.5%' }, size: 60,  dur: 30, delay: 6,   opacity: 0.06, rot: -3, color: '#34d399' },
    { char: '心', style: { top: '80%', right: '5%' },  size: 70,  dur: 24, delay: 8,   opacity: 0.06, rot: 4,  color: '#a78bfa' },
];

const STATS = [
    { value: 1200, suffix: '+', label: 'Total Alumni',         icon: '🎓', color: '#8b5cf6' },
    { value: 3,    suffix: '',  label: 'Cabang Aktif',          icon: '🏫', color: '#E63946' },
    { value: 95,   suffix: '%', label: 'Tingkat Lulus HSK',     icon: '📊', color: '#f59e0b' },
    { value: 50,   suffix: '+', label: 'Pengajar Bersertifikat', icon: '👨‍🏫', color: '#10b981' },
];

const MILESTONES: Milestone[] = [
    { year: '2018', title: 'Lahirnya Panda 🐼', desc: 'Panda Mandarin Education berdiri di MOI Kelapa Gading, Jakarta Utara — dimulai dengan tekad menghadirkan pendidikan Mandarin berkualitas tinggi bagi masyarakat Indonesia.', icon: '🐼', color: '#8b5cf6' },
    { year: '2019', title: 'Angkatan Pertama Lulus', desc: '50+ siswa angkatan pertama menuntaskan program HSK dengan tingkat kelulusan 92%. Sebuah pembuktian bahwa metode Panda berhasil dan dipercaya orang tua.', icon: '🎉', color: '#E63946' },
    { year: '2020', title: 'Go Digital — Kelas Online', desc: 'Pandemi mendorong Panda berinovasi cepat. Platform kelas online diluncurkan dan berhasil menjangkau siswa dari seluruh Indonesia tanpa batas geografis.', icon: '💻', color: '#0ea5e9' },
    { year: '2021', title: 'Ekspansi Cabang Pluit', desc: 'Membuka cabang kedua di Pluit, Jakarta Utara. Kapasitas siswa meningkat dua kali lipat, semakin dekat dengan komunitas di wilayah utara Jakarta.', icon: '🏫', color: '#f59e0b' },
    { year: '2022', title: 'Program Kuliah di China', desc: '30+ siswa perdana diterima di universitas top China — Tsinghua, Peking University, dan Fudan University. Program pendampingan Kuliah di China resmi diluncurkan.', icon: '🎓', color: '#10b981' },
    { year: '2023', title: 'Kalideres & Study Tour', desc: 'Cabang ketiga dibuka di Citra 2 Kalideres, Jakarta Barat. Program Study Tour ke China perdana dengan 25 peserta berhasil diselenggarakan dengan meriah.', icon: '✈️', color: '#f43f5e' },
    { year: '2024', title: '1.200+ Alumni & Terus Tumbuh', desc: 'Melewati tonggak 1.200 alumni aktif. Tingkat kelulusan HSK mencapai 95% — menjadikan Panda sebagai salah satu lembaga Mandarin paling terpercaya di Indonesia.', icon: '🏆', color: '#6366f1' },
];

const VISI = 'Menjadi lembaga pendidikan Bahasa Mandarin terkemuka di Indonesia yang menghubungkan generasi muda dengan peluang global melalui budaya dan bahasa China.';
const MISI = [
    { icon: '📚', text: 'Menghadirkan pengajaran Mandarin berkualitas tinggi dengan kurikulum HSK terakreditasi internasional.' },
    { icon: '🌉', text: 'Membangun jembatan antara siswa Indonesia dengan dunia akademik dan profesional China.' },
    { icon: '🤝', text: 'Mendampingi setiap siswa dari pemula hingga fasih dengan bimbingan personal dan penuh empati.' },
    { icon: '🚀', text: 'Mengembangkan program inovatif: Study Tour, Kuliah di China, dan kelas online untuk lebih banyak pelajar.' },
];

const VALUES = [
    { icon: '⭐', title: 'Berkualitas', desc: 'Standar pengajaran tinggi dengan kurikulum HSK resmi dan guru bersertifikat internasional.', color: '#8b5cf6' },
    { icon: '💪', title: 'Berdedikasi', desc: 'Komitmen penuh terhadap perkembangan setiap siswa, dari pertemuan pertama hingga kelulusan.', color: '#E63946' },
    { icon: '💡', title: 'Berinovasi', desc: 'Terus mengembangkan metode pengajaran dan program baru yang relevan dengan kebutuhan zaman.', color: '#f59e0b' },
    { icon: '❤️', title: 'Berempati', desc: 'Memahami keunikan setiap siswa dan menciptakan lingkungan belajar yang aman dan menyenangkan.', color: '#10b981' },
];

const BRANCHES = [
    {
        name: 'MOI Kelapa Gading',
        subtitle: 'Cabang Utama',
        address: 'Lantai 2 Ruko MOI Blok C46, Kelapa Gading, Jakarta Utara 14240',
        phone: '+62 897-8273-311',
        waPhone: '6289778273311',
        hours: 'Senin – Sabtu: 09.00 – 20.00',
        badge: 'Pusat',
        color: '#8b5cf6',
        icon: '🏛️',
        mapsEmbed: 'https://maps.google.com/maps?q=Mall+of+Indonesia+Kelapa+Gading+Jakarta+Utara&output=embed&z=16&hl=id',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Ruko+MOI+Blok+C46+Kelapa+Gading+Jakarta+Utara',
    },
    {
        name: 'Pluit',
        subtitle: 'Cabang Pluit',
        address: 'Jl. Pluit Karang Utara No.129C, Penjaringan, Jakarta Utara 14450',
        phone: '+62 895-0827-5782',
        waPhone: '6289508275782',
        hours: 'Senin – Sabtu: 09.00 – 20.00',
        badge: null,
        color: '#E63946',
        icon: '🏢',
        mapsEmbed: 'https://maps.google.com/maps?q=Jl+Pluit+Karang+Utara+129C+Penjaringan+Jakarta+Utara&output=embed&z=16&hl=id',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Jl+Pluit+Karang+Utara+No+129C+Penjaringan+Jakarta+Utara',
    },
    {
        name: 'Kalideres',
        subtitle: 'Cabang Kalideres',
        address: 'Jl. Citra Dua Extension No.18 BG, Kalideres, Jakarta Barat 11840',
        phone: '+62 895-3410-09972',
        waPhone: '62895341009972',
        hours: 'Senin – Sabtu: 09.00 – 20.00',
        badge: null,
        color: '#f59e0b',
        icon: '🏫',
        mapsEmbed: 'https://maps.google.com/maps?q=Perumahan+Citra+2+Extension+Kalideres+Jakarta+Barat&output=embed&z=16&hl=id',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Jl+Citra+Dua+Extension+No+18+BG+Kalideres+Jakarta+Barat',
    },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function AboutUsPage() {
    return (
        <>
            <Head title="Tentang Kami — Panda Mandarin Education" />
            <style>{`
                @keyframes sk-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .sk-shimmer { background: linear-gradient(90deg,#ede9e3 25%,#f5f2ee 50%,#ede9e3 75%); background-size: 200% 100%; animation: sk-shimmer 1.6s ease-in-out infinite; }
                .dark .sk-shimmer { background: linear-gradient(90deg,#1c1f2b 25%,#252836 50%,#1c1f2b 75%); background-size: 200% 100%; }
                @keyframes aurora-blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.06); } 66% { transform: translate(-20px,25px) scale(0.96); } }
                @keyframes warm-pulse { 0%,100% { opacity:0.4;transform:scale(1); } 50% { opacity:0.7;transform:scale(1.08); } }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .float-y { animation: float-y 4s ease-in-out infinite; }
                html { scroll-behavior: smooth; }
            `}</style>
            <MotionConfig reducedMotion="user">
                <div className="overflow-x-hidden">
                    <HeroSection />
                    <LazySection skeleton={<StatsSkeleton />} rootMargin="300px">
                        <StatsSection />
                    </LazySection>
                    <LazySection skeleton={<StorySkeleton />} rootMargin="280px">
                        <StorySection />
                    </LazySection>
                    <LazySection skeleton={<VisionMissionSkeleton />} rootMargin="260px">
                        <VisionMissionSection />
                    </LazySection>
                    <LazySection skeleton={<TimelineSkeleton />} rootMargin="240px">
                        <TimelineSection />
                    </LazySection>
                    <LazySection skeleton={<ValuesSkeleton />} rootMargin="220px">
                        <ValuesSection />
                    </LazySection>
                    <LazySection skeleton={<BranchesSkeleton />} rootMargin="200px">
                        <BranchesSection />
                    </LazySection>
                    <LazySection skeleton={<CtaSkeleton />} rootMargin="180px">
                        <CtaSection />
                    </LazySection>
                </div>
            </MotionConfig>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — dark navy, parallax, GSAP blobs
═══════════════════════════════════════════════════════════════ */

const HeroSection = memo(function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const isDark = useDarkMode();
    const { scrollY } = useScroll();
    const bgY     = useTransform(scrollY, [0, 700], [0, 240]);
    const textY   = useTransform(scrollY, [0, 700], [0, 110]);
    const opacity = useTransform(scrollY, [0, 450], [1, 0]);

    const dotsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!dotsRef.current) return;
        const dots = dotsRef.current.querySelectorAll('.hero-dot');
        gsap.from(dots, { opacity: 0, scale: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.5)', delay: 0.4 });
    }, []);

    const YEAR_STRIP = ['2018','·','2019','·','2020','·','2021','·','2022','·','2023','·','2024'];

    const heroBg = isDark
        ? 'linear-gradient(160deg,#05080F 0%,#0A0618 50%,#060810 100%)'
        : 'linear-gradient(160deg,#FDFBFF 0%,#F2ECFF 38%,#FFF0F8 65%,#FFFBF0 100%)';

    return (
        <section ref={containerRef} className="relative h-dvh min-h-[580px] overflow-hidden" style={{ background: heroBg }}>

            {/* ── Parallax BG layer ── */}
            <motion.div style={{ y: bgY, willChange: 'transform' }} className="pointer-events-none absolute inset-0">

                {/* Grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? 'rgba(139,92,246,0.5)' : 'rgba(110,50,210,0.14)'} 1px,transparent 1px),linear-gradient(90deg,${isDark ? 'rgba(139,92,246,0.5)' : 'rgba(110,50,210,0.14)'} 1px,transparent 1px)`,
                        backgroundSize: '64px 64px',
                        opacity: isDark ? 0.038 : 0.055,
                    }}
                />

                {/* Aurora blobs */}
                <div style={{ position:'absolute', top:'-12%', left:'-6%',  width:620, height:620, borderRadius:'50%', background: isDark ? 'radial-gradient(circle,rgba(109,40,217,0.26) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(139,92,246,0.20) 0%,transparent 65%)', animation:'aurora-blob 24s ease-in-out infinite',        filter:'blur(95px)' }} />
                <div style={{ position:'absolute', top:'32%',  right:'-8%', width:520, height:520, borderRadius:'50%', background: isDark ? 'radial-gradient(circle,rgba(225,29,72,0.18) 0%,transparent 65%)'  : 'radial-gradient(circle,rgba(244,63,94,0.13) 0%,transparent 65%)',  animation:'aurora-blob 30s ease-in-out infinite reverse',   filter:'blur(85px)', animationDelay:'-10s' }} />
                <div style={{ position:'absolute', bottom:'-6%', left:'22%',width:480, height:480, borderRadius:'50%', background: isDark ? 'radial-gradient(circle,rgba(59,130,246,0.20) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 65%)', animation:'aurora-blob 36s ease-in-out infinite',           filter:'blur(80px)', animationDelay:'-18s' }} />
                <div style={{ position:'absolute', top:'50%',  left:'48%',  width:300, height:300, borderRadius:'50%', background: isDark ? 'radial-gradient(circle,rgba(251,191,36,0.13) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(245,158,11,0.16) 0%,transparent 65%)', animation:'warm-pulse 11s ease-in-out infinite',              filter:'blur(60px)', animationDelay:'-4s' }} />

                {/* Rotating rings — hidden on mobile for performance */}
                <div className="absolute inset-0 hidden items-center justify-center sm:flex">
                    <div className="h-[700px] w-[700px] rounded-full" style={{ border: isDark ? '1px solid rgba(139,92,246,0.06)' : '1px solid rgba(139,92,246,0.16)', animation:'spin-slow 80s linear infinite' }} />
                    <div className="absolute h-[450px] w-[450px] rounded-full" style={{ border: isDark ? '1px solid rgba(167,139,250,0.05)' : '1px solid rgba(167,139,250,0.14)', animation:'spin-slow 55s linear infinite reverse' }} />
                </div>

                {/* GSAP dot particles — 10 items for perf */}
                <div ref={dotsRef} className="absolute inset-0 overflow-hidden">
                    {Array.from({length:10}).map((_,i) => (
                        <div
                            key={i}
                            className="hero-dot absolute rounded-full"
                            style={{
                                width: 3 + (i % 3), height: 3 + (i % 3),
                                top: `${10 + (i * 37) % 80}%`, left: `${5 + (i * 53) % 90}%`,
                                background: ['#a78bfa','#fb7185','#60a5fa','#fbbf24','#34d399'][i % 5],
                                opacity: isDark ? 0.45 : 0.28,
                                animation: `float-y ${5 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
                            }}
                        />
                    ))}
                </div>

                {/* Floating Hanzi — last 3 hidden on mobile */}
                {HERO_CHARS.map((c, i) => (
                    <motion.div
                        key={i}
                        className={`pointer-events-none absolute select-none font-black${i >= 3 ? ' hidden sm:block' : ''}`}
                        style={{ ...c.style, fontSize: c.size, opacity: isDark ? c.opacity : c.opacity * 0.55, color: c.color }}
                        animate={{ y: [0, -18, 0], rotate: [c.rot, c.rot + 2, c.rot] }}
                        transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {c.char}
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Parallax content ── */}
            <motion.div
                style={{ y: textY, opacity, willChange: 'transform, opacity' }}
                className="relative flex h-full flex-col items-center justify-center px-4 pt-16 text-center sm:pt-20"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="mb-7 inline-flex items-center gap-2.5 rounded-full px-5 py-2 backdrop-blur-sm"
                    style={{
                        border: isDark ? '1px solid rgba(139,92,246,0.30)' : '1px solid rgba(109,40,217,0.22)',
                        background: isDark ? 'rgba(139,92,246,0.10)' : 'rgba(237,233,254,0.88)',
                    }}
                >
                    <motion.span
                        animate={{ rotate: [0, 12, -12, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-base"
                    >🐼</motion.span>
                    <span
                        className="text-xs font-bold uppercase tracking-[0.22em]"
                        style={{ color: isDark ? '#c4b5fd' : '#6d28d9' }}
                    >
                        Berdiri Sejak 2018
                    </span>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
                    className="mb-3"
                >
                    <h1
                        className="text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
                        style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    >
                        Panda
                    </h1>
                    <h1
                        className="text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
                        style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#fb7185 50%,#fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                        Mandarin
                    </h1>
                </motion.div>

                {/* Chinese name */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.38 }}
                    className="mb-6 text-sm tracking-[0.3em]"
                    style={{ fontFamily: "'Noto Serif SC', 'Noto Sans SC', serif", color: isDark ? '#71717a' : '#a1a1aa' }}
                >
                    熊猫普通话教育
                </motion.p>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.5, ease: EASE }}
                    className="mx-auto max-w-md text-base leading-relaxed sm:text-lg"
                    style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
                >
                    Lebih dari 6 tahun membuka pintu menuju dunia Mandarin — untuk ribuan pelajar Indonesia.
                </motion.p>

                {/* Year strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
                >
                    {YEAR_STRIP.map((item, i) => (
                        <span
                            key={i}
                            className={item !== '·' ? 'cursor-pointer rounded-md px-1.5 py-0.5 text-[11px] font-bold transition-colors hover:bg-violet-500/15 hover:text-violet-600' : ''}
                            style={{ color: item === '·' ? (isDark ? '#3f3f46' : '#d4d4d8') : (isDark ? '#71717a' : '#a1a1aa') }}
                        >
                            {item}
                        </span>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span
                    className="text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: isDark ? '#52525b' : '#a1a1aa' }}
                >
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-7 w-0.5 rounded-full"
                    style={{ background: `linear-gradient(to bottom,${isDark ? 'rgba(139,92,246,0.70)' : 'rgba(109,40,217,0.40)'},transparent)` }}
                />
            </motion.div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   STATS SECTION — GSAP counters
═══════════════════════════════════════════════════════════════ */

const StatCard = memo(function StatCard({ stat, i, isDark }: { stat: typeof STATS[number]; i: number; isDark: boolean }) {
    const counterRef = useGsapCounter(stat.value, stat.suffix);
    return (
        <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            whileHover={{ y: -8, scale: 1.04, transition: { duration: 0.22 } }}
            className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/35 p-5 text-center backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/6"
            style={{ boxShadow: isDark
                ? '0 4px 32px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                : '0 4px 32px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,0.80)' }}
        >
            {/* Colored glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at 50% 50%,${stat.color}14 0%,transparent 70%)` }}
            />
            {/* Top color strip */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-[24px]" style={{ background: stat.color }} />

            <motion.div
                className="mb-3 text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3.5, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
            >
                {stat.icon}
            </motion.div>

            <div className="mb-1.5 flex items-end justify-center gap-0.5">
                <span
                    ref={counterRef}
                    className="text-5xl font-black tabular-nums"
                    style={{ color: stat.color }}
                />
            </div>
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{stat.label}</p>
        </motion.div>
    );
});

const StatsSection = memo(function StatsSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-20 md:py-28"
            style={{ background: isDark
                ? 'linear-gradient(155deg,#08060F 0%,#100C1E 50%,#060810 100%)'
                : 'linear-gradient(155deg,#FDFBFF 0%,#F0EAFF 50%,#FFF8EE 100%)' }}
        >
            {/* Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position:'absolute', top:'-10%', left:'-5%',  width:460, height:460, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(109,40,217,0.20) 0%,transparent 65%)':'radial-gradient(circle,rgba(139,92,246,0.22) 0%,transparent 65%)', animation:'aurora-blob 24s ease-in-out infinite', filter:'blur(80px)' }} />
                <div style={{ position:'absolute', bottom:'-8%',right:'-4%', width:400, height:400, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(245,158,11,0.14) 0%,transparent 65%)':'radial-gradient(circle,rgba(245,158,11,0.26) 0%,transparent 65%)', animation:'aurora-blob 30s ease-in-out infinite reverse', filter:'blur(75px)', animationDelay:'-12s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-12 text-center"
                >
                    <span className="inline-block rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-600 uppercase dark:bg-violet-900/30 dark:text-violet-400">
                        Dalam Angka
                    </span>
                    <h2 className="mt-3 text-3xl font-black text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Perjalanan yang{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#8b5cf6,#e11d48)' }}>
                            Bermakna
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                    {STATS.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} i={i} isDark={isDark} />
                    ))}
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   STORY SECTION
═══════════════════════════════════════════════════════════════ */

const StorySection = memo(function StorySection() {
    return (
        <section className="bg-[#FDFAF6] py-24 dark:bg-[#06080E] md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">

                    {/* Left — big decorative panda block */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="relative"
                    >
                        {/* Main card */}
                        <div className="relative overflow-hidden rounded-[32px] p-7 text-center sm:p-10"
                            style={{ background: 'linear-gradient(135deg,#f3e8ff 0%,#fce7f3 50%,#fef3c7 100%)' }}
                        >
                            <motion.div
                                className="float-y mb-6 text-[80px] sm:text-[100px]"
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
                            >
                                🐼
                            </motion.div>

                            <p
                                className="text-5xl font-black leading-none sm:text-6xl"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontFamily:"'Noto Serif SC',serif" }}
                            >
                                熊猫教育
                            </p>
                            <p className="mt-3 text-sm font-semibold tracking-widest text-zinc-500 uppercase">Panda Education</p>

                            {/* Floating year pills */}
                            <motion.div
                                animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-3 -right-3 rounded-2xl px-3 py-1.5 text-xs font-black text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}
                            >
                                Sejak 2018
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                className="absolute -bottom-3 -left-3 rounded-2xl px-3 py-1.5 text-xs font-black text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg,#E63946,#f97316)' }}
                            >
                                Jakarta 🇮🇩
                            </motion.div>
                        </div>

                        {/* Quote card below */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
                            className="mt-4 rounded-[20px] border border-zinc-200/60 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-white/5"
                        >
                            <p className="text-2xl font-black leading-none text-violet-400">"</p>
                            <p className="mt-1 text-sm italic leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Kami percaya bahwa belajar Mandarin bukan sekadar menghafal karakter — melainkan membuka jendela menuju dunia yang lebih luas.
                            </p>
                            <p className="mt-3 text-xs font-bold text-zinc-400">— Founder, Panda Mandarin Education</p>
                        </motion.div>
                    </motion.div>

                    {/* Right — story text */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: EASE }}
                    >
                        <span className="mb-4 inline-block rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-600 uppercase dark:bg-violet-900/30 dark:text-violet-400">
                            Tentang Kami
                        </span>
                        <h2 className="mb-5 text-3xl font-black leading-snug text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                            Dimulai dari Sebuah{' '}
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage:'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)' }}>
                                Keyakinan
                            </span>
                        </h2>

                        {[
                            'Panda Mandarin Education lahir pada tahun 2018 dengan keyakinan sederhana: setiap pelajar Indonesia berhak mendapatkan akses ke pendidikan Bahasa Mandarin berkualitas tinggi.',
                            'Kami memulai perjalanan dari satu ruang kelas kecil di MOI Kelapa Gading, Jakarta Utara. Dengan metode pengajaran yang terstruktur, kurikulum HSK internasional, dan pengajar yang berdedikasi, kami tumbuh bersama ribuan siswa.',
                            'Kini, dengan 3 cabang aktif, program Study Tour, dan program pendampingan Kuliah di China — Panda terus berkembang sebagai jembatan antara generasi muda Indonesia dan peluang tak terbatas di China.',
                        ].map((text, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
                                className="mb-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
                            >
                                {text}
                            </motion.p>
                        ))}

                        <motion.a
                            href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+ingin+tahu+lebih+tentang+Panda+Mandarin.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#8b5cf6,#e11d48)' }}
                        >
                            💬 Hubungi Kami
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   VISION & MISSION
═══════════════════════════════════════════════════════════════ */

const VisionMissionSection = memo(function VisionMissionSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(155deg,#0A0610 0%,#0C0A1C 50%,#08080A 100%)'
                : 'linear-gradient(155deg,#FDFBFF 0%,#EDE8FF 45%,#FFF5EC 100%)' }}
        >
            {/* Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position:'absolute', top:'-8%',  left:'-4%',  width:440,height:440, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(109,40,217,0.20) 0%,transparent 65%)':'radial-gradient(circle,rgba(139,92,246,0.24) 0%,transparent 65%)', animation:'aurora-blob 22s ease-in-out infinite', filter:'blur(80px)' }} />
                <div style={{ position:'absolute', bottom:'-6%',right:'-4%', width:400,height:400, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(245,158,11,0.14) 0%,transparent 65%)':'radial-gradient(circle,rgba(245,158,11,0.28) 0%,transparent 65%)', animation:'aurora-blob 29s ease-in-out infinite reverse', filter:'blur(75px)', animationDelay:'-11s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-14 text-center"
                >
                    <span className="inline-block rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-600 uppercase dark:bg-violet-900/30 dark:text-violet-400">
                        Arah & Tujuan
                    </span>
                    <h2 className="mt-3 text-3xl font-black text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Visi &{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage:'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)' }}>
                            Misi Kami
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

                    {/* Vision card */}
                    <motion.div
                        initial={{ opacity: 0, y: 36, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: EASE }}
                        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/40 p-8 backdrop-blur-xl sm:p-10 dark:border-white/12 dark:bg-white/5"
                        style={{ boxShadow: isDark
                            ? '0 8px 48px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                            : '0 8px 48px rgba(139,92,246,0.12), inset 0 1.5px 0 rgba(255,255,255,0.85)' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[28px]" style={{ background: 'linear-gradient(90deg,#8b5cf6,#e11d48,#d97706)' }} />

                        {/* Icon */}
                        <motion.div
                            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.05))' }}
                            animate={{ rotate: [0, 8, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            🔭
                        </motion.div>

                        <p className="mb-3 text-xs font-bold tracking-widest text-violet-600 uppercase dark:text-violet-400">Visi</p>
                        <h3 className="mb-5 text-xl font-black text-zinc-900 dark:text-zinc-50">Tujuan Besar Kami</h3>

                        {/* Big quote display */}
                        <div className="relative">
                            <span className="absolute -top-4 -left-1 text-6xl font-black leading-none text-violet-300/40">"</span>
                            <p className="pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">{VISI}</p>
                        </div>

                        {/* Accent bar */}
                        <motion.div
                            className="mt-6 h-1 rounded-full"
                            style={{ background: 'linear-gradient(90deg,#8b5cf6,#e11d48,transparent)' }}
                            initial={{ width: 0 }}
                            whileInView={{ width: '70%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                        />
                    </motion.div>

                    {/* Mission card */}
                    <motion.div
                        initial={{ opacity: 0, y: 36, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/40 p-8 backdrop-blur-xl sm:p-10 dark:border-white/12 dark:bg-white/5"
                        style={{ boxShadow: isDark
                            ? '0 8px 48px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                            : '0 8px 48px rgba(245,158,11,0.10), inset 0 1.5px 0 rgba(255,255,255,0.85)' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[28px]" style={{ background: 'linear-gradient(90deg,#d97706,#f43f5e,#8b5cf6)' }} />

                        <motion.div
                            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                            style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))' }}
                            animate={{ rotate: [0, -8, 8, 0] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                        >
                            🎯
                        </motion.div>

                        <p className="mb-3 text-xs font-bold tracking-widest text-amber-600 uppercase dark:text-amber-400">Misi</p>
                        <h3 className="mb-6 text-xl font-black text-zinc-900 dark:text-zinc-50">Langkah Nyata Kami</h3>

                        <ul className="flex flex-col gap-4">
                            {MISI.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.12 + i * 0.1, ease: EASE }}
                                    className="flex items-start gap-3"
                                >
                                    <span
                                        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-sm"
                                        style={{ background: 'rgba(245,158,11,0.12)' }}
                                    >
                                        {item.icon}
                                    </span>
                                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.text}</p>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   TIMELINE — GSAP ScrollTrigger line draw + Framer Motion cards
═══════════════════════════════════════════════════════════════ */

function TimelineCard({ milestone, i, isLeft }: { milestone: Milestone; i: number; isLeft: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.62, delay: 0.05, ease: EASE }}
            whileHover={{ y: -6, boxShadow: `0 16px 44px ${milestone.color}22`, transition: { duration: 0.22 } }}
            className="relative overflow-hidden rounded-[22px] border border-zinc-100 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/5"
        >
            {/* Color strip */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-[22px]" style={{ background: `linear-gradient(90deg,${milestone.color},${milestone.color}66)` }} />

            <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: `${milestone.color}18` }}>
                    {milestone.icon}
                </span>
                <span className="rounded-full px-3 py-0.5 text-xs font-black text-white shadow-sm" style={{ background: milestone.color }}>
                    {milestone.year}
                </span>
            </div>

            <h3 className="mb-2 text-[15px] font-bold text-zinc-900 dark:text-zinc-50">{milestone.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{milestone.desc}</p>

            <motion.div
                className="mt-4 h-0.5 rounded-full"
                style={{ background: `linear-gradient(90deg,${milestone.color},transparent)` }}
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            />
        </motion.div>
    );
}

const TimelineSection = memo(function TimelineSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const lineRef    = useRef<HTMLDivElement>(null);

    /* GSAP ScrollTrigger — scrub the line */
    useEffect(() => {
        const line = lineRef.current;
        const section = sectionRef.current;
        if (!line || !section) return;

        gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
        const anim = gsap.to(line, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top 68%',
                end: 'bottom 32%',
                scrub: 0.9,
            },
        });
        return () => { anim.scrollTrigger?.kill(); anim.kill(); };
    }, []);

    return (
        <section className="bg-[#FDFAF6] py-24 dark:bg-[#06080E] md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-16 text-center"
                >
                    <span className="inline-block rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-600 uppercase dark:bg-violet-900/30 dark:text-violet-400">
                        Perjalanan Kami
                    </span>
                    <h2 className="mt-3 text-3xl font-black text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Dari 2018 Hingga{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage:'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)' }}>
                            Sekarang
                        </span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-base text-zinc-500 dark:text-zinc-400">
                        Setiap tahun adalah cerita baru. Setiap angkatan adalah kebanggaan.
                    </p>
                </motion.div>

                {/* Timeline body */}
                <div ref={sectionRef} className="relative">

                    {/* ── Center line (desktop only) ── */}
                    <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 overflow-hidden md:block">
                        {/* Track */}
                        <div className="absolute inset-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        {/* GSAP-animated fill */}
                        <div
                            ref={lineRef}
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'linear-gradient(180deg,#8b5cf6,#E63946,#0ea5e9,#f59e0b,#10b981,#f43f5e,#6366f1)' }}
                        />
                    </div>

                    {/* ── Milestone rows ── */}
                    {MILESTONES.map((milestone, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div key={milestone.year} className="relative mb-8 last:mb-0 md:mb-10">

                                {/* ── MOBILE layout ── */}
                                <div className="flex gap-4 md:hidden">
                                    {/* Left accent */}
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                            className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base text-white shadow-md"
                                            style={{ background: milestone.color }}
                                        >
                                            {milestone.icon}
                                        </motion.div>
                                        {i < MILESTONES.length - 1 && (
                                            <div className="mt-2 w-0.5 flex-1 rounded-full" style={{ background: `${milestone.color}38` }} />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <TimelineCard milestone={milestone} i={i} isLeft={true} />
                                    </div>
                                </div>

                                {/* ── DESKTOP layout ── */}
                                <div className="hidden items-center gap-0 md:flex">
                                    {/* Left slot */}
                                    <div className="flex-1 pr-10">
                                        {isLeft
                                            ? <TimelineCard milestone={milestone} i={i} isLeft={true} />
                                            : <div />
                                        }
                                    </div>

                                    {/* Center dot */}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.12 }}
                                        className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg text-white shadow-lg"
                                        style={{ background: milestone.color }}
                                    >
                                        {milestone.icon}
                                        <motion.div
                                            className="absolute inset-0 rounded-full"
                                            animate={{ boxShadow: [`0 0 0 0px ${milestone.color}66`, `0 0 0 14px ${milestone.color}00`] }}
                                            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.28 }}
                                        />
                                    </motion.div>

                                    {/* Right slot */}
                                    <div className="flex-1 pl-10">
                                        {!isLeft
                                            ? <TimelineCard milestone={milestone} i={i} isLeft={false} />
                                            : <div />
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   VALUES SECTION — glassmorphism on rainbow gradient
═══════════════════════════════════════════════════════════════ */

const ValuesSection = memo(function ValuesSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(135deg,#0E0A1E 0%,#0A0E10 35%,#0E0A06 65%,#0A0C1E 100%)'
                : 'linear-gradient(135deg,#F3EEFF 0%,#FFE8F0 25%,#FFECD2 50%,#E8F8EE 75%,#E8EEFF 100%)' }}
        >
            {/* Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position:'absolute', top:'-8%',  left:'-4%',  width:440,height:440, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 65%)':'radial-gradient(circle,rgba(167,139,250,0.55) 0%,transparent 65%)', animation:'aurora-blob 26s ease-in-out infinite', filter:'blur(80px)' }} />
                <div style={{ position:'absolute', top:'-6%',  right:'-6%', width:420,height:420, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(225,29,72,0.14) 0%,transparent 65%)':'radial-gradient(circle,rgba(255,150,180,0.50) 0%,transparent 65%)', animation:'aurora-blob 32s ease-in-out infinite reverse', filter:'blur(76px)', animationDelay:'-12s' }} />
                <div style={{ position:'absolute', bottom:'-6%',left:'30%', width:380,height:380, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 65%)':'radial-gradient(circle,rgba(110,220,180,0.42) 0%,transparent 65%)', animation:'warm-pulse 14s ease-in-out infinite', filter:'blur(70px)', animationDelay:'-6s' }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-14 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/45 px-5 py-2 text-xs font-bold tracking-widest text-zinc-700 uppercase shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/8 dark:text-zinc-300">
                        <span>✨</span> Nilai Kami
                    </span>
                    <h2 className="mt-4 text-3xl font-black text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Yang Kami{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage:'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)' }}>
                            Pegang Teguh
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.58, delay: i * 0.1, ease: EASE }}
                            whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.22 } }}
                            className="group relative overflow-hidden rounded-[24px] border border-white/60 bg-white/30 p-7 backdrop-blur-xl dark:border-white/12 dark:bg-white/5"
                            style={{ boxShadow: isDark
                                ? '0 4px 28px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,0.08)'
                                : '0 4px 28px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,0.80)' }}
                        >
                            {/* Hover glow */}
                            <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{ background: `radial-gradient(circle at 50% 30%,${v.color}20 0%,transparent 65%)`, border: `1px solid ${v.color}35` }}
                            />
                            <div className="absolute inset-x-0 top-0 h-1 rounded-t-[24px]" style={{ background: v.color }} />

                            <motion.div
                                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                                style={{ background: `${v.color}18` }}
                                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                                transition={{ duration: 5, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {v.icon}
                            </motion.div>

                            <h3 className="mb-2 text-base font-black text-zinc-900 dark:text-zinc-50">{v.title}</h3>
                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{v.desc}</p>

                            <motion.div
                                className="mt-4 h-0.5 rounded-full"
                                style={{ background: `linear-gradient(90deg,${v.color},transparent)` }}
                                initial={{ width: 0 }}
                                whileInView={{ width: 40 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   BRANCHES SECTION
═══════════════════════════════════════════════════════════════ */

const BranchesSection = memo(function BranchesSection() {
    const isDark = useDarkMode();
    const [active, setActive] = useState(0);
    const branch = BRANCHES[active];

    return (
        <section className="py-24 md:py-32" style={{ background: isDark ? '#06080E' : '#FDFAF6' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-10 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold tracking-widest text-amber-600 uppercase dark:bg-amber-900/30 dark:text-amber-400">
                        <span>📍</span> Lokasi Kami
                    </span>
                    <h2 className="mt-3 text-3xl font-black text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        3 Cabang di{' '}
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#f59e0b,#e11d48)' }}>
                            Jakarta
                        </span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-base text-zinc-500 dark:text-zinc-400">
                        Pilih cabang terdekat, lihat lokasinya di peta, dan hubungi kami langsung.
                    </p>
                </motion.div>

                {/* ── Branch tab selector ── */}
                <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
                    {BRANCHES.map((b, i) => (
                        <motion.button
                            key={b.name}
                            onClick={() => setActive(i)}
                            whileHover={{ y: -3, transition: { duration: 0.18 } }}
                            whileTap={{ scale: 0.97 }}
                            className="relative overflow-hidden rounded-2xl border p-3 text-left transition-colors sm:p-4"
                            style={{
                                borderColor: active === i ? b.color : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'),
                                background: active === i
                                    ? isDark ? `${b.color}1A` : `${b.color}0E`
                                    : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.90)',
                                boxShadow: active === i
                                    ? isDark ? `0 4px 20px ${b.color}28` : `0 4px 20px ${b.color}1A`
                                    : isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                        >
                            {active === i && (
                                <motion.div
                                    layoutId="branch-tab-bar"
                                    className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
                                    style={{ background: b.color }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <div
                                className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl text-base sm:h-10 sm:w-10 sm:text-xl"
                                style={{ background: active === i ? `${b.color}22` : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') }}
                            >
                                {b.icon}
                            </div>
                            <p
                                className="truncate text-[11px] font-black leading-tight sm:text-xs"
                                style={{ color: active === i ? b.color : (isDark ? '#e4e4e7' : '#18181b') }}
                            >
                                {b.name}
                            </p>
                            <p className="mt-0.5 hidden truncate text-[10px] text-zinc-400 sm:block">{b.subtitle}</p>
                        </motion.button>
                    ))}
                </div>

                {/* ── Active branch panel ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:gap-6"
                    >
                        {/* Map — 3/5 cols, responsive height */}
                        <div
                            className="relative h-[260px] overflow-hidden rounded-[24px] sm:h-[320px] md:h-[360px] lg:col-span-3"
                            style={{
                                boxShadow: isDark
                                    ? `0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px ${branch.color}30`
                                    : `0 8px 40px rgba(0,0,0,0.10), 0 0 0 1px ${branch.color}28`,
                            }}
                        >
                            {/* Color accent bar */}
                            <div className="absolute inset-x-0 top-0 z-10 h-1" style={{ background: branch.color }} />
                            <iframe
                                src={branch.mapsEmbed}
                                width="100%"
                                height="100%"
                                style={{ border: 0, display: 'block' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Peta Cabang Panda ${branch.name}`}
                            />
                        </div>

                        {/* Info card — 2/5 cols */}
                        <div
                            className="flex flex-col rounded-[24px] border p-5 sm:p-7 lg:col-span-2"
                            style={{
                                borderColor: isDark ? `${branch.color}28` : `${branch.color}22`,
                                background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)',
                            }}
                        >
                            {/* Name + badge */}
                            <div className="mb-5 flex items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xl">{branch.icon}</span>
                                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{branch.name}</h3>
                                    </div>
                                    {branch.badge && (
                                        <span
                                            className="mt-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-black text-white"
                                            style={{ background: branch.color }}
                                        >
                                            {branch.badge}
                                        </span>
                                    )}
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-base"
                                    style={{ background: `${branch.color}18` }}
                                >
                                    📍
                                </motion.div>
                            </div>

                            {/* Info rows */}
                            <div className="mb-5 flex flex-col gap-3.5">
                                {([
                                    { icon: '🏠', text: branch.address, bold: false },
                                    { icon: '⏰', text: branch.hours,   bold: false },
                                    { icon: '📞', text: branch.phone,   bold: true  },
                                ] as const).map((row, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span
                                            className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                                            style={{ background: `${branch.color}15` }}
                                        >
                                            {row.icon}
                                        </span>
                                        <span className={`text-sm leading-relaxed ${row.bold ? 'font-semibold text-zinc-800 dark:text-zinc-200' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                            {row.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="mb-5 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }} />

                            {/* Action buttons */}
                            <div className="mt-auto flex flex-col gap-2.5">
                                <motion.a
                                    href={`https://wa.me/${branch.waPhone}?text=Halo+Admin+Panda!+Saya+ingin+info+lebih+lanjut+tentang+cabang+${encodeURIComponent(branch.name)}.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02, boxShadow: `0 8px 24px ${branch.color}38` }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
                                    style={{ background: `linear-gradient(135deg,${branch.color},${branch.color}bb)` }}
                                >
                                    💬 Chat WhatsApp
                                </motion.a>
                                <a
                                    href={branch.mapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-white/5"
                                    style={{
                                        borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)',
                                        color: isDark ? '#d4d4d8' : '#3f3f46',
                                    }}
                                >
                                    🗺️ Buka di Google Maps
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ── Mini branch strip (quick jump) ── */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {BRANCHES.map((b, i) => (
                        <motion.button
                            key={b.name}
                            onClick={() => setActive(i)}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                            className="flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all hover:shadow-sm"
                            style={{
                                borderColor: active === i ? b.color : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'),
                                background: active === i
                                    ? isDark ? `${b.color}12` : `${b.color}08`
                                    : isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                            }}
                        >
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-base" style={{ background: `${b.color}18` }}>{b.icon}</span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50">{b.name}</p>
                                <p className="truncate text-xs text-zinc-400">{b.address.split(',')[0]}</p>
                            </div>
                            {active === i && (
                                <motion.span
                                    layoutId="strip-active"
                                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                                    style={{ background: b.color }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                >✓</motion.span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
});

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA SECTION
═══════════════════════════════════════════════════════════════ */

const CtaSection = memo(function CtaSection() {
    const isDark = useDarkMode();
    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            style={{ background: isDark
                ? 'linear-gradient(150deg,#0A060F 0%,#10061A 40%,#060810 100%)'
                : 'linear-gradient(150deg,#F3EEFF 0%,#FFE8F5 38%,#FFF3E6 75%,#F3EEFF 100%)' }}
        >
            {/* Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div style={{ position:'absolute', top:'-10%', left:'-5%',  width:520,height:520, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(109,40,217,0.22) 0%,transparent 65%)':'radial-gradient(circle,rgba(139,92,246,0.32) 0%,transparent 65%)', animation:'aurora-blob 24s ease-in-out infinite', filter:'blur(90px)' }} />
                <div style={{ position:'absolute', bottom:'-8%',right:'-5%', width:480,height:480, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(225,29,72,0.16) 0%,transparent 65%)':'radial-gradient(circle,rgba(255,140,170,0.38) 0%,transparent 65%)', animation:'aurora-blob 30s ease-in-out infinite reverse', filter:'blur(85px)', animationDelay:'-12s' }} />
                <div style={{ position:'absolute', top:'35%',  right:'10%', width:360,height:360, borderRadius:'50%', background:isDark?'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 65%)':'radial-gradient(circle,rgba(253,186,116,0.36) 0%,transparent 65%)', animation:'warm-pulse 13s ease-in-out infinite', filter:'blur(70px)', animationDelay:'-5s' }} />
            </div>

            {/* Rotating rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <motion.div className="absolute h-[620px] w-[620px] rounded-full border border-violet-400/12 dark:border-violet-700/14" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute h-[420px] w-[420px] rounded-full border border-rose-300/10 dark:border-rose-700/10"  animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
            </div>

            <div className="relative mx-auto max-w-2xl px-4 text-center">

                {/* Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.72, ease: EASE }}
                    className="overflow-hidden rounded-[36px] border border-white/75 bg-white/55 backdrop-blur-2xl dark:border-white/12 dark:bg-white/6"
                    style={{ boxShadow: isDark
                        ? '0 12px 64px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.08)'
                        : '0 12px 64px rgba(139,92,246,0.12), inset 0 2px 0 rgba(255,255,255,0.95)' }}
                >
                    <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#8b5cf6,#e11d48,#d97706,#10b981,#0ea5e9)' }} />

                    <div className="px-8 py-14 sm:px-14">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.05 }}
                            className="mb-7"
                        >
                            <motion.span
                                className="inline-block text-7xl"
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                🐼
                            </motion.span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.62, delay: 0.12, ease: EASE }}
                            className="mb-4 text-3xl font-black leading-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
                        >
                            Bergabunglah Bersama{' '}
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage:'linear-gradient(135deg,#8b5cf6,#e11d48,#d97706)' }}>
                                Panda
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.22 }}
                            className="mb-9 text-base leading-relaxed text-zinc-500 dark:text-zinc-400"
                        >
                            Mulai perjalananmu belajar Mandarin bersama 1.200+ alumni Panda. Konsultasi gratis, tanpa komitmen.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.32 }}
                            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                        >
                            <motion.a
                                href={`https://wa.me/${WA}?text=Halo+Admin+Panda!+Saya+ingin+bergabung+belajar+Mandarin.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.06, boxShadow: '0 16px 44px rgba(37,211,102,0.40)' }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-base font-bold text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                            >
                                <motion.span
                                    className="pointer-events-none absolute inset-0 rounded-full"
                                    style={{ background:'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)' }}
                                    animate={{ x:['-160%','160%'] }}
                                    transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                />
                                <span className="relative text-xl">💬</span>
                                <span className="relative">Chat WhatsApp Sekarang</span>
                            </motion.a>

                            <Link
                                href="/classes"
                                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-7 py-4 text-sm font-semibold text-zinc-700 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-white dark:border-white/15 dark:bg-white/8 dark:text-zinc-300 dark:hover:bg-white/12"
                            >
                                Lihat Kelas Kami →
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-400 dark:text-zinc-500"
                        >
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Gratis konsultasi</span>
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Tanpa komitmen</span>
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Berdiri sejak 2018</span>
                            <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> 1.200+ alumni</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
});

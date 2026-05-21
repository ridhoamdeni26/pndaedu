'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate, useSpring, animate } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FeatureCard {
    num: string;
    icon: string;
    label: string;
    desc: string;
    accentHex: string;
    textAccent: string;
    bgClass: string;
    borderClass: string;
    dark?: boolean;
    featured?: boolean;
    hanzi?: boolean;
    initialX: number;
    initialY: number;
    delay: number;
}

const CARDS: FeatureCard[] = [
    {
        num: '01',
        icon: '师',
        label: 'Native Speaker Teachers',
        desc: 'Belajar dari guru bersertifikat asal China — alumni Tsinghua, PKU, & BLCU. Aksen asli, budaya nyata, pengalaman tak ternilai.',
        accentHex: '#E63946',
        textAccent: 'text-red-400',
        bgClass: 'bg-[#0F1E38]',
        borderClass: 'border-slate-800/50',
        dark: true,
        featured: true,
        hanzi: true,
        initialX: -80,
        initialY: 0,
        delay: 0,
    },
    {
        num: '02',
        icon: '📅',
        label: 'Jadwal Super Fleksibel',
        desc: 'Online via VOOV atau offline di 3 cabang Jakarta. Rekaman kelas tersedia 24 jam.',
        accentHex: '#F59E0B',
        textAccent: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-white dark:bg-zinc-900',
        borderClass: 'border-zinc-200 dark:border-zinc-800',
        initialX: 80,
        initialY: -20,
        delay: 0.1,
    },
    {
        num: '03',
        icon: '证',
        label: 'Sertifikasi HSK 1–6',
        desc: '95% siswa lulus HSK di percobaan pertama. Free biaya pendaftaran ujian!',
        accentHex: '#8B5CF6',
        textAccent: 'text-violet-600 dark:text-violet-400',
        bgClass: 'bg-white dark:bg-zinc-900',
        borderClass: 'border-zinc-200 dark:border-zinc-800',
        hanzi: true,
        initialX: 80,
        initialY: 20,
        delay: 0.18,
    },
    {
        num: '04',
        icon: '📚',
        label: 'Study Abroad Support',
        desc: '200+ siswa lolos beasiswa CSC, Confucius, & universitas top China.',
        accentHex: '#10B981',
        textAccent: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-white dark:bg-zinc-900',
        borderClass: 'border-zinc-200 dark:border-zinc-800',
        initialX: -30,
        initialY: 60,
        delay: 0.08,
    },
    {
        num: '05',
        icon: '🤖',
        label: 'AI Learning Tools',
        desc: 'AI tutor personal, flashcard cerdas adaptif, & speech recognition untuk latihan pelafalan.',
        accentHex: '#0EA5E9',
        textAccent: 'text-sky-600 dark:text-sky-400',
        bgClass: 'bg-white dark:bg-zinc-900',
        borderClass: 'border-zinc-200 dark:border-zinc-800',
        initialX: 0,
        initialY: 60,
        delay: 0.16,
    },
    {
        num: '06',
        icon: '🎯',
        label: 'Placement Test Gratis',
        desc: 'Tes penempatan gratis untuk jalur belajar paling sesuai. Hasil rekomendasi personal dalam 15 menit.',
        accentHex: '#EC4899',
        textAccent: 'text-pink-600 dark:text-pink-400',
        bgClass: 'bg-white dark:bg-zinc-900',
        borderClass: 'border-zinc-200 dark:border-zinc-800',
        initialX: 30,
        initialY: 60,
        delay: 0.24,
    },
];

/* ── Background floating hanzi ──────────────────────────────── */
interface BgHanzi { char: string; top: string; left?: string; right?: string; size: number; dur: number; delay: number; opacity: number; }
const BG_HANZI: BgHanzi[] = [
    { char: '学', top: '8%',  left: '2%',   size: 96,  dur: 22, delay: 0,   opacity: 0.04  },
    { char: '好', top: '72%', left: '1%',   size: 68,  dur: 18, delay: 3,   opacity: 0.032 },
    { char: '进', top: '16%', right: '2%',  size: 80,  dur: 26, delay: 1.5, opacity: 0.038 },
    { char: '步', top: '66%', right: '2%',  size: 60,  dur: 20, delay: 4,   opacity: 0.028 },
    { char: '成', top: '44%', left: '1.5%', size: 50,  dur: 16, delay: 2,   opacity: 0.025 },
    { char: '功', top: '50%', right: '1%',  size: 58,  dur: 28, delay: 5.5, opacity: 0.03  },
];

/* ── Animated count-up ──────────────────────────────────────── */
function CountUp({ target, suffix = '', inView }: { target: number; suffix?: string; inView: boolean }) {
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (!inView || !ref.current) return;
        const ctrl = animate(0, target, {
            duration: 1.8,
            ease: 'easeOut',
            onUpdate(v) {
                if (ref.current) ref.current.textContent = Math.floor(v) + suffix;
            },
        });
        return () => ctrl.stop();
    }, [inView]); // eslint-disable-line
    return <span ref={ref}>0{suffix}</span>;
}

/* ── Card with 3D tilt + rotating border glow ───────────────── */
function SpotlightCard({ card, sectionInView }: { card: FeatureCard; sectionInView: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    /* spotlight */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, ${card.accentHex}22, transparent 70%)`;

    /* rotating conic border glow */
    const borderAngle = useMotionValue(0);
    const borderBg = useMotionTemplate`conic-gradient(from ${borderAngle}deg at 50% 50%, transparent 0deg, ${card.accentHex}60 80deg, transparent 180deg)`;
    useEffect(() => {
        if (!hovered) { borderAngle.set(0); return; }
        const ctrl = animate(borderAngle, 360, { duration: 2.4, ease: 'linear', repeat: Infinity });
        return () => ctrl.stop();
    }, [hovered]); // eslint-disable-line

    /* 3D spring tilt */
    const tiltX = useMotionValue(0);
    const tiltY = useMotionValue(0);
    const springX = useSpring(tiltX, { stiffness: 200, damping: 26 });
    const springY = useSpring(tiltY, { stiffness: 200, damping: 26 });

    function trackMouse(e: React.MouseEvent) {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
        tiltX.set(((e.clientY - top  - height / 2) / height) * -5);
        tiltY.set(((e.clientX - left - width  / 2) / width)  *  5);
    }
    function handleLeave() { setHovered(false); tiltX.set(0); tiltY.set(0); }

    return (
        /* perspective wrapper — grid col/row lives here */
        <div
            className={card.featured ? 'md:col-span-2 md:row-span-2' : ''}
            style={{ perspective: '900px' }}
        >
            {/* tilt + entrance wrapper */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.72, delay: card.delay, ease: EASE }}
                style={{ rotateX: springX, rotateY: springY }}
                onMouseMove={trackMouse}
                onMouseEnter={(e) => { trackMouse(e); setHovered(true); }}
                onMouseLeave={handleLeave}
                className="group relative h-full"
            >
                {/* rotating border glow — sits outside overflow-hidden */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl"
                    style={{ background: borderBg }}
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.28 }}
                />

                {/* card body */}
                <div className={`relative h-full overflow-hidden rounded-3xl border p-6 md:p-8 ${card.bgClass} ${card.borderClass}`}>

                    {/* mouse spotlight */}
                    <motion.div
                        className="pointer-events-none absolute inset-0"
                        style={{ background: spotlight }}
                        animate={{ opacity: hovered ? 1 : 0 }}
                        transition={{ duration: 0.28 }}
                    />

                    {/* featured corner pulse */}
                    {card.featured && (
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full"
                            style={{ background: `radial-gradient(circle,${card.accentHex}28,transparent 70%)` }}
                            animate={{ scale: [1, 1.28, 1], opacity: [0.5, 0.88, 0.5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    )}

                    {/* hanzi watermark */}
                    {card.hanzi && (
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-4 -right-6 select-none font-bold leading-none"
                            style={{
                                fontFamily: 'var(--font-hanzi)',
                                fontSize: card.featured ? '180px' : '80px',
                                color: card.accentHex,
                                opacity: card.featured ? 0.055 : 0.07,
                            }}
                            animate={card.featured
                                ? { x: [0, 10, 0], y: [0, -12, 0] }
                                : { rotate: [0, 5, 0] }
                            }
                            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {card.icon}
                        </motion.div>
                    )}

                    <div className="relative z-10 flex h-full flex-col">

                        {/* icon + number */}
                        <div className="flex items-start justify-between">
                            <div className="relative">
                                {/* pulse ring */}
                                <motion.div
                                    className="pointer-events-none absolute inset-0 rounded-2xl"
                                    style={{ border: `1px solid ${card.accentHex}` }}
                                    animate={{ scale: [1, 1.75, 1], opacity: [0.55, 0, 0.55] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: card.delay * 0.5 }}
                                />
                                <motion.div
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                    style={{ background: `${card.accentHex}18` }}
                                    whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                                >
                                    {card.hanzi ? (
                                        <span
                                            className={`text-xl font-bold ${card.textAccent}`}
                                            style={{ fontFamily: 'var(--font-hanzi)' }}
                                        >
                                            {card.icon}
                                        </span>
                                    ) : (
                                        <span className="text-xl leading-none">{card.icon}</span>
                                    )}
                                </motion.div>
                            </div>

                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: card.delay + 0.2, ease: EASE }}
                                className={`font-mono text-xs font-semibold tracking-widest ${card.dark ? 'text-slate-600' : 'text-zinc-300 dark:text-zinc-700'}`}
                            >
                                {card.num}
                            </motion.span>
                        </div>

                        {/* title + desc */}
                        <div className={card.featured ? 'mt-8' : 'mt-5'}>
                            <h3 className={`mb-2.5 font-bold leading-snug ${card.dark ? 'text-zinc-100' : 'text-zinc-900 dark:text-zinc-100'} ${card.featured ? 'text-xl md:text-2xl' : 'text-[15px]'}`}>
                                {card.label}
                            </h3>
                            <p className={`text-sm leading-relaxed ${card.dark ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                {card.desc}
                            </p>
                        </div>

                        <div className="flex-1" />

                        {/* featured stats — animated count-up */}
                        {card.featured && (
                            <div className="mt-8 grid grid-cols-3 gap-3">
                                {[
                                    { target: 5000, suffix: '+', label: 'Alumni' },
                                    { target: 95,   suffix: '%', label: 'HSK Pass' },
                                    { target: 10,   suffix: '+', label: 'Tahun' },
                                ].map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        whileHover={{ y: -3, scale: 1.04 }}
                                        className="rounded-2xl px-3 py-3.5 text-center"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: card.delay + 0.35 + i * 0.1, ease: EASE }}
                                    >
                                        <div className="text-base font-bold text-zinc-100">
                                            <CountUp target={s.target} suffix={s.suffix} inView={sectionInView} />
                                        </div>
                                        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-600">
                                            {s.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* accent line — draws from left on scroll-enter */}
                        <motion.div
                            className="mt-5 h-0.75 rounded-full"
                            style={{ background: card.accentHex, originX: 0 }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: card.delay + 0.45, ease: EASE }}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ── Section ────────────────────────────────────────────────── */

export function WhySection() {
    const headingRef  = useRef<HTMLDivElement>(null);
    const sectionRef  = useRef<HTMLElement>(null);
    const headingInView = useInView(headingRef, { once: true, margin: '-80px' });
    const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-[#FAF8F4] py-20 dark:bg-[#080F1C] md:py-28">

            {/* ── Background ── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>

                {/* Aurora blobs */}
                <motion.div
                    animate={{ x: [0, 38, 0], y: [0, -25, 0], scale: [1, 1.22, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -left-32 -top-16 h-96 w-96 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.09),transparent 70%)', filter: 'blur(70px)' }}
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 22, 0], scale: [1, 1.16, 1] }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                    className="absolute -bottom-20 -right-24 h-96 w-96 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.11),transparent 70%)', filter: 'blur(65px)' }}
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.65, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
                    className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(245,158,11,0.07),transparent 70%)', filter: 'blur(55px)' }}
                />
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -14, 0], opacity: [0.2, 0.42, 0.2] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
                    className="absolute -bottom-10 left-1/4 h-64 w-64 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(194,68,10,0.08),transparent 70%)', filter: 'blur(60px)' }}
                />
                <motion.div
                    animate={{ x: [0, -16, 0], y: [0, 20, 0], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                    className="absolute -right-20 top-1/3 h-56 w-56 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.07),transparent 70%)', filter: 'blur(55px)' }}
                />

                {/* Floating hanzi */}
                {BG_HANZI.map((h, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -22, 0], rotate: [0, 4, 0] }}
                        transition={{ duration: h.dur, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
                        className="absolute select-none font-bold leading-none text-black dark:text-white"
                        style={{
                            top: h.top,
                            left: h.left,
                            right: h.right,
                            fontSize: h.size,
                            fontFamily: 'var(--font-hanzi)',
                            opacity: h.opacity,
                        }}
                        aria-hidden
                    >
                        {h.char}
                    </motion.div>
                ))}

                {/* Warm dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.028]"
                    style={{
                        backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.5) 1px,transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Heading ── */}
                <div ref={headingRef} className="mb-14 text-center">

                    {/* badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.88 }}
                        animate={headingInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.45, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-1.5 w-1.5 rounded-full bg-red-500"
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Kenapa Panda?
                        </span>
                    </motion.div>

                    {/* word-by-word stagger */}
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl lg:text-5xl">
                        {['Lebih', 'dari', 'sekadar'].map((word, i) => (
                            <motion.span
                                key={word}
                                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                                animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                                transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: EASE }}
                                className="mr-2 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                        <motion.span
                            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                            animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                            transition={{ duration: 0.55, delay: 0.38, ease: EASE }}
                            className="inline-block"
                            style={{
                                background: 'linear-gradient(135deg,#E63946 0%,#c2410c 50%,#D4A574 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            les bahasa.
                        </motion.span>
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={headingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.52, ease: EASE }}
                        className="mx-auto mt-4 max-w-lg text-base text-zinc-500 dark:text-zinc-400"
                    >
                        Ekosistem belajar Mandarin terlengkap di Indonesia — dari guru native hingga AI tools & beasiswa internasional.
                    </motion.p>
                </div>

                {/* ── Bento grid ── */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                    {CARDS.map((card) => (
                        <SpotlightCard key={card.num} card={card} sectionInView={sectionInView} />
                    ))}
                </div>
            </div>
        </section>
    );
}

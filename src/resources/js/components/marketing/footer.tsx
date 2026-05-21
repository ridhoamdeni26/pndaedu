import { Link } from '@inertiajs/react';

/* ─── Data ───────────────────────────────────────────────── */

const PROGRAM_LINKS = [
    { label: 'HSK 1 & 2 — Pemula',        href: '/classes?level=hsk-1' },
    { label: 'HSK 3 & 4 — Menengah',       href: '/classes?level=hsk-3' },
    { label: 'HSK 5 & 6 — Lanjutan',       href: '/classes?level=hsk-5' },
    { label: 'Kids Mandarin',               href: '/classes?cat=kids' },
    { label: 'Business Mandarin',           href: '/classes?type=business' },
    { label: 'Private 1-on-1',             href: '/classes?type=private' },
] as const;

const INFO_LINKS = [
    { label: 'Tentang Kami',     href: '/about-us' },
    { label: 'Placement Test',   href: '/placement-test' },
    { label: 'Study Tour China', href: '/study-tour' },
    { label: 'Kuliah di China',  href: '/college-china' },
    { label: 'News & Blog',      href: '/news' },
    { label: 'Program Referral', href: '/referral' },
] as const;

const BRANCHES = [
    {
        name: 'MOI Kelapa Gading',
        address: 'Lantai 2 Ruko MOI Blok C46, Jakarta Utara 14240',
        phone: '+62 897-8273-311',
        badge: 'Pusat',
    },
    {
        name: 'Pluit Jakarta Utara',
        address: 'Jl. Pluit Karang Utara No.129C, Penjaringan 14450',
        phone: '+62 895-0827-5782',
        badge: null,
    },
    {
        name: 'Citra 2 Kalideres',
        address: 'Jl. Citra Dua Extension No.18 BG, Jakarta Barat 11840',
        phone: '+62 895-3410-09972',
        badge: null,
    },
] as const;

const LEGAL_LINKS = [
    { label: 'Kebijakan Privasi', href: '/privasi' },
    { label: 'Syarat & Ketentuan', href: '/syarat' },
    { label: 'Cookie', href: '/cookie' },
] as const;

/* ─── Social icons ───────────────────────────────────────── */

interface SocialLink {
    label: string;
    href: string;
    icon: React.ReactNode;
    hoverBg: string;
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
    );
}

function TikTokIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
        </svg>
    );
}

const SOCIALS: SocialLink[] = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/panda.edc/',
        icon: <InstagramIcon />,
        hoverBg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@panda.edc',
        icon: <TikTokIcon />,
        hoverBg: '#010101',
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/@pandaedcmandarin',
        icon: <YoutubeIcon />,
        hoverBg: '#FF0000',
    },
    {
        label: 'WhatsApp',
        href: 'https://api.whatsapp.com/send/?phone=6289508275782',
        icon: <WhatsAppIcon />,
        hoverBg: '#25D366',
    },
];

/* ─── Panda Logo ─────────────────────────────────────────── */

function PandaLogo() {
    return (
        <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden>
            <circle cx="16" cy="17" r="11" fill="#FAF7F2" />
            <ellipse cx="8"    cy="10"   rx="3.2" ry="3.5" fill="#0B0B0F" />
            <ellipse cx="24"   cy="10"   rx="3.2" ry="3.5" fill="#0B0B0F" />
            <ellipse cx="11.5" cy="16"   rx="2.2" ry="2.8" fill="#0B0B0F" />
            <ellipse cx="20.5" cy="16"   rx="2.2" ry="2.8" fill="#0B0B0F" />
            <circle  cx="11.5" cy="16.5" r="0.8"            fill="#FAF7F2" />
            <circle  cx="20.5" cy="16.5" r="0.8"            fill="#FAF7F2" />
            <ellipse cx="16"   cy="20"   rx="1.5" ry="1"   fill="#0B0B0F" />
            <path d="M14.5 21.5 Q16 23 17.5 21.5" stroke="#0B0B0F" strokeWidth="0.8" fill="none" />
        </svg>
    );
}

/* ─── Sub-components ─────────────────────────────────────── */

function SocialButton({ s }: { s: SocialLink }) {
    return (
        <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 transition-all duration-300 hover:scale-110 hover:border-transparent hover:shadow-lg dark:border-white/10 dark:bg-white/6"
        >
            <span
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: s.hoverBg }}
                aria-hidden
            />
            <span className="relative z-10 text-zinc-500 transition-colors duration-200 group-hover:text-white dark:text-zinc-400">
                {s.icon}
            </span>
        </a>
    );
}

function LinkList({ links }: { links: readonly { label: string; href: string }[] }) {
    return (
        <ul className="space-y-2.5">
            {links.map((l) => (
                <li key={l.href}>
                    <Link
                        href={l.href}
                        className="group flex items-center gap-1.5 text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
                    >
                        <span className="h-px w-3 rounded-full bg-zinc-300 transition-all duration-200 group-hover:w-4 group-hover:bg-red-500 dark:bg-zinc-700" />
                        {l.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function BranchCard({ b }: { b: (typeof BRANCHES)[number] }) {
    return (
        <div className="group rounded-2xl border border-zinc-100 bg-white p-4 transition-all duration-300 hover:border-zinc-200 hover:shadow-sm dark:border-white/6 dark:bg-white/3 dark:hover:border-zinc-600">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{b.name}</span>
                {b.badge && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-red-600 dark:bg-red-500/20 dark:text-red-400">
                        {b.badge}
                    </span>
                )}
            </div>
            <p className="mb-1.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-600">{b.address}</p>
            <a
                href={`tel:${b.phone.replace(/\s|-/g, '')}`}
                className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 transition-colors hover:text-green-600 dark:text-zinc-500 dark:hover:text-green-400"
            >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {b.phone}
            </a>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────── */

export default function MarketingFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-white/5 dark:bg-zinc-950">

            {/* ── Newsletter / CTA strip ──────────────────────────── */}
            <div className="relative overflow-hidden border-b border-zinc-100 dark:border-white/5">
                {/* glow — only visible in dark mode */}
                <div
                    className="pointer-events-none absolute -top-20 left-1/2 hidden h-64 w-150 -translate-x-1/2 rounded-full dark:block"
                    style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.15),transparent 70%)', filter: 'blur(60px)' }}
                />
                <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
                        <div>
                            <p className="mb-1 text-lg font-bold text-zinc-900 dark:text-white md:text-xl">
                                Konsultasi gratis, tidak ada kewajiban. 🐼
                            </p>
                            <p className="text-sm text-zinc-500">
                                Admin kami siap membantu kamu memilih kelas yang paling tepat — respon 5–10 menit.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap justify-center gap-3">
                            <a
                                href="https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Admin+Panda!+Saya+ingin+konsultasi+kelas+Mandarin."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-green-500/20"
                                style={{ background: '#25D366' }}
                            >
                                <WhatsAppIcon />
                                Chat WhatsApp
                            </a>
                            <Link
                                href="/placement-test"
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/12 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
                            >
                                🎯 Placement Test Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main grid ──────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-12">

                    {/* Brand column */}
                    <div className="lg:col-span-3">
                        <Link href="/" className="group mb-5 inline-flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200 transition-transform duration-300 group-hover:-rotate-6 dark:bg-zinc-100">
                                <PandaLogo />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Panda Mandarin</p>
                                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
                                    Education · 教育
                                </p>
                            </div>
                        </Link>

                        <p className="mb-6 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                            Platform belajar Mandarin terpercaya di Indonesia sejak 2014. 5000+ alumni telah
                            berkarir, meraih beasiswa, dan berkembang bersama Panda.
                        </p>

                        {/* Stats row */}
                        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
                            {[['5K+', 'Alumni'], ['95%', 'HSK Pass'], ['10+', 'Tahun']].map(([val, lbl]) => (
                                <div
                                    key={lbl}
                                    className="rounded-xl border border-zinc-100 bg-white py-2.5 dark:border-white/6 dark:bg-white/4"
                                >
                                    <div className="text-sm font-bold text-zinc-900 dark:text-white">{val}</div>
                                    <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">{lbl}</div>
                                </div>
                            ))}
                        </div>

                        {/* Social icons */}
                        <div>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-700">
                                Ikuti Kami
                            </p>
                            <div className="flex gap-2">
                                {SOCIALS.map((s) => (
                                    <SocialButton key={s.label} s={s} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Program links */}
                    <div className="lg:col-span-2">
                        <h4 className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                            Program
                        </h4>
                        <LinkList links={PROGRAM_LINKS} />
                    </div>

                    {/* Info links */}
                    <div className="lg:col-span-2">
                        <h4 className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                            Info
                        </h4>
                        <LinkList links={INFO_LINKS} />
                    </div>

                    {/* Branches */}
                    <div className="lg:col-span-5">
                        <h4 className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                            Cabang Jakarta
                        </h4>
                        <div className="space-y-3">
                            {BRANCHES.map((b) => (
                                <BranchCard key={b.name} b={b} />
                            ))}
                        </div>

                        {/* HSK badge */}
                        <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3 dark:border-white/8 dark:bg-white/4">
                            <span className="text-2xl" aria-hidden>🇨🇳</span>
                            <div>
                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">HSK Certified Test Center</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-600">Hanban · Confucius Institute · Level 1–6</p>
                            </div>
                            <div className="ml-2 flex items-center gap-1">
                                {'★★★★★'.split('').map((s, i) => (
                                    <span key={i} className="text-xs text-amber-400">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ──────────────────────────────────────── */}
            <div className="border-t border-zinc-100 dark:border-white/5">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-400 sm:flex-row sm:px-6 lg:px-8 dark:text-zinc-700">
                    <p className="font-mono">
                        © {year} Panda Mandarin Education. Made with ♥ in Jakarta.
                    </p>
                    <nav className="flex flex-wrap items-center gap-4" aria-label="Legal">
                        {LEGAL_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="transition-colors duration-150 hover:text-zinc-700 dark:hover:text-zinc-400"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}

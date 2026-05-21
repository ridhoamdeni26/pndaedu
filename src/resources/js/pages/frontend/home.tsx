import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import type { CourseClass } from '@/types/home';

// ── Above fold: eager ─────────────────────────────────────────
import { HeroSection } from '@/components/marketing/home/hero-section';

// ── Below fold: code-split chunks ─────────────────────────────
const StatsSection        = lazy(() => import('@/components/marketing/home/stats-section').then(m        => ({ default: m.StatsSection })));
const KidsBanner          = lazy(() => import('@/components/marketing/home/kids-banner').then(m          => ({ default: m.KidsBanner })));
const TrendingSection     = lazy(() => import('@/components/marketing/home/trending-section').then(m     => ({ default: m.TrendingSection })));
const WhySection          = lazy(() => import('@/components/marketing/home/why-section').then(m          => ({ default: m.WhySection })));
const TestimonialsSection = lazy(() => import('@/components/marketing/home/testimonials-section').then(m => ({ default: m.TestimonialsSection })));
const PartnersMarquee     = lazy(() => import('@/components/marketing/home/partners-marquee').then(m     => ({ default: m.PartnersMarquee })));
const ReferralSection     = lazy(() => import('@/components/marketing/home/referral-section').then(m     => ({ default: m.ReferralSection })));
const FaqSection          = lazy(() => import('@/components/marketing/home/faq-section').then(m          => ({ default: m.FaqSection })));
const FinalCta            = lazy(() => import('@/components/marketing/home/final-cta').then(m            => ({ default: m.FinalCta })));
const ConsultModal        = lazy(() => import('@/components/marketing/home/consult-modal').then(m        => ({ default: m.ConsultModal })));
const CartDrawer          = lazy(() => import('@/components/marketing/home/cart-drawer').then(m          => ({ default: m.CartDrawer })));

/* ─────────────────────────────────────────────────────────────
   LazySection — defers mount until element is near viewport.
   Shows skeleton while unloaded OR while chunk is downloading.
───────────────────────────────────────────────────────────── */
function LazySection({
    children,
    fallback,
    rootMargin = '600px 0px',
}: {
    children: React.ReactNode;
    fallback: React.ReactNode;
    rootMargin?: string;
}) {
    const [visible, setVisible] = useState(false);
    const sentinelRef           = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { rootMargin },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [rootMargin]);

    if (visible) return <Suspense fallback={fallback}>{children}</Suspense>;
    return <div ref={sentinelRef}>{fallback}</div>;
}

/* ─────────────────────────────────────────────────────────────
   Skeleton building blocks
───────────────────────────────────────────────────────────── */

function Sk({ className = '' }: { className?: string }) {
    return <div className={`sk rounded-xl ${className}`} />;
}

function LightSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <section className={`bg-[#FDFAF6] py-20 dark:bg-[#080F1C] md:py-28 ${className}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </section>
    );
}

function SkHeading({ titleW = 'w-72', subtitleW = 'w-96' }: { titleW?: string; subtitleW?: string }) {
    return (
        <div className="mb-12 text-center">
            <Sk className="mx-auto mb-5 h-7 w-40 rounded-full" />
            <Sk className={`mx-auto mb-3 h-11 ${titleW}`} />
            <Sk className={`mx-auto h-5 ${subtitleW} max-w-full`} />
        </div>
    );
}

/* ── Per-section skeletons ── */

function StatsSkeleton() {
    return (
        <section className="bg-[#FDFAF6] py-16 dark:bg-[#0C1A2E]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-3xl border border-zinc-100 bg-white p-6 dark:border-zinc-800/40 dark:bg-zinc-900/40">
                            <Sk className="mb-4 h-12 w-28" />
                            <Sk className="mb-2 h-4 w-full" />
                            <Sk className="h-3 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function KidsBannerSkeleton() {
    return (
        <section className="py-20 md:py-28" style={{ background: 'linear-gradient(155deg,#5C2D3A,#704A3B)' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="flex items-center justify-center py-8">
                        <div className="h-52 w-52 rounded-full bg-white/10" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-7 w-44 rounded-full bg-white/20" />
                        <div className="h-11 w-4/5 rounded-xl bg-white/20" />
                        <div className="h-11 w-3/5 rounded-xl bg-white/20" />
                        <div className="h-5 w-full rounded-lg bg-white/15" />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-9 w-32 rounded-full bg-white/20" />
                            ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <div className="h-12 w-44 rounded-2xl bg-white/90" />
                            <div className="h-12 w-40 rounded-2xl bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrendingSkeleton() {
    return (
        <section className="bg-white py-20 dark:bg-[#080F1C] md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SkHeading titleW="w-80" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40">
                            <Sk className="h-44 w-full rounded-none" />
                            <div className="space-y-3 p-5">
                                <Sk className="h-5 w-3/4" />
                                <Sk className="h-4 w-full" />
                                <Sk className="h-4 w-2/3" />
                                <div className="flex items-center justify-between pt-2">
                                    <Sk className="h-7 w-20" />
                                    <Sk className="h-9 w-32 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhySkeleton() {
    return (
        <LightSection>
            <SkHeading titleW="w-80" subtitleW="w-72" />
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-4">
                    <div className="h-52 rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                    <div className="h-52 rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                </div>
                <div className="min-h-[432px] rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                <div className="space-y-4">
                    <div className="h-52 rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                    <div className="h-52 rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                </div>
            </div>
        </LightSection>
    );
}

function TestimonialsSkeleton() {
    return (
        <section className="py-20 md:py-28" style={{ background: 'linear-gradient(160deg,#0C1A2E,#112240)' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-5 h-7 w-44 rounded-full bg-white/10" />
                    <div className="mx-auto mb-3 h-11 w-80 rounded-xl bg-white/10" />
                    <div className="mx-auto h-5 w-64 rounded-lg bg-white/[0.07]" />
                </div>
                <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                    {[160, 210, 185, 230, 175, 200].map((h, i) => (
                        <div key={i} className="mb-5 break-inside-avoid rounded-3xl bg-white/[0.06]" style={{ height: h }} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PartnersSkeleton() {
    return (
        <section className="overflow-hidden bg-white py-10 dark:bg-[#080F1C]">
            <div className="flex items-center gap-12 px-8">
                {[...Array(7)].map((_, i) => (
                    <Sk key={i} className="h-8 w-28 shrink-0" />
                ))}
            </div>
        </section>
    );
}

function ReferralSkeleton() {
    return (
        <LightSection>
            <SkHeading titleW="w-80" />
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="h-44 rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                <div className="h-44 rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                ))}
            </div>
        </LightSection>
    );
}

function FaqSkeleton() {
    return (
        <section className="bg-[#FDFAF6] py-20 dark:bg-[#080F1C] md:py-28">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <SkHeading titleW="w-72" subtitleW="w-80" />
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800/40 dark:bg-zinc-900/40" />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FinalCtaSkeleton() {
    return (
        <section className="py-20 md:py-28" style={{ background: 'linear-gradient(145deg,#0C1A2E,#1a2840)' }}>
            <div className="mx-auto max-w-3xl px-4 text-center">
                <div className="mx-auto mb-5 h-7 w-44 rounded-full bg-white/10" />
                <div className="mx-auto mb-3 h-14 w-96 max-w-full rounded-xl bg-white/10" />
                <div className="mx-auto mb-8 h-5 w-80 max-w-full rounded-lg bg-white/[0.07]" />
                <div className="flex justify-center gap-4">
                    <div className="h-14 w-48 rounded-2xl bg-white/25" />
                    <div className="h-14 w-44 rounded-2xl bg-white/12" />
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */

export default function HomePage() {
    const [consultClass, setConsultClass] = useState<CourseClass | null>(null);
    const [cartItems, setCartItems]       = useState<CourseClass[]>([]);
    const [cartOpen, setCartOpen]         = useState(false);

    // Preload ConsultModal chunk 2s after mount so it's ready on first click
    useEffect(() => {
        const tid = window.setTimeout(() => {
            void import('@/components/marketing/home/consult-modal');
        }, 2000);
        return () => window.clearTimeout(tid);
    }, []);

    function handleAddCart(cls: CourseClass) {
        setCartItems((prev) => {
            if (prev.some((c) => c.id === cls.id)) return prev;
            const next = [...prev, cls];
            localStorage.setItem('panda-cart', JSON.stringify(next));
            window.dispatchEvent(new CustomEvent('panda-cart-changed'));
            return next;
        });
        setCartOpen(true);
    }

    function handleRemoveCart(id: number) {
        setCartItems((prev) => {
            const next = prev.filter((c) => c.id !== id);
            localStorage.setItem('panda-cart', JSON.stringify(next));
            window.dispatchEvent(new CustomEvent('panda-cart-changed'));
            return next;
        });
    }

    return (
        <>
            <Head title="Belajar Bahasa Mandarin Terbaik di Indonesia" />

            <style>{`
                @keyframes float    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(2deg)} }
                @keyframes wave     { 0%,100%{height:20%} 50%{height:100%} }
                @keyframes marquee  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shimmer  { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
                .sk {
                    background: linear-gradient(90deg,#eee9e3 25%,#e4ddd7 50%,#eee9e3 75%);
                    background-size: 1600px 100%;
                    animation: shimmer 2s ease-in-out infinite;
                }
                .dark .sk {
                    background: linear-gradient(90deg,#18243a 25%,#243044 50%,#18243a 75%);
                    background-size: 1600px 100%;
                }
            `}</style>

            {/* ── Above fold: eager — no IntersectionObserver ── */}
            <HeroSection />

            {/* ── Below fold: lazy-loaded + skeleton ─────────── */}

            <LazySection fallback={<StatsSkeleton />} rootMargin="800px 0px">
                <StatsSection />
            </LazySection>

            <LazySection fallback={<KidsBannerSkeleton />}>
                <KidsBanner />
            </LazySection>

            <LazySection fallback={<TrendingSkeleton />}>
                <TrendingSection onConsult={setConsultClass} onAddCart={handleAddCart} />
            </LazySection>

            <LazySection fallback={<WhySkeleton />}>
                <WhySection />
            </LazySection>

            <LazySection fallback={<TestimonialsSkeleton />}>
                <TestimonialsSection />
            </LazySection>

            <LazySection fallback={<PartnersSkeleton />}>
                <PartnersMarquee />
            </LazySection>

            <LazySection fallback={<ReferralSkeleton />}>
                <ReferralSection />
            </LazySection>

            <LazySection fallback={<FaqSkeleton />}>
                <FaqSection />
            </LazySection>

            <LazySection fallback={<FinalCtaSkeleton />}>
                <FinalCta />
            </LazySection>

            {/* ── Modals: render only when triggered ── */}
            {consultClass && (
                <Suspense fallback={null}>
                    <ConsultModal cls={consultClass} onClose={() => setConsultClass(null)} />
                </Suspense>
            )}

            <Suspense fallback={null}>
                <CartDrawer
                    open={cartOpen}
                    items={cartItems}
                    onClose={() => setCartOpen(false)}
                    onRemove={handleRemoveCart}
                />
            </Suspense>
        </>
    );
}

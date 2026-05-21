'use client';

import { useEffect, useState } from 'react';
import MarketingNavbar from '@/components/marketing/navbar';
import MarketingFooter from '@/components/marketing/footer';

function WhatsAppFloat() {
    return (
        <a
            href="https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Admin+Panda%2C+saya+ingin+konsultasi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi admin via WhatsApp"
            className="
                group fixed bottom-6 right-6 z-50
                flex h-14 w-14 items-center justify-center
                rounded-2xl text-white shadow-2xl
                transition-all duration-300
                hover:scale-110 hover:rounded-3xl hover:shadow-green-500/40
            "
            style={{ background: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,0.35)' }}
        >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl bg-green-400 opacity-30 animate-ping group-hover:animate-none" />
            <svg className="relative h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
            </svg>
        </a>
    );
}

function MobileStickyBar() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden"
            style={{
                background: 'rgba(250,247,242,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid #e4e4e7',
            }}
        >
            <div className="mx-auto flex max-w-sm gap-2">
                <a
                    href="/classes"
                    className="flex-1 rounded-xl bg-zinc-900 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                >
                    Lihat Kelas
                </a>
                <a
                    href="https://api.whatsapp.com/send/?phone=6289508275782"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ background: '#25D366' }}
                    aria-label="WhatsApp"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode]   = useState(false);
    const [cartCount, setCartCount] = useState(0);

    function syncCartCount() {
        try {
            const raw = localStorage.getItem('panda-cart');
            const items = raw ? JSON.parse(raw) : [];
            setCartCount(Array.isArray(items) ? items.length : 0);
        } catch { setCartCount(0); }
    }

    // Initialise from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('panda-dark');
        const enabled = stored !== null ? stored === 'true' : false;
        setDarkMode(enabled);
        document.documentElement.classList.toggle('dark', enabled);

        syncCartCount();
        window.addEventListener('panda-cart-changed', syncCartCount);
        return () => window.removeEventListener('panda-cart-changed', syncCartCount);
    }, []);

    function toggleDark() {
        const next = !darkMode;
        setDarkMode(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('panda-dark', String(next));
    }

    return (
        <div className="flex min-h-screen flex-col bg-stone-50 dark:bg-zinc-950">
            <MarketingNavbar darkMode={darkMode} toggleDark={toggleDark} cartCount={cartCount} />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <MarketingFooter />

            {/* Floating WhatsApp — desktop */}
            <WhatsAppFloat />

            {/* Sticky bottom bar — mobile only */}
            <MobileStickyBar />
        </div>
    );
}

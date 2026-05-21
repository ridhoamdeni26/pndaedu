'use client';

import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourseClass } from '@/types/home';
import { fmtRp } from './utils';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CartDrawerProps {
    open: boolean;
    items: CourseClass[];
    onClose: () => void;
    onRemove: (id: number) => void;
}

export function CartDrawer({ open, items, onClose, onRemove }: CartDrawerProps) {
    const total = items.reduce((sum, c) => sum + c.price, 0);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    function handleCheckout() {
        localStorage.setItem('panda-cart', JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('panda-cart-changed'));
        window.location.href = '/checkout';
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer panel */}
                    <motion.div
                        key="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.38, ease: EASE }}
                        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col shadow-2xl"
                        style={{ background: '#FDFAF6' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">🛒</span>
                                <h2 className="text-lg font-bold text-zinc-900">Keranjang Belanja</h2>
                                <AnimatePresence>
                                    {items.length > 0 && (
                                        <motion.span
                                            key={items.length}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                                        >
                                            {items.length}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Items list */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <AnimatePresence mode="popLayout">
                                {items.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center gap-3 py-16 text-center"
                                    >
                                        <motion.span
                                            animate={{ rotate: [-8, 8, -5, 0] }}
                                            transition={{ duration: 1.2, delay: 0.2 }}
                                            className="text-6xl"
                                        >
                                            🛒
                                        </motion.span>
                                        <p className="text-zinc-500">Keranjang masih kosong</p>
                                        <p className="text-sm text-zinc-400">Tambahkan kelas favoritmu!</p>
                                        <Link
                                            href="/classes"
                                            onClick={onClose}
                                            className="mt-2 inline-block rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                                        >
                                            Pilih Kelas
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -32, scale: 0.92, height: 0, marginBottom: 0 }}
                                                transition={{ duration: 0.3, ease: EASE }}
                                                className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm"
                                            >
                                                {/* Thumbnail */}
                                                <div
                                                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                                                    style={{ background: `linear-gradient(135deg,${item.thumbFrom},${item.thumbTo})` }}
                                                >
                                                    <span
                                                        className="font-bold leading-none"
                                                        style={{ fontFamily: "'Noto Serif SC',serif", fontSize: '28px', color: 'rgba(255,255,255,0.75)' }}
                                                    >
                                                        {item.hanzi}
                                                    </span>
                                                </div>

                                                {/* Info */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[13px] font-bold text-zinc-900">{item.title}</p>
                                                    <p className="text-[11px] text-zinc-500">
                                                        {item.level} · {item.type === 'online' ? '🌐 Online' : '🏫 Offline'}
                                                    </p>
                                                    <p className="mt-1 text-[13px] font-bold text-red-500">{fmtRp(item.price)}</p>
                                                </div>

                                                {/* Remove button */}
                                                <motion.button
                                                    onClick={() => onRemove(item.id)}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer — total + CTA */}
                        <AnimatePresence>
                            {items.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 16 }}
                                    transition={{ duration: 0.28, ease: EASE }}
                                    className="border-t border-zinc-200 bg-white px-5 py-4"
                                >
                                    {/* Summary */}
                                    <div className="mb-4 space-y-1.5 rounded-xl bg-zinc-50 p-3">
                                        <div className="flex items-center justify-between text-sm text-zinc-500">
                                            <span>Subtotal ({items.length} kelas)</span>
                                            <span className="font-bold text-zinc-900">{fmtRp(total)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-zinc-400">
                                            <span>Kode referral</span>
                                            <span className="italic">Di halaman checkout</span>
                                        </div>
                                        <div className="mt-2 border-t border-zinc-200 pt-2 flex items-center justify-between font-bold">
                                            <span className="text-sm text-zinc-800">Total</span>
                                            <span
                                                className="text-base"
                                                style={{ background: 'linear-gradient(135deg,#E63946,#D4A574)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                            >
                                                {fmtRp(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleCheckout}
                                        className="w-full rounded-2xl bg-red-500 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-red-500/25 transition-all"
                                        whileHover={{ scale: 1.015, boxShadow: '0 8px 28px rgba(230,57,70,0.4)' }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Lanjut ke Checkout →
                                    </motion.button>
                                    <button
                                        onClick={onClose}
                                        className="mt-2.5 w-full py-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-600"
                                    >
                                        Lanjut Belanja
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

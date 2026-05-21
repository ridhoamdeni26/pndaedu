'use client';

import { memo, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourseClass } from '@/types/home';
import { fmtRp } from '@/components/marketing/home/utils';
import { CLASSES } from '@/data/home';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Steps ─────────────────────────────────────────────────── */

const STEPS = [
    { id: 1, label: 'Keranjang',  icon: '🛒' },
    { id: 2, label: 'Data Diri',  icon: '👤' },
    { id: 3, label: 'Pembayaran', icon: '💳' },
    { id: 4, label: 'Konfirmasi', icon: '✅' },
] as const;

/* ─── Payment methods (Tripay / Duitku channels) ──────────────── */

interface PaymentMethod {
    id: string;
    label: string;
    icon: string;
    detail: string;
    badge?: string;
}

interface PaymentGroup {
    group: string;
    icon: string;
    methods: PaymentMethod[];
}

const PAYMENT_GROUPS: PaymentGroup[] = [
    {
        group: 'Virtual Account',
        icon: '🏦',
        methods: [
            { id: 'BCAVA',     label: 'BCA VA',     icon: '🔵', detail: 'BCA Virtual Account — otomatis terkonfirmasi' },
            { id: 'BRIVA',     label: 'BRI VA',     icon: '🔵', detail: 'BRI Virtual Account — otomatis terkonfirmasi' },
            { id: 'MANDIRIVA', label: 'Mandiri VA',  icon: '🔵', detail: 'Mandiri Virtual Account — otomatis terkonfirmasi' },
            { id: 'BNIVA',     label: 'BNI VA',     icon: '🔵', detail: 'BNI Virtual Account — otomatis terkonfirmasi' },
            { id: 'PERMATAVA', label: 'Permata VA',  icon: '🔵', detail: 'Permata Virtual Account — otomatis terkonfirmasi' },
        ],
    },
    {
        group: 'QRIS & E-Wallet',
        icon: '📱',
        methods: [
            { id: 'QRIS',      label: 'QRIS',       icon: '📷', detail: 'Scan QR — semua e-wallet & m-banking', badge: 'Populer' },
            { id: 'OVO',       label: 'OVO',        icon: '💜', detail: 'Bayar langsung dari aplikasi OVO' },
            { id: 'DANA',      label: 'DANA',       icon: '💙', detail: 'Bayar langsung dari aplikasi DANA' },
            { id: 'SHOPEEPAY', label: 'ShopeePay',  icon: '🧡', detail: 'Bayar langsung dari ShopeePay' },
            { id: 'LINKAJA',   label: 'LinkAja',    icon: '❤️', detail: 'Bayar langsung dari LinkAja' },
        ],
    },
    {
        group: 'Gerai Retail',
        icon: '🏪',
        methods: [
            { id: 'ALFAMART',  label: 'Alfamart',   icon: '🏪', detail: 'Bayar tunai di kasir Alfamart / Alfamidi' },
            { id: 'INDOMARET', label: 'Indomaret',  icon: '🏪', detail: 'Bayar tunai di kasir Indomaret' },
        ],
    },
];

/* ─── Referral Codes ─────────────────────────────────────────── */

interface ReferralCode { pct: number; label: string; desc: string; owner: string }

const REFERRAL_CODES: Record<string, ReferralCode> = {
    'PANDA10':  { pct: 10, label: '10% Off', desc: 'Diskon standar referral teman',    owner: 'Program Referral Umum' },
    'PANDA15':  { pct: 15, label: '15% Off', desc: 'Diskon untuk member lama',         owner: 'Program Loyalitas' },
    'PANDA20':  { pct: 20, label: '20% Off', desc: 'Diskon spesial batch pembukaan',   owner: 'Promo Batch Baru' },
    'FRIEND5':  { pct: 5,  label: '5% Off',  desc: 'Diskon referral pertama kali',     owner: 'Referral Pemula' },
    'NEWPANDA': { pct: 25, label: '25% Off', desc: 'Diskon khusus siswa baru',         owner: 'Welcome Bonus' },
};

/* ─── Skeleton ───────────────────────────────────────────────── */

const CartSkeleton = memo(function CartSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="mb-5 h-5 w-36 rounded-full bg-zinc-200" />
            <div className="space-y-3">
                {[0, 1].map(i => (
                    <div key={i} className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                        <div className="h-16 w-16 shrink-0 rounded-xl bg-zinc-200" />
                        <div className="flex-1 space-y-2.5 py-1">
                            <div className="h-4 w-3/4 rounded-full bg-zinc-200" />
                            <div className="h-3 w-1/2 rounded-full bg-zinc-200" />
                            <div className="h-4 w-1/4 rounded-full bg-zinc-200" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 space-y-3">
                <div className="h-[90px] rounded-2xl bg-zinc-100" />
                <div className="h-[76px] rounded-2xl bg-zinc-100" />
            </div>
        </div>
    );
});

/* ─── Helpers ─────────────────────────────────────────────────── */

function StepDot({ step, current }: { step: typeof STEPS[number]; current: number }) {
    const done   = step.id < current;
    const active = step.id === current;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                {active && (
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ scale: [1, 1.65, 1], opacity: [0.45, 0, 0.45] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ background: 'rgba(230,57,70,0.35)' }}
                    />
                )}
                <motion.div
                    animate={{ scale: active ? 1.08 : 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-base shadow-md sm:h-12 sm:w-12 sm:text-lg"
                    style={{
                        background: done
                            ? 'linear-gradient(135deg,#10b981,#34d399)'
                            : active
                            ? 'linear-gradient(135deg,#E63946,#c0303b)'
                            : '#e4e4e7',
                        boxShadow: active
                            ? '0 6px 20px rgba(230,57,70,0.4)'
                            : done
                            ? '0 4px 14px rgba(16,185,129,0.35)'
                            : '0 2px 6px rgba(0,0,0,0.06)',
                        color: done || active ? 'white' : '#a1a1aa',
                    }}
                >
                    {done ? (
                        <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="text-base font-black"
                        >✓</motion.span>
                    ) : (
                        <span>{step.icon}</span>
                    )}
                </motion.div>
            </div>
            <span className={`font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                active ? 'text-red-500' : done ? 'text-emerald-500' : 'text-zinc-400'
            }`}>
                {step.label}
            </span>
        </div>
    );
}

/* ─── Step 1: Cart ───────────────────────────────────────────── */

function StepCart({
    items,
    appliedCode,
    onApplyCode,
    subtotal,
    discountAmt,
    total,
    onRemove,
    onNext,
}: {
    items: CourseClass[];
    appliedCode: string | null;
    onApplyCode: (code: string | null) => void;
    subtotal: number;
    discountAmt: number;
    total: number;
    onRemove: (id: number) => void;
    onNext: () => void;
}) {
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState('');

    const referralInfo = appliedCode ? REFERRAL_CODES[appliedCode] : null;

    function handleApply() {
        const code = codeInput.trim().toUpperCase();
        if (!code) return;
        if (REFERRAL_CODES[code]) {
            onApplyCode(code);
            setCodeError('');
            setCodeInput('');
        } else {
            setCodeError('Kode referral tidak valid atau sudah kadaluarsa.');
        }
    }

    if (items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-20 text-center"
            >
                <span className="text-7xl">🛒</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Keranjang kosong</h3>
                <p className="text-zinc-500">Pilih kelas dulu sebelum checkout.</p>
                <Link
                    href="/"
                    className="mt-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                    ← Kembali Pilih Kelas
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <h3 className="mb-5 text-lg font-bold text-zinc-900 dark:text-zinc-100">Kelas yang dipilih</h3>

            <div className="space-y-3">
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.28, ease: EASE }}
                            className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0F1E38]"
                        >
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                                style={{ background: `linear-gradient(135deg,${item.thumbFrom},${item.thumbTo})` }}
                            >
                                <span
                                    className="font-bold leading-none"
                                    style={{ fontFamily: "'Noto Serif SC',serif", fontSize: '26px', color: 'rgba(255,255,255,0.8)' }}
                                >
                                    {item.hanzi}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</p>
                                <p className="text-sm text-zinc-500">{item.level} · {item.type === 'online' ? '🌐 Online' : '🏫 Offline'}</p>
                                <p className="mt-1 font-bold text-red-500">{fmtRp(item.price)}</p>
                            </div>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Referral code */}
            <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    🎁 Kode Referral (opsional)
                </label>

                <AnimatePresence mode="wait">
                    {referralInfo ? (
                        /* Applied state */
                        <motion.div
                            key="applied"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-lg">✅</span>
                                <div>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        {appliedCode} — {referralInfo.label}
                                    </p>
                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-500">{referralInfo.owner}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onApplyCode(null)}
                                className="text-[11px] font-semibold text-emerald-600 underline hover:text-red-500 dark:text-emerald-400"
                            >
                                Hapus
                            </button>
                        </motion.div>
                    ) : (
                        /* Input state */
                        <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={codeInput}
                                    onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeError(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                                    placeholder="Masukkan kode referral"
                                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-amber-400/40 dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-100"
                                />
                                <motion.button
                                    onClick={handleApply}
                                    whileTap={{ scale: 0.96 }}
                                    className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-500"
                                >
                                    Pakai
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {codeError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-1.5 text-xs text-red-500"
                                    >
                                        ⚠️ {codeError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <p className="mt-2 text-xs text-zinc-400">Gunakan kode dari teman atau program referral Panda.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Order summary + total */}
            <div className="mt-6 rounded-2xl bg-zinc-50 p-4 dark:bg-slate-900/40">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-zinc-500">
                        <span>Subtotal ({items.length} kelas)</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{fmtRp(subtotal)}</span>
                    </div>

                    <AnimatePresence>
                        {referralInfo && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50 px-3 py-2 dark:border-emerald-800/30 dark:bg-emerald-950/15">
                                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                                        🎁 <span>Diskon Referral <span className="font-bold">{referralInfo.pct}%</span> ({appliedCode})</span>
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">− {fmtRp(discountAmt)}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
                        <div className="flex items-center justify-between">
                            <div>
                                {referralInfo && (
                                    <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                        Hemat {fmtRp(discountAmt)}!
                                    </p>
                                )}
                                <p className={`font-black ${referralInfo ? 'text-2xl text-emerald-700 dark:text-emerald-300' : 'text-2xl text-zinc-900 dark:text-zinc-100'}`}>
                                    {fmtRp(total)}
                                </p>
                            </div>
                            <motion.button
                                onClick={onNext}
                                className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Lanjut →
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Step 2: Data Diri ───────────────────────────────────────── */

interface FormData {
    name: string;
    email: string;
    phone: string;
    parentName: string;
    notes: string;
}

function StepDataDiri({
    form,
    setForm,
    hasKids,
    onNext,
    onBack,
}: {
    form: FormData;
    setForm: (f: FormData) => void;
    hasKids: boolean;
    onNext: () => void;
    onBack: () => void;
}) {
    const valid = form.name.trim() && form.email.trim() && form.phone.trim();

    function update(key: keyof FormData, value: string) {
        setForm({ ...form, [key]: value });
    }

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">Data diri peserta</h3>

            {/* Auto-account creation notice */}
            <div className="mb-5 flex gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 dark:border-indigo-900/30 dark:from-indigo-950/20 dark:to-blue-950/20">
                <span className="mt-0.5 shrink-0 text-xl">🔐</span>
                <div>
                    <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300">Akun login dibuat otomatis</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-indigo-600 dark:text-indigo-400">
                        Setelah pembayaran dikonfirmasi, akun kamu dibuat dan dikirim ke email di bawah — beserta <strong>kode referral unik</strong> milikmu.
                        Tidak perlu daftar dulu!
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-100"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-100"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-semibold text-zinc-700 dark:border-slate-700 dark:bg-slate-800 dark:text-zinc-300">
                            🇮🇩 +62
                        </div>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update('phone', e.target.value)}
                            placeholder="8xx xxxx xxxx"
                            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-100"
                        />
                    </div>
                </div>

                {hasKids && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Nama Orang Tua / Wali
                        </label>
                        <input
                            value={form.parentName}
                            onChange={(e) => update('parentName', e.target.value)}
                            placeholder="Untuk kelas Kids"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-100"
                        />
                    </motion.div>
                )}

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Catatan (opsional)
                    </label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        rows={3}
                        placeholder="Ada hal yang ingin disampaikan ke admin?"
                        className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-[#0F1E38] dark:text-zinc-100"
                    />
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={onBack}
                    className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    ← Kembali
                </button>
                <motion.button
                    onClick={onNext}
                    disabled={!valid}
                    className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 disabled:opacity-50"
                    whileHover={valid ? { scale: 1.01 } : {}}
                    whileTap={valid ? { scale: 0.97 } : {}}
                >
                    Lanjut ke Pembayaran →
                </motion.button>
            </div>
        </motion.div>
    );
}

/* ─── Step 3: Pembayaran ─────────────────────────────────────── */

function StepPembayaran({
    payMethod,
    setPayMethod,
    subtotal,
    discountAmt,
    appliedCode,
    total,
    onNext,
    onBack,
}: {
    payMethod: string;
    setPayMethod: (v: string) => void;
    subtotal: number;
    discountAmt: number;
    appliedCode: string | null;
    total: number;
    onNext: () => void;
    onBack: () => void;
}) {
    const selectedMethod = PAYMENT_GROUPS.flatMap((g) => g.methods).find((m) => m.id === payMethod);

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Pilih metode pembayaran</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">Diproses via <span className="font-semibold text-zinc-700 dark:text-zinc-300">Tripay</span> / <span className="font-semibold text-zinc-700 dark:text-zinc-300">Duitku</span> — aman & terenkripsi</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                    🔒 SSL
                </div>
            </div>

            <div className="space-y-4">
                {PAYMENT_GROUPS.map((grp) => (
                    <div key={grp.group}>
                        <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                            <span>{grp.icon}</span>
                            <span>{grp.group}</span>
                        </p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {grp.methods.map((pm) => {
                                const selected = payMethod === pm.id;
                                return (
                                    <motion.button
                                        key={pm.id}
                                        onClick={() => setPayMethod(pm.id)}
                                        whileTap={{ scale: 0.94 }}
                                        className="relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all"
                                        style={{
                                            borderColor: selected ? '#E63946' : 'rgba(228,228,231,0.8)',
                                            background: selected ? 'rgba(230,57,70,0.04)' : 'white',
                                            boxShadow: selected ? '0 0 0 2px rgba(230,57,70,0.2), 0 4px 12px rgba(230,57,70,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        {selected && (
                                            <motion.div
                                                layoutId="pay-check"
                                                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm"
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            >
                                                ✓
                                            </motion.div>
                                        )}
                                        {pm.badge && (
                                            <span className="absolute -left-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[8px] font-bold leading-none text-white">
                                                {pm.badge}
                                            </span>
                                        )}
                                        <span className="text-xl leading-none">{pm.icon}</span>
                                        <span className="text-[10px] font-bold leading-tight text-zinc-800 dark:text-zinc-200">{pm.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected method detail */}
            <AnimatePresence>
                {selectedMethod && (
                    <motion.div
                        key={selectedMethod.id}
                        initial={{ opacity: 0, y: 8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="mt-4 overflow-hidden rounded-2xl border border-red-100 bg-red-50/50 p-3.5 dark:border-red-900/30 dark:bg-red-950/10"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl">{selectedMethod.icon}</span>
                            <div>
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{selectedMethod.label}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{selectedMethod.detail}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-5 space-y-1.5 rounded-2xl bg-zinc-50 p-4 dark:bg-slate-900/40">
                {discountAmt > 0 && (
                    <>
                        <div className="flex items-center justify-between text-sm text-zinc-500">
                            <span>Subtotal</span>
                            <span>{fmtRp(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                            <span>🎁 Diskon {REFERRAL_CODES[appliedCode!]?.pct}% ({appliedCode})</span>
                            <span className="font-semibold">− {fmtRp(discountAmt)}</span>
                        </div>
                        <div className="border-t border-zinc-200 pt-1.5 dark:border-zinc-700" />
                    </>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">Total Pembayaran</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">{fmtRp(total)}</span>
                </div>
            </div>

            <div className="mt-5 flex gap-3">
                <button
                    onClick={onBack}
                    className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    ← Kembali
                </button>
                <motion.button
                    onClick={onNext}
                    disabled={!payMethod}
                    className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 disabled:opacity-50"
                    whileHover={payMethod ? { scale: 1.01 } : {}}
                    whileTap={payMethod ? { scale: 0.97 } : {}}
                >
                    Konfirmasi Pesanan →
                </motion.button>
            </div>
        </motion.div>
    );
}

/* ─── Step 4: Konfirmasi ─────────────────────────────────────── */

function StepKonfirmasi({
    items,
    form,
    payMethod,
    subtotal,
    discountAmt,
    appliedCode,
    total,
}: {
    items: CourseClass[];
    form: FormData;
    payMethod: string;
    subtotal: number;
    discountAmt: number;
    appliedCode: string | null;
    total: number;
}) {
    const pm = PAYMENT_GROUPS.flatMap((g) => g.methods).find((p) => p.id === payMethod);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex flex-col items-center gap-6 py-4 text-center"
        >
            {/* Success animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', boxShadow: '0 0 40px rgba(16,185,129,0.35)' }}
            >
                <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl"
                >
                    ✓
                </motion.span>
            </motion.div>

            <div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Pesanan Berhasil! 🎉</h3>
                <p className="mt-1 text-zinc-500">
                    Admin kami akan segera menghubungi kamu via WhatsApp.
                </p>
            </div>

            {/* Order summary */}
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 text-left dark:border-slate-700 dark:bg-[#0F1E38]">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Ringkasan Pesanan</p>
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-zinc-700 dark:text-zinc-300">{item.title}</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{fmtRp(item.price)}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-slate-700 space-y-1.5">
                    {discountAmt > 0 && (
                        <>
                            <div className="flex items-center justify-between text-sm text-zinc-500">
                                <span>Subtotal</span>
                                <span>{fmtRp(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                                <span>🎁 Diskon {REFERRAL_CODES[appliedCode!]?.pct}% ({appliedCode})</span>
                                <span className="font-semibold">− {fmtRp(discountAmt)}</span>
                            </div>
                        </>
                    )}
                    <div className="flex items-center justify-between font-bold">
                        <span className="text-zinc-800 dark:text-zinc-200">Total Bayar</span>
                        <span className="text-red-500">{fmtRp(total)}</span>
                    </div>
                </div>
            </div>

            {/* Recipient info */}
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 text-left dark:border-slate-700 dark:bg-[#0F1E38]">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Data Peserta</p>
                <div className="space-y-1.5 text-sm">
                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-zinc-500">Nama</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{form.name}</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-zinc-500">Email</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{form.email}</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-zinc-500">WhatsApp</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">+62{form.phone}</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-zinc-500">Pembayaran</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{pm?.icon} {pm?.label}</span>
                    </div>
                </div>
            </div>

            {/* Timeline next steps */}
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 text-left dark:border-slate-700 dark:bg-[#0F1E38]">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Apa yang terjadi selanjutnya</p>
                <div className="space-y-4">
                    {([
                        { icon: '📸', col: 'bg-zinc-100 text-zinc-600', title: 'Simpan bukti pendaftaran', desc: 'Screenshot halaman ini sebagai bukti pesananmu' },
                        { icon: '💬', col: 'bg-green-100 text-green-700', title: 'Admin menghubungi via WhatsApp', desc: 'Dalam 1×24 jam, instruksi pembayaran akan dikirim' },
                        { icon: '💳', col: 'bg-blue-100 text-blue-700', title: 'Lakukan pembayaran', desc: 'Transfer sesuai instruksi dan kirim bukti bayar' },
                        { icon: '📧', col: 'bg-purple-100 text-purple-700', title: 'Akun + kode referral dikirim ke email', desc: `Username, password, dan kode referral unik dikirim ke ${form.email}` },
                        { icon: '🎓', col: 'bg-red-100 text-red-600', title: 'Akses kelas tersedia di dashboard', desc: 'Login dan mulai belajar Mandarin kapan saja!' },
                    ] as const).map((item, i) => (
                        <div key={i} className="flex gap-3">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${item.col}`}>{item.icon}</div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</p>
                                <p className="text-[11px] text-zinc-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral teaser */}
            <div className="w-full rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-5 text-left dark:border-amber-800/30 dark:from-amber-950/20 dark:to-yellow-950/20">
                <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <p className="font-bold text-amber-800 dark:text-amber-300">Kode Referral Menunggumu!</p>
                </div>
                <p className="text-[12px] leading-relaxed text-amber-700 dark:text-amber-400">
                    Setelah akun aktif, kamu mendapat kode referral unik. Bagikan ke teman —{' '}
                    <strong>setiap teman yang daftar, kamu dapat bonus!</strong>
                </p>
                <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-white/60 px-4 py-2.5 dark:border-amber-800/30 dark:bg-white/5">
                    <span className="font-mono text-[15px] tracking-widest text-amber-400">••••••••</span>
                    <span className="text-[11px] text-amber-500">Kode dikirim ke {form.email}</span>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:flex-row">
                <a
                    href={`https://api.whatsapp.com/send/?phone=6289508275782&text=Halo+Admin+Panda%2C+saya+${encodeURIComponent(form.name)}+baru+saja+melakukan+pendaftaran+kelas+via+website.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-2xl py-3 text-center text-sm font-bold text-white transition-colors"
                    style={{ background: '#25D366' }}
                >
                    💬 Chat Admin WhatsApp
                </a>
                <Link
                    href="/"
                    className="flex-1 rounded-2xl border border-zinc-200 py-3 text-center text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    ← Kembali ke Beranda
                </Link>
            </div>
        </motion.div>
    );
}

/* ─── Main Checkout Page ─────────────────────────────────────── */

export default function CheckoutPage() {
    const [step, setStep]           = useState(1);
    const [items, setItems]         = useState<CourseClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [payMethod, setPayMethod] = useState('');
    const [form, setForm]           = useState<FormData>({
        name: '', email: '', phone: '', parentName: '', notes: '',
    });

    const subtotal   = items.reduce((s, c) => s + c.price, 0);
    const discountAmt = appliedCode ? Math.round(subtotal * (REFERRAL_CODES[appliedCode]?.pct ?? 0) / 100) : 0;
    const total      = subtotal - discountAmt;
    const hasKids    = items.some((c) => c.cat === 'kids');

    useEffect(() => {
        try {
            const stored: CourseClass[] = (() => {
                const raw = localStorage.getItem('panda-cart');
                return raw ? (JSON.parse(raw) as CourseClass[]) : [];
            })();

            const classParam = new URLSearchParams(window.location.search).get('class');
            if (classParam) {
                const id = parseInt(classParam, 10);
                const cls = CLASSES.find(c => c.id === id);
                if (cls && !stored.some(c => c.id === id)) {
                    const merged = [...stored, cls];
                    localStorage.setItem('panda-cart', JSON.stringify(merged));
                    window.dispatchEvent(new CustomEvent('panda-cart-changed'));
                    setItems(merged);
                    setIsLoading(false);
                    return;
                }
            }

            if (stored.length) setItems(stored);
        } catch { /* ignore */ }
        setIsLoading(false);
    }, []);

    function removeItem(id: number) {
        const next = items.filter((c) => c.id !== id);
        setItems(next);
        localStorage.setItem('panda-cart', JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('panda-cart-changed'));
    }

    return (
        <>
            <Head title="Checkout — Panda Mandarin" />

            <style>{`
                @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
                @keyframes drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.04)} 66%{transform:translate(-20px,15px) scale(0.97)} }
            `}</style>

            <div className="relative min-h-screen overflow-x-hidden pb-20 pt-10 md:pt-14"
                style={{ background: 'linear-gradient(160deg,#FDF8F3 0%,#FDFAF6 45%,#F9F4EE 100%)' }}
            >
                {/* Animated background blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute right-0 top-0 h-[520px] w-[520px] -translate-y-1/4 translate-x-1/4 rounded-full opacity-[0.22]"
                        style={{ background: 'radial-gradient(circle,rgba(230,57,70,0.35),transparent 65%)', filter: 'blur(80px)', animation: 'drift 18s ease-in-out infinite' }}
                    />
                    <div className="absolute bottom-0 left-0 h-[420px] w-[420px] translate-y-1/4 -translate-x-1/4 rounded-full opacity-[0.18]"
                        style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.4),transparent 65%)', filter: 'blur(72px)', animation: 'drift 22s ease-in-out infinite 7s' }}
                    />
                    <div className="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full opacity-[0.12]"
                        style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.3),transparent 65%)', filter: 'blur(64px)', animation: 'drift 26s ease-in-out infinite 13s' }}
                    />
                </div>

                {/* Dot grid */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.022]"
                    style={{ backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.9) 1px,transparent 1px)', backgroundSize: '26px 26px' }}
                />

                <div className="relative mx-auto max-w-2xl px-4 sm:px-6">

                    {/* ── Hero header ── */}
                    <div className="mb-10 pt-6 text-center md:mb-14 md:pt-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="space-y-4"
                        >
                            {/* Top badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                                className="inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm"
                            >
                                <motion.span
                                    animate={{ rotate: [0, 12, -8, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4 }}
                                    className="text-lg"
                                >🐼</motion.span>
                                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">Panda Mandarin</span>
                                <span className="h-3.5 w-px bg-zinc-300" />
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                    <motion.span
                                        animate={{ scale: [1, 1.4, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                                    />
                                    Aman &amp; Terenkripsi
                                </span>
                            </motion.div>

                            {/* Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                            >
                                <h1 className="text-3xl font-black leading-tight tracking-tight text-zinc-900 md:text-4xl">
                                    Selesaikan{' '}
                                    <span style={{ background: 'linear-gradient(135deg,#E63946,#D4A574)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        Pendaftaran
                                    </span>
                                </h1>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                                    Hanya beberapa langkah lagi — kelas Mandarinmu sudah menunggu! 🎓
                                </p>
                            </motion.div>

                            {/* Security chips */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="flex flex-wrap justify-center gap-2"
                            >
                                {[
                                    { icon: '🔒', text: 'SSL Secure' },
                                    { icon: '⚡', text: 'Konfirmasi Instan' },
                                    { icon: '💬', text: 'Support 24/7' },
                                ].map(c => (
                                    <span key={c.text} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1 text-[11px] font-medium text-zinc-500 shadow-sm backdrop-blur-sm">
                                        {c.icon} {c.text}
                                    </span>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* ── Step indicators ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.45, ease: EASE }}
                        className="mb-8 flex items-center justify-center"
                    >
                        <div className="flex items-center gap-1">
                            {STEPS.map((s, i) => (
                                <div key={s.id} className="flex items-center gap-1">
                                    <StepDot step={s} current={step} />
                                    {i < STEPS.length - 1 && (
                                        <div className="relative mx-0.5 h-1 w-5 overflow-hidden rounded-full bg-zinc-200 sm:mx-1 sm:w-14">
                                            <motion.div
                                                className="absolute inset-y-0 left-0 rounded-full"
                                                style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }}
                                                animate={{ width: step > s.id ? '100%' : '0%' }}
                                                transition={{ duration: 0.55, ease: EASE }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Card */}
                    <div className="rounded-3xl border border-zinc-200/60 bg-white/90 p-6 shadow-xl shadow-black/6 backdrop-blur-sm sm:p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: EASE }}>
                                    {isLoading ? <CartSkeleton /> : (
                                        <StepCart
                                            items={items}
                                            appliedCode={appliedCode}
                                            onApplyCode={setAppliedCode}
                                            subtotal={subtotal}
                                            discountAmt={discountAmt}
                                            total={total}
                                            onRemove={removeItem}
                                            onNext={() => setStep(2)}
                                        />
                                    )}
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: EASE }}>
                                    <StepDataDiri
                                        form={form}
                                        setForm={setForm}
                                        hasKids={hasKids}
                                        onNext={() => setStep(3)}
                                        onBack={() => setStep(1)}
                                    />
                                </motion.div>
                            )}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: EASE }}>
                                    <StepPembayaran
                                        payMethod={payMethod}
                                        setPayMethod={setPayMethod}
                                        subtotal={subtotal}
                                        discountAmt={discountAmt}
                                        appliedCode={appliedCode}
                                        total={total}
                                        onNext={() => setStep(4)}
                                        onBack={() => setStep(2)}
                                    />
                                </motion.div>
                            )}
                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: EASE }}>
                                    <StepKonfirmasi
                                        items={items}
                                        form={form}
                                        payMethod={payMethod}
                                        subtotal={subtotal}
                                        discountAmt={discountAmt}
                                        appliedCode={appliedCode}
                                        total={total}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-[11px] text-zinc-400">
                        🔒 Data kamu dilindungi enkripsi SSL · Terpercaya sejak 2014
                    </p>

                    {/* DEV ONLY — Referral code cheat sheet */}
                    {import.meta.env.DEV && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            className="mt-8 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-5 dark:border-amber-700/50 dark:bg-amber-950/20"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded-md bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                                    DEV ONLY
                                </span>
                                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                                    Kode Referral Tersedia untuk Testing
                                </p>
                            </div>
                            <p className="mb-3 text-[11px] text-amber-600 dark:text-amber-400">
                                Panel ini hanya muncul di mode development dan otomatis hilang saat production build.
                            </p>
                            <div className="space-y-2">
                                {Object.entries(REFERRAL_CODES).map(([code, info]) => (
                                    <div
                                        key={code}
                                        className="flex items-center justify-between rounded-xl border border-amber-200 bg-white px-4 py-2.5 dark:border-amber-800/40 dark:bg-amber-950/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <code className="rounded-lg bg-amber-100 px-2.5 py-1 font-mono text-[13px] font-black tracking-wide text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                                {code}
                                            </code>
                                            <div>
                                                <p className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300">{info.desc}</p>
                                                <p className="text-[10px] text-zinc-400">{info.owner}</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[12px] font-black text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            {info.pct}% Off
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}

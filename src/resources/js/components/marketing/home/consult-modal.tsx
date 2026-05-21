import type { CourseClass } from '@/types/home';
import { fmtDate, fmtRp, seatColor } from './utils';

interface ConsultModalProps {
    cls: CourseClass;
    onClose: () => void;
}

export function ConsultModal({ cls, onClose }: ConsultModalProps) {
    const waMsg = encodeURIComponent(
        `Halo Admin Panda! Saya ingin konsultasi tentang kelas ${cls.title}${cls.batch.no ? ` Batch #${cls.batch.no}` : ''}. Mohon info lebih lanjut.`,
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center" onClick={onClose}>
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                style={{ animation: 'slideUp 0.3s ease-out' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Konsultasi Gratis</p>
                        <p className="text-sm text-zinc-500">{cls.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    >
                        <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-5 space-y-2 rounded-2xl bg-zinc-50 p-4 text-sm dark:bg-zinc-800">
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Kelas</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{cls.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Harga</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{fmtRp(cls.price)}</span>
                    </div>
                    {cls.batch.start && (
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Batch Mulai</span>
                            <span className="text-zinc-900 dark:text-zinc-100">{fmtDate(cls.batch.start)}</span>
                        </div>
                    )}
                    {!cls.isPrivate && (
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Sisa Kursi</span>
                            <span className={`font-semibold ${seatColor(cls.enrolled, cls.maxS)}`}>
                                {cls.enrolled >= cls.maxS ? 'PENUH' : `${cls.maxS - cls.enrolled} kursi`}
                            </span>
                        </div>
                    )}
                </div>

                <p className="mb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Admin Panda siap bantu — metode, jadwal, pembayaran, persiapan belajar. Respon{' '}
                    <strong className="text-zinc-900 dark:text-zinc-100">5–10 menit</strong> (09.00–22.00 WIB).
                </p>

                <a
                    href={`https://api.whatsapp.com/send/?phone=6289508275782&text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: '#25D366' }}
                >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                    Chat WhatsApp Admin
                </a>
                <button onClick={onClose} className="w-full py-2.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
                    Tutup
                </button>
            </div>
        </div>
    );
}

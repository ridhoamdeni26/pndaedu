import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    AnimatePresence, motion, MotionConfig,
    useInView, useMotionValue, useSpring, useTransform,
} from 'framer-motion';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import { Head } from '@inertiajs/react';

/* ─── Dark mode ──────────────────────────────────────────────────────────── */
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

/* ─── Count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, active = false) {
    const [val, setVal] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (!active || started.current) return;
        started.current = true;
        let raf: number;
        let t0: number | null = null;
        const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * e));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [active, target, duration]);
    return val;
}

/* ─── Read counts (localStorage + base) ─────────────────────────────────── */
const BASE_READS: Record<number, number> = {
    1: 2847, 2: 1923, 3: 3412, 4: 1654, 5: 987,
    6: 2103, 7: 4218, 8: 1456, 9: 2891, 10: 1732,
    11: 3156, 12: 891,
};
const TOTAL_BASE = Object.values(BASE_READS).reduce((a, b) => a + b, 0);

function useReadCounts() {
    const [counts, setCounts] = useState<Record<number, number>>(() => ({ ...BASE_READS }));
    useEffect(() => {
        try {
            const inc: Record<number, number> = JSON.parse(localStorage.getItem('panda-reads') ?? '{}');
            const merged: Record<number, number> = {};
            for (const id of Object.keys(BASE_READS)) {
                merged[+id] = (BASE_READS[+id] ?? 0) + (inc[+id] ?? 0);
            }
            setCounts(merged);
        } catch { /* ignore */ }
    }, []);
    const increment = useCallback((id: number) => {
        setCounts(prev => {
            const next = { ...prev, [id]: (prev[id] ?? 0) + 1 };
            try {
                const inc: Record<number, number> = JSON.parse(localStorage.getItem('panda-reads') ?? '{}');
                inc[id] = (inc[id] ?? 0) + 1;
                localStorage.setItem('panda-reads', JSON.stringify(inc));
            } catch { /* ignore */ }
            return next;
        });
    }, []);
    return { counts, increment };
}

/* ─── Lazy section hook ──────────────────────────────────────────────────── */
function useLazySection(margin = '160px') {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        if (shown || !ref.current) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
            { rootMargin: margin }
        );
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [shown, margin]);
    return { ref, shown };
}

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface NewsThumb { from: string; to: string; icon: string; hanzi: string; }
interface NewsItem {
    id: number; title: string; excerpt: string; category: string;
    date: string; author: string; readTime: number; tags: string[];
    thumb: NewsThumb; featured?: boolean; body: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function relTime(d: string) {
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
    if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
    return `${Math.floor(days / 365)} tahun lalu`;
}
function fmtNum(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
}
function renderBody(body: string) {
    return body.split('\n').filter(Boolean).map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
            p.startsWith('**') && p.endsWith('**')
                ? <strong key={j}>{p.slice(2, -2)}</strong>
                : <span key={j}>{p}</span>
        );
        return <p key={i} className="mb-4 leading-relaxed">{parts}</p>;
    });
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const CATEGORIES = [
    { label: 'Semua',        value: 'all',          color: '#6366f1', icon: '📰' },
    { label: 'Prestasi',     value: 'Prestasi',     color: '#f59e0b', icon: '🏆' },
    { label: 'Event',        value: 'Event',        color: '#0ea5e9', icon: '📅' },
    { label: 'Tips Belajar', value: 'Tips Belajar', color: '#10b981', icon: '💡' },
    { label: 'Study Tour',   value: 'Study Tour',   color: '#f43f5e', icon: '✈️' },
    { label: 'Pengumuman',   value: 'Pengumuman',   color: '#8b5cf6', icon: '📢' },
];

const NEWS: NewsItem[] = [
    {
        id: 1,
        title: 'Panda Mandarin Capai 1.200+ Alumni di Seluruh Indonesia',
        excerpt: 'Milestone bersejarah! Panda Mandarin resmi mencatat lebih dari 1.200 alumni aktif yang telah berhasil menguasai bahasa Mandarin dan meraih mimpi mereka.',
        category: 'Prestasi', date: '2024-12-15', author: 'Tim Redaksi Panda', readTime: 4,
        tags: ['Alumni', 'Milestone', 'Mandarin'], featured: true,
        thumb: { from: '#8b5cf6', to: '#4f46e5', icon: '🏆', hanzi: '成功' },
        body: `**Panda Mandarin** dengan bangga mengumumkan pencapaian luar biasa: lebih dari **1.200 alumni aktif** di seluruh Indonesia telah berhasil menyelesaikan program belajar Mandarin kami.

Milestone ini bukan sekadar angka. Setiap alumni mewakili perjalanan panjang, tekad yang kuat, dan keberhasilan menembus batasan bahasa. Dari pelajar SMP hingga profesional muda, dari Sabang sampai Merauke.

**Apa yang membuat pencapaian ini istimewa?**

Alumni kami kini tersebar di berbagai bidang: ada yang berkarir di perusahaan multinasional China, ada yang melanjutkan studi ke Fudan University dan Peking University, ada pula yang membuka bisnis dengan mitra dari Tiongkok.

**Rencana ke depan:** Kami berkomitmen untuk terus meningkatkan kualitas pengajaran dan memperluas jangkauan kami agar lebih banyak generasi muda Indonesia dapat merasakan manfaat belajar bahasa Mandarin bersama Panda.`,
    },
    {
        id: 2,
        title: 'Winter Study Tour 2026: Pendaftaran Resmi Dibuka!',
        excerpt: 'Kesempatan emas untuk merasakan langsung budaya dan bahasa Mandarin di negeri asalnya. Beijing, Shanghai, Hangzhou — tiga kota, satu pengalaman tak terlupakan.',
        category: 'Study Tour', date: '2024-12-10', author: 'Tim Study Tour', readTime: 5,
        tags: ['Study Tour', 'Beijing', 'Shanghai', '2026'],
        thumb: { from: '#f43f5e', to: '#e11d48', icon: '✈️', hanzi: '旅行' },
        body: `Pendaftaran **Winter Study Tour 2026** kini resmi dibuka! Program unggulan Panda Mandarin ini akan membawa peserta ke tiga kota ikonik di Tiongkok.

**Destinasi:**
- **Beijing** — Tembok Besar, Kota Terlarang, Temple of Heaven
- **Shanghai** — The Bund, Yu Garden, museum seni kontemporer
- **Hangzhou** — West Lake, desa teh, suasana China tradisional

**Yang termasuk dalam paket:**
- Akomodasi bintang 4, semua transportasi dalam negeri, makan 3x sehari, guide bilingual, asuransi perjalanan, dan sesi belajar bahasa langsung di lokasi bersejarah.

**Kuota terbatas:** Hanya 25 peserta per batch. Daftarkan diri sekarang melalui WhatsApp admin kami atau datang langsung ke cabang terdekat.`,
    },
    {
        id: 3,
        title: '5 Cara Efektif Belajar Karakter Hanzi untuk Pemula',
        excerpt: 'Karakter Hanzi terlihat rumit? Jangan khawatir! Dengan strategi yang tepat, kamu bisa menguasai ratusan karakter dalam waktu singkat.',
        category: 'Tips Belajar', date: '2024-11-28', author: 'Pengajar Panda', readTime: 6,
        tags: ['Hanzi', 'Tips', 'Pemula', 'Belajar'],
        thumb: { from: '#10b981', to: '#059669', icon: '📝', hanzi: '学习' },
        body: `Belajar karakter Hanzi adalah salah satu tantangan terbesar bagi pemula. Tapi dengan pendekatan yang sistematis, prosesnya bisa jauh lebih menyenangkan.

**1. Mulai dari Radikal Dasar**
Setiap karakter Hanzi terdiri dari komponen yang disebut **radikal**. Pelajari 50-100 radikal dasar terlebih dahulu, dan kamu akan lebih mudah menebak arti karakter baru.

**2. Gunakan Metode Cerita**
Buat cerita lucu atau imajinatif untuk setiap karakter. Misalnya, karakter 明 (míng, terang) terdiri dari 日 (matahari) + 月 (bulan) — "ketika matahari dan bulan bersama, dunia menjadi terang."

**3. Tulis, Tulis, Tulis**
Menulis tangan terbukti jauh lebih efektif daripada mengetik untuk mengingat karakter. Gunakan buku latihan kotak-kotak (方格纸).

**4. Aplikasi Flashcard Digital**
Anki atau Pleco dengan sistem SRS (Spaced Repetition System) sangat membantu mengulang karakter di waktu yang tepat sebelum terlupakan.

**5. Konteks, Bukan Hafalan Murni**
Pelajari karakter dalam konteks kalimat, bukan secara terisolasi. Karakter 好 jauh lebih mudah diingat ketika kamu tahu kalimat 你好！(Halo!)`,
    },
    {
        id: 4,
        title: 'Alumni Panda Raih Beasiswa Penuh ke Fudan University',
        excerpt: 'Bangga! Kevin Pratama, alumni Panda Mandarin angkatan 2022, berhasil meraih beasiswa CSC penuh untuk melanjutkan studi S2 di Fudan University, Shanghai.',
        category: 'Prestasi', date: '2024-10-22', author: 'Tim Redaksi Panda', readTime: 3,
        tags: ['Beasiswa', 'Fudan', 'Alumni', 'CSC'],
        thumb: { from: '#f59e0b', to: '#d97706', icon: '🎓', hanzi: '大学' },
        body: `Dengan penuh kebanggaan, **Panda Mandarin** mengumumkan keberhasilan alumni kami, **Kevin Pratama**, dalam meraih **beasiswa CSC (Chinese Scholarship Council) penuh** untuk program S2 di **Fudan University**, salah satu universitas paling bergengsi di Asia.

Kevin memulai perjalanannya belajar Mandarin di Panda dari nol pada 2022. Dengan tekad yang kuat dan bimbingan tim pengajar kami, ia berhasil meraih sertifikat **HSK 5** dalam waktu 18 bulan.

**Pesan dari Kevin:**
"Dulu saya tidak bisa membedakan 你 dan 好. Sekarang saya bisa presentasi penelitian dalam bahasa Mandarin. Terima kasih Panda Mandarin!"

Pencapaian Kevin membuktikan bahwa dengan metode yang tepat dan dedikasi yang kuat, tidak ada yang mustahil. Selamat, Kevin! 加油！`,
    },
    {
        id: 5,
        title: 'Grand Opening Cabang Ketiga: Panda Hadir di Kalideres!',
        excerpt: 'Panda Mandarin resmi membuka cabang ketiga di Kalideres, Jakarta Barat! Hadir untuk melayani komunitas di wilayah Jakarta Barat dengan standar pengajaran terbaik.',
        category: 'Pengumuman', date: '2024-09-05', author: 'Tim Manajemen Panda', readTime: 3,
        tags: ['Cabang Baru', 'Kalideres', 'Jakarta Barat'],
        thumb: { from: '#8b5cf6', to: '#7c3aed', icon: '🏫', hanzi: '开业' },
        body: `Dengan penuh semangat, **Panda Mandarin** resmi membuka pintu **Cabang Kalideres** — cabang ketiga kami di Jakarta!

Berlokasi strategis di kawasan Kalideres, Jakarta Barat, cabang baru ini hadir untuk menjawab tingginya permintaan dari komunitas di wilayah barat Jakarta yang selama ini harus menempuh perjalanan jauh ke cabang MOI atau Pluit.

**Fasilitas Cabang Kalideres:**
- Ruang kelas ber-AC dengan kapasitas optimal
- Audio system berkualitas tinggi untuk latihan pronunciation
- Perpustakaan mini buku-buku Mandarin
- Ruang tunggu nyaman untuk orang tua

**Promo Grand Opening:**
Daftar dalam **30 hari pertama** dan dapatkan diskon 20% untuk bulan pertama + buku teks gratis senilai Rp 250.000.

Hubungi kami sekarang untuk jadwal tur cabang dan konsultasi gratis!`,
    },
    {
        id: 6,
        title: 'Recap Summer Study Tour Beijing–Shanghai 2024',
        excerpt: 'Dua minggu, dua kota, 28 peserta, dan ribuan kenangan. Inilah highlight perjalanan Summer Study Tour 2024 yang luar biasa bersama keluarga besar Panda Mandarin.',
        category: 'Study Tour', date: '2024-08-18', author: 'Tim Study Tour', readTime: 7,
        tags: ['Recap', 'Beijing', 'Shanghai', 'Study Tour 2024'],
        thumb: { from: '#0ea5e9', to: '#0284c7', icon: '🏯', hanzi: '北京' },
        body: `**Summer Study Tour 2024** telah berakhir, tapi kenangan indahnya akan selalu tersimpan di hati 28 peserta setia kami yang berani bertualang ke negeri Tirai Bambu.

**Hari 1-7: Beijing**
Perjalanan dimulai dari ibu kota China yang megah. Peserta mengunjungi **Tembok Besar China** di Mutianyu, Kota Terlarang (故宫), Temple of Heaven, dan Summer Palace. Sesi belajar bahasa langsung di lokasi bersejarah membuat pengalaman jauh lebih mendalam.

**Hari 8-14: Shanghai**
Di Shanghai yang kosmopolitan, peserta merasakan perpaduan unik antara tradisi dan modernitas. Dari jalanan antik di **Yu Garden** hingga gedung pencakar langit di Pudong, semuanya menjadi bahan diskusi dalam kelas bahasa harian kami.

**Highlight yang paling dikenang:**
Sesi memasak dumpling bersama keluarga lokal di Beijing, dan pertunjukan opera muka berubah (变脸) di Shanghai.

Terima kasih kepada semua peserta dan orang tua yang mempercayakan petualangan ini kepada kami. **Winter Study Tour 2026** sudah menanti!`,
    },
    {
        id: 7,
        title: 'Tips Jitu Lolos Ujian HSK 4 dalam 90 Hari',
        excerpt: 'HSK 4 adalah gerbang menuju kemampuan Mandarin yang sesungguhnya. Dengan strategi belajar yang tepat, kamu bisa lolos dalam 90 hari. Ini panduannya!',
        category: 'Tips Belajar', date: '2024-07-12', author: 'Pengajar Panda', readTime: 8,
        tags: ['HSK 4', 'Tips', 'Ujian', 'Strategi'],
        thumb: { from: '#10b981', to: '#0d9488', icon: '📊', hanzi: 'HSK' },
        body: `**HSK 4** mensyaratkan penguasaan sekitar **1.200 kosakata** dan kemampuan memahami teks kompleks serta percakapan natural. Ini panduan 90 hari kami yang terbukti efektif.

**Bulan 1: Fondasi Kosakata**
Target: kuasai 400 kata baru. Gunakan Anki dengan deck HSK 4 resmi. Review minimal 50 kata per hari, 30 menit pagi + 30 menit malam.

**Bulan 2: Listening & Reading Intensif**
Dengarkan podcast HSK 4 sambil membaca transkrip. Tonton drama China dengan subtitle Mandarin (bukan Indonesia!). Baca teks soal HSK 4 dari buku latihan resmi Hanban.

**Bulan 3: Simulasi & Review**
Kerjakan minimal **5 set soal ujian lengkap** dalam kondisi mirip ujian: timer, tanpa kamus. Identifikasi pola kesalahan dan fokus perbaikan di area tersebut.

**Tips bonus:**
- Writing HSK 4 (bagian menulis karakter) sering diabaikan tapi bobotnya signifikan. Latih minimal 30 menit per hari.
- Tidur cukup sebelum ujian. Otak yang lelah tidak akan bisa mengolah listening dengan optimal.`,
    },
    {
        id: 8,
        title: 'Workshop Kaligrafi China: 50 Peserta Antusias di MOI',
        excerpt: 'Workshop kaligrafi China perdana Panda Mandarin dihadiri lebih dari 50 peserta dari berbagai usia. Serunya belajar seni menulis 书法 (shūfǎ) langsung dari ahlinya!',
        category: 'Event', date: '2024-06-20', author: 'Tim Event Panda', readTime: 4,
        tags: ['Kaligrafi', 'Workshop', 'Event', 'MOI'],
        thumb: { from: '#f43f5e', to: '#e11d48', icon: '🖌️', hanzi: '书法' },
        body: `**Workshop Kaligrafi China** yang digelar di cabang MOI Kelapa Gading berhasil menarik lebih dari **50 peserta antusias** dari berbagai latar belakang — mulai dari siswa TK hingga profesional muda yang penasaran dengan seni tulis China.

Workshop dipandu oleh **Guru Chen Wei**, seniman kaligrafi berpengalaman dari Fujian yang kini menetap di Jakarta. Beliau membagikan teknik dasar memegang kuas, cara membuat sapuan kuas yang tepat, dan filosofi di balik setiap karakter yang ditulis.

**Karakter yang dipelajari:**
Peserta belajar menulis 4 karakter dengan makna mendalam: **福** (fú, keberuntungan), **寿** (shòu, panjang umur), **爱** (ài, cinta), dan **和** (hé, harmoni).

**Reaksi peserta:**
"Ternyata lebih susah dari yang saya bayangkan, tapi justru itulah yang membuat saya semakin penasaran!" — Reza, peserta usia 15 tahun.

Event serupa akan diadakan kembali pada September 2024. Pantau terus media sosial Panda Mandarin untuk info pendaftaran!`,
    },
    {
        id: 9,
        title: 'Mengenal Metode Pengajaran HSK Panda yang Terbukti Efektif',
        excerpt: 'Apa yang membuat Panda Mandarin berbeda? Kami membedah metode pengajaran eksklusif kami yang telah menghasilkan ratusan alumni bersertifikat HSK.',
        category: 'Tips Belajar', date: '2024-05-08', author: 'Tim Akademik Panda', readTime: 6,
        tags: ['Metode', 'HSK', 'Pengajaran', 'Kurikulum'],
        thumb: { from: '#6366f1', to: '#4f46e5', icon: '📚', hanzi: '方法' },
        body: `Di Panda Mandarin, kami percaya bahwa **belajar bahasa adalah perjalanan, bukan sprint**. Metode pengajaran kami dirancang khusus untuk konteks pelajar Indonesia yang ingin menguasai Mandarin secara efektif dan menyenangkan.

**Pilar 1: Input Comprehensible (i+1)**
Mengikuti teori Stephen Krashen, setiap materi yang diajarkan berada sedikit di atas level pemahaman siswa saat ini — cukup menantang untuk mendorong pertumbuhan, tapi tidak terlalu sulit hingga membuat frustrasi.

**Pilar 2: Output yang Bermakna**
Siswa tidak hanya mendengar dan menghafal. Setiap sesi selalu melibatkan **praktik berbicara dan menulis** dalam konteks kehidupan nyata: berdialog, berargumen, bercerita.

**Pilar 3: Umpan Balik Instan**
Pengajar kami terlatih memberikan koreksi secara halus tanpa mengganggu alur komunikasi — teknik yang disebut **recasting** dalam linguistik terapan.

**Pilar 4: Koneksi Budaya**
Bahasa tanpa budaya adalah cangkang kosong. Kami mengintegrasikan elemen budaya China — festival, filosofi, seni — dalam setiap level pembelajaran.`,
    },
    {
        id: 10,
        title: 'Panda Mandarin Juara 2 di Kompetisi Cheng Yu Nasional 2024',
        excerpt: 'Tim Panda Mandarin berhasil meraih Juara 2 dalam ajang Kompetisi Cheng Yu Antar Lembaga Bahasa Mandarin se-Indonesia 2024 yang digelar di Surabaya.',
        category: 'Prestasi', date: '2024-04-15', author: 'Tim Redaksi Panda', readTime: 3,
        tags: ['Kompetisi', 'Cheng Yu', 'Juara', 'Nasional'],
        thumb: { from: '#f59e0b', to: '#f97316', icon: '🏅', hanzi: '成语' },
        body: `Kebanggaan besar bagi keluarga besar Panda Mandarin! Tim kami yang diwakili oleh **tiga siswa terbaik** — Alicia Tanaka, Bram Santoso, dan Cintia Wijaya — berhasil meraih **Juara 2** dalam **Kompetisi Cheng Yu Antar Lembaga Bahasa Mandarin se-Indonesia 2024**.

Kompetisi yang digelar di Surabaya ini diikuti oleh **47 tim** dari seluruh Indonesia. Babak final mempertemukan 6 tim terbaik dalam adu cepat mengidentifikasi arti dan penggunaan **成语** (chéngyǔ) — peribahasa empat karakter China yang sarat makna.

**Tim Panda berhasil melewati:**
- Babak penyisihan (soal tertulis)
- Babak semifinal (presentasi chengyu)
- Babak final (buzzer round)

Kekalahan tipis di ronde terakhir tidak menyurutkan semangat. "Kami akan kembali tahun depan dan meraih yang pertama!" kata Alicia dengan mantap.

Terima kasih kepada seluruh pengajar, orang tua, dan pendukung setia Panda Mandarin! 加油！`,
    },
    {
        id: 11,
        title: 'Berapa Lama Belajar Mandarin Sampai Benar-Benar Fasih?',
        excerpt: 'Pertanyaan yang paling sering ditanyakan oleh calon siswa baru. Jawabannya lebih kompleks dan lebih menggembirakan dari yang kamu kira.',
        category: 'Tips Belajar', date: '2024-03-07', author: 'Pengajar Panda', readTime: 5,
        tags: ['Fasih', 'Timeline', 'Belajar', 'FAQ'],
        thumb: { from: '#8b5cf6', to: '#6366f1', icon: '⏰', hanzi: '时间' },
        body: `"Berapa lama sih sampai bisa Mandarin?" — Ini adalah pertanyaan nomor satu yang kami terima setiap hari.

Jawabannya: **tergantung pada definisi "bisa" yang kamu inginkan**.

**Level dasar (HSK 1-2): 3-6 bulan**
Bisa menyapa, memperkenalkan diri, memesan makanan, dan menghitung. Kosakata sekitar 300-600 kata.

**Level menengah (HSK 3-4): 12-24 bulan**
Bisa berdiskusi tentang topik sehari-hari, membaca teks pendek, dan dipahami oleh penutur asli dalam konteks standar. Kosakata 600-1.200 kata.

**Level mahir (HSK 5-6): 3-5 tahun**
Bisa menonton film China tanpa subtitle, membaca novel, dan berkarir di lingkungan berbahasa Mandarin. Kosakata 2.500+ kata.

**Faktor yang paling menentukan:**
1. **Konsistensi** — 30 menit setiap hari jauh lebih efektif daripada 4 jam sekali seminggu
2. **Paparan** — Semakin banyak konten Mandarin yang kamu konsumsi, semakin cepat otak beradaptasi
3. **Praktek berbicara** — Jangan takut salah! Native speaker sangat menghargai usaha orang asing yang belajar bahasa mereka`,
    },
    {
        id: 12,
        title: 'Selamat Datang Siswa Baru Angkatan Februari 2024!',
        excerpt: 'Panda Mandarin dengan hangat menyambut 87 siswa baru yang bergabung di angkatan Februari 2024. Perjalanan menakjubkan kalian dimulai hari ini!',
        category: 'Pengumuman', date: '2024-02-01', author: 'Tim Manajemen Panda', readTime: 2,
        tags: ['Siswa Baru', 'Angkatan Baru', 'Pengumuman'],
        thumb: { from: '#ec4899', to: '#db2777', icon: '🎉', hanzi: '欢迎' },
        body: `**Selamat datang** di keluarga besar Panda Mandarin! Kami dengan bangga dan penuh sukacita menyambut **87 siswa baru** Angkatan Februari 2024 yang resmi memulai perjalanan belajar Mandarin mereka.

Para siswa baru berasal dari berbagai latar belakang: pelajar SMP, SMA, mahasiswa, hingga profesional yang ingin mengembangkan karir dengan keahlian bahasa Mandarin. Semua disambut dengan orientasi hangat dan perkenalan dengan metode belajar Panda yang menyenangkan.

**Yang menanti kalian:**
- Kelas bahasa yang interaktif dan tidak membosankan
- Komunitas belajar yang solid dan saling mendukung
- Event-event seru seperti Imlek celebration, workshop kaligrafi, dan study tour
- Pengajar berpengalaman yang peduli dengan perkembangan setiap siswa

Ingat selalu: **每天进步一点点，终有一天会成功！**
(Setiap hari maju sedikit, suatu saat kamu pasti berhasil!)

Selamat belajar, keluarga baru Panda! 加油！🐼`,
    },
];

/* ─── Unsplash photos per article ────────────────────────────────────────── */
const NEWS_PHOTOS: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop',
    2: 'https://images.unsplash.com/photo-1508804185872-d7badad3b2b8?w=800&q=80&auto=format&fit=crop',
    3: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80&auto=format&fit=crop',
    4: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80&auto=format&fit=crop',
    5: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80&auto=format&fit=crop',
    6: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80&auto=format&fit=crop',
    7: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop',
    8: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&auto=format&fit=crop',
    9: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80&auto=format&fit=crop',
    10: 'https://images.unsplash.com/photo-1567427017947-545c5f8b8608?w=800&q=80&auto=format&fit=crop',
    11: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80&auto=format&fit=crop',
    12: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80&auto=format&fit=crop',
};

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Sk({ className = '' }: { className?: string }) {
    return <div className={`sk-shimmer rounded-xl ${className}`} />;
}

function NewsSkeleton() {
    return (
        <div className="px-4 pb-28 pt-20 sm:px-6 sm:pt-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Hero card */}
                <Sk className="mb-10 h-65 rounded-4xl sm:h-72.5" />

                {/* Stats bar — 3 col glass card */}
                <div className="mx-auto mb-10 max-w-2xl overflow-hidden rounded-2xl">
                    <div className="grid grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col items-center gap-2 px-4 py-5">
                                <Sk className="h-8 w-20 rounded-lg" />
                                <Sk className="h-3 w-14 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search + sort row */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <Sk className="h-11 flex-1 rounded-full" />
                    <Sk className="h-11 w-32 shrink-0 rounded-full" />
                </div>

                {/* Category filter pills */}
                <div className="mb-8 flex gap-2 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Sk key={i} className="h-10 w-28 shrink-0 rounded-full" />
                    ))}
                </div>

                {/* Featured card */}
                <Sk className="mb-6 h-85 rounded-4xl" />

                {/* Bento grid — alternating wide (2col) + normal (1col) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Sk className="h-70 rounded-2xl lg:col-span-2" />
                    <Sk className="h-70 rounded-2xl" />
                    <Sk className="h-70 rounded-2xl" />
                    <Sk className="h-70 rounded-2xl lg:col-span-2" />
                </div>
            </div>
        </div>
    );
}

/* ─── Thumb ──────────────────────────────────────────────────────────────── */
const Thumb = memo(function Thumb({
    thumb, size = 'md', image,
}: { thumb: NewsThumb; size?: 'sm' | 'md' | 'lg'; image?: string }) {
    const hz = size === 'lg' ? 'text-[90px]' : size === 'md' ? 'text-[56px]' : 'text-4xl';
    const ic = size === 'lg' ? 'text-4xl' : 'text-2xl';
    const [imgOk, setImgOk] = useState(!!image);

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center select-none overflow-hidden"
            style={{ background: `linear-gradient(135deg,${thumb.from} 0%,${thumb.to} 100%)` }}
        >
            {image && imgOk ? (
                <>
                    <img
                        src={image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        onError={() => setImgOk(false)}
                    />
                    {/* Subtle color tint overlay so category colors still read */}
                    <div className="absolute inset-0"
                        style={{ background: `linear-gradient(160deg,${thumb.from}55 0%,${thumb.to}35 100%)` }} />
                </>
            ) : (
                <>
                    <div className="absolute inset-0 opacity-[0.15]"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />
                    <div className={`relative ${hz} font-black text-white/18 leading-none tracking-tight`}>{thumb.hanzi}</div>
                    <div className={`relative ${ic} mt-1`}>{thumb.icon}</div>
                </>
            )}
        </div>
    );
});

/* ─── Category pill ──────────────────────────────────────────────────────── */
const CategoryPill = memo(function CategoryPill({ category }: { category: string }) {
    const cat = CATEGORIES.find(c => c.value === category);
    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
            style={{ background: cat?.color ?? '#6366f1' }}
        >
            {cat?.icon} {category}
        </span>
    );
});

/* ─── Read badge ─────────────────────────────────────────────────────────── */
const ReadBadge = memo(function ReadBadge({ count, isDark }: { count: number; isDark: boolean }) {
    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm"
            style={{
                background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)',
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            }}
        >
            <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {fmtNum(count)}
        </span>
    );
});

/* ─── Stats bar ──────────────────────────────────────────────────────────── */
function StatItem({ value, label, suffix = '', isDark }: { value: number; label: string; suffix?: string; isDark: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-30px' });
    const count = useCountUp(value, 1600, inView);
    return (
        <div ref={ref} className="flex flex-col items-center gap-1 px-6 py-4 text-center">
            <span className="text-2xl font-black sm:text-3xl" style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}>
                {count.toLocaleString('id-ID')}{suffix}
            </span>
            <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>
                {label}
            </span>
        </div>
    );
}

function StatsBar({ isDark, totalReads }: { isDark: boolean; totalReads: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mb-10 max-w-2xl overflow-hidden rounded-[20px]"
            style={{
                background: isDark
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.7)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: isDark
                    ? '0 8px 32px rgba(0,0,0,0.3)'
                    : '0 8px 32px rgba(0,0,0,0.06)',
            }}
        >
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <StatItem value={NEWS.length} label="Artikel" isDark={isDark} />
                <StatItem value={totalReads} label="Total Dibaca" suffix="+" isDark={isDark} />
                <StatItem value={CATEGORIES.length - 1} label="Kategori" isDark={isDark} />
            </div>
        </motion.div>
    );
}

/* ─── Featured card (with 3D tilt) ──────────────────────────────────────── */
const FeaturedCard = memo(function FeaturedCard({
    item, isDark, readCount, onOpen,
}: { item: NewsItem; isDark: boolean; readCount: number; onOpen: (i: NewsItem) => void }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotX = useSpring(useTransform(mouseY, [-100, 100], [4, -4]), { stiffness: 350, damping: 40 });
    const rotY = useSpring(useTransform(mouseX, [-160, 160], [-4, 4]), { stiffness: 350, damping: 40 });

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - r.left - r.width / 2);
        mouseY.set(e.clientY - r.top - r.height / 2);
    };
    const onLeave = () => { mouseX.set(0); mouseY.set(0); };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={() => onOpen(item)}
            className="group mb-6 cursor-pointer overflow-hidden rounded-4xl"
        >
            {/* Gradient border wrapper */}
            <div
                className="p-[1.5px] rounded-4xl transition-all duration-300"
                style={{
                    background: `linear-gradient(135deg, ${item.thumb.from}80, ${item.thumb.to}80, transparent)`,
                    boxShadow: `0 0 40px ${item.thumb.from}20`,
                }}
            >
                <div
                    className="overflow-hidden rounded-[27px]"
                    style={{ background: isDark ? '#0C0E18' : '#fff' }}
                >
                    <div className="grid lg:grid-cols-5">
                        {/* Thumb */}
                        <div className="relative h-56 overflow-hidden lg:col-span-3 lg:h-auto lg:min-h-85">
                            <Thumb thumb={item.thumb} size="lg" image={NEWS_PHOTOS[item.id]} />
                            {/* Live pulse badge */}
                            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md"
                                style={{ background: 'rgba(0,0,0,0.35)' }}>
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                                </span>
                                Unggulan
                            </div>
                            <div className="absolute bottom-4 right-4">
                                <ReadBadge count={readCount} isDark />
                            </div>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col justify-between p-6 lg:col-span-2 lg:p-8">
                            <div>
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <CategoryPill category={item.category} />
                                    <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                        {relTime(item.date)}
                                    </span>
                                </div>
                                <h2
                                    className="mb-3 text-xl font-black leading-snug transition-opacity group-hover:opacity-80 sm:text-2xl"
                                    style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}
                                >
                                    {item.title}
                                </h2>
                                <p className="mb-5 text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                                    {item.excerpt}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white shadow-lg"
                                        style={{ background: `linear-gradient(135deg,${item.thumb.from},${item.thumb.to})` }}
                                    >
                                        {item.author[0]}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)' }}>
                                            {item.author}
                                        </div>
                                        <div className="text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                            {formatDate(item.date)} · {item.readTime} mnt
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white"
                                    style={{ background: `linear-gradient(135deg,${item.thumb.from},${item.thumb.to})` }}
                                >
                                    Baca
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

/* ─── Bento card ─────────────────────────────────────────────────────────── */
const BentoCard = memo(function BentoCard({
    item, index, isWide, isDark, readCount, onOpen,
}: { item: NewsItem; index: number; isWide: boolean; isDark: boolean; readCount: number; onOpen: (i: NewsItem) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: Math.min((index % 3) * 0.08, 0.24), ease: [0.25, 0.1, 0.25, 1] }}
            className={`col-span-1 ${isWide ? 'lg:col-span-2' : ''}`}
        >
            <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                onClick={() => onOpen(item)}
                className="group h-full cursor-pointer overflow-hidden rounded-[20px]"
                style={{
                    border: `1px solid ${hovered
                        ? `${item.thumb.from}50`
                        : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    boxShadow: hovered
                        ? `0 20px 48px ${item.thumb.from}22, 0 0 0 1px ${item.thumb.from}28`
                        : isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
            >
                {/* Wide card: side-by-side on desktop */}
                {isWide ? (
                    <div className="grid h-full grid-cols-1 lg:grid-cols-5">
                        <div className="relative h-48 overflow-hidden lg:col-span-2 lg:h-full lg:min-h-55">
                            <Thumb thumb={item.thumb} size="md" image={NEWS_PHOTOS[item.id]} />
                            <div className="absolute right-3 top-3">
                                <CategoryPill category={item.category} />
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <ReadBadge count={readCount} isDark={isDark} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between p-5 lg:col-span-3">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                        {relTime(item.date)}
                                    </span>
                                    <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>·</span>
                                    <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                        {item.readTime} mnt
                                    </span>
                                </div>
                                <h3
                                    className="mb-2 text-base font-black leading-snug transition-opacity group-hover:opacity-75 sm:text-lg"
                                    style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}
                                >
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                                    {item.excerpt}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <div
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ background: `linear-gradient(135deg,${item.thumb.from},${item.thumb.to})` }}
                                >
                                    {item.author[0]}
                                </div>
                                <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)' }}>
                                    {item.author}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Normal card: stacked */
                    <>
                        <div className="relative h-44 overflow-hidden">
                            <Thumb thumb={item.thumb} size="md" image={NEWS_PHOTOS[item.id]} />
                            <div className="absolute right-3 top-3">
                                <CategoryPill category={item.category} />
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <ReadBadge count={readCount} isDark={isDark} />
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                    {relTime(item.date)}
                                </span>
                                <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>·</span>
                                <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                    {item.readTime} mnt
                                </span>
                            </div>
                            <h3
                                className="mb-2 font-black leading-snug transition-opacity group-hover:opacity-75"
                                style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}
                            >
                                {item.title}
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed line-clamp-2" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                                {item.excerpt}
                            </p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ background: `linear-gradient(135deg,${item.thumb.from},${item.thumb.to})` }}
                                >
                                    {item.author[0]}
                                </div>
                                <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)' }}>
                                    {item.author}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
});

/* ─── Empty state ────────────────────────────────────────────────────────── */
const EmptyState = memo(function EmptyState({ isDark }: { isDark: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center py-20 text-center"
        >
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-lg font-bold" style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}>
                Tidak ada artikel ditemukan
            </h3>
            <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                Coba filter atau kata kunci lain
            </p>
        </motion.div>
    );
});

/* ─── Article modal ──────────────────────────────────────────────────────── */
const ArticleModal = memo(function ArticleModal({
    item, isDark, readCount, onClose,
}: { item: NewsItem; isDark: boolean; readCount: number; onClose: () => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const modalBg = isDark ? '#0E1018' : '#FAFBFF';

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const waLink = `https://wa.me/6289778273311?text=${encodeURIComponent(`Halo Panda Mandarin! Saya tertarik setelah membaca artikel "${item.title}". Boleh minta info lebih lanjut?`)}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-200 flex items-end md:items-center md:p-4"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-4xl md:mx-auto md:max-h-[88dvh] md:max-w-2xl md:rounded-4xl"
                style={{ background: modalBg }}
                onClick={e => e.stopPropagation()}
            >
                {/* ─ All content scrolls freely ─ */}
                <div ref={scrollRef} className="hide-scroll flex-1 overflow-y-auto">

                    {/* Photo / thumbnail — NOT fixed, scrolls with content */}
                    <div className="relative h-56 overflow-hidden md:h-64">
                        <Thumb thumb={item.thumb} size="lg" image={NEWS_PHOTOS[item.id]} />

                        {/* Bottom gradient fade */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                            style={{ background: `linear-gradient(to top,${modalBg},transparent)` }} />

                        {/* Drag handle (mobile) */}
                        <div className="absolute left-1/2 top-2.5 -translate-x-1/2 md:hidden">
                            <div className="h-1 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
                        </div>

                        {/* Close button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            aria-label="Tutup"
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full"
                            style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(10px)', color: '#fff' }}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        {/* Bottom overlay: category + meta + read badge */}
                        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
                            <div className="flex items-center gap-2">
                                <CategoryPill category={item.category} />
                                <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm"
                                    style={{ background: 'rgba(0,0,0,0.32)', color: 'rgba(255,255,255,0.85)' }}>
                                    {item.readTime} mnt baca
                                </span>
                            </div>
                            <ReadBadge count={readCount} isDark />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-4 pt-4 md:px-7">
                        {/* Title with left accent bar */}
                        <div className="mb-4 flex gap-3">
                            <div className="mt-0.5 w-0.75 shrink-0 self-stretch rounded-full"
                                style={{ background: `linear-gradient(to bottom,${item.thumb.from},${item.thumb.to})` }} />
                            <h2 className="text-xl font-black leading-snug sm:text-2xl"
                                style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}>
                                {item.title}
                            </h2>
                        </div>

                        {/* Author card */}
                        <div className="mb-5 flex items-center gap-3 rounded-2xl p-3.5"
                            style={{
                                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
                            }}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                                style={{
                                    background: `linear-gradient(135deg,${item.thumb.from},${item.thumb.to})`,
                                    boxShadow: `0 0 0 2px ${modalBg}, 0 0 0 4.5px ${item.thumb.from}55`,
                                }}>
                                {item.author[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold" style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}>
                                    {item.author}
                                </div>
                                <div className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                    {formatDate(item.date)}
                                </div>
                            </div>
                        </div>

                        {/* Gradient divider */}
                        <div className="mb-5 h-px rounded-full"
                            style={{ background: `linear-gradient(to right,${item.thumb.from}90,${item.thumb.to}50,transparent)` }} />

                        {/* Body */}
                        <div className="text-sm leading-[1.85]"
                            style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}>
                            {renderBody(item.body)}
                        </div>

                        {/* Tags */}
                        {item.tags.length > 0 && (
                            <div className="mt-5 mb-2 flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <motion.span key={tag} whileHover={{ scale: 1.05 }}
                                        className="cursor-default rounded-full px-3 py-1 text-xs font-semibold"
                                        style={{
                                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)'}`,
                                        }}>
                                        #{tag}
                                    </motion.span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ─ Footer CTA (always visible, glassmorphism) ─ */}
                <div className="shrink-0 px-5 pb-5 pt-3 md:px-7"
                    style={{
                        background: isDark ? 'rgba(14,16,24,0.95)' : 'rgba(250,251,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
                    }}>
                    <div className="flex items-center gap-2.5">
                        {/* WA CTA */}
                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#1aab4a,#25D366)' }}
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Konsultasi via WhatsApp
                        </motion.a>
                        {/* Close */}
                        <motion.button
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={onClose}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
                            style={{
                                borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)',
                                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                            }}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function NewsPage() {
    const isDark = useDarkMode();
    const toggleDark = useCallback(() => {
        document.documentElement.classList.toggle('dark');
    }, []);
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
    const [visible, setVisible] = useState(6);
    const [selected, setSelected] = useState<NewsItem | null>(null);
    const [search, setSearch] = useState('');
    const { counts, increment } = useReadCounts();
    const totalReads = useMemo(() =>
        TOTAL_BASE + Object.values(counts).reduce((a, b) => a + b, 0) - TOTAL_BASE,
        [counts]
    );

    useEffect(() => { setMounted(true); }, []);

    const catCounts = useMemo(() => {
        const m: Record<string, number> = { all: NEWS.length };
        for (const n of NEWS) m[n.category] = (m[n.category] ?? 0) + 1;
        return m;
    }, []);

    const list = useMemo(() => {
        let items = NEWS.filter(n => {
            const mc = filter === 'all' || n.category === filter;
            const ms = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase());
            return mc && ms;
        });
        return sort === 'newest'
            ? items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            : items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [filter, sort, search]);

    const showFeatured = filter === 'all' && sort === 'newest' && !search && list.length > 0;
    const featured = showFeatured ? list[0] : null;
    const gridItems = list.slice(showFeatured ? 1 : 0);
    const visibleGrid = gridItems.slice(0, visible);
    const hasMore = gridItems.length > visible;

    const open = useCallback((item: NewsItem) => {
        setSelected(item);
        increment(item.id);
    }, [increment]);
    const close = useCallback(() => setSelected(null), []);
    const loadMore = useCallback(() => setVisible(v => v + 3), []);
    const changeFilter = useCallback((v: string) => { setFilter(v); setVisible(6); }, []);
    const toggleSort = useCallback(() => { setSort(s => s === 'newest' ? 'oldest' : 'newest'); setVisible(6); }, []);

    const pageBg = isDark
        ? 'linear-gradient(180deg,#07090F 0%,#0D0F1A 100%)'
        : 'linear-gradient(180deg,#F5F6FF 0%,#FAFBFF 100%)';

    const HERO_HANZI = [
        { char: '最新', x: '8%',  y: '20%', rot: -12, delay: 0 },
        { char: '活动', x: '82%', y: '15%', rot: 8,   delay: 0.4 },
        { char: '资讯', x: '75%', y: '65%', rot: -6,  delay: 0.8 },
        { char: '故事', x: '5%',  y: '68%', rot: 14,  delay: 0.2 },
    ];

    return (
        <>
            <Head title="News — Panda Mandarin" />
            <style>{`
                @keyframes aurora-blob {
                    0%,100% { transform: translate(0,0) scale(1); }
                    33%     { transform: translate(40px,-24px) scale(1.07); }
                    66%     { transform: translate(-28px,30px) scale(0.94); }
                }
                @keyframes aurora-blob-r {
                    0%,100% { transform: translate(0,0) scale(1); }
                    33%     { transform: translate(-35px,20px) scale(1.05); }
                    66%     { transform: translate(25px,-28px) scale(0.96); }
                }
                .sk-shimmer {
                    background: linear-gradient(90deg,
                        rgba(128,128,128,0.09) 0%,
                        rgba(128,128,128,0.20) 50%,
                        rgba(128,128,128,0.09) 100%);
                    background-size: 200% 100%;
                    animation: sk-shimmer 1.5s ease-in-out infinite;
                }
                @keyframes sk-shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .hide-scroll { -ms-overflow-style:none; scrollbar-width:none; }
                .hide-scroll::-webkit-scrollbar { display:none; }
                html { scroll-behavior: smooth; }
            `}</style>

            <div className="min-h-dvh" style={{ background: pageBg }}>
                <Navbar darkMode={isDark} toggleDark={toggleDark} />

                {!mounted ? <NewsSkeleton /> : (
                    <MotionConfig reducedMotion="user">
                        <main className="pb-28 pt-20 sm:pt-24">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                                {/* ── Hero ── */}
                                <div className="relative mb-4 overflow-hidden rounded-4xl px-6 py-14 text-center sm:py-16"
                                    style={{
                                        background: isDark
                                            ? 'linear-gradient(135deg,#0D0920 0%,#0A1020 50%,#0C0818 100%)'
                                            : 'linear-gradient(135deg,#F0EEFF 0%,#EDF2FF 50%,#F3F0FF 100%)',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.12)'}`,
                                    }}>
                                    {/* Aurora blobs */}
                                    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
                                        <div className="absolute -left-24 -top-24 h-120 w-120 rounded-full opacity-[0.18] blur-[90px]"
                                            style={{ background: 'radial-gradient(circle,#6366f1,transparent 70%)', animation: 'aurora-blob 13s ease-in-out infinite' }} />
                                        <div className="absolute -bottom-16 -right-16 h-100 w-100 rounded-full opacity-[0.14] blur-[80px]"
                                            style={{ background: 'radial-gradient(circle,#8b5cf6,transparent 70%)', animation: 'aurora-blob-r 16s ease-in-out infinite' }} />
                                        <div className="absolute left-1/2 top-1/2 h-75 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[70px]"
                                            style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)', animation: 'aurora-blob 9s ease-in-out infinite 1.5s' }} />
                                        {/* Floating hanzi */}
                                        {HERO_HANZI.map((h, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute hidden text-6xl font-black sm:block lg:text-7xl"
                                                style={{
                                                    left: h.x, top: h.y,
                                                    color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.07)',
                                                    rotate: h.rot,
                                                }}
                                                animate={{ y: [0, -14, 0] }}
                                                transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
                                            >
                                                {h.char}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                                            style={{
                                                borderColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
                                                color: '#6366f1',
                                                background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
                                            }}
                                        >
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75" />
                                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                            </span>
                                            Berita & Artikel Terbaru
                                        </motion.span>

                                        <motion.h1
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.55, delay: 0.15 }}
                                            className="mb-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                                            style={{ color: isDark ? '#F0EEFF' : '#1A1033' }}
                                        >
                                            News&nbsp;
                                            <span style={{
                                                background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}>
                                                Panda
                                            </span>
                                        </motion.h1>

                                        <motion.p
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="mx-auto mb-6 max-w-md text-sm sm:text-base"
                                            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                                        >
                                            Prestasi alumni, event seru, tips belajar, dan semua cerita dari keluarga besar Panda Mandarin
                                        </motion.p>

                                        {/* Quick stats pills */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.28 }}
                                            className="flex flex-wrap justify-center gap-2.5"
                                        >
                                            {[
                                                { icon: '📰', label: `${NEWS.length} Artikel` },
                                                { icon: '👁', label: `${fmtNum(TOTAL_BASE)}+ Dibaca` },
                                                { icon: '🏷', label: `${CATEGORIES.length - 1} Kategori` },
                                            ].map(p => (
                                                <span
                                                    key={p.label}
                                                    className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm"
                                                    style={{
                                                        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.6)',
                                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.15)',
                                                        color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,16,51,0.75)',
                                                    }}
                                                >
                                                    <span>{p.icon}</span>{p.label}
                                                </span>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* ── Stats bar ── */}
                                <StatsBar isDark={isDark} totalReads={TOTAL_BASE} />

                                {/* ── Search + Sort ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"
                                >
                                    <div className="relative flex-1">
                                        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40"
                                            style={{ color: isDark ? '#fff' : '#000' }}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                        <input
                                            type="search"
                                            placeholder="Cari artikel..."
                                            value={search}
                                            onChange={e => { setSearch(e.target.value); setVisible(6); }}
                                            className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                                            style={{
                                                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)',
                                                color: isDark ? '#F0EEFF' : '#1A1033',
                                                boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
                                            }}
                                        />
                                        {search && (
                                            <button
                                                onClick={() => setSearch('')}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm opacity-50 hover:opacity-100"
                                                style={{ color: isDark ? '#fff' : '#000' }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={toggleSort}
                                        className="inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                                        style={{
                                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                                            borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)',
                                            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                                        }}
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                        </svg>
                                        {sort === 'newest' ? 'Terbaru' : 'Terlama'}
                                    </motion.button>
                                </motion.div>

                                {/* ── Category pills ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                    className="hide-scroll mb-8 flex gap-2 overflow-x-auto pb-1"
                                >
                                    {CATEGORIES.map(cat => {
                                        const active = filter === cat.value;
                                        return (
                                            <motion.button
                                                key={cat.value}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => changeFilter(cat.value)}
                                                className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all"
                                                style={{
                                                    borderColor: active ? cat.color : isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)',
                                                    background: active
                                                        ? `${cat.color}18`
                                                        : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                                                    color: active ? cat.color : isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
                                                    boxShadow: active ? `0 0 0 3px ${cat.color}20` : 'none',
                                                }}
                                            >
                                                <span>{cat.icon}</span>
                                                {cat.label}
                                                <span
                                                    className="ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                                                    style={{
                                                        background: active ? `${cat.color}28` : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                                                        color: active ? cat.color : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                                                    }}
                                                >
                                                    {catCounts[cat.value] ?? 0}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>

                                {/* ── Result meta ── */}
                                <div className="mb-5 flex items-center gap-2">
                                    <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                                        {list.length} artikel
                                    </span>
                                    {(filter !== 'all' || search) && (
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => { setFilter('all'); setSearch(''); setVisible(6); }}
                                            className="rounded-full border px-2.5 py-0.5 text-xs font-bold transition-opacity hover:opacity-70"
                                            style={{
                                                color: '#6366f1',
                                                borderColor: '#6366f130',
                                                background: '#6366f110',
                                            }}
                                        >
                                            Reset ✕
                                        </motion.button>
                                    )}
                                </div>

                                {/* ── Featured ── */}
                                <AnimatePresence mode="wait">
                                    {featured && (
                                        <FeaturedCard
                                            key="feat"
                                            item={featured}
                                            isDark={isDark}
                                            readCount={counts[featured.id] ?? 0}
                                            onOpen={open}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* ── Bento grid ── */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${filter}-${sort}-${search}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                                    >
                                        {visibleGrid.length === 0 && list.length === 0 ? (
                                            <EmptyState isDark={isDark} />
                                        ) : (
                                            visibleGrid.map((item, i) => (
                                                <BentoCard
                                                    key={item.id}
                                                    item={item}
                                                    index={i}
                                                    isWide={i % 4 === 0 || i % 4 === 3}
                                                    isDark={isDark}
                                                    readCount={counts[item.id] ?? 0}
                                                    onOpen={open}
                                                />
                                            ))
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* ── Load more ── */}
                                {hasMore && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-10 flex justify-center"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={loadMore}
                                            className="group inline-flex items-center gap-2.5 rounded-full border px-7 py-3 text-sm font-bold transition-all"
                                            style={{
                                                borderColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.25)',
                                                color: '#6366f1',
                                                background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
                                                boxShadow: '0 4px 16px rgba(99,102,241,0.1)',
                                            }}
                                        >
                                            Muat lebih banyak
                                            <motion.svg
                                                className="h-4 w-4"
                                                animate={{ y: [0, 3, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9 2-2.5L19 4m0 0-2 2.5M19 4v7M5 20l-2 2.5L5 25m0 0 2-2.5M5 22v-7M12 3v18" />
                                            </motion.svg>
                                        </motion.button>
                                    </motion.div>
                                )}

                                {/* ── End cap ── */}
                                {!hasMore && list.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-10 flex flex-col items-center gap-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-16 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                                            <span className="text-lg">🐼</span>
                                            <div className="h-px w-16 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                                        </div>
                                        <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                                            Semua {list.length} artikel ditampilkan ·{' '}
                                            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="underline hover:opacity-60">
                                                Kembali ke atas
                                            </button>
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </main>
                    </MotionConfig>
                )}
                <Footer />
            </div>

            {/* ── Modal ── */}
            <AnimatePresence>
                {selected && (
                    <ArticleModal key="modal" item={selected} isDark={isDark} readCount={counts[selected.id] ?? 0} onClose={close} />
                )}
            </AnimatePresence>
        </>
    );
}

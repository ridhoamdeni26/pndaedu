import type { CourseClass, Testimonial, FaqItem, FaqCategoryTab } from '@/types/home';

/* ─────────────────────────────────────────────────────────────────
   Shared teacher profiles
───────────────────────────────────────────────────────────────── */
const T_WANG  = { name: 'Wáng Lǎoshī',   avatar: '王', gradient: 'from-rose-400 to-red-500'      };
const T_LI    = { name: 'Lǐ Lǎoshī',     avatar: '李', gradient: 'from-amber-400 to-orange-500'  };
const T_CHEN  = { name: 'Chén Lǎoshī',   avatar: '陈', gradient: 'from-slate-500 to-zinc-600'    };
const T_KOKO  = { name: 'Koko Lǎoshī',   avatar: '可', gradient: 'from-pink-400 to-rose-500'     };
const T_ZHANG = { name: 'Zhāng Lǎoshī',  avatar: '张', gradient: 'from-sky-500 to-blue-600'      };
const T_LIN   = { name: 'Lín Lǎoshī',    avatar: '林', gradient: 'from-emerald-400 to-teal-500'  };
const T_NATIVE = { name: 'Native Lǎoshī', avatar: '师', gradient: 'from-red-500 to-yellow-400'   };
const T_FLEX  = { name: 'Pilihan Guru',  avatar: '?',  gradient: 'from-violet-400 to-purple-500' };

/* ─────────────────────────────────────────────────────────────────
   Shared benefit lists (offline classes)
───────────────────────────────────────────────────────────────── */
const KIDS_GROUP_BENEFITS = [
    '3 bulan / 24x pertemuan (2 kali/minggu, 60 menit/sesi)',
    'Sudah termasuk Administration Fee Rp250.000 (Free Mandarin Notebook)',
    'Mandarin Textbook & Workbook (opsional)',
    'Min 3 anak/group, max 5 anak/group',
    'Slot terbatas — daftarkan segera!',
];

const TEEN_GROUP_BENEFITS = [
    '3 bulan / 24x pertemuan (2 kali/minggu, 60 menit/sesi)',
    'Sudah termasuk Administration Fee Rp250.000 (Free Mandarin Notebook)',
    'Mandarin Textbook & Workbook (opsional)',
    'Min 4 orang/group, max 8 orang/group',
    'Slot terbatas — daftarkan segera!',
];

const ADULT_GROUP_BENEFITS = [
    '3 bulan / 24x pertemuan (2 kali/minggu, 60 menit/sesi)',
    'Administration Fee Rp250.000 (Free Mandarin Notebook)',
    'Mandarin Textbook & Workbook (opsional)',
    'Min 4 orang/group, max 8 orang/group',
    'Slot terbatas — daftarkan segera!',
];

const OFFLINE_SP_BENEFITS = [
    '60 menit/sesi, 2 kali/minggu',
    'Administration Fee Rp250.000 (Free Mandarin Notebook)',
    'Mandarin Textbook & Workbook (opsional)',
    'Jadwal fleksibel menyesuaikan peserta',
];

const OFFLINE_PRIVATE_BENEFITS = [
    '60 menit/sesi, 2 kali/minggu',
    'Administration Fee Rp250.000 (Free Mandarin Notebook)',
    'Mandarin Textbook & Workbook (opsional)',
    'Jadwal 100% fleksibel sesuai kebutuhan',
];

const HOME_PRIVATE_BENEFITS = [
    'Guru datang langsung ke rumah atau lokasi pilihan Anda',
    'Jadwal 100% fleksibel — kapan saja sesuai kesibukanmu',
    'Materi disesuaikan penuh dengan level & tujuanmu',
    'Administration Fee Rp250.000 (Free Mandarin Notebook)',
    'Pilihan Private (1 murid) atau Semi Private (2 murid)',
];

const OFFLINE_LOC = 'MOI Kelapa Gading / Pluit / Citra 2 Kalideres';
const NO_BATCH = { no: null, start: null, end: null, deadline: null };

/* ─────────────────────────────────────────────────────────────────
   Thumbnail photos — Unsplash free images
───────────────────────────────────────────────────────────────── */
const Q = '?auto=format&fit=crop&w=800&q=80';
const IMG_KIDS_FUN     = `https://images.unsplash.com/photo-1588072432836-e10032774350${Q}`;
const IMG_KIDS_STUDY   = `https://images.unsplash.com/photo-1503676260728-1c00da094a0b${Q}`;
const IMG_KIDS_CLASS   = `https://images.unsplash.com/photo-1516627145497-ae6968895b74${Q}`;
const IMG_ADULT_STUDY  = `https://images.unsplash.com/photo-1434030216411-0b793f4b4173${Q}`;
const IMG_GROUP_STUDY  = `https://images.unsplash.com/photo-1522202176988-66273c2fd55f${Q}`;
const IMG_ONLINE_LEARN = `https://images.unsplash.com/photo-1524178232363-1fb2b075b655${Q}`;
const IMG_ADVANCED     = `https://images.unsplash.com/photo-1546410531-bb4caa6b424d${Q}`;
const IMG_MANDARIN     = `https://images.unsplash.com/photo-1528360983277-13d401cdc186${Q}`;
const IMG_CALLIGRAPHY  = `https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b${Q}`;
const IMG_BIZ_MEETING  = `https://images.unsplash.com/photo-1507679799987-c73779587ccf${Q}`;
const IMG_BIZ_OFFICE   = `https://images.unsplash.com/photo-1521737604893-d14cc237f11d${Q}`;
const IMG_BIZ_TEAM     = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43${Q}`;
const IMG_CLASSROOM    = `https://images.unsplash.com/photo-1580582932707-520aed937b7b${Q}`;
const IMG_TUTORING     = `https://images.unsplash.com/photo-1509062522246-3755977927d7${Q}`;
const IMG_HOME_STUDY   = `https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b${Q}`;
const IMG_HOME_LAPTOP  = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d${Q}`;

/* ─────────────────────────────────────────────────────────────────
   CLASSES — Online (28) + Offline (42) = 70 total
   Harga FIXED (ambil tertinggi dari range, priceMax dihapus)
───────────────────────────────────────────────────────────────── */
export const CLASSES: CourseClass[] = [

    /* ══════════════════════════════════════════════════════════════
       KIDS — ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 1, slug: 'kids-group-online', image: IMG_KIDS_FUN,
        title: 'Kids Mandarin — Group Class',
        subtitle: 'Belajar Mandarin bareng teman-teman baru! Metode bermain yang seru, bikin anak semangat belajar tiap sesi.',
        type: 'online', cat: 'kids', pricingTier: 'group',
        level: 'Semua Level', badge: 'Fun Learning 🎨',
        price: 699000, duration: 'per bulan',
        maxS: 8, enrolled: 6,
        teacher: T_WANG,
        batch: { no: 21, start: '2026-06-02', end: '2026-08-25', deadline: '2026-05-30' },
        schedule: 'Senin & Rabu, 15:30–16:15 WIB',
        hanzi: '玩', thumbFrom: '#fce7f3', thumbTo: '#fff7ed',
        age: '5–12 thn',
        benefits: [
            'Bantu belajar PR & persiapan ujian sekolah',
            'Free trial 30 menit sebelum daftar',
            'Free rekaman kelas — putar ulang kapan saja',
            'Metode Easy, Fun & Fleksibel',
        ],
    },

    {
        id: 2, slug: 'kids-semi-private-online', image: IMG_KIDS_STUDY,
        title: 'Kids Mandarin — Semi Private',
        subtitle: '1 guru untuk maksimal 2 murid — anak dapat perhatian lebih penuh, progres lebih terasa, dan tetap ada teman belajarnya!',
        type: 'online', cat: 'kids', pricingTier: 'semi-private',
        level: 'Semua Level', badge: 'Pilihan Smart 👑',
        price: 3599000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_KOKO,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '学', thumbFrom: '#fce7f3', thumbTo: '#ede9fe',
        age: '5–12 thn',
        benefits: [
            'Bantu belajar PR & persiapan ujian sekolah',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami yang carikan partner belajar!',
            'Metode Easy, Fun & Fleksibel',
        ],
    },

    {
        id: 3, slug: 'kids-private-online', image: IMG_KIDS_CLASS,
        title: 'Kids Mandarin — Private 1-on-1',
        subtitle: 'Guru 100% fokus ke anak. Materi disesuaikan dengan kebutuhan, ritme belajar, bahkan mata pelajaran Mandarin di sekolahnya.',
        type: 'online', cat: 'kids', pricingTier: 'private',
        level: 'Semua Level', badge: 'Premium ✨',
        price: 4199000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_KOKO,
        batch: NO_BATCH,
        schedule: 'Fleksibel',
        hanzi: '乐', thumbFrom: '#fce7f3', thumbTo: '#fdf4ff',
        isPrivate: true, age: '5–12 thn',
        benefits: [
            'Bantu belajar PR & persiapan ujian sekolah',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Materi disesuaikan 100% dengan kebutuhan anak',
            'Metode Easy, Fun & Fleksibel',
        ],
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT HSK — GROUP ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 4, slug: 'hsk1-group-online', image: IMG_ADULT_STUDY,
        title: 'HSK 1 — Beginner Group',
        subtitle: 'Mulai dari nol tanpa khawatir! Kuasai 150 kosakata dasar, sapa orang, perkenalkan diri, dan mulai ngobrol santai dalam Mandarin.',
        type: 'online', cat: 'adult', pricingTier: 'group',
        level: 'HSK 1', badge: 'Bestseller 🔥',
        price: 499000, duration: 'per bulan',
        maxS: 8, enrolled: 6,
        teacher: T_WANG,
        batch: { no: 15, start: '2026-06-02', end: '2026-08-22', deadline: '2026-05-28' },
        schedule: 'Senin & Rabu, 19:00–20:30 WIB',
        hanzi: '汉', thumbFrom: '#ffe4e6', thumbTo: '#fef3c7',
    },

    {
        id: 5, slug: 'hsk2-group-online', image: IMG_GROUP_STUDY,
        title: 'HSK 2 — Elementary Group',
        subtitle: 'Sudah bisa sapaan dasar? Naikkan gear! Capai 300 kosakata dan mulai ngobrol cukup lancar dengan siapa saja.',
        type: 'online', cat: 'adult', pricingTier: 'group',
        level: 'HSK 2', badge: 'Popular ⭐',
        price: 499000, duration: 'per bulan',
        maxS: 8, enrolled: 8,
        teacher: T_LI,
        batch: { no: 13, start: '2026-06-09', end: '2026-09-01', deadline: '2026-06-05' },
        schedule: 'Selasa & Kamis, 19:00–20:30 WIB',
        hanzi: '学', thumbFrom: '#fef3c7', thumbTo: '#ffedd5',
        isFull: true,
    },

    {
        id: 6, slug: 'hsk3-group-online', image: IMG_MANDARIN,
        title: 'HSK 3 — Intermediate Group',
        subtitle: 'Di level ini kamu sudah bisa solo traveling ke China! Kuasai 600 kosakata dan berkomunikasi sehari-hari dengan penutur asli.',
        type: 'online', cat: 'adult', pricingTier: 'group',
        level: 'HSK 3', badge: 'Travel Ready 🌏',
        price: 539000, duration: 'per bulan',
        maxS: 8, enrolled: 4,
        teacher: T_CHEN,
        batch: { no: 9, start: '2026-06-16', end: '2026-09-22', deadline: '2026-06-12' },
        schedule: 'Sabtu, 10:00–12:00 WIB',
        hanzi: '说', thumbFrom: '#f1f5f9', thumbTo: '#e2e8f0',
    },

    {
        id: 7, slug: 'hsk4-group-online', image: IMG_ONLINE_LEARN,
        title: 'HSK 4 — Upper Intermediate Group',
        subtitle: 'Ngobrol bebas dengan native speaker tanpa kagok! Kuasai 1.200 kosakata dan ekspresikan diri dalam Mandarin yang lebih kaya.',
        type: 'online', cat: 'adult', pricingTier: 'group',
        level: 'HSK 4', badge: 'Intensif 🚀',
        price: 699000, duration: 'per bulan',
        maxS: 6, enrolled: 5,
        teacher: T_LIN,
        batch: { no: 7, start: '2026-06-02', end: '2026-09-26', deadline: '2026-05-29' },
        schedule: 'Senin, Rabu & Jumat, 19:00–20:30 WIB',
        hanzi: '升', thumbFrom: '#ecfdf5', thumbTo: '#d1fae5',
    },

    {
        id: 8, slug: 'hsk5-group-online', image: IMG_CALLIGRAPHY,
        title: 'HSK 5 — Advanced Group',
        subtitle: 'Diskusi topik kompleks dan profesional, baca koran China, tonton film Mandarin tanpa subtitle — semua ini kamu bisa di HSK 5.',
        type: 'online', cat: 'adult', pricingTier: 'group',
        level: 'HSK 5', badge: 'Beasiswa Ready 🎓',
        price: 799000, duration: 'per bulan',
        maxS: 6, enrolled: 3,
        teacher: T_CHEN,
        batch: { no: 4, start: '2026-06-23', end: '2026-10-20', deadline: '2026-06-19' },
        schedule: 'Selasa & Kamis, 20:00–21:30 WIB',
        hanzi: '成', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
    },

    {
        id: 9, slug: 'hsk6-group-online', image: IMG_MANDARIN,
        title: 'HSK 6 — Mastery Group',
        subtitle: 'Puncak tertinggi! Kuasai 5.000+ kosakata dan berkomunikasi setara native speaker berpendidikan — lisan maupun tulisan.',
        type: 'online', cat: 'adult', pricingTier: 'group',
        level: 'HSK 6', badge: 'Master Level 👑',
        price: 1099000, duration: 'per bulan',
        maxS: 6, enrolled: 2,
        teacher: T_CHEN,
        batch: { no: 2, start: '2026-07-07', end: '2026-12-14', deadline: '2026-07-03' },
        schedule: 'Senin & Kamis, 20:00–21:30 WIB',
        hanzi: '达', thumbFrom: '#f5f3ff', thumbTo: '#ede9fe',
    },

    /* ══════════════════════════════════════════════════════════════
       BISNIS MANDARIN — GROUP ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 10, slug: 'bisnis-beginner1-group', image: IMG_BIZ_MEETING,
        title: 'Bisnis Mandarin — Beginner I',
        subtitle: 'Beli barang dalam Mandarin, perkenalkan kartu nama profesional, dan presentasikan grafik sederhana — langsung applicable di tempat kerja.',
        type: 'online', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Lv.1', badge: 'Work Ready 💼',
        price: 449000, duration: 'per bulan',
        maxS: 8, enrolled: 4,
        teacher: T_ZHANG,
        batch: { no: 6, start: '2026-06-02', end: '2026-08-25', deadline: '2026-05-30' },
        schedule: 'Senin & Rabu, 20:00–21:00 WIB',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
    },

    {
        id: 11, slug: 'bisnis-beginner2-group', image: IMG_BIZ_TEAM,
        title: 'Bisnis Mandarin — Beginner II',
        subtitle: 'Deskripsikan lokasi kantor, kenalkan produk ke klien China, atur undangan meeting, dan bandingkan harga dengan percaya diri.',
        type: 'online', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Lv.2', badge: null,
        price: 449000, duration: 'per bulan',
        maxS: 8, enrolled: 3,
        teacher: T_ZHANG,
        batch: { no: 5, start: '2026-06-09', end: '2026-09-01', deadline: '2026-06-05' },
        schedule: 'Selasa & Kamis, 20:00–21:00 WIB',
        hanzi: '贸', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
    },

    {
        id: 12, slug: 'bisnis-intermediate1-group', image: IMG_BIZ_OFFICE,
        title: 'Bisnis Mandarin — Intermediate I',
        subtitle: 'Jemput klien di bandara, pesan hotel, atur jadwal rapat, dan buat surat kontrak — semua dalam Mandarin yang profesional.',
        type: 'online', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Lv.3', badge: null,
        price: 499000, duration: 'per bulan',
        maxS: 6, enrolled: 3,
        teacher: T_CHEN,
        batch: { no: 4, start: '2026-06-16', end: '2026-09-22', deadline: '2026-06-12' },
        schedule: 'Rabu & Jumat, 20:00–21:00 WIB',
        hanzi: '合', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
    },

    {
        id: 13, slug: 'bisnis-intermediate2-group', image: IMG_BIZ_MEETING,
        title: 'Bisnis Mandarin — Intermediate II',
        subtitle: 'Kuasai bahasa ekspor-impor: packaging, pengiriman, asuransi barang, deal kerja sama, cara pembayaran, dan laporan harga.',
        type: 'online', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Lv.4', badge: 'Import Export 🚢',
        price: 499000, duration: 'per bulan',
        maxS: 6, enrolled: 2,
        teacher: T_CHEN,
        batch: { no: 3, start: '2026-06-23', end: '2026-10-20', deadline: '2026-06-19' },
        schedule: 'Selasa & Kamis, 20:00–21:00 WIB',
        hanzi: '易', thumbFrom: '#f7fee7', thumbTo: '#d9f99d',
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT — SEMI PRIVATE ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 14, slug: 'beginner-semi-private-online', image: IMG_ADULT_STUDY,
        title: 'Semi Private — Beginner (HSK 1–2)',
        subtitle: 'Belajar lebih intens berdua! 1 guru eksklusif untuk 2 murid — speaking, reading, dan grammar dari nol sampai lancar.',
        type: 'online', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 1–2', badge: 'Direkomendasikan 👍',
        price: 2999000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '汉', thumbFrom: '#ffe4e6', thumbTo: '#fef3c7',
        benefits: [
            'Speaking, Reading, Grammar & Practice intensif',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 15, slug: 'intermediate-semi-private-online', image: IMG_GROUP_STUDY,
        title: 'Semi Private — Intermediate (HSK 3–4)',
        subtitle: 'Perhatian lebih penuh, materi lebih dalam. Cocok untuk kamu yang ingin akselerasi ke level menengah bersama 1 teman belajar.',
        type: 'online', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 3–4', badge: null,
        price: 3199000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '说', thumbFrom: '#fef3c7', thumbTo: '#ecfdf5',
        benefits: [
            'Speaking, Reading, Grammar & Practice intensif',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 16, slug: 'advance-semi-private-online', image: IMG_CALLIGRAPHY,
        title: 'Semi Private — Advanced (HSK 5–6)',
        subtitle: 'Capai level expert bersama! Diskusi topik abstrak & profesional, tulis esai, dan kuasai nuansa bahasa yang lebih halus.',
        type: 'online', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 5–6', badge: 'Expert Track 🎯',
        price: 3599000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '升', thumbFrom: '#ecfdf5', thumbTo: '#dbeafe',
        benefits: [
            'Speaking, Reading, Grammar & Practice intensif',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 17, slug: 'comprehensive-semi-private-online', image: IMG_ONLINE_LEARN,
        title: 'Semi Private — Comprehensive',
        subtitle: 'Program all-in-one: speaking, reading, writing, listening, dan pengenalan budaya Mandarin — semua dikupas tuntas berdua.',
        type: 'online', cat: 'adult', pricingTier: 'semi-private',
        level: 'Semua Level', badge: 'All-in-One 📚',
        price: 3599000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '全', thumbFrom: '#fef9ec', thumbTo: '#fef3c7',
        benefits: [
            'Materi lengkap: speaking, reading, writing & listening',
            'Bantu belajar PR & persiapan ujian',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 18, slug: 'native-semi-private-online', image: IMG_MANDARIN,
        title: 'Semi Private — Native Speaker',
        subtitle: 'Belajar langsung dari native speaker China! Aksen murni, ekspresi natural, dan kultur otentik yang tidak ada di buku.',
        type: 'online', cat: 'adult', pricingTier: 'semi-private',
        level: 'Semua Level', badge: '🇨🇳 Native Class',
        price: 5279000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_NATIVE,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '华', thumbFrom: '#fef2f2', thumbTo: '#fff7ed',
        benefits: [
            'Speaking, Reading, Grammar & Practice dengan penutur asli',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 19, slug: 'traditional-semi-private-online', image: IMG_CALLIGRAPHY,
        title: 'Semi Private — Mandarin Tradisional',
        subtitle: 'Kuasai aksara 繁體字 yang digunakan di Taiwan & Hong Kong. Ideal untuk persiapan studi, bisnis, atau menelusuri warisan budaya.',
        type: 'online', cat: 'adult', pricingTier: 'semi-private',
        level: 'Semua Level', badge: '繁體 Traditional',
        price: 3799000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '繁', thumbFrom: '#fdf4ff', thumbTo: '#f5f3ff',
        benefits: [
            'Speaking, Reading, Grammar & Practice dengan aksara tradisional',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    /* ══════════════════════════════════════════════════════════════
       BISNIS — SEMI PRIVATE ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 20, slug: 'bisnis-beginner-semi-private', image: IMG_BIZ_MEETING,
        title: 'Bisnis Semi Private — Beginner',
        subtitle: 'Eksklusif 2 murid, 1 guru bisnis. Mulai dari nol: perkenalan profesional, komunikasi kantor, dan dasar negosiasi dalam Mandarin.',
        type: 'online', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Beginner', badge: null,
        price: 3099000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        benefits: [
            'Materi kantor, meeting & kerja sama bisnis',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 21, slug: 'bisnis-intermediate-semi-private', image: IMG_BIZ_OFFICE,
        title: 'Bisnis Semi Private — Intermediate',
        subtitle: 'Negosiasi kontrak, presentasi produk ke klien asing, dan komunikasi profesional level menengah — semua dipraktikkan intensif berdua.',
        type: 'online', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Intermediate', badge: null,
        price: 3299000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '谈', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
        benefits: [
            'Materi kantor, negosiasi & presentasi bisnis',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 22, slug: 'bisnis-advance-semi-private', image: IMG_BIZ_TEAM,
        title: 'Bisnis Semi Private — Advanced',
        subtitle: 'Level puncak bisnis Mandarin! Siap deal proyek internasional, tulis laporan formal, dan pimpin rapat dalam Mandarin bersama partner belajarmu.',
        type: 'online', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Advanced', badge: 'Top Level 🏆',
        price: 3799000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '合', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        benefits: [
            'Materi deal internasional, laporan & rapat formal',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
            'Tidak perlu cari teman — kami bantu carikan!',
        ],
    },

    {
        id: 23, slug: 'bisnis-annual-semi-private', image: IMG_BIZ_MEETING,
        title: 'Bisnis Semi Private — Paket Tahunan',
        subtitle: 'Investasi karir setahun penuh! Dari dasar hingga mahir bisnis Mandarin bersama 1 teman belajar — hemat dan terstruktur.',
        type: 'online', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis All Level', badge: 'Paket Hemat 💰',
        price: 19200000, duration: 'per tahun',
        maxS: 2, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: 'Fleksibel, min 2 murid',
        hanzi: '年', thumbFrom: '#f0f9ff', thumbTo: '#dbeafe',
        benefits: [
            'Kurikulum penuh dari beginner hingga advanced',
            'Free rekaman semua sesi',
            'Free Grup WA seumur hidup',
            'Hemat dibanding daftar per paket',
        ],
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT — PRIVATE ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 24, slug: 'hsk-private-online', image: IMG_TUTORING,
        title: 'Private HSK — Semua Level (HSK 1–6)',
        subtitle: '1-on-1 persiapan tes HSK resmi yang paling intensif. Tips, trik, latihan soal, dan simulasi ujian sesuai standar HSK terkini.',
        type: 'online', cat: 'adult', pricingTier: 'private',
        level: 'HSK 1–6', badge: 'Certified Prep 📜',
        price: 11190000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: 'Fleksibel',
        hanzi: '试', thumbFrom: '#f1f5f9', thumbTo: '#e2e8f0',
        isPrivate: true,
        benefits: [
            'Persiapan khusus ujian HSK resmi (HSK 1–6)',
            'Free tips & trik lolos HSK',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
        ],
    },

    {
        id: 25, slug: 'comprehensive-private-online', image: IMG_ADULT_STUDY,
        title: 'Private — Comprehensive Class',
        subtitle: 'Semua aspek Mandarin dalam satu program privat yang terstruktur — dari speaking, reading, writing, hingga listening — mulai dari nol.',
        type: 'online', cat: 'adult', pricingTier: 'private',
        level: 'Semua Level', badge: 'All-in-One 📚',
        price: 4199000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: 'Fleksibel',
        hanzi: '全', thumbFrom: '#fef9ec', thumbTo: '#fef3c7',
        isPrivate: true,
        benefits: [
            'Speaking, Reading, Grammar & Practice lengkap',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
        ],
    },

    {
        id: 26, slug: 'native-private-online', image: IMG_MANDARIN,
        title: 'Private — Native Speaker 1-on-1',
        subtitle: 'Belajar 1-on-1 langsung dari native speaker China. Aksen murni, idiom natural, ekspresi sehari-hari yang benar-benar dipakai orang China.',
        type: 'online', cat: 'adult', pricingTier: 'private',
        level: 'Semua Level', badge: '🇨🇳 Native 1-on-1',
        price: 11399000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_NATIVE,
        batch: NO_BATCH,
        schedule: 'Fleksibel',
        hanzi: '华', thumbFrom: '#fef2f2', thumbTo: '#fff7ed',
        isPrivate: true,
        benefits: [
            'Speaking, Reading, Grammar & Practice dengan penutur asli',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
        ],
    },

    {
        id: 27, slug: 'traditional-private-online', image: IMG_CALLIGRAPHY,
        title: 'Private — Mandarin Tradisional',
        subtitle: 'Kuasai 繁體字 secara privat dan intensif — persiapan ke Taiwan, Hong Kong, ujian budaya, atau sekadar bangga bisa membaca aksara klasik.',
        type: 'online', cat: 'adult', pricingTier: 'private',
        level: 'Semua Level', badge: '繁體 Traditional',
        price: 4599000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: 'Fleksibel',
        hanzi: '繁', thumbFrom: '#fdf4ff', thumbTo: '#f5f3ff',
        isPrivate: true,
        benefits: [
            'Speaking, Reading, Grammar & Practice aksara tradisional',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
        ],
    },

    /* ══════════════════════════════════════════════════════════════
       BISNIS — PRIVATE ONLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 28, slug: 'bisnis-private-online', image: IMG_BIZ_OFFICE,
        title: 'Private Bisnis Mandarin — Semua Level',
        subtitle: 'Satu guru, satu kamu. Kuasai bahasa bisnis Mandarin dari level manapun — materi disesuaikan langsung dengan industri dan kebutuhan karirmu.',
        type: 'online', cat: 'bisnis', pricingTier: 'private',
        level: 'Bisnis All Level', badge: 'Executive 💎',
        price: 8999000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: 'Fleksibel',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        isPrivate: true,
        benefits: [
            'Materi disesuaikan industri & kebutuhan karirmu',
            'Free trial 30 menit',
            'Free rekaman kelas & Free Grup WA seumur hidup',
        ],
    },

    /* ══════════════════════════════════════════════════════════════
       KIDS GROUP — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 29, slug: 'kids-a1-group-offline', image: IMG_KIDS_CLASS,
        title: 'Kids Class Group A1',
        subtitle: 'A1 (3–4 Tahun): Kenalkan si kecil pada Mandarin sejak dini! Kelas kelompok kecil (min 3, max 5 anak) — metode bermain yang seru dan efektif.',
        type: 'offline', cat: 'kids', pricingTier: 'group',
        level: 'A1 — Kids', badge: 'Usia 3–4 Thn 🧸',
        price: 2350000, duration: '3 bulan / 24 sesi',
        maxS: 5, enrolled: 0,
        teacher: T_KOKO,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '玩', thumbFrom: '#fce7f3', thumbTo: '#fff7ed',
        age: '3–4 thn', location: OFFLINE_LOC,
        benefits: KIDS_GROUP_BENEFITS,
    },

    {
        id: 30, slug: 'kids-a2-group-offline', image: IMG_KIDS_FUN,
        title: 'Kids Class Group A2',
        subtitle: 'A2 (5–6 Tahun): Fondasi Mandarin yang kuat untuk anak usia 5–6 tahun. Belajar bersama teman seumuran dalam kelas kelompok yang interaktif.',
        type: 'offline', cat: 'kids', pricingTier: 'group',
        level: 'A2 — Kids', badge: 'Usia 5–6 Thn 🎨',
        price: 2350000, duration: '3 bulan / 24 sesi',
        maxS: 5, enrolled: 0,
        teacher: T_KOKO,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '乐', thumbFrom: '#fef3c7', thumbTo: '#fce7f3',
        age: '5–6 thn', location: OFFLINE_LOC,
        benefits: KIDS_GROUP_BENEFITS,
    },

    {
        id: 31, slug: 'kids-b1-group-offline', image: IMG_KIDS_STUDY,
        title: 'Kids Class Group B1',
        subtitle: 'B1 (7–9 Tahun): Perluas kosakata dan kemampuan membaca Mandarin. Kelas kelompok yang menyenangkan untuk anak usia sekolah dasar.',
        type: 'offline', cat: 'kids', pricingTier: 'group',
        level: 'B1 — Kids', badge: 'Usia 7–9 Thn 📚',
        price: 2650000, duration: '3 bulan / 24 sesi',
        maxS: 5, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '学', thumbFrom: '#fff7ed', thumbTo: '#fef9ec',
        age: '7–9 thn', location: OFFLINE_LOC,
        benefits: KIDS_GROUP_BENEFITS,
    },

    {
        id: 32, slug: 'kids-b2-group-offline', image: IMG_CLASSROOM,
        title: 'Kids Class Group B2',
        subtitle: 'B2 (10–12 Tahun): Tingkatkan kemampuan Mandarin ke level lebih tinggi — percakapan, membaca, dan menulis aksara dengan benar.',
        type: 'offline', cat: 'kids', pricingTier: 'group',
        level: 'B2 — Kids', badge: 'Usia 10–12 Thn ⭐',
        price: 2650000, duration: '3 bulan / 24 sesi',
        maxS: 5, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '进', thumbFrom: '#ecfdf5', thumbTo: '#d1fae5',
        age: '10–12 thn', location: OFFLINE_LOC,
        benefits: KIDS_GROUP_BENEFITS,
    },

    {
        id: 33, slug: 'teenager1-group-offline', image: IMG_GROUP_STUDY,
        title: 'Teenager 1 Kids Class',
        subtitle: 'Teenager 1 (13–15 Tahun): Program Mandarin khusus remaja — relevan, modern, dan dikemas dengan cara yang bikin belajar terasa asik.',
        type: 'offline', cat: 'kids', pricingTier: 'group',
        level: 'Teenager 1', badge: 'Usia 13–15 Thn 🚀',
        price: 2950000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '说', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        age: '13–15 thn', location: OFFLINE_LOC,
        benefits: TEEN_GROUP_BENEFITS,
    },

    {
        id: 34, slug: 'teenager2-group-offline', image: IMG_ADULT_STUDY,
        title: 'Teenager 2 Kidz Class',
        subtitle: 'Teenager 2 (16–18 Tahun): Persiapkan diri untuk dunia kuliah dan kerja! Mandarin yang relevan untuk generasi muda yang ambisius.',
        type: 'offline', cat: 'kids', pricingTier: 'group',
        level: 'Teenager 2', badge: 'Usia 16–18 Thn 🎯',
        price: 2950000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '达', thumbFrom: '#fdf4ff', thumbTo: '#f5f3ff',
        age: '16–18 thn', location: OFFLINE_LOC,
        benefits: TEEN_GROUP_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT REGULAR GROUP — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 35, slug: 'regular-beginner1-offline', image: IMG_CLASSROOM,
        title: 'Beginner 1 Regular Class',
        subtitle: 'Mulai dari nol dengan percaya diri! Kelas regular tatap muka untuk dewasa — kuasai dasar percakapan Mandarin dalam 3 bulan.',
        type: 'offline', cat: 'adult', pricingTier: 'group',
        level: 'Regular Beginner 1', badge: 'Mulai dari Nol ✨',
        price: 2100000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '汉', thumbFrom: '#ffe4e6', thumbTo: '#fef3c7',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 36, slug: 'regular-beginner2-offline', image: IMG_GROUP_STUDY,
        title: 'Beginner 2 Regular Class',
        subtitle: 'Lanjutkan fondasi dari Beginner 1! Perluas kosakata, pelajari struktur kalimat lebih kompleks, dan mulai ngobrol dengan lancar.',
        type: 'offline', cat: 'adult', pricingTier: 'group',
        level: 'Regular Beginner 2', badge: null,
        price: 2100000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '文', thumbFrom: '#fef3c7', thumbTo: '#fff7ed',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 37, slug: 'regular-intermediate1-offline', image: IMG_ADULT_STUDY,
        title: 'Intermediate 1 Regular Class',
        subtitle: 'Naik ke level menengah! Komunikasikan ide yang lebih kompleks, baca teks sederhana, dan perkuat kemampuan listening dalam Mandarin.',
        type: 'offline', cat: 'adult', pricingTier: 'group',
        level: 'Regular Intermediate 1', badge: null,
        price: 2700000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '进', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 38, slug: 'regular-intermediate2-offline', image: IMG_ONLINE_LEARN,
        title: 'Intermediate 2 Regular Class',
        subtitle: 'Perdalam kemampuan menengah — diskusikan topik sehari-hari, ekspresikan pendapat, dan mulai memahami media berbahasa Mandarin.',
        type: 'offline', cat: 'adult', pricingTier: 'group',
        level: 'Regular Intermediate 2', badge: null,
        price: 2700000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '道', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 39, slug: 'regular-advance1-offline', image: IMG_CALLIGRAPHY,
        title: 'Advance 1 Regular Class',
        subtitle: 'Level mahir — diskusi topik profesional dan abstrak, baca artikel, dan komunikasikan ide dengan nuansa bahasa yang tepat.',
        type: 'offline', cat: 'adult', pricingTier: 'group',
        level: 'Regular Advanced 1', badge: 'Mahir 🏆',
        price: 3300000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '成', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 40, slug: 'regular-advance2-offline', image: IMG_MANDARIN,
        title: 'Advance 2 Regular Class',
        subtitle: 'Puncak program regular! Setara level native speaker berpendidikan — kuasai idiom, ungkapan formal, dan teks kompleks.',
        type: 'offline', cat: 'adult', pricingTier: 'group',
        level: 'Regular Advanced 2', badge: 'Top Level 👑',
        price: 3300000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '达', thumbFrom: '#f5f3ff', thumbTo: '#ede9fe',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT BUSINESS GROUP — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 41, slug: 'bisnis-beginner1-offline', image: IMG_BIZ_MEETING,
        title: 'Beginner 1 Business Class',
        subtitle: 'Mulai karir Mandarin bisnis dari tatap muka! Perkenalan profesional, komunikasi kantor dasar, dan kosakata bisnis sehari-hari.',
        type: 'offline', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Beginner 1', badge: 'Work Ready 💼',
        price: 2100000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 42, slug: 'bisnis-beginner2-offline', image: IMG_BIZ_TEAM,
        title: 'Beginner 2 Business Class',
        subtitle: 'Tingkatkan kemampuan bisnis Mandarin — presentasi produk, negosiasi harga dasar, dan korespondensi bisnis yang profesional.',
        type: 'offline', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Beginner 2', badge: null,
        price: 2100000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '贸', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 43, slug: 'bisnis-intermediate1-offline', image: IMG_BIZ_OFFICE,
        title: 'Intermediate 1 Business Class',
        subtitle: 'Tingkat menengah bisnis — kuasai meeting formal, deal kontrak, dan komunikasi ekspor-impor dalam Mandarin yang meyakinkan.',
        type: 'offline', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Intermediate 1', badge: 'Import Export 🚢',
        price: 2700000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '合', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 44, slug: 'bisnis-intermediate2-offline', image: IMG_BIZ_MEETING,
        title: 'Intermediate 2 Business Class',
        subtitle: 'Perdalam bisnis Mandarin — laporan keuangan, manajemen proyek, dan hubungan profesional dengan mitra China tingkat lanjut.',
        type: 'offline', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Intermediate 2', badge: null,
        price: 2700000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '易', thumbFrom: '#f7fee7', thumbTo: '#d9f99d',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 45, slug: 'bisnis-advance1-offline', image: IMG_BIZ_TEAM,
        title: 'Advance 1 Business Class',
        subtitle: 'Level mahir bisnis Mandarin — pimpin rapat internasional, tulis proposal & laporan formal, dan bangun relasi bisnis yang solid.',
        type: 'offline', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Advanced 1', badge: 'Executive 🏆',
        price: 3300000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '谈', thumbFrom: '#fef3c7', thumbTo: '#fff7ed',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    {
        id: 46, slug: 'bisnis-advance2-offline', image: IMG_BIZ_OFFICE,
        title: 'Advance 2 Business Class',
        subtitle: 'Puncak bisnis Mandarin! Siap untuk proyek internasional berskala besar, negosiasi tingkat tinggi, dan kepemimpinan lintas budaya.',
        type: 'offline', cat: 'bisnis', pricingTier: 'group',
        level: 'Bisnis Advanced 2', badge: 'Top Level 💎',
        price: 3300000, duration: '3 bulan / 24 sesi',
        maxS: 8, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal menyesuaikan',
        hanzi: '业', thumbFrom: '#f5f3ff', thumbTo: '#ede9fe',
        location: OFFLINE_LOC,
        benefits: ADULT_GROUP_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       KIDS SEMI PRIVATE — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 47, slug: 'kids-semi-private-offline', image: IMG_TUTORING,
        title: 'Kids Semi Private',
        subtitle: '1 guru untuk 2 murid cilik — perhatian penuh, progres lebih cepat, dan tetap ada teman belajarnya! Tatap muka di lokasi Panda.',
        type: 'offline', cat: 'kids', pricingTier: 'semi-private',
        level: 'Semua Level', badge: 'Pilihan Smart 👑',
        price: 4800000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_KOKO,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '学', thumbFrom: '#fce7f3', thumbTo: '#ede9fe',
        age: 'Semua Usia', location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT SEMI PRIVATE — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 48, slug: 'hsk1-semi-private-offline', image: IMG_ADULT_STUDY,
        title: 'HSK 1 Semi Private',
        subtitle: 'Mulai dari nol berdua — 1 guru eksklusif, tatap muka langsung. Lebih intens, lebih cepat maju, dan lebih percaya diri berbicara.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 1', badge: null,
        price: 4800000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '汉', thumbFrom: '#ffe4e6', thumbTo: '#fef3c7',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 49, slug: 'hsk2-semi-private-offline', image: IMG_GROUP_STUDY,
        title: 'HSK 2 Semi Private',
        subtitle: 'Perkuat level elementary berdua — percakapan, tata bahasa, dan menulis aksara lebih terstruktur dengan bimbingan intensif tatap muka.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 2', badge: null,
        price: 4800000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '语', thumbFrom: '#fef3c7', thumbTo: '#ffedd5',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 50, slug: 'conversation-semi-private-offline', image: IMG_ONLINE_LEARN,
        title: 'Conversation Beginner Semi Private',
        subtitle: 'Fokus pada kemampuan bicara! Program conversation intensif berdua — latihan dialog nyata, koreksi pelafalan, dan kepercayaan diri berbicara.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'Conversation Beginner', badge: 'Speaking Fokus 🗣️',
        price: 4800000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '说', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 51, slug: 'hsk3-semi-private-offline', image: IMG_ADVANCED,
        title: 'HSK 3 Semi Private',
        subtitle: 'Level menengah berdua — diskusikan topik sehari-hari, perkuat tata bahasa, dan siapkan diri untuk komunikasi dengan native speaker.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 3', badge: null,
        price: 12000000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '通', thumbFrom: '#f1f5f9', thumbTo: '#e2e8f0',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 52, slug: 'hsk4-semi-private-offline', image: IMG_CALLIGRAPHY,
        title: 'HSK 4 Semi Private',
        subtitle: 'Upper intermediate berdua — perluas kosakata ke 1.200+ kata, kuasai ekspresi idiomatis, dan bicara bebas tanpa ragu.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 4', badge: null,
        price: 12000000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_LIN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '升', thumbFrom: '#ecfdf5', thumbTo: '#d1fae5',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 53, slug: 'hsk5-semi-private-offline', image: IMG_TUTORING,
        title: 'HSK 5 Semi Private',
        subtitle: 'Level advanced berdua — baca media China, diskusikan topik kompleks, dan komunikasi profesional setara penutur terdidik.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 5', badge: 'Beasiswa Ready 🎓',
        price: 14400000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '成', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 54, slug: 'hsk6-semi-private-offline', image: IMG_MANDARIN,
        title: 'HSK 6 Semi Private',
        subtitle: 'Puncak! Kuasai 5.000+ kosakata berdua dalam sesi intensif tatap muka — setara native speaker berpendidikan tinggi.',
        type: 'offline', cat: 'adult', pricingTier: 'semi-private',
        level: 'HSK 6', badge: 'Master Level 👑',
        price: 14400000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '达', thumbFrom: '#f5f3ff', thumbTo: '#ede9fe',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 55, slug: 'bisnis-beginner1-semi-private-offline', image: IMG_BIZ_MEETING,
        title: 'Business Beginner 1 Semi Private',
        subtitle: 'Mulai bisnis Mandarin tatap muka berdua — perkenalan profesional, kosakata kantor, dan dasar komunikasi bisnis yang langsung applicable.',
        type: 'offline', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Beginner 1', badge: null,
        price: 6400000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 56, slug: 'bisnis-beginner2-semi-private-offline', image: IMG_BIZ_TEAM,
        title: 'Business Beginner 2 Semi Private',
        subtitle: 'Lanjutkan fondasi bisnis — negosiasi harga, penawaran produk, dan korespondensi bisnis level awal dalam kelas eksklusif 2 murid.',
        type: 'offline', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Beginner 2', badge: null,
        price: 6400000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '贸', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 57, slug: 'bisnis-intermediate1-semi-private-offline', image: IMG_BIZ_OFFICE,
        title: 'Business Intermediate 1 Semi Private',
        subtitle: 'Tingkat menengah bisnis berdua — deal kontrak, presentasi formal, dan ekspor-impor dalam Mandarin yang profesional dan meyakinkan.',
        type: 'offline', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Intermediate 1', badge: null,
        price: 7200000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '合', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    {
        id: 58, slug: 'bisnis-intermediate-semi-private-offline', image: IMG_BIZ_MEETING,
        title: 'Business Intermediate Semi Private',
        subtitle: 'Perdalam bisnis Mandarin menengah berdua — laporan bisnis, manajemen proyek, dan relasi dengan mitra China dalam sesi tatap muka eksklusif.',
        type: 'offline', cat: 'bisnis', pricingTier: 'semi-private',
        level: 'Bisnis Intermediate 2', badge: null,
        price: 7200000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '易', thumbFrom: '#f7fee7', thumbTo: '#d9f99d',
        location: OFFLINE_LOC,
        benefits: OFFLINE_SP_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       KIDS PRIVATE — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 59, slug: 'kids-private-offline', image: IMG_KIDS_CLASS,
        title: 'Kids Private',
        subtitle: 'Guru 100% fokus ke anak — tatap muka langsung di lokasi Panda. Materi & jadwal disesuaikan penuh dengan kebutuhan si kecil.',
        type: 'offline', cat: 'kids', pricingTier: 'private',
        level: 'Semua Level', badge: 'Premium ✨',
        price: 4800000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_KOKO,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '乐', thumbFrom: '#fce7f3', thumbTo: '#fdf4ff',
        isPrivate: true, age: 'Semua Usia', location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT PRIVATE — OFFLINE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 60, slug: 'hsk1-private-offline', image: IMG_ADULT_STUDY,
        title: 'HSK 1 Private',
        subtitle: 'Belajar dari nol secara privat tatap muka — 100% perhatian guru, materi disesuaikan, dan progres terukur sejak sesi pertama.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'HSK 1', badge: null,
        price: 4800000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '汉', thumbFrom: '#ffe4e6', thumbTo: '#fef3c7',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 61, slug: 'hsk2-private-offline', image: IMG_GROUP_STUDY,
        title: 'HSK 2 Private',
        subtitle: 'Tingkatkan ke elementary secara privat — latihan speaking intensif, koreksi pelafalan real-time, dan tata bahasa yang kuat.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'HSK 2', badge: null,
        price: 4800000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_WANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '语', thumbFrom: '#fef3c7', thumbTo: '#ffedd5',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 62, slug: 'conversation-private-offline', image: IMG_ONLINE_LEARN,
        title: 'Conversation Beginner Private',
        subtitle: 'Program conversation privat tatap muka — latihan dialog nyata 1-on-1, koreksi langsung, dan kepercayaan diri berbicara yang terbangun cepat.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'Conversation Beginner', badge: 'Speaking Fokus 🗣️',
        price: 4800000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_LI,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '说', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 63, slug: 'hsk3-private-offline', image: IMG_ADVANCED,
        title: 'HSK 3 Private',
        subtitle: 'Akselerasi ke level intermediate — sesi privat tatap muka yang fokus pada area kelemahanmu untuk hasil maksimal.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'HSK 3', badge: null,
        price: 12000000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '通', thumbFrom: '#f1f5f9', thumbTo: '#e2e8f0',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 64, slug: 'hsk4-private-offline', image: IMG_CALLIGRAPHY,
        title: 'HSK 4 Private',
        subtitle: 'Upper intermediate secara privat — kuasai 1.200+ kosakata, ekspresi idiomatis, dan komunikasi bebas dengan bimbingan 1-on-1.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'HSK 4', badge: null,
        price: 12000000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_LIN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '升', thumbFrom: '#ecfdf5', thumbTo: '#d1fae5',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 65, slug: 'hsk5-private-offline', image: IMG_TUTORING,
        title: 'HSK 5 Private',
        subtitle: 'Advanced secara privat — baca media China, diskusi profesional, dan persiapan ujian HSK 5 dengan bimbingan eksklusif tatap muka.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'HSK 5', badge: 'Beasiswa Ready 🎓',
        price: 14400000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '成', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 66, slug: 'hsk6-private-offline', image: IMG_MANDARIN,
        title: 'HSK 6 Private',
        subtitle: 'Puncak privat HSK 6 — sesi 1-on-1 tatap muka untuk kuasai Mandarin setara native speaker berpendidikan tinggi.',
        type: 'offline', cat: 'adult', pricingTier: 'private',
        level: 'HSK 6', badge: 'Master Level 👑',
        price: 14400000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '达', thumbFrom: '#f5f3ff', thumbTo: '#ede9fe',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 67, slug: 'bisnis-beginner1-private-offline', image: IMG_BIZ_MEETING,
        title: 'Business Beginner 1 Private',
        subtitle: 'Mulai bisnis Mandarin secara privat tatap muka — materi 100% disesuaikan industri dan kebutuhan kerjamu, progres lebih cepat.',
        type: 'offline', cat: 'bisnis', pricingTier: 'private',
        level: 'Bisnis Beginner 1', badge: null,
        price: 6400000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 68, slug: 'bisnis-beginner2-private-offline', image: IMG_BIZ_TEAM,
        title: 'Business Beginner 2 Private',
        subtitle: 'Tingkatkan bisnis Mandarin secara privat — negosiasi, penawaran produk, dan korespondensi bisnis level awal yang langsung dipraktikkan.',
        type: 'offline', cat: 'bisnis', pricingTier: 'private',
        level: 'Bisnis Beginner 2', badge: null,
        price: 6400000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_ZHANG,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '贸', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 69, slug: 'bisnis-intermediate1-private-offline', image: IMG_BIZ_OFFICE,
        title: 'Business Intermediate 1 Private',
        subtitle: 'Bisnis Mandarin menengah secara privat — deal kontrak, presentasi formal, dan ekspor-impor dengan fokus penuh dari guru berpengalaman.',
        type: 'offline', cat: 'bisnis', pricingTier: 'private',
        level: 'Bisnis Intermediate 1', badge: null,
        price: 7200000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '合', thumbFrom: '#f0fdf4', thumbTo: '#dcfce7',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    {
        id: 70, slug: 'bisnis-intermediate-private-offline', image: IMG_BIZ_MEETING,
        title: 'Business Intermediate Private',
        subtitle: 'Perdalam bisnis Mandarin menengah secara privat — laporan bisnis, manajemen proyek lintas budaya, dan relasi klien China tingkat lanjut.',
        type: 'offline', cat: 'bisnis', pricingTier: 'private',
        level: 'Bisnis Intermediate 2', badge: null,
        price: 7200000, duration: 'per paket',
        maxS: 1, enrolled: 0,
        teacher: T_CHEN,
        batch: NO_BATCH,
        schedule: '2 kali/minggu, jadwal fleksibel',
        hanzi: '易', thumbFrom: '#f7fee7', thumbTo: '#d9f99d',
        isPrivate: true, location: OFFLINE_LOC,
        benefits: OFFLINE_PRIVATE_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       KIDS HOME PRIVATE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 71, slug: 'kids-home-private', image: IMG_HOME_STUDY,
        title: 'Kids Home Private / Semi Private',
        subtitle: 'Guru berpengalaman kami datang langsung ke rumah si kecil — belajar di lingkungan yang nyaman & familiar bikin konsentrasi anak jauh lebih tinggi. Materi 100% disesuaikan level dan kecepatan belajar anak, tanpa perlu khawatir macet atau transport. Pilih mode Private (1 murid) atau Semi Private berdua bersama teman/saudara!',
        type: 'home-private', cat: 'kids', pricingTier: 'private',
        level: 'Semua Level', badge: '🏠 Ke Rumahmu',
        price: 9600000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_FLEX,
        batch: NO_BATCH,
        schedule: 'Fleksibel, menyesuaikan jadwalmu',
        hanzi: '家', thumbFrom: '#fce7f3', thumbTo: '#fff7ed',
        isPrivate: true, age: 'Semua Usia',
        benefits: HOME_PRIVATE_BENEFITS,
    },

    {
        id: 72, slug: 'kids-intl-school-home-private', image: IMG_HOME_LAPTOP,
        title: 'Kids International School Home Private / Semi Private',
        subtitle: 'Khusus siswa international school yang butuh pendampingan Mandarin intensif — guru kami hadir di rumah, menyesuaikan kurikulum sekolahmu secara langsung. Dari persiapan ujian bilingual, kosakata akademik, hingga percakapan tingkat tinggi. Jadwal sepenuhnya fleksibel mengikuti padatnya aktivitas si kecil.',
        type: 'home-private', cat: 'kids', pricingTier: 'private',
        level: 'International School', badge: '🌏 Intl School',
        price: 24000000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_FLEX,
        batch: NO_BATCH,
        schedule: 'Fleksibel, menyesuaikan jadwalmu',
        hanzi: '学', thumbFrom: '#fef3c7', thumbTo: '#fce7f3',
        isPrivate: true, age: 'Semua Usia',
        benefits: HOME_PRIVATE_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       ADULT HOME PRIVATE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 73, slug: 'hsk12-home-private', image: IMG_HOME_STUDY,
        title: 'HSK 1 / 2 Home Private / Semi Private',
        subtitle: 'Mulai dari kenyamanan rumah sendiri! Guru berpengalaman datang langsung, memastikan setiap sesi fokus pada target HSK 1–2 Anda — dari pinyin, hanzi dasar, hingga percakapan sehari-hari. Pilih Private (100% fokus untukmu) atau Semi Private (berdua bersama teman) untuk efisiensi lebih. Jadwal fleksibel, progres terukur setiap sesi.',
        type: 'home-private', cat: 'adult', pricingTier: 'private',
        level: 'HSK 1–2', badge: '🏠 Ke Rumahmu',
        price: 9600000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_FLEX,
        batch: NO_BATCH,
        schedule: 'Fleksibel, menyesuaikan jadwalmu',
        hanzi: '汉', thumbFrom: '#ffe4e6', thumbTo: '#fef3c7',
        isPrivate: true,
        benefits: HOME_PRIVATE_BENEFITS,
    },

    {
        id: 74, slug: 'hsk34-home-private', image: IMG_HOME_LAPTOP,
        title: 'HSK 3 / 4 Home Private / Semi Private',
        subtitle: 'Pecahkan tembok intermediate dari rumah Anda sendiri! Guru spesialis HSK 3–4 hadir langsung dengan latihan soal, simulasi ujian, dan koreksi real-time. Targetkan penguasaan 600–1.200 kosakata, tata bahasa kompleks, dan reading speed yang cukup untuk lolos HSK 3–4. Pilih Private atau Semi Private berdua teman.',
        type: 'home-private', cat: 'adult', pricingTier: 'private',
        level: 'HSK 3–4', badge: 'Intermediate 🎯',
        price: 28800000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_FLEX,
        batch: NO_BATCH,
        schedule: 'Fleksibel, menyesuaikan jadwalmu',
        hanzi: '进', thumbFrom: '#f0f9ff', thumbTo: '#e0f2fe',
        isPrivate: true,
        benefits: HOME_PRIVATE_BENEFITS,
    },

    {
        id: 75, slug: 'hsk56-home-private', image: IMG_HOME_STUDY,
        title: 'HSK 5 / 6 Home Private / Semi Private',
        subtitle: 'Level puncak Mandarin membutuhkan pendampingan ekstra — guru senior kami hadir di rumah untuk sesi intensif HSK 5–6. Baca artikel akademis China, kuasai idiom tinggi, dan latih penulisan esai dalam Mandarin. Ideal untuk profesional, akademisi, dan calon penerima beasiswa ke China atau Taiwan.',
        type: 'home-private', cat: 'adult', pricingTier: 'private',
        level: 'HSK 5–6', badge: 'Master Level 👑',
        price: 33600000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_FLEX,
        batch: NO_BATCH,
        schedule: 'Fleksibel, menyesuaikan jadwalmu',
        hanzi: '达', thumbFrom: '#f5f3ff', thumbTo: '#ede9fe',
        isPrivate: true,
        benefits: HOME_PRIVATE_BENEFITS,
    },

    /* ══════════════════════════════════════════════════════════════
       BISNIS HOME PRIVATE
    ══════════════════════════════════════════════════════════════ */

    {
        id: 76, slug: 'bisnis-beginner-home-private', image: IMG_BIZ_OFFICE,
        title: 'Business Beginner 1 / 2 Home Private / Semi Private',
        subtitle: 'Les bisnis Mandarin di rumah atau kantor Anda — materi langsung disesuaikan dengan industri dan kebutuhan karir spesifik Anda. Dari perkenalan bisnis Mandarin dasar, salam meeting profesional, hingga percakapan negosiasi level pemula. Pilih Private (solo) atau Semi Private (berdua kolega). Cocok untuk profesional sibuk.',
        type: 'home-private', cat: 'bisnis', pricingTier: 'private',
        level: 'Bisnis Beginner 1–2', badge: '💼 Executive',
        price: 24000000, duration: 'per paket',
        maxS: 2, enrolled: 0,
        teacher: T_FLEX,
        batch: NO_BATCH,
        schedule: 'Fleksibel, menyesuaikan jadwalmu',
        hanzi: '商', thumbFrom: '#eff6ff', thumbTo: '#dbeafe',
        isPrivate: true,
        benefits: HOME_PRIVATE_BENEFITS,
    },
];

/* ─────────────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────────────── */
export const TESTIMONIALS: Testimonial[] = [
    { initials: 'SR', name: 'Siti Rahma', achievement: 'Beasiswa CSC Full — Tsinghua University', quote: 'Mulai dari nol tahun 2022. Sekarang semester 3 di Tsinghua dengan beasiswa penuh. Panda benar-benar mengubah hidup saya!', level: 'HSK 5', emoji: '🎓', gradient: 'from-rose-400 to-orange-400', avatar: 'https://i.pravatar.cc/150?img=47', accentHex: '#E63946' },
    { initials: 'AS', name: 'Andre Saputra', achievement: 'Business Development — Trade Co. Shenzhen', quote: 'Gaji naik 40% setelah bisa Mandarin. Sekarang jadi penghubung tim Indonesia & Shenzhen tanpa translator.', level: 'Business Mandarin', emoji: '💼', gradient: 'from-amber-400 to-orange-500', avatar: 'https://i.pravatar.cc/150?img=12', accentHex: '#F59E0B' },
    { initials: 'MY', name: 'Ibu Yanti', achievement: 'Juara 1 Lomba Pidato Mandarin Nasional', quote: 'Anak saya 9 tahun request belajar tiap hari! 2 tahun ikut, sudah menang kompetisi pidato Mandarin tingkat nasional.', level: 'Kids Level 4', emoji: '🏆', gradient: 'from-emerald-400 to-teal-500', avatar: 'https://i.pravatar.cc/150?img=45', accentHex: '#10B981' },
    { initials: 'RA', name: 'Dr. Rina Aulia', achievement: 'Exchange ke Shanghai Jiao Tong University', quote: 'Sebagai dosen sibuk, kelas privat fleksibelnya pas banget. 8 bulan lulus HSK 5 dan dapat beasiswa exchange!', level: 'HSK 5', emoji: '✨', gradient: 'from-pink-400 to-rose-500', avatar: 'https://i.pravatar.cc/150?img=48', accentHex: '#EC4899' },
    { initials: 'BS', name: 'Budi Santoso', achievement: 'Interpreter BUMN — Proyek BRI China', quote: 'Dari HSK 1 sampai 4 di Panda, sekarang jadi interpreter proyek infrastruktur BRI senilai triliunan rupiah.', level: 'HSK 4', emoji: '🌏', gradient: 'from-sky-400 to-blue-500', avatar: 'https://i.pravatar.cc/150?img=15', accentHex: '#0EA5E9' },
    { initials: 'FA', name: 'Fajar Alam', achievement: 'LPDP + Beasiswa Penuh — Beijing University', quote: 'Dari mahasiswa biasa ke penerima beasiswa ganda LPDP & pemerintah China. Guru Panda sabar dan sangat profesional!', level: 'HSK 6', emoji: '🏅', gradient: 'from-amber-400 to-yellow-500', avatar: 'https://i.pravatar.cc/150?img=14', accentHex: '#8B5CF6' },
    { initials: 'NR', name: 'Nur Rahmawati', achievement: 'Marketing Manager — P&G China Division', quote: 'Dulu takut salah ucap. Sekarang presentasi quarterly di depan tim Shanghai. Panda kasih confidence yang nyata!', level: 'Business Mandarin', emoji: '💪', gradient: 'from-purple-400 to-violet-500', avatar: 'https://i.pravatar.cc/150?img=46', accentHex: '#A855F7' },
    { initials: 'HW', name: 'Hendri Wahyu', achievement: 'Software Engineer — Alibaba Cloud Jakarta', quote: 'Technical interview dalam Mandarin di Alibaba — lulus! Tanpa Panda, itu mustahil. Best investment terbaik dalam karir!', level: 'HSK 4', emoji: '💻', gradient: 'from-blue-400 to-sky-500', avatar: 'https://i.pravatar.cc/150?img=13', accentHex: '#F59E0B' },
];

/* ─────────────────────────────────────────────────────────────────
   FAQs
───────────────────────────────────────────────────────────────── */
export const FAQS: FaqItem[] = [
    { cat: 'umum', icon: '🐣', q: 'Saya pemula absolut, apakah bisa mulai?', a: 'Tentu! 70% siswa kami mulai dari nol. Program HSK 1 dan Kids Mandarin dirancang untuk pemula absolut. Ada kelas trial gratis 30 menit sebelum kamu commit.' },
    { cat: 'umum', icon: '⏱️', q: 'Berapa lama sampai bisa lulus HSK 4?', a: 'Rata-rata 10–14 bulan dari pemula, 2x kelas/minggu + 30 menit latihan mandiri/hari. Dengan kelas intensif bisa lebih cepat di 8 bulan.' },
    { cat: 'umum', icon: '💳', q: 'Apakah ada cicilan?', a: 'Ya, tersedia cicilan tanpa bunga via partner kami. Hubungi admin untuk simulasi paket cicilan sesuai budget-mu.' },
    { cat: 'umum', icon: '📍', q: 'Kelas offline ada di mana saja?', a: 'Saat ini ada di 3 lokasi: MOI Kelapa Gading (Jakut), Pluit Penjaringan (Jakut), dan Citra 2 Kalideres (Jakbar). Kelas online via VOOV Meeting dari mana saja.' },
    { cat: 'kebijakan', icon: '🏫', q: 'Bagaimana kebijakan izin untuk kelas Group?', a: 'Untuk kelas Group, sesi yang diizinkan tidak dapat diganti jadwal dan dianggap hangus. Namun setiap sesi direkam via VOOV Meeting — kamu tetap bisa akses ulang materi kapan saja.' },
    { cat: 'kebijakan', icon: '👤', q: 'Bagaimana kebijakan izin untuk kelas Private?', a: 'Kelas Private lebih fleksibel: maksimal 2x izin per 8 sesi (25%). Sesi bisa dijadwalkan ulang — masa aktif 60 hari sejak sesi pertama.' },
    { cat: 'kebijakan', icon: '👩‍🏫', q: 'Bagaimana kalau guru yang izin?', a: 'Panda akan mengganti dengan sesi di hari lain sesuai kesepakatan, atau menunjuk guru pengganti setara. Kamu tidak akan kehilangan satu sesi pun — dijamin!' },
    { cat: 'kebijakan', icon: '💻', q: 'Apa platform kelas online?', a: 'Semua kelas online menggunakan VOOV Meeting (Tencent). Setiap sesi direkam otomatis — akses link rekaman via admin kapan saja untuk review.' },
    { cat: 'kebijakan', icon: '✅', q: 'Apa yang terjadi setelah saya bayar?', a: 'Kamu otomatis terdaftar. Tim admin menghubungi via WhatsApp dalam 1×24 jam: link grup kelas, jadwal, link VOOV Meeting, dan materi awal. Selamat datang di keluarga Panda! 🐼' },
    { cat: 'referral', icon: '🎁', q: 'Bagaimana cara kerja Program Referral Panda?', a: 'Daftar sebagai Panda Affiliate, dapat kode referral unik, bagikan ke teman. Setiap teman yang mendaftar menggunakan kode-mu → cashback langsung ke rekening. Tidak ada batas maksimal!' },
];

export const FAQ_CATS: FaqCategoryTab[] = [
    { key: 'all',       label: 'Semua',           icon: '📋' },
    { key: 'umum',      label: 'Umum',             icon: '💬' },
    { key: 'kebijakan', label: 'Kebijakan Kelas',  icon: '📜' },
    { key: 'referral',  label: 'Referral',         icon: '🎁' },
];

export const PARTNERS: string[] = [
    'Tsinghua 清华', 'Peking University 北大', 'Fudan 复旦',
    'Shanghai Jiao Tong', 'Zhejiang 浙大', 'BLCU 北语', 'Nanjing 南京', 'Tianjin 天津',
];

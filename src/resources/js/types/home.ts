export interface ClassBatch {
    no: number | null;
    start: string | null;
    end: string | null;
    deadline: string | null;
}

export interface ClassTeacher {
    name: string;
    avatar: string;
    gradient: string;
}

export interface CourseClass {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    type: 'online' | 'offline' | 'home-private';
    cat: 'adult' | 'kids' | 'bisnis';
    pricingTier: 'group' | 'semi-private' | 'private';
    level: string;
    badge?: string | null;
    price: number;
    priceMax?: number;
    duration: string;
    maxS: number;
    enrolled: number;
    teacher: ClassTeacher;
    batch: ClassBatch;
    schedule: string;
    hanzi: string;
    thumbFrom: string;
    thumbTo: string;
    benefits?: string[];
    isFull?: boolean;
    isPrivate?: boolean;
    age?: string;
    location?: string;
    image?: string;
}

export interface Testimonial {
    initials: string;
    name: string;
    achievement: string;
    quote: string;
    level: string;
    emoji: string;
    gradient: string;
    avatar?: string;
    accentHex?: string;
}

export type FaqCategory = 'umum' | 'kebijakan' | 'referral';

export interface FaqItem {
    cat: FaqCategory;
    icon: string;
    q: string;
    a: string;
}

export interface FaqCategoryTab {
    key: 'all' | FaqCategory;
    label: string;
    icon: string;
}

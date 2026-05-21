export function fmtDate(s: string | null): string {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtRp(n: number): string {
    return 'Rp ' + n.toLocaleString('id-ID');
}

export function daysUntil(s: string | null): number | null {
    if (!s) return null;
    return Math.ceil((new Date(s).getTime() - Date.now()) / 86400000);
}

export function seatColor(enrolled: number, maxS: number): string {
    const p = enrolled / maxS;
    return p >= 1
        ? 'text-red-500 dark:text-red-400'
        : p >= 0.75
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-emerald-500 dark:text-emerald-400';
}

export function seatBarBg(enrolled: number, maxS: number): string {
    const p = enrolled / maxS;
    return p >= 1 ? '#ef4444' : p >= 0.75 ? '#f59e0b' : '#10b981';
}

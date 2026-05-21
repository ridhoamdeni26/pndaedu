import { useState, useEffect, useRef } from 'react';

interface CounterProps {
    target: number;
    suffix?: string;
}

export function Counter({ target, suffix = '' }: CounterProps) {
    const [val, setVal] = useState(0);
    const elRef = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || started.current) return;
                started.current = true;
                let t0: number | null = null;
                const dur = 1800;
                const tick = (ts: number) => {
                    if (!t0) t0 = ts;
                    const progress = Math.min((ts - t0) / dur, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    setVal(Math.floor(ease * target));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                obs.disconnect();
            },
            { threshold: 0.4 },
        );
        if (elRef.current) obs.observe(elRef.current);
        return () => obs.disconnect();
    }, [target]);

    return (
        <span ref={elRef}>
            {val.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
}

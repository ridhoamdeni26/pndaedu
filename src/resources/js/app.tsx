import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import MarketingLayout from '@/layouts/marketing-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    layout: (name) => {
        switch (true) {
            // Public marketing site — Navbar + Footer
            case name.startsWith('frontend/'):
                return MarketingLayout;
            // Authentication flows
            case name.startsWith('auth/'):
                return AuthLayout;
            // Backend — settings & teams share nested sidebar + settings layout
            case name.startsWith('backend/settings/'):
            case name.startsWith('backend/teams/'):
                return [AppLayout, SettingsLayout];
            // Backend — all other authenticated pages use sidebar layout
            case name.startsWith('backend/'):
                return AppLayout;
            // Fallback
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

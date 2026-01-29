'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { FarcasterProvider } from '@/lib/farcaster';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by only rendering after client-side mount
    if (!mounted) {
        return (
            <div className="min-h-screen bg-black" />
        );
    }

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#9333ea', // Purple
                        borderRadius: 'large',
                        overlayBlur: 'small',
                    })}
                    modalSize="compact"
                >
                    <FarcasterProvider>
                        {children}
                    </FarcasterProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

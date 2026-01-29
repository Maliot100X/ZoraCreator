'use client';

import { useEffect, useState, createContext, useContext, ReactNode, useMemo } from 'react';

// Use the new SDK if possible, but keep compatibility
interface FarcasterUser {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
}

interface FrameContextType {
    context: any | null;
    isLoaded: boolean;
    isInFrame: boolean;
    user: FarcasterUser | null;
    actions: {
        openUrl: (url: string) => Promise<void>;
        close: () => Promise<void>;
        ready: () => Promise<void>;
    };
}

const FrameContext = createContext<FrameContextType>({
    context: null,
    isLoaded: false,
    isInFrame: false,
    user: null,
    actions: {
        openUrl: async () => { },
        close: async () => { },
        ready: async () => { },
    },
});

export function useFarcasterContext() {
    return useContext(FrameContext);
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
    const [context, setContext] = useState<any | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState<FarcasterUser | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Try to import the new SDK, fallback to old one if needed
                let sdk;
                try {
                    const mod = await import('@farcaster/frame-sdk');
                    sdk = mod.default || mod;
                } catch (e) {
                    console.log("Could not load @farcaster/frame-sdk");
                    return;
                }

                const frameContext = await sdk.context;
                setContext(frameContext);

                if (frameContext?.user) {
                    setUser({
                        fid: frameContext.user.fid,
                        username: frameContext.user.username,
                        displayName: frameContext.user.displayName,
                        pfpUrl: frameContext.user.pfpUrl,
                    });
                }

                await sdk.actions.ready();
            } catch (error) {
                console.log('Farcaster SDK init failed');
            } finally {
                setIsLoaded(true);
            }
        };

        if (typeof window !== 'undefined') {
            init();
        }
    }, []);

    const actions = useMemo(() => ({
        openUrl: async (url: string) => {
            try {
                const { default: sdk } = await import('@farcaster/frame-sdk');
                await sdk.actions.openUrl(url);
            } catch (error) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        },
        close: async () => {
            try {
                const { default: sdk } = await import('@farcaster/frame-sdk');
                await sdk.actions.close();
            } catch (error) {
                console.log('Cannot close');
            }
        },
        ready: async () => {
            try {
                const { default: sdk } = await import('@farcaster/frame-sdk');
                await sdk.actions.ready();
            } catch (error) {
                console.log('Cannot signal ready');
            }
        },
    }), []);

    const value = useMemo(() => ({
        context,
        isLoaded,
        isInFrame: !!context,
        user,
        actions
    }), [context, isLoaded, user, actions]);

    return (
        <FrameContext.Provider value={value}>
            {children}
        </FrameContext.Provider>
    );
}

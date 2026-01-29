'use client';

import { useEffect, useState, createContext, useContext, ReactNode, useMemo } from 'react';

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
            if (typeof window === 'undefined') return;

            try {
                // Bypass TS with any for the dynamic SDK
                const sdkModule = await import('@farcaster/frame-sdk').catch(() => null);
                const sdk = (sdkModule?.default || sdkModule) as any;

                if (sdk && sdk.context) {
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

                    if (sdk.actions && sdk.actions.ready) {
                        await sdk.actions.ready();
                    }
                }
            } catch (error) {
                console.warn('Farcaster SDK init failed');
            } finally {
                setIsLoaded(true);
            }
        };

        init();
    }, []);

    const actions = useMemo(() => ({
        openUrl: async (url: string) => {
            try {
                const sdkModule = await import('@farcaster/frame-sdk').catch(() => null);
                const sdk = (sdkModule?.default || sdkModule) as any;
                if (sdk?.actions?.openUrl) {
                    await sdk.actions.openUrl(url);
                } else {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            } catch (error) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        },
        close: async () => {
            try {
                const sdkModule = await import('@farcaster/frame-sdk').catch(() => null);
                const sdk = (sdkModule?.default || sdkModule) as any;
                if (sdk?.actions?.close) {
                    await sdk.actions.close();
                }
            } catch (error) {
                console.log('Cannot close');
            }
        },
        ready: async () => {
            try {
                const sdkModule = await import('@farcaster/frame-sdk').catch(() => null);
                const sdk = (sdkModule?.default || sdkModule) as any;
                if (sdk?.actions?.ready) {
                    await sdk.actions.ready();
                }
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

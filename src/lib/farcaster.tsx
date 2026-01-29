'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Farcaster context type (simplified for compatibility)
interface FarcasterUser {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
}

interface FrameContextType {
    context: unknown | null;
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
    const [context, setContext] = useState<unknown | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState<FarcasterUser | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Dynamically import SDK to avoid SSR issues
                const { default: sdk } = await import('@farcaster/frame-sdk');
                const frameContext = await sdk.context;
                setContext(frameContext);

                // Extract user info if available
                if (frameContext?.user) {
                    setUser({
                        fid: frameContext.user.fid,
                        username: frameContext.user.username,
                        displayName: frameContext.user.displayName,
                        pfpUrl: frameContext.user.pfpUrl,
                    });
                }

                // Signal to Farcaster that the frame is ready
                await sdk.actions.ready();
            } catch (error) {
                console.log('Not in a Farcaster frame context');
            } finally {
                setIsLoaded(true);
            }
        };

        init();
    }, []);

    const isInFrame = !!context;

    const actions = {
        openUrl: async (url: string) => {
            try {
                const { default: sdk } = await import('@farcaster/frame-sdk');
                await sdk.actions.openUrl(url);
            } catch (error) {
                // Fallback for non-frame context
                window.open(url, '_blank');
            }
        },
        close: async () => {
            try {
                const { default: sdk } = await import('@farcaster/frame-sdk');
                await sdk.actions.close();
            } catch (error) {
                console.log('Cannot close - not in frame');
            }
        },
        ready: async () => {
            try {
                const { default: sdk } = await import('@farcaster/frame-sdk');
                await sdk.actions.ready();
            } catch (error) {
                console.log('Cannot signal ready - not in frame');
            }
        },
    };

    return (
        <FrameContext.Provider value={{ context, isLoaded, isInFrame, user, actions }}>
            {children}
        </FrameContext.Provider>
    );
}

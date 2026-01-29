'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CoinCard, CoinCardSkeleton } from '@/components/CoinCard';
import { CoinInfo } from '@/lib/zora';
import { ArrowLeft, Wallet, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MyCoinsPage() {
    const { address, isConnected } = useAccount();
    const [coins, setCoins] = useState<CoinInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isConnected && address) {
            fetchUserCoins();
        }
    }, [isConnected, address]);

    const fetchUserCoins = async () => {
        if (!address) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/coins?creator=${address}`);
            if (response.ok) {
                const data = await response.json();
                setCoins(data.coins || []);
            }
        } catch (error) {
            console.error('Error fetching user coins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Not connected state
    if (!isConnected) {
        return (
            <div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="max-w-md mx-auto mt-12">
                    <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">View Your Tokens</h2>
                        <p className="text-white/60 mb-6">
                            Connect your wallet to see the tokens you've created on Zora Protocol.
                        </p>
                        <div className="flex justify-center">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Tokens</h1>
                    <p className="text-white/60">
                        Tokens you've created on Zora Protocol
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUserCoins}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <a
                        href={`https://zora.co/profile/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
                    >
                        View on Zora
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Coins Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CoinCardSkeleton key={i} />
                    ))}
                </div>
            ) : coins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {coins.map((coin) => (
                        <CoinCard key={coin.address} coin={coin} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-12 text-center">
                    <div className="text-6xl mb-6">🪙</div>
                    <h3 className="text-xl font-bold text-white mb-3">No Tokens Yet</h3>
                    <p className="text-white/60 mb-6 max-w-md mx-auto">
                        You haven't created any tokens yet. Launch your first token and it will appear here!
                    </p>
                    <Link
                        href="/launch"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all"
                    >
                        Launch Your First Token
                    </Link>
                </div>
            )}

            {/* Stats Summary */}
            {coins.length > 0 && (
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-white/50 text-sm mb-1">Total Tokens</p>
                        <p className="text-2xl font-bold text-white">{coins.length}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-white/50 text-sm mb-1">Network</p>
                        <p className="text-2xl font-bold text-white">Base</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-white/50 text-sm mb-1">Protocol</p>
                        <p className="text-2xl font-bold text-white">Zora</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-white/50 text-sm mb-1">Connected</p>
                        <p className="text-lg font-bold text-white truncate">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { CoinCard, CoinCardSkeleton } from './CoinCard';
import { CoinInfo } from '@/lib/zora';
import { TrendingUp, RefreshCw } from 'lucide-react';

// Demo data for when API is not available
const DEMO_COINS: CoinInfo[] = [
    {
        address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        name: 'Degen Token',
        symbol: 'DEGEN',
        totalSupply: '1000000000000000000000000',
        marketCap: '5234567',
        price: '0.005234',
        priceChange24h: 12.5,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=DEGEN',
        creatorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        createdAt: new Date().toISOString(),
    },
    {
        address: '0x2345678901234567890123456789012345678901' as `0x${string}`,
        name: 'Based Chad',
        symbol: 'CHAD',
        totalSupply: '1000000000000000000000000',
        marketCap: '3456789',
        price: '0.003456',
        priceChange24h: -5.2,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=CHAD',
        creatorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        createdAt: new Date().toISOString(),
    },
    {
        address: '0x3456789012345678901234567890123456789012' as `0x${string}`,
        name: 'Moon Rocket',
        symbol: 'MOON',
        totalSupply: '1000000000000000000000000',
        marketCap: '2345678',
        price: '0.002345',
        priceChange24h: 23.8,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=MOON',
        creatorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        createdAt: new Date().toISOString(),
    },
    {
        address: '0x4567890123456789012345678901234567890123' as `0x${string}`,
        name: 'Diamond Hands',
        symbol: 'DIAMOND',
        totalSupply: '1000000000000000000000000',
        marketCap: '1987654',
        price: '0.001987',
        priceChange24h: 8.9,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=DIAMOND',
        creatorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        createdAt: new Date().toISOString(),
    },
    {
        address: '0x5678901234567890123456789012345678901234' as `0x${string}`,
        name: 'Pepe Classic',
        symbol: 'PEPE',
        totalSupply: '1000000000000000000000000',
        marketCap: '1654321',
        price: '0.001654',
        priceChange24h: -2.1,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=PEPE',
        creatorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        createdAt: new Date().toISOString(),
    },
    {
        address: '0x6789012345678901234567890123456789012345' as `0x${string}`,
        name: 'Wojak Finance',
        symbol: 'WOJAK',
        totalSupply: '1000000000000000000000000',
        marketCap: '1234567',
        price: '0.001234',
        priceChange24h: 15.3,
        imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=WOJAK',
        creatorAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        createdAt: new Date().toISOString(),
    },
];

export function TopGainers() {
    const [coins, setCoins] = useState<CoinInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCoins = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Try to fetch from API, fall back to demo data
            const response = await fetch('/api/coins');
            if (response.ok) {
                const data = await response.json();
                setCoins(data.coins || []);
            } else {
                // Use demo data
                setCoins(DEMO_COINS);
            }
        } catch (err) {
            // Use demo data on error
            setCoins(DEMO_COINS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoins();
    }, []);

    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Top Gainers</h2>
                        <p className="text-white/50 text-sm">Trending coins on Base</p>
                    </div>
                </div>

                <button
                    onClick={fetchCoins}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {/* Coins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, i) => (
                        <CoinCardSkeleton key={i} />
                    ))
                ) : coins.length > 0 ? (
                    // Coin cards
                    coins.map((coin, index) => (
                        <CoinCard key={coin.address} coin={coin} rank={index + 1} />
                    ))
                ) : (
                    // Empty state
                    <div className="col-span-full text-center py-12">
                        <p className="text-white/50 text-lg">No coins found</p>
                        <p className="text-white/30 text-sm mt-2">Be the first to launch a token!</p>
                    </div>
                )}
            </div>
        </section>
    );
}

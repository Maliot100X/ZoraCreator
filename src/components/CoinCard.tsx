'use client';

import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { CoinInfo } from '@/lib/zora';
import { formatEther } from 'viem';

interface CoinCardProps {
    coin: CoinInfo;
    rank?: number;
}

export function CoinCard({ coin, rank }: CoinCardProps) {
    const priceChangePositive = coin.priceChange24h >= 0;

    // Format market cap for display
    const formatMarketCap = (value: string) => {
        const num = parseFloat(value);
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    // Format price
    const formatPrice = (value: string) => {
        const num = parseFloat(value);
        if (num < 0.0001) return `$${num.toExponential(2)}`;
        if (num < 1) return `$${num.toFixed(6)}`;
        return `$${num.toFixed(4)}`;
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Rank Badge */}
            {rank && (
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {rank}
                </div>
            )}

            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Token Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                        {coin.imageUrl ? (
                            <img
                                src={coin.imageUrl}
                                alt={coin.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-purple-400">
                                {coin.symbol.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Token Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                            {coin.name}
                        </h3>
                        <p className="text-white/50 text-sm font-medium">
                            ${coin.symbol}
                        </p>
                    </div>

                    {/* Price Change */}
                    <div className={`
            flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium
            ${priceChangePositive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }
          `}>
                        {priceChangePositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {Math.abs(coin.priceChange24h).toFixed(2)}%
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-1">Price</p>
                        <p className="text-white font-semibold">
                            {formatPrice(coin.price)}
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-white/40 text-xs mb-1">Market Cap</p>
                        <p className="text-white font-semibold">
                            {formatMarketCap(coin.marketCap)}
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <a
                    href={`https://zora.co/coin/base:${coin.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all group-hover:shadow-lg group-hover:shadow-purple-500/25"
                >
                    Trade
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}

// Loading skeleton for coin cards
export function CoinCardSkeleton() {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-5 animate-pulse">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/10" />
                <div className="flex-1">
                    <div className="h-5 w-24 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-7 w-16 bg-white/10 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-16 bg-white/5 rounded-xl" />
                <div className="h-16 bg-white/5 rounded-xl" />
            </div>
            <div className="h-12 bg-white/10 rounded-xl" />
        </div>
    );
}

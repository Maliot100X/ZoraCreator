'use client';

import { Address } from 'viem';
import { CoinInfo } from '@/lib/zora';
import { TrendingUp, BarChart3, User, Calendar, ExternalLink } from 'lucide-react';

interface CoinCardProps {
    coin: CoinInfo;
}

export function CoinCard({ coin }: CoinCardProps) {
    const formatCurrency = (val: string) => {
        const numeric = parseFloat(val);
        if (isNaN(numeric) || numeric === 0) return '$0.00';
        if (numeric < 0.01) return '<$0.01';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(numeric);
    };

    const isPositive = coin.priceChange24h >= 0;

    return (
        <div className="group relative rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-black/40">
                <img
                    src={coin.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${coin.symbol}`}
                    alt={coin.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    <TrendingUp className={`w-3 h-3 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={`text-[10px] font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-white truncate leading-tight">{coin.name}</h3>
                    <span className="text-[10px] font-bold bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase tracking-wider">
                        ${coin.symbol}
                    </span>
                </div>

                {coin.description && (
                    <p className="text-xs text-white/50 mb-4 line-clamp-2 leading-relaxed italic">
                        "{coin.description}"
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Price</p>
                        <p className="text-sm font-black text-white">{formatCurrency(coin.price)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Mkt Cap</p>
                        <p className="text-sm font-black text-white">{formatCurrency(coin.marketCap)}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mt-auto">
                <a
                    href={`https://zora.co/collect/base:${coin.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-black hover:bg-white/90 transition-all text-sm"
                >
                    <BarChart3 className="w-4 h-4" />
                    TRADE ON ZORA
                </a>

                <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-1.5 opacity-40">
                        <User className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-bold text-white uppercase truncate max-w-[80px]">
                            {coin.creatorAddress?.slice(0, 6)}...{coin.creatorAddress?.slice(-4)}
                        </span>
                    </div>
                    <a
                        href={`https://basescan.org/address/${coin.address}`}
                        target="_blank"
                        className="opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <ExternalLink className="w-3 h-3 text-white" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export function CoinCardSkeleton() {
    return (
        <div className="rounded-3xl bg-white/5 border border-white/10 p-5 flex flex-col h-full animate-pulse">
            <div className="relative aspect-square rounded-2xl bg-white/5 mb-5" />
            <div className="flex-1">
                <div className="h-6 bg-white/5 rounded-lg w-3/4 mb-2" />
                <div className="h-4 bg-white/5 rounded-lg w-full mb-4" />
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="h-12 bg-white/5 rounded-xl" />
                    <div className="h-12 bg-white/5 rounded-xl" />
                </div>
            </div>
            <div className="h-10 bg-white/5 rounded-xl w-full" />
        </div>
    );
}

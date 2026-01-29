'use client';

import { useState, useEffect } from 'react';
import { CoinCard } from './CoinCard';
import { CoinInfo, fetchTopCoins } from '@/lib/zora';
import { RefreshCw, TrendingUp, Sparkles } from 'lucide-react';

export function TopGainers() {
    const [coins, setCoins] = useState<CoinInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCoins = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchTopCoins();
            setCoins(data);
        } catch (err) {
            console.error('Error loading coins:', err);
            setError('Failed to load coins. Please refresh.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCoins();
    }, []);

    return (
        <section className="py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                                RECENT LAUNCHES
                                <div className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">LIVE</div>
                            </h2>
                            <p className="text-white/50 font-medium">Trending tokens being born on Zora & Base</p>
                        </div>
                    </div>

                    <button
                        onClick={loadCoins}
                        disabled={isLoading}
                        className="self-start px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 group disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        {isLoading ? 'Refreshing...' : 'Refresh Feed'}
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                        ))}
                    </div>
                ) : coins.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {coins.map((coin) => (
                            <CoinCard key={coin.address} coin={coin} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-3xl bg-white/5 border border-white/10 border-dashed">
                        <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Tokens Found Yet</h3>
                        <p className="text-white/40 mb-6">Be the first one to launch a token today!</p>
                        <a
                            href="/launch"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all"
                        >
                            Start Launching
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

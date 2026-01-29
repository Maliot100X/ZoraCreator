import { TopGainers } from '@/components/TopGainers';
import { Sparkles, Rocket, TrendingUp, Coins } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-12 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Powered by Zora Protocol on Base
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Launch Your Token in{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Seconds
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-8">
          Create ERC20 tokens on Base blockchain using Zora's innovative coin protocol.
          Fair launches, automatic liquidity, and built-in rewards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/launch"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105"
          >
            <Rocket className="w-5 h-5" />
            Launch Token
          </Link>
          <a
            href="https://zora.co/coins"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
          >
            <Coins className="w-5 h-5" />
            Explore Zora
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Network', value: 'Base', icon: '⛓️' },
          { label: 'Protocol', value: 'Zora', icon: '✨' },
          { label: 'Token Type', value: 'ERC20', icon: '🪙' },
          { label: 'Liquidity', value: 'Instant', icon: '💧' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-5 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/50 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Top Gainers */}
      <TopGainers />

      {/* Features Section */}
      <section className="py-12 mt-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Why ZoraCreator?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🚀',
              title: 'Instant Launch',
              description: 'Deploy your token in seconds with automatic liquidity on Uniswap V4.',
            },
            {
              icon: '💰',
              title: 'Creator Rewards',
              description: 'Earn a share of trading fees automatically distributed by the protocol.',
            },
            {
              icon: '🛡️',
              title: 'Anti-Snipe Protection',
              description: 'Built-in early launch fee prevents bots from sniping your token.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

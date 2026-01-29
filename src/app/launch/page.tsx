import { CreateCoinForm } from '@/components/CreateCoinForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Launch Token | ZoraCreator',
    description: 'Create and launch your own ERC20 token on Base blockchain via Zora Protocol.',
};

export default function LaunchPage() {
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
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    Launch Your Token
                </h1>
                <p className="text-white/60 max-w-lg mx-auto">
                    Create an ERC20 token on Base blockchain using Zora Protocol.
                    Your token will have instant liquidity and automatic rewards.
                </p>
            </div>

            {/* Create Form */}
            <CreateCoinForm />

            {/* Info Cards */}
            <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xl mb-2">⚡</div>
                    <h3 className="text-white font-medium mb-1">No Coding Required</h3>
                    <p className="text-white/50 text-sm">Just fill the form and sign the transaction.</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xl mb-2">💧</div>
                    <h3 className="text-white font-medium mb-1">Instant Liquidity</h3>
                    <p className="text-white/50 text-sm">Your token is tradeable immediately on Uniswap.</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xl mb-2">🔗</div>
                    <h3 className="text-white font-medium mb-1">On Base Network</h3>
                    <p className="text-white/50 text-sm">Low fees and fast transactions on Coinbase's L2.</p>
                </div>
            </div>
        </div>
    );
}

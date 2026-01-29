'use client';

import { useState, useCallback } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther, Address } from 'viem';
import { getCreateCoinCalldata, buildSimpleMetadataUri } from '@/lib/zora';
import { Upload, Rocket, Check, Loader2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';

interface FormData {
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
}

export function CreateCoinForm() {
    const { address, isConnected } = useAccount();
    const { sendTransaction, data: txHash, isPending: isSending, error: sendError } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const [formData, setFormData] = useState<FormData>({
        name: '',
        symbol: '',
        description: '',
        imageUrl: '',
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate symbol from name
        if (name === 'name' && !formData.symbol) {
            const autoSymbol = value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 5);
            setFormData(prev => ({ ...prev, symbol: autoSymbol }));
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setPreviewImage(url || null);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Token name is required');
            return false;
        }
        if (!formData.symbol.trim()) {
            setError('Token symbol is required');
            return false;
        }
        if (formData.symbol.length > 10) {
            setError('Symbol must be 10 characters or less');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !address) return;

        try {
            setError(null);

            // Build metadata URI
            const metadataUri = buildSimpleMetadataUri(
                formData.name,
                formData.symbol,
                formData.description,
                formData.imageUrl || undefined
            );

            // Get calldata for creating the coin
            const callData = await getCreateCoinCalldata({
                name: formData.name,
                symbol: formData.symbol.toUpperCase(),
                uri: metadataUri,
                creator: address,
            });

            // Send the transaction
            // The SDK returns transaction parameters - cast through unknown to handle type variance
            const txParams = callData as unknown as { to: Address; data: `0x${string}`; value?: bigint };
            sendTransaction({
                to: txParams.to,
                data: txParams.data,
                value: txParams.value || BigInt(0),
            });
        } catch (err) {
            console.error('Error creating coin:', err);
            setError(err instanceof Error ? err.message : 'Failed to create coin');
        }
    };

    // Not connected state
    if (!isConnected) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
                    <p className="text-white/60 mb-6">
                        Connect your wallet to launch your own token on Base via Zora Protocol
                    </p>
                    <div className="flex justify-center">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (isConfirmed && txHash) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Token Launched! 🎉</h2>
                    <p className="text-white/60 mb-6">
                        Your token <span className="text-green-400 font-semibold">${formData.symbol}</span> has been deployed on Base!
                    </p>

                    <div className="space-y-3">
                        <a
                            href={`https://basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                        >
                            View Transaction →
                        </a>
                        <button
                            onClick={() => {
                                setFormData({ name: '', symbol: '', description: '', imageUrl: '' });
                                setPreviewImage(null);
                            }}
                            className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all"
                        >
                            Launch Another Token
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Form
    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Card */}
                <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Launch Your Token</h2>
                            <p className="text-white/50 text-sm">Create an ERC20 token on Base via Zora</p>
                        </div>
                    </div>

                    {/* Error Display */}
                    {(error || sendError) && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">
                                {error || sendError?.message || 'An error occurred'}
                            </p>
                        </div>
                    )}

                    {/* Token Name */}
                    <div className="mb-5">
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Token Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Degen Token"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            disabled={isSending || isConfirming}
                        />
                    </div>

                    {/* Token Symbol */}
                    <div className="mb-5">
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Symbol *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                            <input
                                type="text"
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleInputChange}
                                placeholder="DEGEN"
                                maxLength={10}
                                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all uppercase"
                                disabled={isSending || isConfirming}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Tell us about your token..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            disabled={isSending || isConfirming}
                        />
                    </div>

                    {/* Image URL */}
                    <div className="mb-5">
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Image URL (optional)
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="https://example.com/image.png"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            disabled={isSending || isConfirming}
                        />

                        {/* Image Preview */}
                        {previewImage && (
                            <div className="mt-3 relative inline-block">
                                <img
                                    src={previewImage}
                                    alt="Token preview"
                                    className="w-20 h-20 rounded-xl object-cover border border-white/10"
                                    onError={() => setPreviewImage(null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSending || isConfirming || !formData.name || !formData.symbol}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-purple-500/25 flex items-center justify-center gap-3"
                >
                    {isSending || isConfirming ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isConfirming ? 'Confirming...' : 'Launching...'}
                        </>
                    ) : (
                        <>
                            <Rocket className="w-5 h-5" />
                            Launch Token
                        </>
                    )}
                </button>

                {/* Transaction Status */}
                {txHash && !isConfirmed && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-blue-400 text-sm text-center">
                            Transaction submitted. Waiting for confirmation...
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
}

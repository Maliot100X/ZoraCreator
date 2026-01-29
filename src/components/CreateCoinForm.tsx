'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Address } from 'viem';
import { getCreateCoinCalldata, buildCoinMetadata } from '@/lib/zora';
import { uploadToIPFS } from '@/lib/pinata';
import { Rocket, Check, Loader2, AlertCircle, Sparkles, Wand2, ArrowRight } from 'lucide-react';

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [createdCoinAddress, setCreatedCoinAddress] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'name' && !formData.symbol) {
            const autoSymbol = value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 5);
            setFormData(prev => ({ ...prev, symbol: autoSymbol }));
        }
    };

    const generateAIContent = async (type: 'coin' | 'description') => {
        setIsGenerating(true);
        setError(null);
        try {
            const prompt = type === 'coin'
                ? (formData.name || "a cool new memecoin")
                : (formData.name + " " + formData.description);

            const res = await fetch('/api/ai', {
                method: 'POST',
                body: JSON.stringify({ prompt, type }),
            });
            const data = await res.json();

            if (type === 'coin') {
                const [name, symbol] = data.result.split('|');
                setFormData(prev => ({ ...prev, name: name?.trim() || prev.name, symbol: symbol?.trim() || prev.symbol }));
            } else {
                setFormData(prev => ({ ...prev, description: data.result }));
            }
        } catch (err) {
            setError("AI generation failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;

        setIsUploading(true);
        setError(null);

        try {
            // 1. Prepare Metadata
            const metadata = buildCoinMetadata(
                formData.name,
                formData.symbol,
                formData.description,
                formData.imageUrl
            );

            // 2. Upload to IPFS
            const ipfsUri = await uploadToIPFS(metadata);

            // 3. Get Calldata
            const callData = await getCreateCoinCalldata({
                name: formData.name,
                symbol: formData.symbol.toUpperCase(),
                uri: ipfsUri,
                creator: address,
            });

            // 4. Send Transaction
            const txParams = callData as unknown as { to: Address; data: `0x${string}`; value?: bigint };

            // Store the predicted address from Zora SDK if available
            if ((callData as any).address) {
                setCreatedCoinAddress((callData as any).address);
            }

            sendTransaction({
                to: txParams.to,
                data: txParams.data,
                value: txParams.value || BigInt(0),
            });
        } catch (err) {
            console.error('Launch Error:', err);
            setError(err instanceof Error ? err.message : 'Launch failed. Check your wallet.');
        } finally {
            setIsUploading(false);
        }
    };

    // Save to database when confirmed
    useEffect(() => {
        if (isConfirmed && address && formData.name) {
            const syncToDb = async () => {
                try {
                    await fetch('/api/db/coins', {
                        method: 'POST',
                        body: JSON.stringify({
                            address: createdCoinAddress || txHash, // Fallback to txHash if address extraction failed
                            name: formData.name,
                            symbol: formData.symbol,
                            description: formData.description,
                            imageUrl: formData.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${formData.symbol}`,
                            creator: address,
                            chainId: 8453, // Base
                        }),
                    });
                } catch (e) {
                    console.error("Failed to sync to DB:", e);
                }
            };
            syncToDb();
        }
    }, [isConfirmed, address, createdCoinAddress, txHash, formData]);

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
                <Rocket className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Launch?</h2>
                <p className="text-white/60 mb-8">Connect your wallet to start creating tokens on Base.</p>
                <div className="flex justify-center">
                    <ConnectButton />
                </div>
            </div>
        );
    }

    if (isConfirmed) {
        return (
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-green-500/10 border border-green-500/30 backdrop-blur-xl text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                    <Check className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Token Launched!</h2>
                <p className="text-green-400 font-medium mb-8">Congratulations! Your coin is now live on Base.</p>

                <div className="grid grid-cols-1 gap-4">
                    <a
                        href={`https://basescan.org/tx/${txHash}`}
                        target="_blank"
                        className="p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center justify-between"
                    >
                        View on Basescan
                        <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:opacity-90 transition-all"
                    >
                        Launch Another One
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Wand2 className="w-6 h-6 text-purple-400" />
                            <h2 className="text-xl font-bold text-white">Project Details</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => generateAIContent('coin')}
                            disabled={isGenerating}
                            className="text-xs font-bold bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1.5 rounded-full border border-purple-500/30 flex items-center gap-2 transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {isGenerating ? "Brainstorming..." : "AI Generate Name"}
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Token Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                    placeholder="e.g. Base Rocket"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Symbol</label>
                                <input
                                    type="text"
                                    name="symbol"
                                    value={formData.symbol}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all uppercase"
                                    placeholder="ROCKET"
                                    maxLength={5}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-white/40 uppercase ml-1">Description</label>
                                <button
                                    type="button"
                                    onClick={() => generateAIContent('description')}
                                    disabled={isGenerating || !formData.name}
                                    className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-all uppercase"
                                >
                                    AI Write Pitch
                                </button>
                            </div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                                placeholder="What's the utility or the meme?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                placeholder="https://..."
                            />
                            {formData.imageUrl && (
                                <div className="mt-4 flex justify-center">
                                    <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover border-2 border-purple-500/50" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSending || isConfirming || isUploading || isGenerating}
                    className="w-full h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-black text-xl rounded-3xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center justify-center gap-3">
                        {isConfirming ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> CONFIRMING...</>
                        ) : isSending || isUploading ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> LAUNCHING...</>
                        ) : (
                            <><Rocket className="w-6 h-6" /> BLAST OFF</>
                        )}
                    </span>
                </button>
            </form>
        </div>
    );
}

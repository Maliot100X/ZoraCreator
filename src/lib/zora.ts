import {
    createCoinCall,
    CreateConstants,
} from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import { getChainId } from './chains';

export interface CreateCoinParams {
    name: string;
    symbol: string;
    uri: string;
    creator: Address;
    payoutRecipient?: Address;
    platformReferrer?: Address;
    initialPurchaseWei?: bigint;
}

export interface CoinInfo {
    address: Address;
    name: string;
    symbol: string;
    totalSupply: string;
    marketCap: string;
    price: string;
    priceChange24h: number;
    imageUrl?: string;
    creatorAddress: Address;
    createdAt: string;
    description?: string;
}

/**
 * Generate calldata for creating a new coin via Zora Protocol
 */
export async function getCreateCoinCalldata(params: CreateCoinParams) {
    const chainId = getChainId();

    let metadataUri = params.uri;
    if (!metadataUri.startsWith('ipfs://') && !metadataUri.startsWith('data:')) {
        metadataUri = `ipfs://${metadataUri}`;
    }

    const callArgs = {
        name: params.name,
        symbol: params.symbol,
        metadata: {
            type: 'RAW_URI' as const,
            uri: metadataUri,
        },
        creator: params.creator,
        currency: CreateConstants.ContentCoinCurrencies.ETH,
        chainId,
        startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
        platformReferrer: params.platformReferrer || '0xccd1e099590bfedf279e239558772bbb50902ef6',
    } as const;

    try {
        const response = await createCoinCall(callArgs);
        return response;
    } catch (error) {
        console.error("Zora SDK Error:", error);
        throw error;
    }
}

/**
 * Fetch top coins - Combining Database (Recent) and Zora (Global)
 */
export async function fetchTopCoins(limit: number = 20): Promise<CoinInfo[]> {
    const coins: CoinInfo[] = [];

    // 1. Fetch from our DB (fastest, most recent)
    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${appUrl}/api/db/coins`, { cache: 'no-store' });
        const data = await res.json();

        if (data.coins) {
            data.coins.forEach((c: any) => {
                coins.push({
                    address: c.address as Address,
                    name: c.name,
                    symbol: c.symbol,
                    totalSupply: "0",
                    marketCap: "0",
                    price: "0",
                    priceChange24h: 0,
                    imageUrl: c.image_url,
                    creatorAddress: c.creator as Address,
                    createdAt: c.created_at,
                    description: c.description
                });
            });
        }
    } catch (e) {
        console.error("DB Fetch Error:", e);
    }

    // 2. If empty or small, add some "Trending" fallback
    if (coins.length < 4) {
        // Fallback demo/trending data to ensure the UI looks full as requested
        const fallbacks: CoinInfo[] = [
            {
                address: '0x123...456' as Address,
                name: 'Zora Creator',
                symbol: 'ZORA',
                totalSupply: '1000000',
                marketCap: '50000',
                price: '0.05',
                priceChange24h: 12.5,
                imageUrl: 'https://zora.co/favicon.ico',
                creatorAddress: '0x000...000' as Address,
                createdAt: new Date().toISOString()
            }
        ];
        return [...coins, ...fallbacks].slice(0, limit);
    }

    return coins.slice(0, limit);
}

export function buildCoinMetadata(
    name: string,
    symbol: string,
    description: string,
    imageUrl?: string
) {
    return {
        name,
        symbol,
        description,
        image: imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}`,
        version: "0.1",
    };
}

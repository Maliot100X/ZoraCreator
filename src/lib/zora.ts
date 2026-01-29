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
 * 1000% Real Mainnet Call
 */
export async function getCreateCoinCalldata(params: CreateCoinParams) {
    const chainId = getChainId();

    // Zora SDK expects a valid IPFS URI or Data URI
    let metadataUri = params.uri;
    if (!metadataUri.startsWith('ipfs://') && !metadataUri.startsWith('data:')) {
        metadataUri = `ipfs://${metadataUri}`;
    }

    // Platform Referral for 1000% real deployment tracking
    const PLATFORM_REFERRER = process.env.NEXT_PUBLIC_PLATFORM_WALLET as Address || '0xccd1e099590bfedf279e239558772bbb50902ef6';

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
        // Using LOW market cap for easier entry on memecoins
        startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
        platformReferrer: PLATFORM_REFERRER,
    } as const;

    try {
        console.log("Calling Zora SDK with:", JSON.stringify(callArgs, (k, v) => typeof v === 'bigint' ? v.toString() : v));
        const response = await createCoinCall(callArgs);
        return response;
    } catch (error) {
        console.error("Zora SDK Real Call Error:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate Zora contract call");
    }
}

/**
 * Fetch top coins - Fetch from DB + Fallback
 */
export async function fetchTopCoins(limit: number = 20): Promise<CoinInfo[]> {
    const coins: CoinInfo[] = [];

    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${appUrl}/api/db/coins`, { cache: 'no-store' });
        if (res.ok) {
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
        }
    } catch (e) {
        console.warn("DB Fetch Fallback Triggered");
    }

    if (coins.length === 0) {
        // Return dummy data only if DB is empty to prevent blank UI
        return [
            {
                address: '0x123...' as Address,
                name: 'Zora Creator',
                symbol: 'ZORA',
                totalSupply: '1000000',
                marketCap: '50000',
                price: '0.05',
                priceChange24h: 4.20,
                imageUrl: 'https://zora.co/favicon.ico',
                creatorAddress: '0x000...' as Address,
                createdAt: new Date().toISOString()
            }
        ];
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

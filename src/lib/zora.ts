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
}

/**
 * Generate calldata for creating a new coin via Zora Protocol
 */
export async function getCreateCoinCalldata(params: CreateCoinParams) {
    const chainId = getChainId();

    const callArgs = {
        name: params.name,
        symbol: params.symbol,
        metadata: {
            type: 'RAW_URI' as const,
            uri: params.uri,
        },
        creator: params.creator,
        currency: CreateConstants.ContentCoinCurrencies.ETH,
        chainId,
        startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
        platformReferrer: params.platformReferrer,
    };

    return await createCoinCall(callArgs);
}

/**
 * Fetch trending/top coins - returns demo data for now
 * TODO: Integrate with Zora's actual API when SDK types are clarified
 */
export async function fetchTopCoins(limit: number = 20): Promise<CoinInfo[]> {
    // Return empty array - the TopGainers component will use demo data
    return [];
}

/**
 * Fetch coins created by a specific address
 * TODO: Integrate with Zora's actual API when SDK types are clarified
 */
export async function fetchUserCoins(creatorAddress: Address): Promise<CoinInfo[]> {
    // Return empty array - component will handle empty state
    return [];
}

/**
 * Build metadata URI for coin (simple version)
 * For production, use createMetadataBuilder from @zoralabs/coins-sdk
 */
export function buildSimpleMetadataUri(
    name: string,
    symbol: string,
    description: string,
    imageUrl?: string
): string {
    const metadata = {
        name,
        symbol,
        description,
        image: imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${symbol}`,
    };

    // Encode as data URI for simple cases
    // For production, upload to IPFS using Zora's uploader
    const base64 = Buffer.from(JSON.stringify(metadata)).toString('base64');
    return `data:application/json;base64,${base64}`;
}

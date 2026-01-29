import { base, baseSepolia } from 'wagmi/chains';

export const SUPPORTED_CHAINS = {
    mainnet: base,
    testnet: baseSepolia,
} as const;

export function getChain() {
    const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
    return network === 'mainnet' ? SUPPORTED_CHAINS.mainnet : SUPPORTED_CHAINS.testnet;
}

export function getChainId() {
    return getChain().id;
}

export const BASE_MAINNET_ID = 8453;
export const BASE_SEPOLIA_ID = 84532;

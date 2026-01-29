'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo_project_id';

export const config = getDefaultConfig({
    appName: 'ZoraCreator',
    projectId,
    chains: [base, baseSepolia],
    transports: {
        [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
        [baseSepolia.id]: http('https://sepolia.base.org'),
    },
    ssr: true,
});

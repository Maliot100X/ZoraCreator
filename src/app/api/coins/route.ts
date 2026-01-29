import { NextResponse } from 'next/server';
import { fetchTopCoins } from '@/lib/zora';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

export async function GET() {
    try {
        const coins = await fetchTopCoins(20);

        return NextResponse.json({
            coins,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error in /api/coins:', error);

        // Return empty array on error
        return NextResponse.json({
            coins: [],
            error: 'Failed to fetch coins',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

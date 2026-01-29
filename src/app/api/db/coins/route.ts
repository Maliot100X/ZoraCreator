import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const coinData = await req.json();

        // Insert into 'coins' table
        const { data, error } = await supabase
            .from('coins')
            .upsert({
                address: coinData.address,
                name: coinData.name,
                symbol: coinData.symbol,
                description: coinData.description,
                image_url: coinData.imageUrl,
                creator: coinData.creator,
                chain_id: coinData.chainId,
                created_at: new Date().toISOString(),
            }, { onConflict: 'address' });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Database Sync Error:', error);
        return NextResponse.json({ error: 'Failed to sync with database' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('coins')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return NextResponse.json({ coins: data });
    } catch (error) {
        console.error('Database Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 });
    }
}

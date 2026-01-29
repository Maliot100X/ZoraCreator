import { NextRequest, NextResponse } from 'next/server';

const AIML_API_KEY = process.env.AIML_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const { prompt, type } = await req.json();

        if (!AIML_API_KEY) {
            return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
        }

        const systemPrompt = type === 'coin'
            ? "You are a crypto token expert. Generate a catchy Name and a 5-letter Symbol for a new memecoin based on the user's idea. Format: Name|Symbol"
            : "You are a crypto marketer. Write a 2-sentence hype description for a new token. Be energetic and degen-friendly.";

        const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIML_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct-v0.2',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const result = data.choices[0].message.content.trim();

        return NextResponse.json({ result });
    } catch (error) {
        console.error('AI Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}

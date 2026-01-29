import { NextRequest, NextResponse } from 'next/server';

const KEYS = [
    { key: process.env.AIML_API_KEY_1, url: 'https://api.aimlapi.com/v1/chat/completions', model: 'mistralai/mistral-7b-instruct-v0.2' },
    { key: process.env.AIML_API_KEY_2, url: 'https://openrouter.ai/api/v1/chat/completions', model: 'mistralai/mistral-7b-instruct' },
    { key: process.env.AIML_API_KEY_3, url: 'https://api.groq.com/openai/v1/chat/completions', model: 'mixtral-8x7b-32768' }
].filter(k => k.key);

export async function POST(req: NextRequest) {
    try {
        const { prompt, type } = await req.json();

        if (KEYS.length === 0) {
            return NextResponse.json({ error: 'No AI API keys configured' }, { status: 500 });
        }

        const systemPrompt = type === 'coin'
            ? "You are a crypto token expert. Generate a catchy Name and a 1-5 letter Symbol for a new memecoin based on the user's idea. Format: Name|Symbol. Do not include quotes."
            : "You are a crypto marketer. Write a 2-sentence hype description for a new token. Be energetic and degen-friendly.";

        // Try keys in order until one works
        for (const config of KEYS) {
            try {
                const response = await fetch(config.url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${config.key}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: config.model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.8,
                        max_tokens: 100,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const result = data.choices[0].message.content.trim();
                    return NextResponse.json({ result });
                }
                console.warn(`AI Key failed (${config.url}): ${response.status}`);
            } catch (e) {
                console.error(`AI Error with key ${config.url}:`, e);
            }
        }

        return NextResponse.json({ error: 'All AI providers failed' }, { status: 500 });
    } catch (error) {
        console.error('AI General Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}

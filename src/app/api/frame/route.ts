import { NextRequest, NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface FrameActionPayload {
    untrustedData: {
        fid: number;
        url: string;
        messageHash: string;
        timestamp: number;
        network: number;
        buttonIndex: number;
        castId: {
            fid: number;
            hash: string;
        };
    };
    trustedData: {
        messageBytes: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: FrameActionPayload = await request.json();
        const buttonIndex = body.untrustedData?.buttonIndex || 1;

        // Button 1: Launch Token -> Redirect to launch page
        // Button 2: Top Gainers -> Redirect to home page
        const targetUrl = buttonIndex === 1 ? `${appUrl}/launch` : appUrl;

        // Return a new frame that redirects to the app
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${appUrl}/og-image.png" />
  <meta property="fc:frame:button:1" content="Open App" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="${targetUrl}" />
</head>
<body>
  Redirecting to ZoraCreator...
</body>
</html>
    `.trim();

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });
    } catch (error) {
        console.error('Frame API error:', error);

        // Return error frame
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${appUrl}/og-image.png" />
  <meta property="fc:frame:button:1" content="Try Again" />
  <meta property="fc:frame:post_url" content="${appUrl}/api/frame" />
</head>
<body>
  Error occurred
</body>
</html>
    `.trim();

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });
    }
}

// Handle GET requests for frame preview
export async function GET() {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>ZoraCreator - Launch Tokens on Base</title>
  <meta property="og:title" content="ZoraCreator - Launch Tokens on Base" />
  <meta property="og:description" content="Create and launch ERC20 tokens on Base blockchain via Zora Protocol" />
  <meta property="og:image" content="${appUrl}/og-image.png" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${appUrl}/og-image.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:button:1" content="🚀 Launch Token" />
  <meta property="fc:frame:button:2" content="📈 Top Gainers" />
  <meta property="fc:frame:post_url" content="${appUrl}/api/frame" />
</head>
<body>
  <h1>ZoraCreator</h1>
  <p>Create and launch ERC20 tokens on Base blockchain via Zora Protocol</p>
</body>
</html>
  `.trim();

    return new NextResponse(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
        },
    });
}

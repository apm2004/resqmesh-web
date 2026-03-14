import { NextResponse } from "next/server";

const SUBREDDIT = "ResQMesh";

// Reddit's JSON API — no auth needed for public subreddits.
// We try multiple base URLs to improve reliability across different networks.
const REDDIT_URLS = [
    `https://www.reddit.com/r/${SUBREDDIT}/new.json?limit=25`,
    `https://old.reddit.com/r/${SUBREDDIT}/new.json?limit=25`,
];

const HEADERS = {
    "User-Agent": "Mozilla/5.0 ResQMesh/1.0 (disaster-response-dashboard)",
    "Accept": "application/json",
};

// Attempt fetch with a hard timeout so we never wait more than 8 s.
async function tryFetch(url: string): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8_000);
    try {
        const res = await fetch(url, {
            headers: HEADERS,
            signal: controller.signal,
            cache: "no-store",
        });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

export async function GET() {
    let lastError: unknown;

    for (const url of REDDIT_URLS) {
        try {
            const res = await tryFetch(url);

            if (!res.ok) {
                lastError = new Error(`Reddit returned HTTP ${res.status}`);
                continue; // try next URL
            }

            const data = await res.json();
            return NextResponse.json(data);
        } catch (err) {
            lastError = err;
            // Try next URL on any network error
        }
    }

    // All URLs failed — return an empty listing so the frontend
    // degrades gracefully instead of throwing a 500.
    console.warn("[Reddit proxy] All fetch attempts failed:", lastError);
    return NextResponse.json({
        data: { children: [] },
        _fallback: true,
        _error: String(lastError),
    });
}

import { NextResponse } from "next/server";

const SUBREDDIT = "ResQMesh";
const REDDIT_URL = `https://www.reddit.com/r/${SUBREDDIT}/new.json?limit=25`;

export async function GET() {
    try {
        const res = await fetch(REDDIT_URL, {
            headers: {
                "User-Agent": "ResQMesh/1.0 (disaster-response-dashboard)",
            },
            next: { revalidate: 0 }, // no cache — always fresh
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Reddit API returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("[Reddit proxy] Error:", err);
        return NextResponse.json(
            { error: "Failed to fetch from Reddit" },
            { status: 500 }
        );
    }
}

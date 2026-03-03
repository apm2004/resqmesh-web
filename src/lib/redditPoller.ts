import type { LiveAlert } from "./mockData";

// ── Config ──────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 60_000; // 60 seconds
// Use local Next.js proxy to avoid CORS issues with Reddit
const REDDIT_API = `/api/reddit`;

// ── City → Coordinates dictionary ───────────────────────────────────────────
const cityCoords: Record<string, { lat: number; lng: number }> = {
    // India
    "chennai": { lat: 13.0827, lng: 80.2707 },
    "mumbai": { lat: 19.0760, lng: 72.8777 },
    "delhi": { lat: 28.6139, lng: 77.2090 },
    "bangalore": { lat: 12.9716, lng: 77.5946 },
    "bengaluru": { lat: 12.9716, lng: 77.5946 },
    "hyderabad": { lat: 17.3850, lng: 78.4867 },
    "kolkata": { lat: 22.5726, lng: 88.3639 },
    "pune": { lat: 18.5204, lng: 73.8567 },
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "kerala": { lat: 10.8505, lng: 76.2711 },
    "kochi": { lat: 9.9312, lng: 76.2673 },
    "coimbatore": { lat: 11.0168, lng: 76.9558 },
    "madurai": { lat: 9.9252, lng: 78.1198 },
    // US
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    "new york": { lat: 40.7128, lng: -74.0060 },
    "chicago": { lat: 41.8781, lng: -87.6298 },
    "houston": { lat: 29.7604, lng: -95.3698 },
    "miami": { lat: 25.7617, lng: -80.1918 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    // World
    "london": { lat: 51.5074, lng: -0.1278 },
    "tokyo": { lat: 35.6762, lng: 139.6503 },
    "sydney": { lat: -33.8688, lng: 151.2093 },
    "toronto": { lat: 43.6532, lng: -79.3832 },
    "paris": { lat: 48.8566, lng: 2.3522 },
    "jakarta": { lat: -6.2088, lng: 106.8456 },
    "manila": { lat: 14.5995, lng: 120.9842 },
};

// Default fallback location (world center)
const DEFAULT_COORDS = { lat: 20.5937, lng: 78.9629 };

// ── Keyword → Urgency mapping ────────────────────────────────────────────────
const criticalKeywords = [
    "trapped", "collapse", "collapsed", "sos", "mayday", "explosion",
    "gas leak", "casualties", "critical", "urgent rescue", "people died",
    "power outage", "grid failure", "missing", "buried", "fire spreading",
];
const rescueKeywords = [
    "stranded", "stuck", "flooded", "flood", "need rescue", "cut off",
    "no electricity", "road blocked", "shelter needed", "displaced",
    "evacuating", "injured", "ambulance", "rescue", "help needed",
];
const infoKeywords = [
    "warning", "alert", "watch", "advisory", "preparing", "shelter in place",
    "curfew", "official update", "relief", "volunteers", "donations", "info",
];

// ── Keyword → AlertType mapping ──────────────────────────────────────────────
const alertTypeKeywords: Record<string, string[]> = {
    Fire: ["fire", "smoke", "burning", "gas leak", "explosion", "blaze"],
    Flood: ["flood", "flooding", "water rising", "submerged", "drainage", "rain"],
    Medical: ["injured", "medical", "hospital", "ambulance", "trauma", "unconscious", "bleeding"],
    Rescue: ["trapped", "stranded", "rescue", "collapsed", "buried", "missing"],
};

// ── Helper: extract urgency from text + flair ────────────────────────────────
function detectUrgency(text: string, flair: string): LiveAlert["urgency"] {
    const lower = text.toLowerCase();
    const flairLower = flair.toLowerCase();

    if (flairLower.includes("critical") || lower.includes("[critical]") ||
        criticalKeywords.some(k => lower.includes(k))) return "critical";

    if (flairLower.includes("rescue") || lower.includes("[rescue]") ||
        rescueKeywords.some(k => lower.includes(k))) return "rescue";

    return "info";
}

// ── Helper: extract alert type from text ─────────────────────────────────────
function detectAlertType(text: string): string {
    const lower = text.toLowerCase();
    for (const [type, keywords] of Object.entries(alertTypeKeywords)) {
        if (keywords.some(k => lower.includes(k))) return type;
    }
    return "Rescue";
}

// ── Helper: extract location + coords from text ──────────────────────────────
function extractLocation(text: string): { location: string; lat: number; lng: number } {
    const lower = text.toLowerCase();

    // Try to find "Location: <city>" pattern in post body
    const locationMatch = text.match(/location\s*[:\-]\s*([^\n,]+)/i);
    if (locationMatch) {
        const rawCity = locationMatch[1].trim();
        const cityKey = rawCity.toLowerCase();
        const coords = cityCoords[cityKey] ?? DEFAULT_COORDS;
        return {
            location: rawCity,
            lat: coords.lat,
            lng: coords.lng,
        };
    }

    // Scan for known city names in the text
    for (const [city, coords] of Object.entries(cityCoords)) {
        if (lower.includes(city)) {
            return {
                location: city.charAt(0).toUpperCase() + city.slice(1),
                lat: coords.lat,
                lng: coords.lng,
            };
        }
    }

    return {
        location: "Unknown Location",
        lat: DEFAULT_COORDS.lat,
        lng: DEFAULT_COORDS.lng,
    };
}

// ── Helper: calculate NLP confidence score ────────────────────────────────────
function calcConfidence(text: string, score: number): number {
    const lower = text.toLowerCase();
    let confidence = 40;

    const allKeywords = [...criticalKeywords, ...rescueKeywords];
    const matches = allKeywords.filter(k => lower.includes(k)).length;
    confidence += Math.min(matches * 10, 40); // up to +40

    if (score > 10) confidence += 5;
    if (score > 50) confidence += 5;
    if (score > 100) confidence += 5;

    return Math.min(confidence, 97);
}

// ── Helper: format relative time ─────────────────────────────────────────────
function timeAgo(utcSeconds: number): string {
    const diffMs = Date.now() - utcSeconds * 1000;
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr ago`;
}

// ── Reddit JSON types ─────────────────────────────────────────────────────────
interface RedditPost {
    id: string;
    title: string;
    selftext: string;
    author: string;
    created_utc: number;
    score: number;
    link_flair_text: string | null;
    url: string;
}

// ── Convert a Reddit post → LiveAlert ────────────────────────────────────────
export function redditPostToAlert(post: RedditPost): LiveAlert {
    const fullText = `${post.title} ${post.selftext}`;
    const flair = post.link_flair_text ?? "";
    const urgency = detectUrgency(fullText, flair);
    const alertType = detectAlertType(fullText);
    const { location, lat, lng } = extractLocation(fullText);
    const confidence = calcConfidence(fullText, post.score);
    const coords = `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° ${lng < 0 ? "W" : "E"}`;

    return {
        id: `REDDIT-${post.id}`,
        urgency,
        source: "social",
        sourceDetails: `NLP: ${confidence}%`,
        title: post.title.replace(/^\[(CRITICAL|RESCUE|INFO)\]\s*/i, ""),
        time: timeAgo(post.created_utc),
        location,
        lat,
        lng,
        need: alertType,
        fullMessage: post.selftext || post.title,
        userId: `u/${post.author}`,
        alertType,
        message: post.selftext
            ? post.selftext.slice(0, 200)
            : post.title,
        coordinates: coords,
    };
}

// ── Fetch latest posts from r/ResQMeshAlerts ──────────────────────────────────
export async function fetchRedditAlerts(): Promise<LiveAlert[]> {
    try {
        const res = await fetch(REDDIT_API);
        if (!res.ok) throw new Error(`Reddit proxy error: ${res.status}`);

        const json = await res.json();
        const posts: RedditPost[] = json?.data?.children?.map(
            (c: { data: RedditPost }) => c.data
        ) ?? [];

        return posts.map(redditPostToAlert);
    } catch (err) {
        console.error("[RedditPoller] Failed to fetch:", err);
        return [];
    }
}

export { POLL_INTERVAL_MS };

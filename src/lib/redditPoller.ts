import type { AlertCategory } from "./alertConfig";
import type { LiveAlert } from "./mockData";

// ── Config ───────────────────────────────────────────────────────────────────
export const POLL_INTERVAL_MS = 60_000; // 60 seconds
const REDDIT_API = `/api/reddit`;
const GEOCODE_API = `/api/geocode`;

// ── Default fallback coords (geographic centre of India) ─────────────────────
const DEFAULT_COORDS = { lat: 20.5937, lng: 78.9629 };

// ── Session-level geocode cache: location string → {lat, lng} ────────────────
// Prevents duplicate API calls within a browser session for the same place.
const geocodeCache = new Map<string, { lat: number; lng: number }>();

async function geocode(query: string): Promise<{ lat: number; lng: number }> {
    const key = query.toLowerCase().trim();
    if (geocodeCache.has(key)) return geocodeCache.get(key)!;

    try {
        const res = await fetch(`${GEOCODE_API}?q=${encodeURIComponent(key)}`);
        if (!res.ok) throw new Error(`Geocode proxy ${res.status}`);

        const data: { found: boolean; lat?: number; lng?: number } =
            await res.json();

        if (data.found && data.lat !== undefined && data.lng !== undefined) {
            const coords = { lat: data.lat, lng: data.lng };
            geocodeCache.set(key, coords);
            return coords;
        }
    } catch (err) {
        console.warn(`[RedditPoller] Geocode failed for "${query}":`, err);
    }

    // Cache the fallback too so we don't retry a bad query every poll
    geocodeCache.set(key, DEFAULT_COORDS);
    return DEFAULT_COORDS;
}

// ── Keyword → Urgency mapping ─────────────────────────────────────────────────
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

// ── Keyword → AlertType mapping ───────────────────────────────────────────────
const alertTypeKeywords: Record<string, string[]> = {
    Fire:    ["fire", "smoke", "burning", "gas leak", "explosion", "blaze"],
    Flood:   ["flood", "flooding", "water rising", "submerged", "drainage", "rain"],
    Medical: ["injured", "medical", "hospital", "ambulance", "trauma", "unconscious", "bleeding"],
    Rescue:  ["trapped", "stranded", "rescue", "collapsed", "buried", "missing"],
};

// ── Flair → AlertCategory canonical mapping ──────────────────────────────────
const FLAIR_TO_CATEGORY: Record<string, AlertCategory> = {
    'medical':         'MEDICAL',
    'rescue':          'RESCUE',
    'food':            'FOOD',
    'trapped':         'TRAPPED',
    'general':         'GENERAL',
    'other':           'OTHER',
};

const CATEGORY_LABEL: Record<AlertCategory, string> = {
    MEDICAL: 'Medical',
    RESCUE:  'Rescue',
    FOOD:    'Food & Water',
    TRAPPED: 'Trapped',
    GENERAL: 'General',
    OTHER:   'Other',
};

// ── Resolve urgency + alertType: flair first, NLP fallback ───────────────────
function resolveUrgencyAndType(
    text: string,
    flair: string
): { urgency: AlertCategory; alertType: string; sourcedFromFlair: boolean } {
    const flairKey = flair.trim().toLowerCase();
    if (flairKey && FLAIR_TO_CATEGORY[flairKey]) {
        const urgency = FLAIR_TO_CATEGORY[flairKey];
        return { urgency, alertType: CATEGORY_LABEL[urgency], sourcedFromFlair: true };
    }

    const lower = text.toLowerCase();
    let urgency: AlertCategory = 'GENERAL';
    if (criticalKeywords.some(k => lower.includes(k))) urgency = 'MEDICAL';
    else if (rescueKeywords.some(k => lower.includes(k))) urgency = 'RESCUE';

    let alertType = 'Rescue';
    for (const [type, kws] of Object.entries(alertTypeKeywords)) {
        if (kws.some(k => lower.includes(k))) { alertType = type; break; }
    }

    return { urgency, alertType, sourcedFromFlair: false };
}

// ── Helper: extract the best location string from post text ───────────────────
// Returns the raw place name string; actual coords are fetched via geocode().
function extractLocationName(text: string): string | null {
    // 1. Explicit "Location: <city>" pattern in body
    const locMatch = text.match(/location\s*[:\-]\s*([^\n,\.]{2,60})/i);
    if (locMatch) return locMatch[1].trim();

    // 2. "in <City>" / "at <City>" close to disaster keywords
    const nearMatch = text.match(
        /(?:in|at|near|from)\s+([A-Z][a-zA-Z\s]{2,40})(?:[,\.\n]|$)/
    );
    if (nearMatch) return nearMatch[1].trim();

    // 3. Parenthetical city hint: "... (Chennai)"
    const parenMatch = text.match(/\(([A-Z][a-zA-Z\s]{2,30})\)/);
    if (parenMatch) return parenMatch[1].trim();

    return null;
}

// ── Helper: NLP confidence score ─────────────────────────────────────────────
function calcConfidence(text: string, score: number): number {
    const lower = text.toLowerCase();
    let confidence = 40;
    const allKeywords = [...criticalKeywords, ...rescueKeywords];
    const matches = allKeywords.filter(k => lower.includes(k)).length;
    confidence += Math.min(matches * 10, 40);
    if (score > 10)  confidence += 5;
    if (score > 50)  confidence += 5;
    if (score > 100) confidence += 5;
    return Math.min(confidence, 97);
}

// ── Helper: relative time ─────────────────────────────────────────────────────
function timeAgo(utcSeconds: number): string {
    const diffMs = Date.now() - utcSeconds * 1000;
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1)  return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)} hr ago`;
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

// ── Convert a Reddit post → LiveAlert (async — geocodes the location) ─────────
export async function redditPostToAlert(post: RedditPost): Promise<LiveAlert> {
    const fullText = `${post.title} ${post.selftext}`;
    const flair    = post.link_flair_text ?? "";

    const { urgency, alertType, sourcedFromFlair } = resolveUrgencyAndType(fullText, flair);
    const confidence    = calcConfidence(fullText, post.score);
    const sourceDetails = sourcedFromFlair ? `Flair: ${flair}` : `NLP: ${confidence}%`;

    const locationName = extractLocationName(fullText);
    const { lat, lng } = locationName ? await geocode(locationName) : DEFAULT_COORDS;
    const displayLocation = locationName ?? "Unknown Location";
    const coords = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;

    return {
        id:            `REDDIT-${post.id}`,
        urgency,
        source:        "social",
        sourceDetails,
        title:         post.title.replace(/^\[.*?\]\s*/i, "").trim(),
        time:          timeAgo(post.created_utc),
        location:      displayLocation,
        lat,
        lng,
        need:          alertType,
        fullMessage:   post.selftext || post.title,
        userId:        `u/${post.author}`,
        alertType,
        message:       post.selftext ? post.selftext.slice(0, 200) : post.title,
        coordinates:   coords,
        createdAt:     post.created_utc * 1000,
    };
}

// ── Fetch latest posts from r/ResQMesh ────────────────────────────────────────
export async function fetchRedditAlerts(): Promise<LiveAlert[]> {
    try {
        const res = await fetch(REDDIT_API);
        if (!res.ok) throw new Error(`Reddit proxy error: ${res.status}`);

        const json = await res.json();
        const posts: RedditPost[] = json?.data?.children?.map(
            (c: { data: RedditPost }) => c.data
        ) ?? [];

        // Geocode all posts concurrently
        return await Promise.all(posts.map(redditPostToAlert));
    } catch (err) {
        console.error("[RedditPoller] Failed to fetch:", err);
        return [];
    }
}

import type { LiveAlert } from './mockData';

// ─── Raw Payload ─────────────────────────────────────────────────────────────
// Exact shape emitted by the Node.js backend after saving to MongoDB.
// Mirrors the mobile app's hardware payload.
export interface RawMeshPayload {
    id: string;
    type: string;       // e.g. "Medical", "Rescue", "Fire", "Flood"
    message: string;
    timestamp: number;  // Unix ms — from the originating handset
    status: string;     // e.g. "active"
    latitude: number;
    longitude: number;
}

// ─── Urgency Mapping ─────────────────────────────────────────────────────────
const URGENCY_MAP: Record<string, LiveAlert['urgency']> = {
    medical: 'critical',
    fire: 'critical',
    hazmat: 'critical',
    rescue: 'rescue',
    flood: 'rescue',
    collapse: 'rescue',
    info: 'info',
};

function mapUrgency(type: string): LiveAlert['urgency'] {
    return URGENCY_MAP[type.toLowerCase()] ?? 'rescue';
}

// ─── GPS Formatting ───────────────────────────────────────────────────────────
function formatCoordinates(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

// ─── Relative Time ────────────────────────────────────────────────────────────
function relativeTime(timestampMs: number): string {
    const diffMs = Date.now() - timestampMs;
    const mins = Math.floor(diffMs / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────
// Transforms the compact hardware payload into the rich LiveAlert format
// consumed by the dashboard UI.
export function transformMeshAlert(raw: RawMeshPayload): LiveAlert {
    const coordinates = formatCoordinates(raw.latitude, raw.longitude);

    return {
        // Identity
        id: raw.id,
        userId: `USR-${raw.id.slice(-4).toUpperCase()}`, // mock — no auth on mesh nodes

        // Classification
        urgency: mapUrgency(raw.type),
        source: 'mesh',
        sourceDetails: 'Verified GPS',
        alertType: raw.type,

        // Display
        title: `${raw.type} Alert — Mesh Network`,
        time: relativeTime(raw.timestamp),
        location: coordinates,
        coordinates,

        // Content
        message: raw.message,
        fullMessage: raw.message,
        need: 'Awaiting triage assignment',

        // Map
        lat: raw.latitude,
        lng: raw.longitude,

        // Sorting / analytics
        createdAt: raw.timestamp,
    };
}

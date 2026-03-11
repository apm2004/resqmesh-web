import type { AlertCategory } from './alertConfig';

export interface LiveAlert {
    id: string;
    urgency: AlertCategory;
    source: "mesh" | "social";
    sourceDetails: string;
    title: string;
    time: string;
    location: string;
    lat: number;
    lng: number;
    need: string;
    fullMessage: string;
    userId: string;
    alertType: string;
    message: string;
    coordinates: string;
    createdAt: number;
}

/* Stagger mock alerts across the last 7 days */
const NOW = Date.now();
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const staggerOffsets = [
    2 * HOUR,       // ALT-001: 2 hours ago
    8 * HOUR,       // ALT-002: 8 hours ago
    18 * HOUR,      // ALT-003: 18 hours ago
    1.2 * DAY,      // ALT-004: 1.2 days ago
    2.5 * DAY,      // ALT-005: 2.5 days ago
    3.8 * DAY,      // ALT-006: 3.8 days ago
    5.1 * DAY,      // ALT-007: 5.1 days ago
    6.4 * DAY,      // ALT-008: 6.4 days ago
];

export const liveAlerts: LiveAlert[] = [
    {
        id: "ALT-001",
        urgency: "MEDICAL",
        source: "mesh",
        sourceDetails: "Verified GPS",
        title: "Building Collapse — Sector 7",
        time: "2 min ago",
        location: "34.0522° N, 118.2437° W",
        lat: 10.0488437,
        lng: 76.3052912,
        need: "Heavy rescue team, medical",
        fullMessage:
            "Multiple-storey residential building collapsed after aftershock. Survivors heard under rubble on floors 2-3. Immediate heavy-lift equipment and trauma medics required. Access via Main St blocked — reroute through 5th Ave.",
        userId: "USR-4821",
        alertType: "Medical",
        message: "Building collapsed, multiple survivors trapped under rubble. Urgent heavy-rescue and trauma medics required.",
        coordinates: "34.0522° N, 118.2437° W",
        createdAt: NOW - staggerOffsets[0],
    },
    {
        id: "ALT-002",
        urgency: "TRAPPED",
        source: "mesh",
        sourceDetails: "Verified GPS",
        title: "Family Trapped in Flooded Basement",
        time: "8 min ago",
        location: "34.0580° N, 118.2500° W",
        lat: 34.0580,
        lng: -118.2500,
        need: "Water rescue, pumps",
        fullMessage:
            "Family of four trapped in basement as floodwater rises. Water currently at waist level and rising. Children aged 3 and 7 present. Portable pumps and inflatable rescue boat needed. Power to the block has been cut.",
        userId: "USR-7193",
        alertType: "Rescue",
        message: "Family of four trapped in flooded basement, water rising. Children present — inflatable rescue boat needed.",
        coordinates: "34.0580° N, 118.2500° W",
        createdAt: NOW - staggerOffsets[1],
    },
    {
        id: "ALT-003",
        urgency: "MEDICAL",
        source: "social",
        sourceDetails: "NLP: 85%",
        title: "Gas Leak Near School Zone",
        time: "5 min ago",
        location: "34.0650° N, 118.2380° W",
        lat: 34.0650,
        lng: -118.2380,
        need: "HazMat, evacuation",
        fullMessage:
            "Strong gas odour reported by multiple social-media posts near Lincoln Elementary. Suspected ruptured main line. ~200 children still inside. Evacuation corridor and HazMat containment unit requested. Wind blowing SE at 12 mph.",
        userId: "USR-3310",
        alertType: "Fire",
        message: "Gas leak near Lincoln Elementary with ~200 children inside. HazMat and evacuation corridor needed immediately.",
        coordinates: "34.0650° N, 118.2380° W",
        createdAt: NOW - staggerOffsets[2],
    },
    {
        id: "ALT-004",
        urgency: "GENERAL",
        source: "social",
        sourceDetails: "NLP: 85%",
        title: "Road Blocked on Highway 101",
        time: "12 min ago",
        location: "34.0700° N, 118.2550° W",
        lat: 34.0700,
        lng: -118.2550,
        need: "Traffic reroute, debris clearing",
        fullMessage:
            "Large debris field blocking both lanes of Highway 101 between exits 14 and 15. No casualties reported yet. Commuters are self-diverting onto residential streets causing secondary gridlock. DOT crew and tow trucks requested.",
        userId: "USR-5502",
        alertType: "Flood",
        message: "Highway 101 blocked by debris between exits 14-15. DOT crew and tow trucks requested for clearing.",
        coordinates: "34.0700° N, 118.2550° W",
        createdAt: NOW - staggerOffsets[3],
    },
    {
        id: "ALT-005",
        urgency: "RESCUE",
        source: "mesh",
        sourceDetails: "Verified GPS",
        title: "Injured Hiker — Griffith Trail",
        time: "18 min ago",
        location: "34.1184° N, 118.3004° W",
        lat: 34.1184,
        lng: -118.3004,
        need: "Air rescue, paramedic",
        fullMessage:
            "Solo hiker with suspected spinal injury after a fall on the upper Griffith Trail. Conscious but unable to move. Trail too narrow for ground stretcher — helicopter extraction recommended. GPS beacon active on mesh node G-117.",
        userId: "USR-8847",
        alertType: "Medical",
        message: "Hiker with suspected spinal injury on Griffith Trail. Helicopter extraction recommended — trail too narrow for stretcher.",
        coordinates: "34.1184° N, 118.3004° W",
        createdAt: NOW - staggerOffsets[4],
    },
    {
        id: "ALT-006",
        urgency: "FOOD",
        source: "mesh",
        sourceDetails: "Verified GPS",
        title: "Shelter at Capacity — Convention Center",
        time: "25 min ago",
        location: "34.0407° N, 118.2468° W",
        lat: 34.0407,
        lng: -118.2468,
        need: "Overflow shelter, supplies",
        fullMessage:
            "Downtown Convention Center shelter has reached max capacity of 800 occupants. Over 60 people still arriving per hour. Need secondary shelter site activated and additional cot/blanket shipments. Medical volunteer count also running low.",
        userId: "USR-2205",
        alertType: "Rescue",
        message: "Convention Center shelter at max capacity (800). Secondary shelter activation and supply shipments needed urgently.",
        coordinates: "34.0407° N, 118.2468° W",
        createdAt: NOW - staggerOffsets[5],
    },
    {
        id: "ALT-007",
        urgency: "MEDICAL",
        source: "social",
        sourceDetails: "NLP: 85%",
        title: "Power Grid Failure — District 4",
        time: "3 min ago",
        location: "34.0490° N, 118.2600° W",
        lat: 34.0490,
        lng: -118.2600,
        need: "Generators, electricians",
        fullMessage:
            "Complete power grid failure across District 4 affecting ~12,000 residents and two hospital annexes running on backup generators with limited fuel. Priority: mobile generator deployment to Mercy Clinic annex (est. 4 hrs fuel remaining).",
        userId: "USR-6439",
        alertType: "Fire",
        message: "Total power grid failure in District 4. Two hospital annexes on backup generators with only 4 hours of fuel left.",
        coordinates: "34.0490° N, 118.2600° W",
        createdAt: NOW - staggerOffsets[6],
    },
    {
        id: "ALT-008",
        urgency: "RESCUE",
        source: "social",
        sourceDetails: "NLP: 85%",
        title: "Elderly Residents Stranded — Oak Manor",
        time: "30 min ago",
        location: "34.0330° N, 118.2410° W",
        lat: 34.0330,
        lng: -118.2410,
        need: "Evacuation bus, medical",
        fullMessage:
            "Oak Manor assisted-living facility has 45 elderly residents unable to self-evacuate. Elevator non-functional due to power outage. Several residents are oxygen-dependent. Accessible transport buses and on-site nursing support needed.",
        userId: "USR-1076",
        alertType: "Medical",
        message: "45 elderly residents at Oak Manor unable to evacuate. Several oxygen-dependent. Accessible buses and nursing support needed.",
        coordinates: "34.0330° N, 118.2410° W",
        createdAt: NOW - staggerOffsets[7],
    },
];

/* ══════════════════════════════════════════════════════════════════
   Dynamic mock alert generator for analytics testing
   ══════════════════════════════════════════════════════════════════ */

const URGENCIES: LiveAlert["urgency"][] = ["MEDICAL", "RESCUE", "FOOD", "TRAPPED", "GENERAL", "OTHER"];
const SOURCES: LiveAlert["source"][] = ["mesh", "social"];
const ALERT_TYPES = ["Medical", "Rescue", "Fire", "Flood", "Collapse", "HazMat"];
const NEEDS = [
    "Medical team, stretcher",
    "Heavy rescue, cranes",
    "Evacuation bus, medical",
    "Water rescue, pumps",
    "HazMat, evacuation",
    "Generators, electricians",
    "Search & rescue dogs",
    "Aerial recon, drones",
    "Food & water supply",
    "Temporary shelter kits",
];
const TITLES = [
    "Structure Fire — Warehouse District",
    "Flash Flood — Channel Overflow",
    "Multi-Vehicle Collision — I-10",
    "Landslide — Hillside Residential",
    "Gas Main Rupture — Commercial Zone",
    "Bridge Structural Failure",
    "Chemical Spill — Industrial Park",
    "Roof Collapse — Shopping Mall",
    "Electrical Substation Explosion",
    "Sinkhole — Downtown Intersection",
    "Wildfire Perimeter Breach",
    "Dam Overflow Warning",
    "Train Derailment — Rail Yard",
    "Apartment Fire — 3rd Floor",
    "Water Main Break — Flooding Streets",
    "Earthquake Aftershock Damage",
    "Pedestrian Bridge Failure",
    "Overturned Tanker — Fuel Leak",
    "School Evacuation — Bomb Threat",
    "Hospital Generator Failure",
];

/* Downtown LA hotspot center */
const HOTSPOT_LAT = 34.0522;
const HOTSPOT_LNG = -118.2437;

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function relativeTimeStr(ms: number): string {
    const mins = Math.floor(ms / 60_000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export function generateMockAlerts(count: number = 40): {
    active: LiveAlert[];
    resolved: Array<LiveAlert & { resolvedAt: string; duration: string; responders: number }>;
} {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * HOUR;
    const active: LiveAlert[] = [];
    const resolved: Array<LiveAlert & { resolvedAt: string; duration: string; responders: number }> = [];

    for (let i = 0; i < count; i++) {
        /* ── Time distribution: weight toward last 48h ── */
        let ageMs: number;
        const roll = Math.random();
        if (roll < 0.45) {
            // 45% in last 24 hours
            ageMs = randomBetween(0, DAY);
        } else if (roll < 0.70) {
            // 25% in 24-48h
            ageMs = randomBetween(DAY, 2 * DAY);
        } else {
            // 30% spread across 2-7 days
            ageMs = randomBetween(2 * DAY, SEVEN_DAYS);
        }
        const createdAt = now - ageMs;

        /* ── Geographic clustering ── */
        let lat: number, lng: number;
        if (Math.random() < 0.30) {
            // 30% tight downtown LA hotspot (0.02° radius)
            lat = HOTSPOT_LAT + randomBetween(-0.02, 0.02);
            lng = HOTSPOT_LNG + randomBetween(-0.02, 0.02);
        } else {
            // 70% scattered wider (0.15° radius)
            lat = HOTSPOT_LAT + randomBetween(-0.15, 0.15);
            lng = HOTSPOT_LNG + randomBetween(-0.15, 0.15);
        }

        const urgency = URGENCIES[Math.floor(Math.random() * URGENCIES.length)];
        const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
        const alertType = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)];
        const title = TITLES[Math.floor(Math.random() * TITLES.length)];
        const need = NEEDS[Math.floor(Math.random() * NEEDS.length)];

        const alert: LiveAlert = {
            id: `GEN-${String(i + 1).padStart(3, "0")}`,
            urgency,
            source,
            sourceDetails: source === "mesh" ? "Verified GPS" : `NLP: ${75 + Math.floor(Math.random() * 20)}%`,
            title,
            time: relativeTimeStr(ageMs),
            location: `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`,
            lat,
            lng,
            need,
            fullMessage: `Auto-generated alert for analytics testing. ${title}. Requires ${need}.`,
            userId: `USR-${1000 + Math.floor(Math.random() * 9000)}`,
            alertType,
            message: `${title} — ${need}. Immediate response required.`,
            coordinates: `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`,
            createdAt,
        };

        /* ── Decide active vs resolved ── */
        // NOTE: resolved-split temporarily disabled for production transition.
        // All generated alerts stay in the active queue; resolved data comes from real backend.
        // const isResolved = Math.random() < 0.35;
        // if (isResolved) { ... resolved.push(...) } else { active.push(alert); }
        active.push(alert);
    }

    // Sort by most recent first
    active.sort((a, b) => b.createdAt - a.createdAt);
    resolved.sort((a, b) => b.createdAt - a.createdAt);

    return { active, resolved };
}

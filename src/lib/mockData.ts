export interface LiveAlert {
    id: string;
    urgency: "critical" | "rescue" | "info";
    source: "mesh" | "social";
    sourceDetails: string;
    title: string;
    time: string;
    location: string;
    lat: number;
    lng: number;
    need: string;
    fullMessage: string;
}

export const liveAlerts: LiveAlert[] = [
    {
        id: "ALT-001",
        urgency: "critical",
        source: "mesh",
        sourceDetails: "Verified GPS",
        title: "Building Collapse — Sector 7",
        time: "2 min ago",
        location: "34.0522° N, 118.2437° W",
        lat: 34.0522,
        lng: -118.2437,
        need: "Heavy rescue team, medical",
        fullMessage:
            "Multiple-storey residential building collapsed after aftershock. Survivors heard under rubble on floors 2-3. Immediate heavy-lift equipment and trauma medics required. Access via Main St blocked — reroute through 5th Ave.",
    },
    {
        id: "ALT-002",
        urgency: "rescue",
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
    },
    {
        id: "ALT-003",
        urgency: "critical",
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
    },
    {
        id: "ALT-004",
        urgency: "info",
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
    },
    {
        id: "ALT-005",
        urgency: "rescue",
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
    },
    {
        id: "ALT-006",
        urgency: "info",
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
    },
    {
        id: "ALT-007",
        urgency: "critical",
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
    },
    {
        id: "ALT-008",
        urgency: "rescue",
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
    },
];

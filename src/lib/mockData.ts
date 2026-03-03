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
    userId: string;
    alertType: string;
    message: string;
    coordinates: string;
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
        lat: 10.0488437,
        lng: 76.3052912,
        need: "Heavy rescue team, medical",
        fullMessage:
            "Multiple-storey residential building collapsed after aftershock. Survivors heard under rubble on floors 2-3. Immediate heavy-lift equipment and trauma medics required. Access via Main St blocked — reroute through 5th Ave.",
        userId: "USR-4821",
        alertType: "Medical",
        message: "Building collapsed, multiple survivors trapped under rubble. Urgent heavy-rescue and trauma medics required.",
        coordinates: "34.0522° N, 118.2437° W",
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
        userId: "USR-7193",
        alertType: "Rescue",
        message: "Family of four trapped in flooded basement, water rising. Children present — inflatable rescue boat needed.",
        coordinates: "34.0580° N, 118.2500° W",
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
        userId: "USR-8847",
        alertType: "Medical",
        message: "Hiker with suspected spinal injury on Griffith Trail. Helicopter extraction recommended — trail too narrow for stretcher.",
        coordinates: "34.1184° N, 118.3004° W",
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
        userId: "USR-2205",
        alertType: "Rescue",
        message: "Convention Center shelter at max capacity (800). Secondary shelter activation and supply shipments needed urgently.",
        coordinates: "34.0407° N, 118.2468° W",
    },
];

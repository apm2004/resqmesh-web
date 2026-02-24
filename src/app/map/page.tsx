"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { liveAlerts, type LiveAlert } from "@/lib/mockData";
import GlassNav from "../components/GlassNav";
import TriageFeed from "../components/TriageFeed";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

export default function MapPage() {
    const [selectedAlert, setSelectedAlert] = useState<LiveAlert | null>(null);

    return (
        <div className="relative w-screen h-screen overflow-hidden theme-bg">
            {/* Full-bleed map */}
            <div className="absolute inset-0 z-0">
                <MapView
                    alerts={liveAlerts}
                    selectedAlert={selectedAlert}
                    onSelectAlert={setSelectedAlert}
                />
            </div>

            {/* Top nav */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                <GlassNav />
            </div>

            {/* Left sidebar */}
            <div className="absolute top-20 left-4 bottom-4 w-[340px] z-20">
                <TriageFeed
                    alerts={liveAlerts}
                    selectedAlert={selectedAlert}
                    onSelectAlert={setSelectedAlert}
                />
            </div>
        </div>
    );
}

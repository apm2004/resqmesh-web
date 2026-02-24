"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { liveAlerts, type LiveAlert } from "@/lib/mockData";
import GlassNav from "./components/GlassNav";
import TriageFeed from "./components/TriageFeed";
import NetworkHealth from "./components/NetworkHealth";
import ActiveResponse from "./components/ActiveResponse";
import DisasterAnalytics from "./components/DisasterAnalytics";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function HUDDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<LiveAlert | null>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0e1a]">
      {/* ═══ Layer 0: Full-bleed dark map ═══ */}
      <div className="absolute inset-0 z-0">
        <MapView
          alerts={liveAlerts}
          selectedAlert={selectedAlert}
          onSelectAlert={setSelectedAlert}
        />
      </div>

      {/* ═══ Layer 1: HUD Glass Overlays ═══ */}

      {/* ── Top Center: Navigation Pill ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <GlassNav />
      </div>

      {/* ── Left Side: Triage Feed ── */}
      <div className="absolute top-20 left-4 bottom-4 w-[340px] z-20">
        <TriageFeed
          alerts={liveAlerts}
          selectedAlert={selectedAlert}
          onSelectAlert={setSelectedAlert}
        />
      </div>

      {/* ── Top Right: Network Health ── */}
      <div className="absolute top-20 right-4 w-[280px] z-20">
        <NetworkHealth />
      </div>

      {/* ── Bottom Right: Active Response ── */}
      <div className="absolute bottom-4 right-4 w-[320px] z-20">
        <ActiveResponse selectedAlert={selectedAlert} />
      </div>

      {/* ── Bottom Left: Disaster Analytics ── */}
      <div className="absolute bottom-4 left-[368px] w-[340px] z-20">
        <DisasterAnalytics />
      </div>
    </div>
  );
}

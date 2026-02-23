"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { liveAlerts, type LiveAlert } from "@/lib/mockData";
import AlertCard from "../components/AlertCard";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

const filters = ["All", "Mesh Network", "High Confidence"] as const;
type Filter = (typeof filters)[number];

export default function MapPage() {
    const [activeFilter, setActiveFilter] = useState<Filter>("All");
    const [selectedAlert, setSelectedAlert] = useState<LiveAlert | null>(null);

    const filteredAlerts = liveAlerts.filter((alert) => {
        if (activeFilter === "Mesh Network") return alert.source === "mesh";
        if (activeFilter === "High Confidence")
            return alert.sourceDetails === "NLP: 85%";
        return true;
    });

    return (
        <div
            className="flex bg-[#0F172A]"
            style={{ height: "calc(100vh - 73px)" }}
        >
            {/* ── Left Sidebar: Alerts ── */}
            <aside className="w-[360px] flex flex-col border-r border-slate-700/50">
                <div className="px-4 pt-4 pb-3">
                    <h1 className="text-white text-lg font-bold mb-3">
                        Alerts
                    </h1>
                    <div className="flex items-center gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${activeFilter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                    {filteredAlerts.map((alert) => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            isSelected={selectedAlert?.id === alert.id}
                            onClick={() => setSelectedAlert(alert)}
                        />
                    ))}
                </div>
            </aside>

            {/* ── Right: Full-size Map ── */}
            <main className="flex-1 p-4">
                <MapView
                    alerts={filteredAlerts}
                    selectedAlert={selectedAlert}
                    onSelectAlert={setSelectedAlert}
                />
            </main>
        </div>
    );
}

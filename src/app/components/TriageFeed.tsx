"use client";

import { useState } from "react";
import type { LiveAlert } from "@/lib/mockData";

interface TriageFeedProps {
    alerts: LiveAlert[];
    selectedAlert: LiveAlert | null;
    onSelectAlert: (alert: LiveAlert) => void;
}

type FilterType = "all" | "mesh" | "social";

const urgencyBorderClass: Record<LiveAlert["urgency"], string> = {
    critical: "border-glow-red",
    rescue: "border-glow-orange",
    info: "border-glow-blue",
};

const filterConfig: Record<FilterType, { label: string; active: string }> = {
    all: {
        label: "All",
        active: "bg-white/20 border-white/40 text-white shadow-[0_0_12px_rgba(255,255,255,0.25)]",
    },
    mesh: {
        label: "Mesh Only",
        active: "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.35)]",
    },
    social: {
        label: "Social NLP",
        active: "bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.35)]",
    },
};

const baseButtonClass =
    "px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-200 cursor-pointer";
const inactiveButtonClass =
    "bg-black/40 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70";

export default function TriageFeed({
    alerts,
    selectedAlert,
    onSelectAlert,
}: TriageFeedProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const filteredAlerts =
        activeFilter === "all"
            ? alerts
            : alerts.filter((a) => a.source === activeFilter);

    return (
        <div className="glass flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b theme-divider">
                <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 animate-pulse-glow" />
                    </span>
                    <h2 className="theme-heading text-sm font-bold tracking-wide uppercase">
                        Live Triage Queue
                    </h2>
                </div>
                <p className="theme-dim text-[11px]">
                    {filteredAlerts.length} active alerts &middot; Sorted by
                    urgency
                </p>

                {/* Filter buttons */}
                <div className="flex gap-1.5 mt-2.5">
                    {(Object.keys(filterConfig) as FilterType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveFilter(key)}
                            className={`${baseButtonClass} ${activeFilter === key
                                    ? filterConfig[key].active
                                    : inactiveButtonClass
                                }`}
                        >
                            {filterConfig[key].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alert Cards */}
            <div className="flex-1 overflow-y-auto hud-scroll px-3 py-3">
                <div
                    key={activeFilter}
                    className="space-y-2.5 animate-fade-in-up"
                    style={{ animationDuration: "0.5s" }}
                >
                    {filteredAlerts.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                            <p className="theme-dimmer text-xs text-center">
                                No active alerts in this category
                            </p>
                        </div>
                    ) : (
                        filteredAlerts.map((alert, i) => {
                            const isSelected = selectedAlert?.id === alert.id;
                            return (
                                <div
                                    key={alert.id}
                                    onClick={() => onSelectAlert(alert)}
                                    className={`${urgencyBorderClass[alert.urgency]} rounded-xl p-3 cursor-pointer transition-all duration-200 animate-slide-in ${isSelected
                                            ? "theme-surface-active ring-1 ring-[var(--divider-strong)]"
                                            : "theme-surface theme-surface-hover"
                                        }`}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    {/* Source badge + urgency */}
                                    <div className="flex items-center justify-between mb-1.5">
                                        {alert.source === "mesh" ? (
                                            <span className="text-[10px] font-semibold text-green-400 flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 glow-green" />
                                                📱 Mesh (Verified)
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-semibold text-blue-400 flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 glow-blue" />
                                                🐦 Social (NLP)
                                            </span>
                                        )}
                                        <span
                                            className={`text-[9px] font-bold uppercase tracking-wider ${alert.urgency === "critical"
                                                    ? "text-red-400"
                                                    : alert.urgency === "rescue"
                                                        ? "text-orange-400"
                                                        : "text-blue-400"
                                                }`}
                                        >
                                            {alert.urgency}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="theme-heading text-xs font-semibold leading-snug mb-1">
                                        {alert.title}
                                    </h3>

                                    {/* Time + location */}
                                    <div className="flex items-center justify-between text-[10px] theme-dim">
                                        <span>{alert.time}</span>
                                        <span className="truncate ml-2 max-w-[120px]">
                                            {alert.location}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

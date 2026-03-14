"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LiveAlert } from "@/lib/mockData";
import { alertConfig } from "@/lib/alertConfig";

interface TriageFeedProps {
    alerts: LiveAlert[];
    selectedAlert: LiveAlert | null;
    onSelectAlert: (alert: LiveAlert) => void;
}

type FilterType = "all" | "mesh" | "social";

const filterConfig: Record<FilterType, { label: string; active: string }> = {
    all: {
        label: "All",
        active: "bg-slate-200 dark:bg-white/20 border-slate-400 dark:border-white/40 text-slate-900 dark:text-white shadow-[0_0_12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_12px_rgba(255,255,255,0.25)]",
    },
    mesh: {
        label: "Mesh Only",
        active: "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.35)]",
    },
    social: {
        label: "Social Media",
        active: "bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.35)]",
    },
};

const baseButtonClass =
    "px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-200 cursor-pointer";
const inactiveButtonClass =
    "bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white/70";

export default function TriageFeed({
    alerts,
    selectedAlert,
    onSelectAlert,
}: TriageFeedProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const baseFiltered =
        activeFilter === "all"
            ? alerts
            : alerts.filter((a) => a.source === activeFilter);

    // Sort by most recent first (newest createdAt at the top)
    const filteredAlerts = [...baseFiltered].sort(
        (a, b) => b.createdAt - a.createdAt
    );

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
                    {filteredAlerts.length} active alerts &middot; Sorted by latest
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
                <AnimatePresence mode="popLayout">
                    {filteredAlerts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-32"
                        >
                            <p className="theme-dimmer text-xs text-center">
                                No active alerts in this category
                            </p>
                        </motion.div>
                    ) : (
                        filteredAlerts.map((alert) => {
                            const isSelected = selectedAlert?.id === alert.id;
                            return (
                                <motion.div
                                    key={alert.id}
                                    layout="position"
                                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    onClick={() => onSelectAlert(alert)}
                                    className={`border rounded-xl p-3 cursor-pointer transition-colors duration-200 mb-2.5 ${alertConfig[alert.urgency].border} ${alertConfig[alert.urgency].bg} ${isSelected
                                        ? "ring-1 ring-[var(--divider-strong)] theme-surface-active"
                                        : "theme-surface theme-surface-hover"
                                        }`}
                                    style={{ boxShadow: alertConfig[alert.urgency].glow }}
                                >
                                    {/* Source badge + urgency */}
                                    <div className="flex items-center justify-between mb-1.5">
                                        {alert.source === "mesh" ? (
                                            <span className="text-[10px] font-semibold text-green-400 flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 glow-green" />
                                                📱 Mesh (Verified)
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-semibold text-orange-400 flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 glow-orange" />
                                                📲 Social Media
                                            </span>
                                        )}
                                        <span
                                            className={`text-[9px] font-bold uppercase tracking-wider ${alertConfig[alert.urgency].color}`}
                                        >
                                            {alertConfig[alert.urgency].label}
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
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

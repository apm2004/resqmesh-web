"use client";

import type { LiveAlert } from "@/lib/mockData";

interface TriageFeedProps {
    alerts: LiveAlert[];
    selectedAlert: LiveAlert | null;
    onSelectAlert: (alert: LiveAlert) => void;
}

const urgencyBorderClass: Record<LiveAlert["urgency"], string> = {
    critical: "border-glow-red",
    rescue: "border-glow-orange",
    info: "border-glow-blue",
};

export default function TriageFeed({
    alerts,
    selectedAlert,
    onSelectAlert,
}: TriageFeedProps) {
    return (
        <div className="glass flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 animate-pulse-glow" />
                    </span>
                    <h2 className="text-white text-sm font-bold tracking-wide uppercase">
                        Live Triage Queue
                    </h2>
                </div>
                <p className="text-slate-500 text-[11px]">
                    {alerts.length} active alerts &middot; Sorted by urgency
                </p>
            </div>

            {/* Alert Cards */}
            <div className="flex-1 overflow-y-auto hud-scroll px-3 py-3 space-y-2.5">
                {alerts.map((alert, i) => {
                    const isSelected = selectedAlert?.id === alert.id;
                    return (
                        <div
                            key={alert.id}
                            onClick={() => onSelectAlert(alert)}
                            className={`${urgencyBorderClass[alert.urgency]} rounded-xl p-3 cursor-pointer transition-all duration-200 animate-slide-in ${isSelected
                                    ? "bg-white/10 ring-1 ring-white/20"
                                    : "bg-white/[0.03] hover:bg-white/[0.07]"
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
                            <h3 className="text-white text-xs font-semibold leading-snug mb-1">
                                {alert.title}
                            </h3>

                            {/* Time + location */}
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>{alert.time}</span>
                                <span className="truncate ml-2 max-w-[120px]">
                                    {alert.location}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

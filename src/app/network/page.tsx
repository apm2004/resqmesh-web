"use client";

import GlassNav from "../components/GlassNav";

const services = [
    { name: "NLP AI Engine", status: "Operational", color: "bg-green-500" },
    {
        name: "Social Media Ingestion",
        status: "Operational",
        color: "bg-green-500",
    },
    {
        name: "WebSocket Live Sync",
        status: "Operational",
        color: "bg-green-500",
    },
];

export default function NetworkPage() {
    return (
        <div className="relative w-screen h-screen overflow-hidden theme-bg">
            {/* Nav */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                <GlassNav />
            </div>

            {/* Content */}
            <div
                className="absolute inset-0 pt-20 pb-6 px-6 overflow-y-auto hud-scroll animate-fade-in-up"
                style={{ animationDuration: "0.5s" }}
            >
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* ── Row 1: Mesh + LoRa ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mesh Network Health */}
                        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
                                    Mesh Network Health
                                </h3>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.3)]">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                                    <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">
                                        Network Stable
                                    </span>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-100 dark:bg-white/[0.03] rounded-xl p-4 border border-slate-200 dark:border-white/5">
                                    <p className="text-slate-400 dark:text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">
                                        Active Mobile Nodes
                                    </p>
                                    <p className="text-3xl font-bold text-green-400">
                                        847
                                    </p>
                                </div>
                                <div className="bg-slate-100 dark:bg-white/[0.03] rounded-xl p-4 border border-slate-200 dark:border-white/5">
                                    <p className="text-slate-400 dark:text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">
                                        Offline Syncs Queued
                                    </p>
                                    <p className="text-3xl font-bold text-amber-400">
                                        124
                                    </p>
                                </div>
                            </div>

                            {/* Node Activity Sparkline */}
                            <div className="mt-4">
                                <p className="text-[10px] text-slate-400 dark:text-white/30 mb-2">
                                    Node activity (last 60 min)
                                </p>
                                <div className="flex items-end gap-[2px] h-10">
                                    {[60, 72, 55, 80, 68, 90, 75, 85, 92, 70, 88, 65, 78, 95, 82, 74, 86, 91, 77, 83, 69, 87, 93, 76, 81, 88, 73, 90, 84, 79].map(
                                        (v, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-t bg-green-500/50"
                                                style={{ height: `${v}%` }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* LoRa Backbone */}
                        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-5">
                                LoRa Backbone — ESP32
                            </h3>

                            <div className="space-y-4">
                                {/* Gateway Status */}
                                <div className="flex items-center justify-between bg-slate-100 dark:bg-white/[0.03] rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5">
                                    <span className="text-xs text-slate-500 dark:text-white/60">
                                        Gateway Status
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse-glow" />
                                        ONLINE
                                    </span>
                                </div>

                                {/* Signal Strength */}
                                <div className="bg-slate-100 dark:bg-white/[0.03] rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-500 dark:text-white/60">
                                            Avg Signal Strength
                                        </span>
                                        <span className="text-xs font-bold text-amber-400">
                                            82%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 progress-glow transition-all duration-1000"
                                            style={{ width: "82%" }}
                                        />
                                    </div>
                                </div>

                                {/* Packets Relayed */}
                                <div className="flex items-center justify-between bg-slate-100 dark:bg-white/[0.03] rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5">
                                    <span className="text-xs text-slate-500 dark:text-white/60">
                                        Packets Relayed
                                    </span>
                                    <span className="text-lg font-bold text-amber-400">
                                        4,092
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Row 2: API & Services ── */}
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
                            API &amp; Services
                        </h3>

                        <div className="space-y-2">
                            {services.map((svc) => (
                                <div
                                    key={svc.name}
                                    className="flex items-center justify-between bg-slate-100 dark:bg-white/[0.03] rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full ${svc.color} shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse-glow`}
                                        />
                                        <span className="text-sm text-slate-900 dark:text-white font-medium">
                                            {svc.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-green-400 font-semibold uppercase tracking-wider">
                                        {svc.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Uptime bar */}
                        <div className="mt-5">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-wider font-semibold">
                                    System Uptime
                                </span>
                                <span className="text-xs font-bold text-green-400">
                                    99.97%
                                </span>
                            </div>
                            <div className="flex gap-[2px]">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-5 flex-1 rounded-sm transition-all ${i === 17
                                            ? "bg-amber-500/70"
                                            : "bg-green-500/50"
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-1 text-[9px] text-slate-400 dark:text-white/20">
                                <span>30 days ago</span>
                                <span>Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

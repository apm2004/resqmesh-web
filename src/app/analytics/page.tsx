"use client";

import GlassNav from "../components/GlassNav";

const kpis = [
    { label: "Total Alerts Processed", value: "1,248", accent: "" },
    {
        label: "Active Critical Threats",
        value: "42",
        accent: "text-red-500 animate-pulse-glow",
    },
    { label: "Avg Response Time", value: "8.5 min", accent: "" },
];

const sourceDistribution = [
    {
        label: "Mesh Network (Verified)",
        pct: 65,
        gradient: "from-green-500 to-emerald-400",
        badge: "text-green-400",
    },
    {
        label: "Social NLP",
        pct: 35,
        gradient: "from-blue-500 to-cyan-400",
        badge: "text-blue-400",
    },
];

const urgencyBreakdown = [
    {
        label: "Critical",
        pct: 20,
        gradient: "from-red-600 to-red-400",
        badge: "text-red-400",
    },
    {
        label: "Rescue",
        pct: 50,
        gradient: "from-orange-500 to-amber-400",
        badge: "text-orange-400",
    },
    {
        label: "Info",
        pct: 30,
        gradient: "from-blue-500 to-sky-400",
        badge: "text-blue-400",
    },
];

export default function AnalyticsPage() {
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
                    {/* ── KPI Row ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {kpis.map((kpi) => (
                            <div
                                key={kpi.label}
                                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center"
                            >
                                <p className="text-white/50 text-[11px] uppercase tracking-wider font-semibold mb-2">
                                    {kpi.label}
                                </p>
                                <p
                                    className={`text-3xl font-bold ${kpi.accent || "text-white"}`}
                                >
                                    {kpi.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Middle Row ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Source Distribution */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-4">
                                Source Distribution
                            </h3>
                            <div className="space-y-4">
                                {sourceDistribution.map((s) => (
                                    <div key={s.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-white/80">
                                                {s.label}
                                            </span>
                                            <span
                                                className={`text-xs font-bold ${s.badge}`}
                                            >
                                                {s.pct}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${s.gradient} transition-all duration-1000 ease-out progress-glow`}
                                                style={{
                                                    width: `${s.pct}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Urgency Breakdown */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-4">
                                Urgency Breakdown
                            </h3>
                            <div className="space-y-4">
                                {urgencyBreakdown.map((u) => (
                                    <div key={u.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-white/80">
                                                {u.label}
                                            </span>
                                            <span
                                                className={`text-xs font-bold ${u.badge}`}
                                            >
                                                {u.pct}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${u.gradient} transition-all duration-1000 ease-out progress-glow`}
                                                style={{
                                                    width: `${u.pct}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom Summary ── */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-4">
                            Incident Timeline (Last 24h)
                        </h3>
                        <div className="flex items-end gap-1 h-24">
                            {[35, 52, 28, 74, 60, 42, 88, 55, 70, 38, 62, 90, 45, 67, 30, 82, 50, 73, 48, 65, 85, 40, 58, 76].map(
                                (val, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t bg-gradient-to-t from-orange-500/80 to-red-500/60 transition-all duration-500"
                                        style={{
                                            height: `${val}%`,
                                            animationDelay: `${i * 40}ms`,
                                        }}
                                    />
                                )
                            )}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-white/30">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                            <span>Now</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

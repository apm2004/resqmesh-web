"use client";

import GlassNav from "../components/GlassNav";
import { useAlerts } from "@/context/AlertContext";
import { useMemo } from "react";

export default function AnalyticsPage() {
    const { activeAlerts, resolvedAlerts } = useAlerts();

    /* ── Derived data ── */
    const allAlerts = useMemo(
        () => [...activeAlerts, ...resolvedAlerts],
        [activeAlerts, resolvedAlerts]
    );

    const totalProcessed = allAlerts.length;
    const activeCritical = activeAlerts.filter(
        (a) => a.urgency === "critical"
    ).length;
    const incidentsResolved = resolvedAlerts.length;

    /* Source distribution */
    const meshPct =
        totalProcessed > 0
            ? Math.round(
                (allAlerts.filter((a) => a.source === "mesh").length /
                    totalProcessed) *
                100
            )
            : 0;
    const socialPct = totalProcessed > 0 ? 100 - meshPct : 0;

    const sourceDistribution = [
        {
            label: "Mesh Network (Verified)",
            pct: meshPct,
            gradient: "from-green-500 to-emerald-400",
            badge: "text-green-400",
        },
        {
            label: "Social NLP",
            pct: socialPct,
            gradient: "from-blue-500 to-cyan-400",
            badge: "text-blue-400",
        },
    ];

    /* Urgency breakdown (based on active alerts) */
    const activeTotal = activeAlerts.length || 1; // avoid div-by-0
    const criticalPct = Math.round(
        (activeAlerts.filter((a) => a.urgency === "critical").length /
            activeTotal) *
        100
    );
    const rescuePct = Math.round(
        (activeAlerts.filter((a) => a.urgency === "rescue").length /
            activeTotal) *
        100
    );
    const infoPct = 100 - criticalPct - rescuePct;

    const urgencyBreakdown = [
        {
            label: "Critical",
            pct: criticalPct,
            gradient: "from-red-600 to-red-400",
            badge: "text-red-400",
        },
        {
            label: "Rescue",
            pct: rescuePct,
            gradient: "from-orange-500 to-amber-400",
            badge: "text-orange-400",
        },
        {
            label: "Info",
            pct: infoPct,
            gradient: "from-blue-500 to-sky-400",
            badge: "text-blue-400",
        },
    ];

    /* KPI cards */
    const kpis = [
        { label: "Total Alerts Processed", value: totalProcessed, accent: "" },
        {
            label: "Active Critical Threats",
            value: activeCritical,
            accent: activeCritical > 0 ? "text-red-500 animate-pulse-glow" : "",
        },
        {
            label: "Incidents Resolved",
            value: incidentsResolved,
            accent: "text-green-400",
        },
    ];

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
                                className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5 text-center"
                            >
                                <p className="text-slate-500 dark:text-white/50 text-[11px] uppercase tracking-wider font-semibold mb-2">
                                    {kpi.label}
                                </p>
                                <p
                                    className={`text-3xl font-bold ${kpi.accent || "text-slate-900 dark:text-white"}`}
                                >
                                    {kpi.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Middle Row ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Source Distribution */}
                        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
                                Source Distribution
                            </h3>
                            <div className="space-y-4">
                                {sourceDistribution.map((s) => (
                                    <div key={s.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-slate-600 dark:text-white/80">
                                                {s.label}
                                            </span>
                                            <span
                                                className={`text-xs font-bold ${s.badge}`}
                                            >
                                                {s.pct}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
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
                        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
                                Urgency Breakdown
                            </h3>
                            <div className="space-y-4">
                                {urgencyBreakdown.map((u) => (
                                    <div key={u.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-slate-600 dark:text-white/80">
                                                {u.label}
                                            </span>
                                            <span
                                                className={`text-xs font-bold ${u.badge}`}
                                            >
                                                {u.pct}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
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
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
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
                        <div className="flex justify-between mt-2 text-[10px] text-slate-400 dark:text-white/30">
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

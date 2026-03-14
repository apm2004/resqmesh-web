"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import GlassNav from "../components/GlassNav";
import { useAlerts } from "@/context/AlertContext";
import { useTheme } from "../components/ThemeContext";
import { alertConfig, ALERT_CATEGORIES } from "@/lib/alertConfig";

const AnalyticsMiniMap = dynamic(() => import("../components/AnalyticsMiniMap"), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full rounded-xl bg-black/20 animate-pulse border border-white/10" />
    ),
});

type TimeRange = "24h" | "2d" | "5d" | "7d";

const RANGE_MS: Record<TimeRange, number> = {
    "24h": 24 * 3_600_000,
    "2d": 2 * 24 * 3_600_000,
    "5d": 5 * 24 * 3_600_000,
    "7d": 7 * 24 * 3_600_000,
};

const RANGE_LABELS: { value: TimeRange; label: string }[] = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "2d", label: "Last 2 Days" },
    { value: "5d", label: "Last 5 Days" },
    { value: "7d", label: "Last Week" },
];

/* ── Bucket helpers ── */
function bucketByHour(alerts: { createdAt: number }[], rangeMs: number) {
    const now = Date.now();
    const totalHours = Math.ceil(rangeMs / 3_600_000);
    const buckets = new Array(totalHours).fill(0);

    for (const a of alerts) {
        const hoursAgo = Math.floor((now - a.createdAt) / 3_600_000);
        if (hoursAgo >= 0 && hoursAgo < totalHours) {
            buckets[totalHours - 1 - hoursAgo]++;
        }
    }
    return buckets;
}

function bucketByDay(alerts: { createdAt: number }[], rangeMs: number) {
    const now = Date.now();
    const totalDays = Math.ceil(rangeMs / (24 * 3_600_000));
    const buckets = new Array(totalDays).fill(0);

    for (const a of alerts) {
        const daysAgo = Math.floor((now - a.createdAt) / (24 * 3_600_000));
        if (daysAgo >= 0 && daysAgo < totalDays) {
            buckets[totalDays - 1 - daysAgo]++;
        }
    }
    return buckets;
}

function getTimeLabels(range: TimeRange): string[] {
    const now = new Date();
    if (range === "24h") {
        // Show every 6th hour
        return Array.from({ length: 5 }, (_, i) => {
            const h = new Date(now.getTime() - (24 - i * 6) * 3_600_000);
            return h.getHours().toString().padStart(2, "0") + ":00";
        });
    }
    if (range === "2d") {
        return Array.from({ length: 5 }, (_, i) => {
            const h = new Date(now.getTime() - (48 - i * 12) * 3_600_000);
            const day = h.toLocaleDateString("en", { weekday: "short" });
            return `${day} ${h.getHours().toString().padStart(2, "0")}:00`;
        });
    }
    // 5d / 7d — daily labels
    const totalDays = range === "5d" ? 5 : 7;
    return Array.from({ length: totalDays }, (_, i) => {
        const d = new Date(now.getTime() - (totalDays - 1 - i) * 24 * 3_600_000);
        return d.toLocaleDateString("en", { month: "short", day: "numeric" });
    });
}

export default function AnalyticsPage() {
    const { activeAlerts, resolvedAlerts } = useAlerts();
    const { theme } = useTheme();
    const [timeRange, setTimeRange] = useState<TimeRange>("24h");

    /* ── Derived data ── */
    const allAlerts = useMemo(
        () => [...activeAlerts, ...resolvedAlerts],
        [activeAlerts, resolvedAlerts]
    );

    const filteredAlerts = useMemo(() => {
        const cutoff = Date.now() - RANGE_MS[timeRange];
        return allAlerts.filter((a) => a.createdAt >= cutoff);
    }, [allAlerts, timeRange]);

    const totalProcessed = allAlerts.length;
    const activeCritical = activeAlerts.filter(
        (a) => a.urgency === "MEDICAL" || a.urgency === "TRAPPED"
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

    /* Urgency breakdown — 6 categories derived from alertConfig */
    const barColors: Record<string, string> = {
        MEDICAL: 'bg-red-500',
        TRAPPED: 'bg-purple-500',
        RESCUE: 'bg-orange-500',
        FOOD: 'bg-cyan-500',
        GENERAL: 'bg-slate-400',
        OTHER: 'bg-slate-500',
    };

    const activeTotal = activeAlerts.length || 1;
    const urgencyBreakdown = ALERT_CATEGORIES.map((cat) => {
        const count = activeAlerts.filter((a) => a.urgency === cat).length;
        const pct = Math.round((count / activeTotal) * 100);
        const cfg = alertConfig[cat];
        return {
            id: cat,
            label: cfg.label,
            pct,
            count,
            textColor: cfg.color,
        };
    });

    /* KPI cards */
    const kpis = [
        { label: "Total Alerts Processed", value: totalProcessed, accent: "" },
        {
            label: "High Priority Alerts",
            value: activeCritical,
            accent: activeCritical > 0 ? "text-red-500 animate-pulse-glow" : "",
        },
        {
            label: "Incidents Resolved",
            value: incidentsResolved,
            accent: "text-green-400",
        },
    ];

    /* ── Chart data ── */
    const useHourly = timeRange === "24h" || timeRange === "2d";
    const buckets = useHourly
        ? bucketByHour(filteredAlerts, RANGE_MS[timeRange])
        : bucketByDay(filteredAlerts, RANGE_MS[timeRange]);
    const maxBucket = Math.max(...buckets, 1);
    const timeLabels = getTimeLabels(timeRange);

    /* ── Heatmap data ── */
    const heatPoints: [number, number, number][] = useMemo(
        () => filteredAlerts.map((a) => [a.lat, a.lng, 0.8]),
        [filteredAlerts]
    );

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
                                                className={`text-xs font-bold ${u.textColor}`}
                                            >
                                                {u.count} ({u.pct}%)
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${barColors[u.id]} transition-all duration-1000 ease-out progress-glow`}
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

                    {/* ── Bottom Panel: Incident Trends & Spatial Density ── */}
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                        {/* Header with time filter */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
                                Incident Trends & Spatial Density
                            </h3>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                                className="bg-white/70 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white rounded-lg px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer backdrop-blur-sm"
                            >
                                {RANGE_LABELS.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Two-column grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Col 1: Dynamic bar chart */}
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-3">
                                    Incident Timeline
                                </p>
                                <div className="flex items-end gap-[3px] h-32">
                                    {buckets.map((count, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-t bg-gradient-to-t from-orange-500/80 to-red-500/60 transition-all duration-500 hover:from-orange-400 hover:to-red-400 relative group"
                                            style={{
                                                height: `${Math.max((count / maxBucket) * 100, 4)}%`,
                                            }}
                                        >
                                            {/* Tooltip */}
                                            {count > 0 && (
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 dark:text-white bg-white/80 dark:bg-black/60 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-slate-400 dark:text-white/30">
                                    {timeLabels.map((l, i) => (
                                        <span key={i}>{l}</span>
                                    ))}
                                </div>
                                <p className="text-center text-[10px] text-slate-400 dark:text-white/30 mt-2">
                                    {filteredAlerts.length} incident{filteredAlerts.length !== 1 ? "s" : ""} in range
                                </p>
                            </div>

                            {/* Col 2: Mini density heatmap */}
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-3">
                                    Spatial Density
                                </p>
                                <AnalyticsMiniMap
                                    key={timeRange}
                                    heatPoints={heatPoints}
                                    theme={theme}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

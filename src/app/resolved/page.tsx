"use client";

import { CheckCircle, Clock, MapPin, Shield, Users, Timer, TrendingUp } from "lucide-react";
import GlassNav from "../components/GlassNav";

const resolvedAlerts = [
    {
        id: "RES-001",
        title: "Building Collapse — Sector 7",
        location: "34.0522° N, 118.2437° W",
        resolvedAt: "Today, 09:42 AM",
        responders: 12,
        duration: "2h 18m",
    },
    {
        id: "RES-002",
        title: "Flash Flood — River District",
        location: "34.0610° N, 118.2350° W",
        resolvedAt: "Today, 07:15 AM",
        responders: 8,
        duration: "3h 45m",
    },
    {
        id: "RES-003",
        title: "Chemical Spill — Industrial Park",
        location: "34.0480° N, 118.2590° W",
        resolvedAt: "Yesterday, 11:30 PM",
        responders: 15,
        duration: "5h 02m",
    },
    {
        id: "RES-004",
        title: "Power Line Down — Oak Avenue",
        location: "34.0730° N, 118.2410° W",
        resolvedAt: "Yesterday, 06:50 PM",
        responders: 4,
        duration: "1h 12m",
    },
    {
        id: "RES-005",
        title: "Multi-Vehicle Pileup — Highway 101",
        location: "34.0700° N, 118.2550° W",
        resolvedAt: "Yesterday, 02:20 PM",
        responders: 10,
        duration: "1h 55m",
    },
    {
        id: "RES-006",
        title: "Gas Leak — Residential Block C",
        location: "34.0650° N, 118.2380° W",
        resolvedAt: "Feb 21, 10:00 AM",
        responders: 6,
        duration: "4h 30m",
    },
];

/* ── Computed statistics ── */
const totalReceived = 14; // simulated: more alerts were received than resolved
const totalResolved = resolvedAlerts.length;
const totalResponders = resolvedAlerts.reduce((sum, a) => sum + a.responders, 0);

function parseDuration(d: string): number {
    const hMatch = d.match(/(\d+)h/);
    const mMatch = d.match(/(\d+)m/);
    return (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0);
}
const avgResponseMin = Math.round(
    resolvedAlerts.reduce((s, a) => s + parseDuration(a.duration), 0) / resolvedAlerts.length
);
const avgHours = Math.floor(avgResponseMin / 60);
const avgMins = avgResponseMin % 60;
const resolutionRate = Math.round((totalResolved / totalReceived) * 100);

/* ── Stat card helper ── */
function StatCard({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    accent: string;
}) {
    return (
        <div className="bg-slate-100 dark:bg-white/[0.03] rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${accent}`} />
                <p className="text-slate-400 dark:text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                    {label}
                </p>
            </div>
            <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        </div>
    );
}

export default function ResolvedPage() {
    return (
        <div className="relative w-screen h-screen overflow-hidden theme-bg">
            {/* ── Top Center: Navigation Pill ── */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                <GlassNav />
            </div>

            {/* ── Scrollable content ── */}
            <div
                className="absolute inset-0 pt-20 pb-6 px-6 overflow-y-auto hud-scroll animate-fade-in-up"
                style={{ animationDuration: "0.5s" }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* ── Header ── */}
                    <div className="mb-6">
                        <h1 className="text-slate-900 dark:text-white font-bold text-3xl tracking-wide">
                            Resolved Emergencies
                        </h1>
                        <p className="text-slate-500 dark:text-white/50 text-sm mt-2">
                            {totalResolved} incidents successfully resolved
                        </p>
                    </div>

                    {/* ── Two-column layout: Cards + Stats ── */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* ── Left: Card Grid ── */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                            {resolvedAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 border-l-4 border-l-green-500 rounded-2xl p-5 transition-all hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] group"
                                >
                                    {/* Top row: icon + title */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">
                                                {alert.title}
                                            </h3>
                                            <span className="text-slate-400 dark:text-white/30 text-[10px] font-mono">
                                                {alert.id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="text-slate-500 dark:text-white/60 text-xs space-y-1.5 ml-8">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3 text-slate-400 dark:text-white/40" />
                                            {alert.location}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-slate-400 dark:text-white/40" />
                                                {alert.duration}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users className="h-3 w-3 text-slate-400 dark:text-white/40" />
                                                {alert.responders} responders
                                            </span>
                                        </div>
                                    </div>

                                    {/* Resolved timestamp */}
                                    <div className="mt-3 ml-8">
                                        <span className="text-[10px] text-green-400/70 font-semibold uppercase tracking-wider">
                                            Resolved {alert.resolvedAt}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Right: Statistics Sidebar ── */}
                        <div className="w-full lg:w-[300px] flex-shrink-0 space-y-4">
                            {/* Summary Panel */}
                            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
                                    Resolution Overview
                                </h3>
                                <div className="space-y-3">
                                    <StatCard
                                        icon={Shield}
                                        label="Total Received"
                                        value={totalReceived}
                                        accent="text-orange-400"
                                    />
                                    <StatCard
                                        icon={CheckCircle}
                                        label="Resolved"
                                        value={totalResolved}
                                        accent="text-green-400"
                                    />
                                    <StatCard
                                        icon={Timer}
                                        label="Avg Response Time"
                                        value={`${avgHours}h ${avgMins}m`}
                                        accent="text-amber-400"
                                    />
                                    <StatCard
                                        icon={Users}
                                        label="Responders Deployed"
                                        value={totalResponders}
                                        accent="text-blue-400"
                                    />
                                </div>
                            </div>

                            {/* Resolution Rate */}
                            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
                                    Resolution Rate
                                </h3>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-4xl font-bold text-green-400">
                                        {resolutionRate}%
                                    </span>
                                    <TrendingUp className="h-5 w-5 text-green-400 mb-1" />
                                </div>
                                <div className="h-2.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out progress-glow"
                                        style={{ width: `${resolutionRate}%` }}
                                    />
                                </div>
                                <p className="text-slate-400 dark:text-white/30 text-[10px] mt-2">
                                    {totalResolved} of {totalReceived} incidents resolved
                                </p>
                            </div>

                            {/* Response Time Breakdown */}
                            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-4">
                                    Response Duration
                                </h3>
                                <div className="space-y-2.5">
                                    {resolvedAlerts.map((a) => {
                                        const mins = parseDuration(a.duration);
                                        const maxMins = 320; // 5h 20m cap for bar width
                                        const pct = Math.min(
                                            100,
                                            Math.round((mins / maxMins) * 100)
                                        );
                                        return (
                                            <div key={a.id}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] text-slate-500 dark:text-white/60 truncate max-w-[160px]">
                                                        {a.title.split("—")[0].trim()}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40">
                                                        {a.duration}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                                                        style={{
                                                            width: `${pct}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Wifi, Radio, CloudOff } from "lucide-react";

interface Stat {
    label: string;
    value: string;
    max: number;
    current: number;
    icon: React.ElementType;
    color: string;
    barColor: string;
}

const stats: Stat[] = [
    {
        label: "Active Mesh Nodes",
        value: "47 / 50",
        max: 50,
        current: 47,
        icon: Wifi,
        color: "text-green-400",
        barColor: "bg-green-500",
    },
    {
        label: "LoRa Gateway Signal",
        value: "82%",
        max: 100,
        current: 82,
        icon: Radio,
        color: "text-amber-400",
        barColor: "bg-amber-500",
    },
    {
        label: "Offline Syncs Pending",
        value: "3",
        max: 20,
        current: 3,
        icon: CloudOff,
        color: "text-amber-400",
        barColor: "bg-amber-500",
    },
];

export default function NetworkHealth() {
    return (
        <div className="glass p-4 animate-fade-in-up">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
                Network Health
            </h3>

            <div className="space-y-3">
                {stats.map((s) => {
                    const pct = Math.round((s.current / s.max) * 100);
                    return (
                        <div key={s.label}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                    <s.icon className={`h-3 w-3 ${s.color}`} />
                                    <span className="text-[11px] text-slate-300">
                                        {s.label}
                                    </span>
                                </div>
                                <span className={`text-[11px] font-bold ${s.color}`}>
                                    {s.value}
                                </span>
                            </div>
                            {/* Segmented progress bar */}
                            <div className="flex gap-0.5">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < Math.round(pct / 5)
                                                ? `${s.barColor} opacity-90`
                                                : "bg-white/5"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

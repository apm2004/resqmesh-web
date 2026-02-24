"use client";

import {
    ShieldCheck,
    AlertTriangle,
    Clock,
    Star,
    UserCircle,
} from "lucide-react";

const stats = [
    {
        label: "Alerts Handled",
        value: "247",
        icon: AlertTriangle,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
    },
    {
        label: "Clearance Level",
        value: "Alpha-3",
        icon: ShieldCheck,
        color: "text-green-400",
        bg: "bg-green-400/10",
    },
    {
        label: "Avg. Response Time",
        value: "4m 12s",
        icon: Clock,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        label: "Rating",
        value: "4.9 / 5",
        icon: Star,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
    },
];

export default function ProfilePage() {
    return (
        <div className="min-h-[calc(100vh-73px)] theme-bg px-6 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Profile header */}
                <div className="flex items-center gap-5 mb-8">
                    <div className="flex-shrink-0 rounded-full theme-surface border theme-divider-strong p-3">
                        <UserCircle className="h-16 w-16 theme-dim" />
                    </div>
                    <div>
                        <h1 className="theme-heading text-2xl font-bold">
                            Operator Delta-7
                        </h1>
                        <p className="theme-muted text-sm mt-0.5">
                            Search &amp; Rescue Command &middot; Active since Jan 2025
                        </p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-green-500/15 text-green-400 uppercase tracking-wide">
                            On Duty
                        </span>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="theme-surface border theme-divider-strong rounded-lg p-4 flex items-center gap-4"
                        >
                            <div
                                className={`flex-shrink-0 rounded-lg p-2.5 ${s.bg}`}
                            >
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <div>
                                <p className="theme-muted text-xs">
                                    {s.label}
                                </p>
                                <p className="theme-heading text-lg font-bold leading-tight">
                                    {s.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent activity */}
                <h2 className="theme-heading font-semibold text-sm mb-3">
                    Recent Activity
                </h2>
                <div className="space-y-2">
                    {[
                        {
                            action: "Acknowledged",
                            target: "Building Collapse — Sector 7",
                            time: "2h ago",
                        },
                        {
                            action: "Resolved",
                            target: "Flash Flood — River District",
                            time: "5h ago",
                        },
                        {
                            action: "Escalated",
                            target: "Gas Leak Near School Zone",
                            time: "8h ago",
                        },
                    ].map((item) => (
                        <div
                            key={item.target}
                            className="theme-surface rounded-md px-4 py-3 flex items-center justify-between text-sm"
                        >
                            <span className="theme-muted">
                                <span className="text-blue-400 font-medium">
                                    {item.action}
                                </span>{" "}
                                {item.target}
                            </span>
                            <span className="theme-dim text-xs">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

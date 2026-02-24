"use client";

import { CheckCircle, Clock, MapPin } from "lucide-react";

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

export default function ResolvedPage() {
    return (
        <div className="min-h-[calc(100vh-73px)] theme-bg px-6 py-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="theme-heading text-2xl font-bold mb-1">
                    Resolved Emergencies
                </h1>
                <p className="theme-muted text-sm mb-6">
                    {resolvedAlerts.length} incidents successfully resolved
                </p>

                <div className="space-y-3">
                    {resolvedAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="theme-surface border theme-divider-strong rounded-lg p-4 flex items-start gap-4 transition-colors duration-150 hover:border-green-500/30"
                        >
                            {/* Green checkmark */}
                            <div className="mt-0.5 flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <h3 className="theme-heading font-semibold text-sm leading-snug">
                                    {alert.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs theme-muted">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {alert.location}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {alert.duration}
                                    </span>
                                    <span>{alert.responders} responders</span>
                                </div>
                            </div>

                            {/* Resolved timestamp */}
                            <span className="flex-shrink-0 text-xs theme-dim whitespace-nowrap">
                                {alert.resolvedAt}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

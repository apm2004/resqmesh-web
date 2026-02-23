"use client";

import { Activity, Globe } from "lucide-react";
import type { LiveAlert } from "@/lib/mockData";

const urgencyBorder: Record<LiveAlert["urgency"], string> = {
    critical: "border-red-500",
    rescue: "border-orange-500",
    info: "border-blue-500",
};

const urgencyLabel: Record<LiveAlert["urgency"], string> = {
    critical: "text-red-400",
    rescue: "text-orange-400",
    info: "text-blue-400",
};

interface AlertCardProps {
    alert: LiveAlert;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function AlertCard({ alert, isSelected, onClick }: AlertCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-slate-800 border-l-4 ${urgencyBorder[alert.urgency]} rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 cursor-pointer ${isSelected ? "ring-2 ring-blue-500 bg-slate-700" : ""
                }`}
        >
            {/* Top row: source badge + urgency tag */}
            <div className="flex items-center justify-between mb-2">
                {/* Source badge */}
                {alert.source === "mesh" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        <Activity className="h-3.5 w-3.5" />
                        Mesh &middot; {alert.sourceDetails}
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        <Globe className="h-3.5 w-3.5" />
                        Social &middot; {alert.sourceDetails}
                    </span>
                )}

                {/* Urgency tag */}
                <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${urgencyLabel[alert.urgency]}`}
                >
                    {alert.urgency}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-sm leading-snug mb-1">
                {alert.title}
            </h3>

            {/* Time */}
            <p className="text-slate-400 text-xs mb-3">{alert.time}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <button className="flex-1 text-xs font-medium py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-150 cursor-pointer">
                    Acknowledge
                </button>
                <button className="flex-1 text-xs font-medium py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors duration-150 cursor-pointer">
                    Map
                </button>
            </div>
        </div>
    );
}

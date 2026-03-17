"use client";

import { useState, useEffect, useCallback } from "react";
import type { LiveAlert } from "@/lib/mockData";
import { useAlerts } from "@/context/AlertContext";
import { alertConfig } from "@/lib/alertConfig";

interface ActiveResponseProps {
    selectedAlert: LiveAlert | null;
    onClearSelection: () => void;
}

/* ── Animated waveform bars ── */
function Waveform() {
    return (
        <div className="flex items-center gap-[2px] h-5">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="waveform-bar w-[3px] rounded-full bg-green-400/80"
                    style={{ height: "4px" }}
                />
            ))}
        </div>
    );
}

/* ── Toast notification ── */
type ToastType = "acknowledge" | "escalate" | "resolved" | null;

interface ToastConfig {
    icon: string;
    title: string;
    message: string;
    accent: string;
    border: string;
    glow: string;
}

const toastConfigs: Record<Exclude<ToastType, null>, ToastConfig> = {
    acknowledge: {
        icon: "🚀",
        title: "Team Dispatched",
        message: "Rescue Team Alpha & Medical Unit Bravo have been notified and are en route.",
        accent: "text-orange-400",
        border: "border-orange-500/30",
        glow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]",
    },
    escalate: {
        icon: "⚠️",
        title: "Alert Escalated",
        message: "This alert has been escalated to Command HQ for priority review.",
        accent: "text-yellow-400",
        border: "border-yellow-500/30",
        glow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]",
    },
    resolved: {
        icon: "✅",
        title: "Alert Resolved",
        message: "This alert has been marked as resolved. All teams have been stood down.",
        accent: "text-green-400",
        border: "border-green-500/30",
        glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
    },
};



export default function ActiveResponse({ selectedAlert, onClearSelection }: ActiveResponseProps) {
    const { markAsResolved, acknowledgeAlert, isAcknowledged } = useAlerts();
    const [activeToast, setActiveToast] = useState<ToastType>(null);
    const [toastVisible, setToastVisible] = useState(false);

    /* Reset toast state when a different alert is selected */
    useEffect(() => {
        setActiveToast(null);
        setToastVisible(false);
    }, [selectedAlert?.id]);

    const fireToast = useCallback((type: Exclude<ToastType, null>) => {
        setActiveToast(type);
        setToastVisible(true);
        const timer = setTimeout(() => {
            setToastVisible(false);
            setTimeout(() => setActiveToast(null), 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleAcknowledge = () => {
        if (!selectedAlert) return;
        acknowledgeAlert(selectedAlert.id);
        fireToast("acknowledge");
    };

    const handleEscalate = () => {
        fireToast("escalate");
    };

    const handleResolved = () => {
        if (!selectedAlert) return;
        fireToast("resolved");
        // Give the toast a moment to show, then resolve and close panel
        setTimeout(() => {
            markAsResolved(selectedAlert.id);
            onClearSelection();
        }, 800);
    };

    /* ── render nothing when no alert is selected ── */
    if (!selectedAlert) return null;

    const toast = activeToast ? toastConfigs[activeToast] : null;
    const cfg = alertConfig[selectedAlert.urgency];

    return (
        <div className="relative bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-5 animate-fade-in-up space-y-4">

            {/* ── Toast popup ── */}
            {toast && (
                <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-[90%]
                        bg-white/80 dark:bg-black/70 backdrop-blur-xl border ${toast.border} rounded-xl px-4 py-3
                        ${toast.glow} transition-all duration-300 z-50
                        ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                >
                    <div className="flex items-start gap-2.5">
                        <span className="text-lg leading-none mt-0.5">{toast.icon}</span>
                        <div>
                            <p className={`text-sm font-bold ${toast.accent}`}>
                                {toast.title}
                            </p>
                            <p className="text-slate-500 dark:text-white/60 text-[11px] leading-relaxed mt-0.5">
                                {toast.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 1. Header label ── */}
            <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-white/50 font-semibold">
                Active Response
            </p>

            {/* ── 2. Badges row ── */}
            <div className="flex items-center gap-2">
                <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                >
                    {selectedAlert.urgency}
                </span>
                <span className="text-slate-400 dark:text-white/40 text-[11px]">
                    ID: {selectedAlert.userId}
                </span>
            </div>

            {/* ── 3. Title & message ── */}
            <div>
                <h2 className="text-slate-900 dark:text-white font-bold text-xl leading-tight">
                    {selectedAlert.title}
                </h2>
                <p className="text-slate-600 dark:text-white/80 text-sm mt-1 leading-relaxed">
                    {selectedAlert.message.includes('Description')
                        ? selectedAlert.message.split(/Description\s*:\s*/)[1]
                        : selectedAlert.message}
                </p>
            </div>

            {/* ── 4. Coordinates box ── */}
            <div className="bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 p-3 rounded-lg">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/50 font-semibold">
                    Coordinates
                </span>
                <p className="text-orange-400 text-sm font-medium mt-0.5">
                    {selectedAlert.coordinates}
                </p>
            </div>

            {/* ── Radio comms strips (appear on Acknowledge) ── */}
            {isAcknowledged(selectedAlert.id) && (
                <div className="space-y-2 animate-fade-in-up" style={{ animationDuration: "0.4s" }}>
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2">
                        <Waveform />
                        <div className="flex-1 min-w-0">
                            <p className="text-green-400 text-[10px] font-semibold">
                                Rescue Team Alpha
                            </p>
                            <p className="text-slate-400 dark:text-white/40 text-[10px] truncate">
                                En Route — ETA 4 min
                            </p>
                        </div>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2">
                        <Waveform />
                        <div className="flex-1 min-w-0">
                            <p className="text-amber-400 text-[10px] font-semibold">
                                Medical Unit Bravo
                            </p>
                            <p className="text-slate-400 dark:text-white/40 text-[10px] truncate">
                                On Scene — Sector 7
                            </p>
                        </div>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 animate-pulse-glow" />
                    </div>
                </div>
            )}

            {/* ── 5. Action buttons (3-button grid) ── */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                {/* Acknowledge */}
                <button
                    onClick={handleAcknowledge}
                    className={`py-2 rounded-xl font-bold text-sm transition cursor-pointer ${isAcknowledged(selectedAlert.id)
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110"
                        }`}
                >
                    {isAcknowledged(selectedAlert.id) ? "✓ Acknowledged" : "Acknowledge"}
                </button>

                {/* Escalate */}
                <button
                    onClick={handleEscalate}
                    className="py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/70 font-medium text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                >
                    Escalate
                </button>

                {/* Mark as Resolved */}
                <button
                    onClick={handleResolved}
                    className="col-span-2 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/20 transition cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                >
                    Mark as Resolved
                </button>
            </div>
        </div>
    );
}

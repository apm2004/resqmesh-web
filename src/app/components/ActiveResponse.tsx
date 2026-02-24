"use client";

import type { LiveAlert } from "@/lib/mockData";

interface ActiveResponseProps {
    selectedAlert: LiveAlert | null;
}

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

export default function ActiveResponse({ selectedAlert }: ActiveResponseProps) {
    return (
        <div className="glass p-4 animate-fade-in-up">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Active Response
            </h3>

            {selectedAlert ? (
                <div className="space-y-3">
                    {/* Selected alert info */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${selectedAlert.urgency === "critical"
                                        ? "bg-red-500/20 text-red-400"
                                        : selectedAlert.urgency === "rescue"
                                            ? "bg-orange-500/20 text-orange-400"
                                            : "bg-blue-500/20 text-blue-400"
                                    }`}
                            >
                                {selectedAlert.urgency}
                            </span>
                            <span className="text-slate-500 text-[10px]">
                                {selectedAlert.id}
                            </span>
                        </div>
                        <h4 className="text-white text-sm font-semibold mb-1">
                            {selectedAlert.title}
                        </h4>
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                            {selectedAlert.fullMessage}
                        </p>
                    </div>

                    {/* Needs */}
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            Resources
                        </span>
                        <p className="text-orange-300 text-xs mt-0.5 font-medium">
                            {selectedAlert.need}
                        </p>
                    </div>

                    {/* Radio comms strip */}
                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/5">
                        <Waveform />
                        <div className="flex-1 min-w-0">
                            <p className="text-green-400 text-[10px] font-semibold">
                                Rescue Team Alpha
                            </p>
                            <p className="text-slate-500 text-[10px] truncate">
                                En Route — ETA 4 min
                            </p>
                        </div>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110 transition cursor-pointer">
                            Acknowledge
                        </button>
                        <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition cursor-pointer">
                            Escalate
                        </button>
                    </div>
                </div>
            ) : (
                /* Default state */
                <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/5">
                        <Waveform />
                        <div className="flex-1 min-w-0">
                            <p className="text-green-400 text-[10px] font-semibold">
                                Rescue Team Alpha
                            </p>
                            <p className="text-slate-500 text-[10px] truncate">
                                En Route to Main St. — ETA 4 min
                            </p>
                        </div>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/5">
                        <Waveform />
                        <div className="flex-1 min-w-0">
                            <p className="text-amber-400 text-[10px] font-semibold">
                                Medical Unit Bravo
                            </p>
                            <p className="text-slate-500 text-[10px] truncate">
                                On Scene — Sector 7
                            </p>
                        </div>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 animate-pulse-glow" />
                    </div>
                    <p className="text-slate-600 text-[10px] text-center mt-1">
                        Select an alert for full details
                    </p>
                </div>
            )}
        </div>
    );
}

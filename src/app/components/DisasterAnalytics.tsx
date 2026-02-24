"use client";

interface BarStat {
    label: string;
    value: string;
    pct: number;
    gradient: string;
    textColor: string;
}

const bars: BarStat[] = [
    {
        label: "Total Area Scanned",
        value: "78%",
        pct: 78,
        gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
        textColor: "text-cyan-400",
    },
    {
        label: "Critical Alerts Pending",
        value: "5",
        pct: 25,
        gradient: "bg-gradient-to-r from-orange-500 to-red-500",
        textColor: "text-red-400",
    },
    {
        label: "Victims Rescued",
        value: "142",
        pct: 65,
        gradient: "bg-gradient-to-r from-green-500 to-emerald-400",
        textColor: "text-emerald-400",
    },
];

export default function DisasterAnalytics() {
    return (
        <div className="glass p-4 animate-fade-in-up">
            <h3 className="text-[11px] font-bold uppercase tracking-wider theme-dim mb-3">
                Disaster Analytics
            </h3>

            <div className="space-y-3">
                {bars.map((b) => (
                    <div key={b.label}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] theme-muted">
                                {b.label}
                            </span>
                            <span className={`text-[11px] font-bold ${b.textColor}`}>
                                {b.value}
                            </span>
                        </div>
                        <div className="h-2 w-full theme-bar-track rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${b.gradient} transition-all duration-1000 ease-out`}
                                style={{ width: `${b.pct}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

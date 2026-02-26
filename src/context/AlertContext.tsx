"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { liveAlerts, type LiveAlert } from "@/lib/mockData";

/* ── Resolved alert extends LiveAlert with a resolution timestamp ── */
export interface ResolvedAlert extends LiveAlert {
    resolvedAt: string;
    duration: string;
    responders: number;
}

interface AlertContextValue {
    activeAlerts: LiveAlert[];
    resolvedAlerts: ResolvedAlert[];
    markAsResolved: (alertId: string) => void;
}

const AlertContext = createContext<AlertContextValue>({
    activeAlerts: [],
    resolvedAlerts: [],
    markAsResolved: () => { },
});

/* ── Simulation config ── */
const INITIAL_COUNT = 5; // start with first 5 alerts
const INTERVAL_MS = 12_000; // new alert every 12 seconds

export function AlertProvider({ children }: { children: ReactNode }) {
    const [activeAlerts, setActiveAlerts] = useState<LiveAlert[]>(
        () => liveAlerts.slice(0, INITIAL_COUNT)
    );
    const [resolvedAlerts, setResolvedAlerts] = useState<ResolvedAlert[]>([]);
    const pendingAlerts = useRef<LiveAlert[]>(liveAlerts.slice(INITIAL_COUNT));

    /* ── Simulation interval: drip-feed pending alerts ── */
    useEffect(() => {
        const interval = setInterval(() => {
            if (pendingAlerts.current.length === 0) return;

            const next = pendingAlerts.current[0];
            pendingAlerts.current = pendingAlerts.current.slice(1);

            // Add to front of active alerts
            setActiveAlerts((prev) => {
                // Duplicate guard (strict mode)
                if (prev.some((a) => a.id === next.id)) return prev;
                return [next, ...prev];
            });

            // Fire HUD-style incoming alert toast
            toast.custom(
                (t) => (
                    <div
                        className={`bg-red-500/10 border border-red-500/50 backdrop-blur-md text-white
                            px-6 py-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)]
                            flex items-center gap-3 transition-all duration-300
                            ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <span className="text-lg">🚨</span>
                        <span className="text-sm font-semibold tracking-wide">
                            New Alert Detected: {next.title}
                        </span>
                    </div>
                ),
                { position: "bottom-center", duration: 5000 }
            );
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    const markAsResolved = useCallback((alertId: string) => {
        setActiveAlerts((prev) => {
            const alert = prev.find((a) => a.id === alertId);
            if (!alert) return prev;

            const resolved: ResolvedAlert = {
                ...alert,
                resolvedAt: new Date().toISOString(),
                duration: alert.time,
                responders: Math.floor(Math.random() * 12) + 3,
            };

            setResolvedAlerts((prevResolved) => {
                if (prevResolved.some((a) => a.id === alertId)) {
                    return prevResolved;
                }
                return [resolved, ...prevResolved];
            });

            return prev.filter((a) => a.id !== alertId);
        });
    }, []);

    return (
        <AlertContext.Provider
            value={{ activeAlerts, resolvedAlerts, markAsResolved }}
        >
            {children}
        </AlertContext.Provider>
    );
}

export function useAlerts() {
    return useContext(AlertContext);
}

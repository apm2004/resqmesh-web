"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";
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

export function AlertProvider({ children }: { children: ReactNode }) {
    const [activeAlerts, setActiveAlerts] = useState<LiveAlert[]>(liveAlerts);
    const [resolvedAlerts, setResolvedAlerts] = useState<ResolvedAlert[]>([]);

    const markAsResolved = useCallback((alertId: string) => {
        // Read current active list to find the alert
        setActiveAlerts((prev) => {
            const alert = prev.find((a) => a.id === alertId);
            if (!alert) return prev;

            // Build resolved entry
            const resolved: ResolvedAlert = {
                ...alert,
                resolvedAt: new Date().toISOString(),
                duration: alert.time,
                responders: Math.floor(Math.random() * 12) + 3,
            };

            // Add to resolved list (with duplicate guard for Strict Mode)
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

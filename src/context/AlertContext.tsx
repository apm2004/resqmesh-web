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
import { io } from "socket.io-client";
import { type LiveAlert } from "@/lib/mockData";
import { transformMeshAlert, type RawMeshPayload } from "@/lib/transformMeshAlert";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

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
    acknowledgeAlert: (alertId: string) => void;
    isAcknowledged: (alertId: string) => boolean;
}

const AlertContext = createContext<AlertContextValue>({
    activeAlerts: [],
    resolvedAlerts: [],
    markAsResolved: () => { },
    acknowledgeAlert: () => { },
    isAcknowledged: () => false,
});

/* ── Dedup helper ── */
function mergeUnique(prev: LiveAlert[], incoming: LiveAlert[]): LiveAlert[] {
    const existingIds = new Set(prev.map((a) => a.id));
    const fresh = incoming.filter((a) => !existingIds.has(a.id));
    return fresh.length ? [...fresh, ...prev] : prev;
}

export function AlertProvider({ children }: { children: ReactNode }) {
    const [activeAlerts, setActiveAlerts] = useState<LiveAlert[]>([]);
    const [resolvedAlerts, setResolvedAlerts] = useState<ResolvedAlert[]>([]);
    const acknowledgedIds = useRef<Set<string>>(new Set());

    const acknowledgeAlert = useCallback((alertId: string) => {
        acknowledgedIds.current.add(alertId);
    }, []);

    const isAcknowledged = useCallback((alertId: string) => {
        return acknowledgedIds.current.has(alertId);
    }, []);

    /* ── Socket.IO: mesh alerts + Reddit alerts via backend ── */
    useEffect(() => {
        const socket = io(BACKEND, { transports: ["websocket", "polling"] });

        socket.on("connect", () => {
            console.log("[Socket.IO] Connected →", socket.id);

            // ── Hydrate mesh alerts from DB ──
            fetch(`${BACKEND}/api/alerts`)
                .then((r) => r.json())
                .then(({ alerts }: { alerts: RawMeshPayload[] }) => {
                    if (!Array.isArray(alerts)) return;
                    const formatted = alerts.map(transformMeshAlert);
                    setActiveAlerts((prev) => mergeUnique(prev, formatted));
                })
                .catch((e) => console.warn("[Socket.IO] Mesh history fetch failed:", e));

            // ── Hydrate Reddit alerts from DB (silently, no toasts) ──
            fetch(`${BACKEND}/api/reddit-alerts`)
                .then((r) => r.json())
                .then(({ alerts }: { alerts: LiveAlert[] }) => {
                    if (!Array.isArray(alerts)) return;
                    setActiveAlerts((prev) => mergeUnique(prev, alerts));
                })
                .catch((e) => console.warn("[Socket.IO] Reddit history fetch failed:", e));
        });

        /* ── New mesh alert from hardware ── */
        socket.on("new_mesh_alert", (rawPayload: RawMeshPayload) => {
            const formatted = transformMeshAlert(rawPayload);
            setActiveAlerts((prev) => {
                if (prev.some((a) => a.id === formatted.id)) return prev;
                return [formatted, ...prev];
            });
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
                            New Mesh Alert: {formatted.title}
                        </span>
                    </div>
                ),
                { position: "bottom-center", duration: 6000 }
            );
        });

        /* ── New Reddit alert — server polled + saved to DB ── */
        socket.on("new_reddit_alert", (alert: LiveAlert) => {
            setActiveAlerts((prev) => {
                if (prev.some((a) => a.id === alert.id)) return prev;
                return [alert, ...prev];
            });
            toast.custom(
                (t) => (
                    <div
                        className={`bg-orange-500/10 border border-orange-500/50 backdrop-blur-md text-white
                            px-6 py-3 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)]
                            flex items-center gap-3 transition-all duration-300
                            ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <span className="text-lg">📲</span>
                        <span className="text-sm font-semibold tracking-wide">
                            Reddit Alert: {alert.title}
                        </span>
                    </div>
                ),
                { position: "bottom-center", duration: 6000 }
            );
        });

        return () => {
            socket.off("new_mesh_alert");
            socket.off("new_reddit_alert");
            socket.disconnect();
            console.log("[Socket.IO] Disconnected");
        };
    }, []);

    const markAsResolved = useCallback((alertId: string) => {
        // ── If it's a Reddit alert, permanently delete from DB + blocklist ──
        // This prevents the poller from re-inserting it on the next cycle.
        if (alertId.startsWith("REDDIT-")) {
            const redditId = alertId.replace(/^REDDIT-/, "");
            fetch(`${BACKEND}/api/reddit-alerts/${redditId}`, { method: "DELETE" })
                .then((r) => {
                    if (r.ok) {
                        console.log(`[AlertContext] Permanently deleted & blocklisted: ${redditId}`);
                    } else {
                        console.warn(`[AlertContext] Backend DELETE failed for ${redditId}:`, r.status);
                    }
                })
                .catch((e) => console.warn(`[AlertContext] DELETE request error for ${redditId}:`, e));
        }

        setActiveAlerts((prev) => {
            const alert = prev.find((a) => a.id === alertId);
            if (!alert) return prev;

            const resolved: ResolvedAlert = {
                ...alert,
                resolvedAt: new Date().toISOString(),
                duration: alert.time,
                responders: 0,
            };

            setResolvedAlerts((prevResolved) => {
                if (prevResolved.some((a) => a.id === alertId)) return prevResolved;
                return [resolved, ...prevResolved];
            });

            return prev.filter((a) => a.id !== alertId);
        });
    }, []);

    return (
        <AlertContext.Provider
            value={{ activeAlerts, resolvedAlerts, markAsResolved, acknowledgeAlert, isAcknowledged }}
        >
            {children}
        </AlertContext.Provider>
    );
}

export function useAlerts() {
    return useContext(AlertContext);
}

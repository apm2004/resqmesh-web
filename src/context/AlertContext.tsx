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
import { liveAlerts, generateMockAlerts, type LiveAlert } from "@/lib/mockData";
import { transformMeshAlert, type RawMeshPayload } from "@/lib/transformMeshAlert";

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

/* ── Simulation config ── */
const INITIAL_COUNT = 5; // start with first 5 alerts
const INTERVAL_MS = 12_000; // new alert every 12 seconds

export function AlertProvider({ children }: { children: ReactNode }) {
    const [activeAlerts, setActiveAlerts] = useState<LiveAlert[]>(
        () => liveAlerts.slice(0, INITIAL_COUNT)
    );
    const [resolvedAlerts, setResolvedAlerts] = useState<ResolvedAlert[]>([]);
    const pendingAlerts = useRef<LiveAlert[]>(liveAlerts.slice(INITIAL_COUNT));
    const acknowledgedIds = useRef<Set<string>>(new Set());
    const hasHydrated = useRef(false);

    const acknowledgeAlert = useCallback((alertId: string) => {
        acknowledgedIds.current.add(alertId);
    }, []);

    const isAcknowledged = useCallback((alertId: string) => {
        return acknowledgedIds.current.has(alertId);
    }, []);

    /* ── Hydrate mock analytics data only on client ── */
    useEffect(() => {
        if (hasHydrated.current) return;
        hasHydrated.current = true;

        // Production transition: seed exactly 5 pending alerts, no resolved mock data
        const generatedAlerts = generateMockAlerts(5);
        setActiveAlerts(generatedAlerts.active);
        setResolvedAlerts([]);
    }, []);

    /* ── Live backend: Socket.IO connection ── */
    useEffect(() => {
        const socket = io(
            process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000',
            { transports: ['websocket', 'polling'] }
        );

        socket.on('connect', () => {
            console.log('[Socket.IO] Connected to ResQMesh backend →', socket.id);
        });

        socket.on('new_mesh_alert', (rawPayload: RawMeshPayload) => {
            const formatted = transformMeshAlert(rawPayload);

            setActiveAlerts((prev) => {
                // Duplicate guard — mesh re-broadcasts can deliver the same ID twice
                if (prev.some((a) => a.id === formatted.id)) return prev;
                return [formatted, ...prev];
            });

            // HUD-style toast matching the existing simulation style
            toast.custom(
                (t) => (
                    <div
                        className={`bg-red-500/10 border border-red-500/50 backdrop-blur-md text-white
                            px-6 py-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)]
                            flex items-center gap-3 transition-all duration-300
                            ${t.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        <span className="text-lg">🚨</span>
                        <span className="text-sm font-semibold tracking-wide">
                            New Mesh Alert Detected: {formatted.title}
                        </span>
                    </div>
                ),
                { position: 'bottom-center', duration: 6000 }
            );
        });

        return () => {
            socket.off('new_mesh_alert');
            socket.disconnect();
            console.log('[Socket.IO] Disconnected from ResQMesh backend');
        };
    }, []);

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
                return [{ ...next, createdAt: Date.now() }, ...prev];
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
            value={{ activeAlerts, resolvedAlerts, markAsResolved, acknowledgeAlert, isAcknowledged }}
        >
            {children}
        </AlertContext.Provider>
    );
}

export function useAlerts() {
    return useContext(AlertContext);
}

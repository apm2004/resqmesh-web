"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const tileUrls = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
};

interface AnalyticsMiniMapProps {
    heatPoints: [number, number, number][];
    theme: "dark" | "light";
}

export default function AnalyticsMiniMap({
    heatPoints,
    theme,
}: AnalyticsMiniMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        // Destroy previous instance if it exists
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(containerRef.current, {
            center: [30, -40],
            zoom: 1,
            minZoom: 1,
            maxZoom: 4,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            keyboard: false,
            attributionControl: false,
            maxBoundsViscosity: 1.0,
        });

        L.tileLayer(tileUrls[theme]).addTo(map);

        if (heatPoints.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (L as any)
                .heatLayer(heatPoints, {
                    radius: 50,
                    blur: 30,
                    maxZoom: 5,
                    max: 0.6,
                    minOpacity: 0.6,
                    gradient: { 0.2: "#22c55e", 0.5: "#eab308", 0.8: "#ef4444", 1.0: "#dc2626" },
                })
                .addTo(map);
        }

        setTimeout(() => map.invalidateSize(), 150);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [heatPoints, theme]);

    return (
        <div
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden border border-slate-300 dark:border-white/10"
            style={{ height: "256px" }}
        />
    );
}

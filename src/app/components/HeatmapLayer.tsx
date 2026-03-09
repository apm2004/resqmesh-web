"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
    points: [number, number, number][]; // [lat, lng, intensity]
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    gradient?: Record<number, string>;
}

export default function HeatmapLayer({
    points,
    radius = 25,
    blur = 15,
    maxZoom = 17,
    max = 1.0,
    gradient = { 0.2: "#22c55e", 0.5: "#eab308", 1.0: "#ef4444" },
}: HeatmapLayerProps) {
    const map = useMap();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const heat = (L as any).heatLayer(points, {
            radius,
            blur,
            maxZoom,
            max,
            gradient,
        });

        heat.addTo(map);
        return () => {
            map.removeLayer(heat);
        };
    }, [map, points, radius, blur, maxZoom, max, gradient]);

    return null;
}

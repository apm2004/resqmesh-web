"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MapSearchBar from "./MapSearchBar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LiveAlert } from "@/lib/mockData";
import { useTheme } from "./ThemeContext";

/* ── Glowing SOS pin icon ── */
function makeSOSIcon(color: string, glowColor: string, size: number = 30) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="${size}" height="${size * 1.35}">
      <defs>
        <filter id="glow-${color.replace("#", "")}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feFlood flood-color="${glowColor}" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="shadow"/>
          <feMerge>
            <feMergeNode in="shadow"/>
            <feMergeNode in="shadow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M16 2C9.37 2 4 7.37 4 14c0 8.4 12 24 12 24s12-15.6 12-24c0-6.63-5.37-12-12-12z"
            fill="${color}" filter="url(#glow-${color.replace("#", "")})" opacity="0.95"/>
      <circle cx="16" cy="14" r="5" fill="white" opacity="0.9"/>
    </svg>`;

    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [size, size * 1.35],
        iconAnchor: [size / 2, size * 1.35],
        popupAnchor: [0, -(size * 1.35)],
    });
}

const urgencyColor: Record<LiveAlert["urgency"], { fill: string; glow: string }> = {
    critical: { fill: "#ef4444", glow: "#ff0000" },
    rescue: { fill: "#f97316", glow: "#ff6600" },
    info: { fill: "#3b82f6", glow: "#0066ff" },
};

const tileUrls = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
};

/* ── Fly to selected ── */
function FlyTo({ alert }: { alert: LiveAlert | null }) {
    const map = useMap();
    useEffect(() => {
        if (alert) {
            map.flyTo([alert.lat, alert.lng], 14, { duration: 0.8 });
        }
    }, [alert, map]);
    return null;
}

/* ── MapView ── */
interface MapViewProps {
    alerts: LiveAlert[];
    selectedAlert: LiveAlert | null;
    onSelectAlert: (alert: LiveAlert) => void;
    className?: string;
    showSearchBar?: boolean;
}

export default function MapView({
    alerts,
    selectedAlert,
    onSelectAlert,
    className = "",
    showSearchBar = false,
}: MapViewProps) {
    const center: [number, number] = [34.055, -118.255];
    const { theme } = useTheme();

    return (
        <MapContainer
            center={center}
            zoom={12}
            className={`h-full w-full ${className}`}
            style={{ background: "var(--map-bg)" }}
            zoomControl={false}
        >
            <TileLayer
                key={theme}
                url={tileUrls[theme]}
            />
            <FlyTo alert={selectedAlert} />
            {showSearchBar && <MapSearchBar />}

            {alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const colors = urgencyColor[alert.urgency];
                const icon = makeSOSIcon(
                    colors.fill,
                    colors.glow,
                    isSelected ? 38 : 28
                );

                return (
                    <Marker
                        key={alert.id}
                        position={[alert.lat, alert.lng]}
                        icon={icon}
                        eventHandlers={{
                            click: () => onSelectAlert(alert),
                        }}
                    >
                        <Popup>
                            <div className="text-xs p-1">
                                <strong className="theme-heading">{alert.title}</strong>
                                <p className="theme-muted mt-1 mb-0">{alert.need}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

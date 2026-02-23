"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LiveAlert } from "@/lib/mockData";

/* ── Custom marker icons ── */
function makeIcon(color: string, size: number = 28) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`;
    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
}

const urgencyColor: Record<LiveAlert["urgency"], string> = {
    critical: "#ef4444",
    rescue: "#f97316",
    info: "#3b82f6",
};

/* ── Helper: fly to selected alert ── */
function FlyTo({ alert }: { alert: LiveAlert | null }) {
    const map = useMap();
    useEffect(() => {
        if (alert) {
            map.flyTo([alert.lat, alert.lng], 14, { duration: 0.8 });
        }
    }, [alert, map]);
    return null;
}

/* ── Main MapView ── */
interface MapViewProps {
    alerts: LiveAlert[];
    selectedAlert: LiveAlert | null;
    onSelectAlert: (alert: LiveAlert) => void;
}

export default function MapView({
    alerts,
    selectedAlert,
    onSelectAlert,
}: MapViewProps) {
    const center: [number, number] = [34.055, -118.255];

    return (
        <MapContainer
            center={center}
            zoom={12}
            className="h-full w-full rounded-lg"
            style={{ background: "#0f172a" }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <FlyTo alert={selectedAlert} />

            {alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const icon = makeIcon(
                    urgencyColor[alert.urgency],
                    isSelected ? 40 : 28
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
                            <div className="text-xs">
                                <strong>{alert.title}</strong>
                                <br />
                                {alert.need}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

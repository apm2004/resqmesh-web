import type { AlertCategory } from './alertConfig';

export interface LiveAlert {
    id: string;
    urgency: AlertCategory;
    source: "mesh" | "social";
    sourceDetails: string;
    title: string;
    time: string;
    location: string;
    lat: number;
    lng: number;
    need: string;
    fullMessage: string;
    userId: string;
    alertType: string;
    message: string;
    coordinates: string;
    createdAt: number;
}

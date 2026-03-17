/**
 * useRelativeTime.ts
 *
 * Returns a live-updating relative time string (e.g. "2 min ago") that
 * automatically refreshes every 30 seconds — no page reload needed.
 *
 * @param createdAtMs  Unix timestamp in **milliseconds**
 */
"use client";

import { useState, useEffect } from "react";

function formatRelative(createdAtMs: number): string {
    const diffMs  = Date.now() - createdAtMs;
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1)    return "just now";
    if (minutes < 60)   return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)     return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function useRelativeTime(createdAtMs: number): string {
    const [label, setLabel] = useState(() => formatRelative(createdAtMs));

    useEffect(() => {
        // Recalculate immediately in case the component mounted after the interval
        setLabel(formatRelative(createdAtMs));

        const id = setInterval(() => {
            setLabel(formatRelative(createdAtMs));
        }, 30_000); // tick every 30 s

        return () => clearInterval(id);
    }, [createdAtMs]);

    return label;
}

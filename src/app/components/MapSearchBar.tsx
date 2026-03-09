"use client";

import { useState, type FormEvent } from "react";
import { useMap } from "react-leaflet";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MapSearchBar() {
    const map = useMap();
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed || searching) return;

        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}`,
                { headers: { "User-Agent": "ResQMesh/1.0" } }
            );
            const data = await res.json();

            if (!data || data.length === 0) {
                toast.error("No results found for \"" + trimmed + "\"");
                return;
            }

            const { lat, lon } = data[0];
            map.flyTo([parseFloat(lat), parseFloat(lon)], 13, { duration: 1.2 });
            setQuery("");
        } catch {
            toast.error("Geocoding failed — check your connection");
        } finally {
            setSearching(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="absolute top-5 right-4 z-[1000]
                       bg-white/80 dark:bg-black/60 backdrop-blur-md
                       border border-slate-300 dark:border-white/10
                       rounded-full px-4 py-2 flex items-center gap-3
                       shadow-2xl transition-all"
        >
            {searching ? (
                <Loader2 className="w-4 h-4 text-slate-500 dark:text-white/50 animate-spin" />
            ) : (
                <Search className="w-4 h-4 text-slate-500 dark:text-white/50" />
            )}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a location…"
                className="bg-transparent text-slate-900 dark:text-white
                           placeholder:text-slate-500 dark:placeholder:text-white/50
                           focus:outline-none w-64 md:w-80 text-sm"
            />
        </form>
    );
}

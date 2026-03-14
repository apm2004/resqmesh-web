import { NextRequest, NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q");
    if (!q || q.trim().length < 2) {
        return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5_000);

        const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=0`;
        const res = await fetch(url, {
            headers: {
                // Nominatim requires a descriptive User-Agent
                "User-Agent": "ResQMesh/1.0 (disaster-response-dashboard; contact@resqmesh.app)",
                "Accept-Language": "en",
            },
            signal: controller.signal,
            cache: "force-cache", // same city name → same coords, safe to cache
        });
        clearTimeout(timer);

        if (!res.ok) {
            return NextResponse.json(
                { error: `Nominatim returned ${res.status}` },
                { status: res.status }
            );
        }

        const data: Array<{ lat: string; lon: string; display_name: string }> =
            await res.json();

        if (!data.length) {
            return NextResponse.json({ found: false });
        }

        return NextResponse.json({
            found: true,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display: data[0].display_name,
        });
    } catch (err) {
        console.warn("[Geocode proxy] Failed:", err);
        return NextResponse.json({ found: false });
    }
}

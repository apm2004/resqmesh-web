"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { label: "Live Triage", href: "/" },
    { label: "Map View", href: "/map" },
    { label: "Analytics", href: "#" },
    { label: "Network Status", href: "#" },
];

export default function GlassNav() {
    const pathname = usePathname();

    return (
        <nav className="glass-pill px-2 py-1.5 flex items-center gap-1">
            {/* Brand */}
            <Link
                href="/"
                className="px-4 py-1.5 text-sm font-bold tracking-wider text-white select-none mr-2"
            >
                ResQ<span className="text-red-400">Mesh</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mr-1" />

            {/* Links */}
            {links.map(({ label, href }) => {
                const isActive = href !== "#" && pathname === href;
                return (
                    <Link
                        key={label}
                        href={href}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${isActive
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-red-500/20"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

const links = [
    { label: "Live Triage", href: "/" },
    { label: "Map View", href: "/map" },
    { label: "Analytics", href: "#" },
    { label: "Network Status", href: "#" },
];

export default function GlassNav() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [showSettings, setShowSettings] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowSettings(false);
            }
        }
        if (showSettings) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showSettings]);

    // Close on Escape
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setShowSettings(false);
        }
        if (showSettings) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => document.removeEventListener("keydown", handleEsc);
    }, [showSettings]);

    return (
        <div className="relative" ref={dropdownRef}>
            <nav className="glass-pill px-2 py-1.5 flex items-center gap-1">
                {/* Brand */}
                <Link
                    href="/"
                    className="px-4 py-1.5 text-sm font-bold tracking-wider theme-heading select-none mr-2"
                >
                    ResQ<span className="text-red-400">Mesh</span>
                </Link>

                {/* Divider */}
                <div className="w-px h-5 theme-divider-strong bg-current opacity-30 mr-1" />

                {/* Links */}
                {links.map(({ label, href }) => {
                    const isActive = href !== "#" && pathname === href;
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-red-500/20"
                                    : "theme-dim hover:theme-heading hover:bg-[var(--surface-hover)]"
                                }`}
                        >
                            {label}
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="w-px h-5 theme-divider-strong bg-current opacity-30 ml-1" />

                {/* Settings button */}
                <button
                    onClick={() => setShowSettings((prev) => !prev)}
                    className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${showSettings
                            ? "bg-[var(--surface-active)] theme-heading"
                            : "theme-dim hover:theme-heading hover:bg-[var(--surface-hover)]"
                        }`}
                    aria-label="Settings"
                    id="settings-button"
                >
                    <Settings className="h-3.5 w-3.5" />
                </button>
            </nav>

            {/* Settings dropdown */}
            {showSettings && (
                <div
                    className="absolute right-0 top-full mt-2 w-56 glass p-3 z-50 animate-fade-in-up"
                    style={{ animationDuration: "0.2s" }}
                >
                    <h4 className="text-[10px] font-bold uppercase tracking-wider theme-dim mb-3">
                        Settings
                    </h4>

                    {/* Theme toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {theme === "dark" ? (
                                <Moon className="h-3.5 w-3.5 text-blue-400" />
                            ) : (
                                <Sun className="h-3.5 w-3.5 text-amber-500" />
                            )}
                            <span className="text-xs font-medium theme-text">
                                {theme === "dark" ? "Dark Mode" : "Light Mode"}
                            </span>
                        </div>

                        {/* Toggle switch */}
                        <button
                            onClick={toggleTheme}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer ${theme === "light"
                                    ? "bg-amber-500"
                                    : "bg-slate-600"
                                }`}
                            aria-label="Toggle theme"
                            id="theme-toggle"
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "light"
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

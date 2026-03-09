"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, BarChart3, Wifi } from "lucide-react";
import { useTheme } from "./ThemeContext";

const operationalLinks = [
    { label: "Live Triage", href: "/" },
    { label: "Map View", href: "/map" },
    { label: "Resolved", href: "/resolved" },
];

const advancedLinks = [
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Network Status", href: "/network", icon: Wifi },
];

export default function GlassNav() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdvancedMode =
        pathname === "/analytics" || pathname === "/network";

    const activeLinks = isAdvancedMode ? advancedLinks : operationalLinks;

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    // Close on Escape
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setIsDropdownOpen(false);
        }
        if (isDropdownOpen) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isDropdownOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <nav className="glass-pill px-2 py-1.5 flex items-center gap-1">
                {/* Brand — always resets to home */}
                <Link
                    href="/"
                    className="px-4 py-1.5 text-sm font-bold tracking-wider theme-heading select-none mr-2"
                >
                    ResQ<span className="text-red-400">Mesh</span>
                </Link>

                {/* Divider */}
                <div className="w-px h-5 theme-divider-strong bg-current opacity-30 mr-1" />

                {/* Dynamic main links */}
                {activeLinks.map(({ label, href }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${isActive
                                ? "text-white font-bold"
                                : "text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80 hover:bg-[var(--surface-hover)]"
                                }`}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-red-500/20"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">{label}</span>
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="w-px h-6 bg-slate-300 dark:bg-white/10 ml-1" />

                {/* Settings / More Options button */}
                <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${isDropdownOpen
                        ? "bg-[var(--surface-active)] theme-heading"
                        : "theme-dim hover:theme-heading hover:bg-[var(--surface-hover)]"
                        }`}
                    aria-label="More options"
                    id="settings-button"
                >
                    <Settings className="h-3.5 w-3.5" />
                </button>
            </nav>

            {/* Dropdown menu */}
            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-4 w-48 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-xl p-2 shadow-2xl z-50"
                    >
                        {/* Show advanced links only in Operational mode */}
                        {!isAdvancedMode && (
                            <>
                                {advancedLinks.map(
                                    ({ label, href, icon: Icon }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {label}
                                        </Link>
                                    )
                                )}

                                {/* Divider */}
                                <div className="border-t border-slate-300 dark:border-white/10 my-1" />
                            </>
                        )}

                        {/* Theme Toggle — always visible */}
                        <div className="flex items-center justify-between px-4 py-2">
                            <div className="flex items-center gap-2">
                                {theme === "dark" ? (
                                    <Moon className="h-3.5 w-3.5 text-blue-400" />
                                ) : (
                                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                <span className="text-sm text-slate-600 dark:text-white/70">
                                    {theme === "dark" ? "Dark" : "Light"}
                                </span>
                            </div>

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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

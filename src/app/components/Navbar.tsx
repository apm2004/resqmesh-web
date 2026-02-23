"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const navLinks = [
    { label: "Triage", href: "/" },
    { label: "Map", href: "/map" },
    { label: "Resolved", href: "/resolved" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0F172A] text-white shadow-lg">
            {/* Brand */}
            <Link href="/" className="text-xl font-bold tracking-wide select-none">
                ResQ<span className="text-blue-500">Mesh</span>
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex items-center gap-1">
                {navLinks.map(({ label, href }) => {
                    const isActive =
                        href === "#" ? false : pathname === href;

                    return (
                        <li key={label}>
                            <Link
                                href={href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                    }`}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Profile Icon */}
            <Link
                href="/profile"
                className={`rounded-full p-1.5 transition-colors duration-200 ${pathname === "/profile"
                    ? "bg-blue-500 text-white"
                    : "text-slate-300 hover:text-white"
                    }`}
                aria-label="Profile"
            >
                <UserCircleIcon className="h-7 w-7" />
            </Link>
        </nav>
    );
}

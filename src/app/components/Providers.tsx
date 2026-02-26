"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/app/components/ThemeContext";
import { AlertProvider } from "@/context/AlertContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <AlertProvider>{children}</AlertProvider>
        </ThemeProvider>
    );
}

"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/app/components/ThemeContext";
import { AlertProvider } from "@/context/AlertContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <AlertProvider>
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        className:
                            "!bg-white/80 dark:!bg-black/60 !backdrop-blur-md !border !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white !rounded-xl !shadow-xl dark:!shadow-[0_0_20px_rgba(34,197,94,0.15)] !px-4 !py-3",
                        duration: 4000,
                        success: {
                            iconTheme: {
                                primary: "#4ade80",
                                secondary: "transparent",
                            },
                            className:
                                "dark:!shadow-[0_0_20px_rgba(34,197,94,0.15)] !border-l-4 !border-l-green-500",
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "transparent",
                            },
                            className:
                                "dark:!shadow-[0_0_20px_rgba(239,68,68,0.15)] !border-l-4 !border-l-red-500",
                        },
                    }}
                />
            </AlertProvider>
        </ThemeProvider>
    );
}

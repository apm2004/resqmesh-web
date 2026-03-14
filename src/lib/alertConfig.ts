/* ══════════════════════════════════════════════════════════════════
   alertConfig.ts — Single source of truth for alert categories
   Matches the 6 enums emitted by the Kotlin/hardware app.
   ══════════════════════════════════════════════════════════════════ */

export type AlertCategory =
    | 'MEDICAL'
    | 'RESCUE'
    | 'FOOD'
    | 'TRAPPED'
    | 'GENERAL'
    | 'OTHER';

export const ALERT_CATEGORIES: AlertCategory[] = [
    'MEDICAL',
    'TRAPPED',
    'RESCUE',
    'FOOD',
    'GENERAL',
    'OTHER',
];

export interface AlertCategoryConfig {
    /** Tailwind text color class */
    color: string;
    /** Tailwind background tint class */
    bg: string;
    /** Tailwind border class */
    border: string;
    /** CSS box-shadow glow for the card border */
    glow: string;
    /** Sort priority — lower = shown first in the Triage Feed */
    priority: number;
    /** Human-readable display label */
    label: string;
}

export const alertConfig: Record<AlertCategory, AlertCategoryConfig> = {
    MEDICAL: {
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/50',
        glow: '0 0 12px rgba(239,68,68,0.45)',
        priority: 1,
        label: 'Medical',
    },
    TRAPPED: {
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/50',
        glow: '0 0 12px rgba(168,85,247,0.45)',
        priority: 2,
        label: 'Trapped',
    },
    RESCUE: {
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/50',
        glow: '0 0 12px rgba(249,115,22,0.45)',
        priority: 3,
        label: 'Rescue',
    },
    FOOD: {
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/50',
        glow: '0 0 12px rgba(6,182,212,0.35)',
        priority: 4,
        label: 'Food & Water',
    },
    GENERAL: {
        color: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/50',
        glow: '0 0 8px rgba(100,116,139,0.25)',
        priority: 5,
        label: 'General',
    },
    OTHER: {
        color: 'text-slate-500',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/50',
        glow: '0 0 8px rgba(100,116,139,0.2)',
        priority: 6,
        label: 'Other',
    },
};

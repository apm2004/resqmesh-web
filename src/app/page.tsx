"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { liveAlerts, type LiveAlert } from "@/lib/mockData";
import AlertCard from "./components/AlertCard";
import { Activity, Globe, MapPin, Clock, Users } from "lucide-react";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

const filters = ["All", "Mesh Network", "High Confidence"] as const;
type Filter = (typeof filters)[number];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selectedAlert, setSelectedAlert] = useState<LiveAlert | null>(null);

  const filteredAlerts = liveAlerts.filter((alert) => {
    if (activeFilter === "Mesh Network") return alert.source === "mesh";
    if (activeFilter === "High Confidence")
      return alert.sourceDetails === "NLP: 85%";
    return true;
  });

  return (
    <div
      className="flex bg-[#0F172A]"
      style={{ height: "calc(100vh - 73px)" }}
    >
      {/* ── Left Column: Triage Feed ── */}
      <aside className="w-[400px] flex flex-col border-r border-slate-700/50">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-white text-lg font-bold mb-3">
            Live Triage
          </h1>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 cursor-pointer ${activeFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isSelected={selectedAlert?.id === alert.id}
              onClick={() => setSelectedAlert(alert)}
            />
          ))}
        </div>
      </aside>

      {/* ── Right Column: Mini-map (top) + Detail panel (bottom) ── */}
      <main className="flex-1 flex flex-col p-4 gap-4 min-w-0">
        {/* Mini map */}
        <div className="h-[45%] min-h-[200px] rounded-lg overflow-hidden">
          <MapView
            alerts={filteredAlerts}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
          />
        </div>

        {/* Detail panel */}
        <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700/50 overflow-y-auto">
          {selectedAlert ? (
            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${selectedAlert.urgency === "critical"
                          ? "bg-red-500/15 text-red-400"
                          : selectedAlert.urgency === "rescue"
                            ? "bg-orange-500/15 text-orange-400"
                            : "bg-blue-500/15 text-blue-400"
                        }`}
                    >
                      {selectedAlert.urgency}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {selectedAlert.id}
                    </span>
                  </div>
                  <h2 className="text-white text-lg font-bold">
                    {selectedAlert.title}
                  </h2>
                </div>
                <span className="flex-shrink-0 text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {selectedAlert.time}
                </span>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-700/60 px-2.5 py-1 rounded-md">
                  {selectedAlert.source === "mesh" ? (
                    <Activity className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Globe className="h-3.5 w-3.5 text-blue-400" />
                  )}
                  {selectedAlert.source === "mesh" ? "Mesh" : "Social"} &middot;{" "}
                  {selectedAlert.sourceDetails}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-700/60 px-2.5 py-1 rounded-md">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {selectedAlert.location}
                </span>
              </div>

              {/* Need */}
              <div className="mb-4">
                <h4 className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                  Resources Needed
                </h4>
                <p className="text-white text-sm">
                  {selectedAlert.need}
                </p>
              </div>

              {/* Full message */}
              <div className="mb-5">
                <h4 className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                  Full Report
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedAlert.fullMessage}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer">
                  Acknowledge
                </button>
                <button className="px-5 py-2 text-sm font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer">
                  Escalate
                </button>
                <button className="px-5 py-2 text-sm font-medium rounded-lg bg-green-600/80 hover:bg-green-600 text-white transition-colors cursor-pointer">
                  Mark Resolved
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Users className="h-10 w-10 mb-2 text-slate-600" />
              <p className="text-sm font-medium">No alert selected</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Click an alert to view full details
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

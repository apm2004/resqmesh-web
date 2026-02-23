"use client";

export default function PriorityFeed({ alerts, selectedAlert, onSelectAlert }) {
  return (
    <div className="w-[400px] border-r border-slate-700 flex flex-col bg-slate-900">
      {/* ... your header stuff ... */}
      
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            // HERE IS THE MAGIC: Update the parent's state on click
            onClick={() => onSelectAlert(alert)}
            className={`bg-slate-800 rounded-lg p-4 cursor-pointer border-l-4 transition-all ${
              selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500 bg-slate-700' : 'hover:bg-slate-700'
            } ${
              alert.urgency === 'critical' ? 'border-red-500' : 
              alert.urgency === 'rescue' ? 'border-orange-500' : 'border-blue-500'
            }`}
          >
            {/* ... your card content (title, time, source) ... */}
            <h3 className="text-white font-semibold mb-3">{alert.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );}
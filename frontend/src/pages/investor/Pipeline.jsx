import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { investorService } from "../../services/investor";
import { Building2, TrendingUp, ShieldAlert, DollarSign } from "lucide-react";

const STAGES = [
  "New Startups",
  "Reviewing",
  "Shortlisted",
  "Due Diligence",
  "Negotiation",
  "Invested",
  "Rejected"
];

export default function Pipeline() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedOverStage, setDraggedOverStage] = useState(null);
  const [availableStartups, setAvailableStartups] = useState([]);

  // Load from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pipelineData, availableData] = await Promise.all([
          investorService.getPipeline(),
          investorService.getRecentStartups(20) // Get plenty
        ]);

        const mapped = pipelineData.map(p => ({
          ...p,
          id: p.startup, // Primary ID used for drag/drop
          name: p.startup_name,
          industry: p.startup_industry,
          logo_url: p.startup_logo_url,
          funding_ask: p.startup_funding_ask,
          risk_score: p.startup_risk_score,
          pipelineStage: p.stage
        }));
        setStartups(mapped);

        // Filter out items already in the pipeline
        const pipelineIds = new Set(mapped.map(s => s.id));
        const filteredAvailable = availableData.filter(s => !pipelineIds.has(s.id));
        setAvailableStartups(filteredAvailable);
      } catch (err) {
        console.error("Failed to load pipeline data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("startupId", id);
    // Add a slight transparency to the dragged item
    setTimeout(() => {
      if (e.target && e.target.classList) {
        e.target.classList.add("opacity-50");
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target && e.target.classList) {
      e.target.classList.remove("opacity-50");
    }
    setDraggedOverStage(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragEnter = (e, stage) => {
    e.preventDefault();
    setDraggedOverStage(stage);
  };

  const handleDragLeave = (e) => {
    // We don't clear here because dragEnter on next column might lag, 
    // or nested items (if pointer-events aren't perfect) might trigger it.
    // Instead we rely on Enter updating it and End/Drop clearing it.
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const id = e.dataTransfer.getData("startupId");
    
    // Check if dragging from sidebar
    const isFromSidebar = availableStartups.some(s => s.id === id);

    if (isFromSidebar) {
      const draggedItem = availableStartups.find(s => s.id === id);
      setAvailableStartups(prev => prev.filter(s => s.id !== id));
      setStartups(prev => [...prev, { ...draggedItem, pipelineStage: newStage }]);
      
      try {
        await investorService.addToPipeline(id, newStage);
      } catch (e) {
        console.error("Failed adding with sidebar item to pipeline:", e);
      }
    } else {
      // Update local state directly for speedy UI
      setStartups(prev => 
        prev.map(s => {
          if (s.id === id) {
            return { ...s, pipelineStage: newStage };
          }
          return s;
        })
      );
      
      // Fire off backend sync
      try {
        await investorService.updatePipelineStage(id, newStage);
      } catch (e) {
        console.error("Failed syncing pipeline to backend:", e);
      }
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-white/50">Loading pipeline...</div>;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Deal Pipeline</h1>
          <p className="text-sm text-white/60">Drag and drop startups to track their progress.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar: Available Startups */}
        <div className="w-72 flex-shrink-0 flex flex-col rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-black/20">
            <h3 className="font-semibold text-white/90 text-sm">Available Startups</h3>
            <p className="text-[11px] text-white/50">Drag items to add to pipeline</p>
          </div>
          
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {availableStartups.map(startup => (
              <div
                key={startup.id}
                draggable
                onDragStart={(e) => handleDragStart(e, startup.id)}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing transform transition-transform hover:-translate-y-1"
              >
                <GlassCard className="p-3 space-y-2 pointer-events-none">
                  <div className="flex items-start gap-2">
                    {startup.logo_url ? (
                      <img 
                        src={startup.logo_url} 
                        alt={startup.name} 
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 p-1 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center">
                        <Building2 className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate text-xs">{startup.name || "Unknown"}</h4>
                      <p className="text-[10px] text-white/50 truncate">
                        {startup.industry || "General"}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
            {availableStartups.length === 0 && (
              <div className="text-center py-8 text-white/30 text-xs">No startups available</div>
            )}
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-4 h-full min-h-[600px] items-stretch">
          {STAGES.map(stage => (
            <div 
              key={stage}
              className={`w-80 flex-shrink-0 flex flex-col rounded-xl border transition-colors ${
                draggedOverStage === stage 
                  ? "bg-emerald-500/5 border-emerald-500/40" 
                  : "bg-white/[0.02] border-white/5"
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, stage)}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 rounded-t-xl">
                <h3 className="font-semibold text-white/90 text-sm">{stage}</h3>
                <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                  {startups.filter(s => s.pipelineStage === stage).length}
                </span>
              </div>
              
              {/* Droppable Area */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {startups.filter(s => s.pipelineStage === stage).map(startup => (
                  <div
                    key={startup.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, startup.id)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing transform transition-transform hover:-translate-y-1"
                  >
                    <GlassCard className="p-4 space-y-3 pointer-events-none">
                      <div className="flex items-start gap-3">
                        {startup.logo_url ? (
                          <img 
                            src={startup.logo_url} 
                            alt={startup.name} 
                            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 p-1 object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center">
                            <Building2 className="w-5 h-5 text-white/20" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate text-sm">{startup.name || "Unknown"}</h4>
                          <p className="text-xs text-white/50 truncate flex items-center gap-1">
                            {startup.industry || "General"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Ask
                          </span>
                          <span className="text-xs font-medium text-emerald-400">
                            {startup.funding_ask ? `$${startup.funding_ask}` : "TBD"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Risk
                          </span>
                          <span className="text-xs font-medium text-amber-400">
                            {startup.risk_score || "—"}/200
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
                
                {startups.filter(s => s.pipelineStage === stage).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/30 text-xs">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
     </div>
    </div>
  );
}

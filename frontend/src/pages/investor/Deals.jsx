import React, { useEffect, useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { investorService } from "../../services/investor";
import { watchlist } from "../../services/watchlist";
import { userService } from "../../services/user";
import CompanyProfileModal from "../../components/investor/CompanyProfileModal";

export default function DealsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [userId, setUserId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    userService.me().then((u) => setUserId(u?.id || null)).catch(() => setUserId(null));
    investorService
      .getRecentStartups(20)
      .then((data) => {
        if (!active) return;
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e?.message || "Failed to load deals"))
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSavedIds(new Set(watchlist.load(userId).map((w) => w.id)));
  }, [userId]);

  const toggle = (row) => {
    if (!row?.id) return;
    if (watchlist.has(userId, row.id)) {
      watchlist.remove(userId, row.id);
      const next = new Set(savedIds);
      next.delete(row.id);
      setSavedIds(next);
    } else {
      watchlist.add(userId, { id: row.id, name: row.name, industry: row.industry, funding_ask: row.funding_ask, risk_score: row.risk_score });
      const next = new Set(savedIds);
      next.add(row.id);
      setSavedIds(next);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Deals</h2>
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 text-white/60 text-sm">Loading deals…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-white/60 text-sm">No deals available.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04] text-white/70">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Industry</th>
                <th className="text-left p-3">Funding Ask</th>
                <th className="text-left p-3">Risk Score</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-3">{s.name || "—"}</td>
                  <td className="p-3">{s.industry || "—"}</td>
                  <td className="p-3">{s.funding_ask ? `$${s.funding_ask}` : "—"}</td>
                  <td className="p-3">{s.risk_score ?? "—"}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetailId(s.id)}
                        className="text-xs rounded-lg px-3 py-1 border border-white/15 text-white/80 hover:bg-white/10"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggle(s)}
                        className={`text-xs rounded-lg px-3 py-1 border ${
                          savedIds.has(s.id)
                            ? "border-amber-400 text-amber-300 bg-amber-400/10"
                            : "border-white/15 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {savedIds.has(s.id) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
      {detailId && <CompanyProfileModal id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}

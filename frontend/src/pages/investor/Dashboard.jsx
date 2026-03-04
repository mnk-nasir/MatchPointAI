import React, { useEffect, useState } from "react";
import StatCard from "../../components/investor/StatCard";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { investorService } from "../../services/investor";
import { watchlist } from "../../services/watchlist";
import { userService } from "../../services/user";
import CompanyProfileModal from "../../components/investor/CompanyProfileModal";

export default function InvestorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [userId, setUserId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        try {
          const u = await userService.me();
          setUserId(u?.id || null);
        } catch {
          setUserId(null);
        }
        const [s, r] = await Promise.all([investorService.getDashboardStats(), investorService.getRecentStartups(5)]);
        setStats(s || {});
        setRecent(r || []);
      } catch (e) {
        setError(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    run();
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Startups" value="…" />
          <StatCard title="AI Matched Startups" value="…" />
          <StatCard title="Saved Startups" value="…" />
          <StatCard title="Meeting Requests" value="…" />
        </div>
        <GlassCard className="p-6">
          <div className="text-white/60 text-sm">Loading dashboard…</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Startups" value={stats?.total_startups ?? "—"} />
        <StatCard title="AI Matched Startups" value={stats?.ai_matched ?? "—"} />
        <StatCard title="Saved Startups" value={stats?.saved ?? "—"} />
        <StatCard title="Meeting Requests" value={stats?.meetings ?? "—"} />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      {/* Recent Startups */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Recent Startups</h3>
          <GlowButton as="a" href="/investor/deals" variant="secondary" className="text-xs px-3 py-2">View All</GlowButton>
        </div>
        <div className="rounded-xl border border-white/10 overflow-hidden">
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
              {recent.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-white/60">No startups found.</td>
                </tr>
              ) : (
                recent.map((s, i) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Simple Charts (fallback without external libs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="text-sm font-semibold text-white/80 mb-3">Sector Distribution</div>
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white/60">
                {stats?.sectors?.reduce((a, b) => a + b.count, 0) ?? 0} total
              </div>
            </div>
            <div className="text-xs text-white/70 space-y-1">
              {(stats?.sectors || []).slice(0, 6).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-sm bg-white/60"></span>
                  <span>{s.name}</span>
                  <span className="text-white/50">({s.count})</span>
                </div>
              ))}
              {!stats?.sectors && <div className="text-white/60">No data</div>}
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-sm font-semibold text-white/80 mb-3">Risk Distribution</div>
          <div className="space-y-2">
            {(stats?.risk_buckets || []).slice(0, 6).map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                  <span>{r.label}</span>
                  <span>{r.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${Math.min(100, r.percent || 0)}%` }} />
                </div>
              </div>
            ))}
            {!stats?.risk_buckets && <div className="text-white/60 text-sm">No data</div>}
          </div>
        </GlassCard>
      </div>
      {detailId && <CompanyProfileModal id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import EmptyState from "../../components/ui/EmptyState";
import { GlassCard } from "../../components/ui/GlassCard";
import { watchlist } from "../../services/watchlist";
import { userService } from "../../services/user";

export default function WatchlistPage() {
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    userService
      .me()
      .then((u) => {
        if (!active) return;
        const uid = u?.id || null;
        setUserId(uid);
        setItems(watchlist.load(uid));
      })
      .catch(() => {
        setUserId(null);
        setItems(watchlist.load(null));
      });
    return () => {
      active = false;
    };
  }, []);

  const remove = (id) => {
    watchlist.remove(userId, id);
    setItems(watchlist.load(userId));
  };
  const clear = () => {
    watchlist.clear(userId);
    setItems([]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Watchlist</h2>
      {items.length === 0 ? (
        <EmptyState title="Watchlist" message="You haven't saved any startups yet." />
      ) : (
        <>
          <div className="flex justify-end">
            <button onClick={clear} className="text-xs underline text-white/60 hover:text-white">Clear all</button>
          </div>
          <GlassCard className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-white/70">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Industry</th>
                  <th className="text-left p-3">Funding Ask</th>
                  <th className="text-left p-3">Risk Score</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s, i) => (
                  <tr key={s.id || i} className="border-t border-white/10">
                    <td className="p-3">{s.name || "—"}</td>
                    <td className="p-3">{s.industry || "—"}</td>
                    <td className="p-3">{s.funding_ask ? `$${s.funding_ask}` : "—"}</td>
                    <td className="p-3">{s.risk_score ?? "—"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => remove(s.id)}
                        className="text-xs rounded-lg px-3 py-1 border border-white/15 text-white/80 hover:bg-white/10"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </>
      )}
    </div>
  );
}

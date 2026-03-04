import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { evaluationService } from "../../services/evaluation";
import CompanyProfileModal from "../../components/investor/CompanyProfileModal";

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    evaluationService
      .getEvaluation(id)
      .then((res) => {
        if (!active) return;
        setData(res);
        // Removed selected startup context storage
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message || "Failed to load company");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Company</h2>
        <Link to="/investor/deals" className="text-sm text-white/70 underline">Back</Link>
      </div>
      {error && <div className="text-sm text-red-300">{error}</div>}
      {loading && <div className="text-sm text-white/70">Loading…</div>}
      {!loading && data && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">{data.company_name || "—"}</div>
              <div className="text-sm text-white/70">Stage: {data.stage || "—"}</div>
              <div className="text-sm text-white/70">Country: {data.country || "—"}</div>
              <div className="text-sm text-white/70">Score: {typeof data.total_score === "number" ? data.total_score : "—"}</div>
              <div className="text-sm text-white/70">Rating: {data.formatted_rating || data.rating || "—"}</div>
            </div>
            <button
              className="text-xs rounded-full px-3 py-1.5 border border-white/15 text-white/80 hover:bg-white/10 bg-white/[0.03]"
              onClick={() => setOpen(true)}
            >
              Open Profile
            </button>
          </div>
          <div className="mt-4 text-sm text-white/70">
            <div>Funding Raised: {typeof data.funding_raised === "number" ? `$${data.funding_raised}` : "—"}</div>
          </div>
        </div>
      )}
      <CompanyProfileModal open={open} onClose={() => setOpen(false)} data={data} />
    </div>
  );
}

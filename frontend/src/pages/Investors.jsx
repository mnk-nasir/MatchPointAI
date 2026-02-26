import React from "react";
import { LineChart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Investors() {
  return (
    <section className="min-h-screen text-white" style={{ backgroundColor: "#050a12" }}>
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] bg-white/5"
             style={{ borderColor: "rgba(255,255,255,0.12)", fontFamily: "'Space Mono', monospace" }}>
          Investors / Funds
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Dealflow Intelligence for Faster Decisions
        </h1>
        <p className="mt-3 text-white/70" style={{ fontFamily: "'Space Mono', monospace" }}>
          Rank prospects, assess risk, and manage pipelines in one place.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Deal risk index","Smart pipeline filters","Team credibility graph"].map((f, i) => (
            <div key={i} className="rounded-2xl border bg-white/[0.04] p-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <LineChart className="text-violet-400" />
                <span className="text-sm font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>{f}</span>
              </div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/funding"
            className="rounded-full px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(167,139,250,0.25)] transition-all"
            style={{
              fontFamily: "'Space Mono', monospace",
              backgroundImage: "linear-gradient(90deg,#a78bfa,#00aaff)",
              color: "#050a12",
              border: "1px solid rgba(255,255,255,0.12)"
            }}
          >
            Investment Evaluation → Go
          </Link>
        </div>
      </div>
    </section>
  );
}

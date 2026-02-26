import React from "react";
import { Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function Accelerators() {
  return (
    <section className="min-h-screen text-white" style={{ backgroundColor: "#050a12" }}>
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] bg-white/5"
             style={{ borderColor: "rgba(255,255,255,0.12)", fontFamily: "'Space Mono', monospace" }}>
          Accelerators
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Cohort Intelligence and Pipeline Management
        </h1>
        <p className="mt-3 text-white/70" style={{ fontFamily: "'Space Mono', monospace" }}>
          Benchmark, filter, and track startups with data‑driven workflows.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Cohort benchmarking","Signal-based shortlisting","Portfolio dashboards"].map((f, i) => (
            <div key={i} className="rounded-2xl border bg-white/[0.04] p-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <Layers className="text-sky-400" />
                <span className="text-sm font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>{f}</span>
              </div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/funding"
            className="rounded-full px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,170,255,0.2)] transition-all"
            style={{
              fontFamily: "'Space Mono', monospace",
              backgroundImage: "linear-gradient(90deg,#00aaff,#00e6b4)",
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

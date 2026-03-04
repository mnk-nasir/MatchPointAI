import React from "react";

export default function ChatMessage({ sender, message }) {
  const mine = sender === "user";
  const raw = String(message || "");
  const lines = raw.split("\n");

  // Very light table detector for "Rank | Company | Score | ..." style
  // Looks for a header line with pipes and a following rule like -|-|-
  let table = null;
  for (let i = 0; i < lines.length - 1; i++) {
    const h = lines[i].trim();
    const r = lines[i + 1].trim();
    if (h.includes("|") && /^\-+\|(\-+\|)*\-+$/.test(r)) {
      const headerCells = h.split("|").map((c) => c.trim()).filter(Boolean);
      const rows = [];
      for (let j = i + 2; j < lines.length; j++) {
        const ln = lines[j];
        if (!ln.trim()) break;
        if (!ln.includes("|")) break;
        const cells = ln.split("|").map((c) => c.trim());
        if (cells.length >= headerCells.length) {
          rows.push(cells.slice(0, headerCells.length));
        }
      }
      if (headerCells.length && rows.length) {
        table = { start: i, end: i + 2 + rows.length, header: headerCells, rows };
      }
      break;
    }
  }

  // Split content into before/after around the detected table for rendering
  const partsBefore = [];
  const partsAfter = [];
  if (table) {
    partsBefore.push(lines.slice(0, table.start).join("\n").trim());
    partsAfter.push(lines.slice(table.end).join("\n").trim());
  }

  const linkify = (txt) =>
    String(txt || "").split(/(https?:\/\/[^\s]+)/g).map((p, i) =>
      /^https?:\/\//.test(p) ? (
        <a key={i} href={p} target="_blank" rel="noreferrer" className="underline decoration-white/30 hover:decoration-white">
          {p}
        </a>
      ) : (
        <span key={i}>{p}</span>
      )
    );

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] px-4 py-3 text-sm rounded-2xl shadow-md ${mine ? "bg-white/[0.08] border border-white/15" : "bg-gradient-to-br from-[#1a1f2e] to-[#101522] border border-white/10"} ring-1 ring-black/20`}>
        <div className={`text-[11px] uppercase tracking-wide mb-1 ${mine ? "text-white/50" : "text-white/60"}`}>{mine ? "You" : "DealScope AI"}</div>
        {!table ? (
          <div className="text-white/90 leading-relaxed space-y-2">
            {(() => {
              const out = [];
              let list = [];
              const flushList = () => {
                if (list.length) {
                  out.push(
                    <ul key={`ul-${out.length}`} className="list-disc pl-5 space-y-1">
                      {list.map((li, i) => (
                        <li key={i} className="whitespace-pre-wrap">{linkify(li)}</li>
                      ))}
                    </ul>
                  );
                  list = [];
                }
              };
              for (const line of lines) {
                const ln = line.trimEnd();
                if (!ln) {
                  flushList();
                  continue;
                }
                if (/^\s*-\s+/.test(ln)) {
                  list.push(ln.replace(/^\s*-\s+/, ""));
                  continue;
                }
                flushList();
                if (ln.endsWith(":") && ln.length < 80) {
                  out.push(
                    <div key={`h-${out.length}`} className="text-sm font-semibold text-white/90 whitespace-pre-wrap">
                      {linkify(ln)}
                    </div>
                  );
                } else {
                  out.push(
                    <div key={`p-${out.length}`} className="whitespace-pre-wrap">
                      {linkify(ln)}
                    </div>
                  );
                }
              }
              flushList();
              return out;
            })()}
          </div>
        ) : (
          <div className="text-white/90 leading-relaxed space-y-3">
            {partsBefore[0] && <div className="whitespace-pre-wrap">{linkify(partsBefore[0])}</div>}
            <div className="overflow-x-auto">
              <table className="table-fixed border-collapse text-xs text-white/90">
                <thead>
                  <tr>
                    {table.header.map((h, i) => (
                      <th key={i} className="px-3 py-2 border border-white/10 bg-white/[0.03] text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, ri) => (
                    <tr key={ri} className="odd:bg-white/[0.01]">
                      {row.map((c, ci) => (
                        <td key={ci} className="px-3 py-2 border border-white/10 align-top">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {partsAfter[0] && <div className="whitespace-pre-wrap">{linkify(partsAfter[0])}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

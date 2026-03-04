import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { chatService } from "../../../services/chatService";

const QUICK = [
  { label: "Explain Risk", prompt: "Explain key risk factors for top startups shown." },
  { label: "Summarize Financials", prompt: "Summarize financial metrics for visible startups." },
  { label: "Compare Startups", prompt: "Compare startups by score, stage, and MRR." },
  { label: "Show Red Flags", prompt: "List potential red flags based on platform data." },
];

export default function ChatContainer({ title = "DealScope AI" }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [expanded, setExpanded] = useState(false);
  const scroller = useRef(null);
  const [selectedStartupName] = useState("");
  const lastChunkRef = useRef("");
  const seenChunksRef = useRef(new Set());

  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight);
  }, [messages, loading]);

  // Removed selected startup context; chat now works without it

  const send = async (text) => {
    setError("");
    setLoading(true);
    setStatus("connecting");
    setMessages((m) => [...m, { sender: "user", message: text }, { sender: "assistant", message: "" }]);
    let metaSet = false;
    let lastSeq = -1;
    try {
      for await (const evt of chatService.stream({ message: text, session_id: sessionId })) {
        if (evt.event === "meta" && !metaSet) {
          const d = JSON.parse(evt.data || "{}");
          if (d.session_id) setSessionId(d.session_id);
          metaSet = true;
          setStatus("streaming");
        } else if (evt.event === "token") {
          if (typeof evt.id === "number" && evt.id <= lastSeq) {
            continue; // drop duplicate or out-of-order chunk
          }
          if (typeof evt.id === "number") lastSeq = evt.id;
          setMessages((m) => {
            const copy = m.slice();
            const last = copy[copy.length - 1];
            const chunk = evt.data || "";
            if (chunk) {
              const key = chunk.trim();
              if (chunk === lastChunkRef.current || seenChunksRef.current.has(key)) {
                return copy; // drop exact duplicate chunk
              }
              const isStructuredLine =
                chunk.includes("|") ||
                /^\s*-\s/.test(chunk) ||
                /^-+\|(-+\|)*-+$/.test(chunk.trim()) ||
                /^Metric\s*\|/i.test(chunk) ||
                /^Top companies by score/i.test(chunk) ||
                /^Company (Table|List|Profile|Profile:|List:|Table:)/i.test(chunk);
              const sep = isStructuredLine && last.message && !last.message.endsWith("\n") ? "\n" : "";
              last.message += sep + chunk;
              lastChunkRef.current = chunk;
              seenChunksRef.current.add(key);
            }
            return copy;
          });
        } else if (evt.event === "done") {
          setStatus("idle");
          lastChunkRef.current = "";
          seenChunksRef.current = new Set();
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to send");
      setMessages((m) => m.slice(0, -1)); // remove assistant placeholder
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const box = (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#121826]/70 to-[#0b0f17]/60 backdrop-blur-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
      <ChatHeader title={title} onToggleSize={() => setExpanded((v) => !v)} expanded={expanded} analyzingName={selectedStartupName} />
      {error && <div className="px-3 py-2 text-sm text-red-200 border-b border-white/10">{error}</div>}
      {/* filters removed */}
      <div ref={scroller} className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.length === 0 && !loading && (
          <div className="text-sm text-white/70">Ask DealScope AI about risk, valuation, traction, or compare startups.</div>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} sender={m.sender} message={m.message} />
        ))}
        {loading && <div className="text-xs text-white/50 animate-pulse">Thinking…</div>}
      </div>
      <div className="px-3 py-2 flex flex-wrap gap-2 border-t border-white/10 bg-white/[0.02]">
        {QUICK.map((q) => (
          <button key={q.label} onClick={() => send(q.prompt)} className="text-[11px] rounded-full px-3 py-1.5 border border-white/15 text-white/80 hover:bg-white/10 bg-white/[0.03]">
            {q.label}
          </button>
        ))}
      </div>
      <ChatInput onSend={send} loading={loading} />
    </div>
  );

  if (expanded) {
    return createPortal(
      <div className="fixed inset-0 z-50 bg-black/60">
        <div className="w-full h-full">{box}</div>
      </div>,
      document.body
    );
  }
  return box;
}

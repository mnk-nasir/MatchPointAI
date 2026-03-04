import React from "react";
import ChatContainer from "../../components/investor/chat/ChatContainer";

export default function ChatbotPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">DealScope AI</h2>
        <div className="text-white/60 text-sm">
          Ask investment questions grounded in platform data. This assistant answers only startup and investment topics.
        </div>
      </div>
      <div className="lg:col-span-1 h-[70vh]">
        <ChatContainer title="DealScope AI" />
      </div>
    </div>
  );
}


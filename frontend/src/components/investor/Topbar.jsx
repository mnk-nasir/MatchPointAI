import React from "react";
import { GlowButton } from "../ui/GlowButton";
import { authService } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const logout = () => {
    authService.logout();
    navigate("/investors/login");
  };
  return (
    <header className="h-14 border-b border-white/10 bg-white/[0.03] flex items-center justify-between px-4">
      <div className="text-sm font-semibold text-white/80">Match Point — Investor</div>
      <div>
        <GlowButton variant="secondary" onClick={logout} className="text-xs px-4 py-2">Logout</GlowButton>
      </div>
    </header>
  );
}


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { GlassCard } from "../ui/GlassCard";
import { GlowButton } from "../ui/GlowButton";
import { Trophy, CheckCircle, AlertTriangle, Share2, Download, RefreshCw, XCircle } from "lucide-react";
import { useWindowSize } from "react-use";

interface FundingResultProps {
  totalScore: number;
  data: any;
  onRestart?: () => void;
}

const CircularProgress = ({ score }: { score: number }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 200) * circumference; // Max score assumed ~200 for full circle, adjusted below

  // Color logic based on classification
  const getColor = (s: number) => {
    if (s >= 180) return "#10b981"; // Emerald
    if (s >= 120) return "#3b82f6"; // Blue
    if (s >= 60) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] transform"
      >
        <circle
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={getColor(score)}
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp end={score} />
        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
};

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <span className="text-3xl font-bold text-white">{count}</span>;
};

const FundingResult: React.FC<FundingResultProps> = ({ totalScore, data, onRestart }) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (totalScore >= 180) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  }, [totalScore]);

  const getClassification = (score: number) => {
    if (score >= 180) return {
      label: "High Potential",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      desc: "Exceptional application with strong market fit and metrics."
    };
    if (score >= 120) return {
      label: "Strong",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      desc: "Solid business case with good traction potential."
    };
    if (score >= 60) return {
      label: "Moderate",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      desc: "Promising but requires more validation or stronger metrics."
    };
    return {
      label: "High Risk",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      desc: "Significant gaps in model or traction. Review key areas."
    };
  };

  const classification = getClassification(totalScore);

  const getStrengths = () => {
    const strengths = [];
    if (Number(data.monthlyRevenue) > 0) strengths.push("Revenue Generating");
    if (Number(data.domainExperience) > 5) strengths.push("Experienced Founder");
    if (Number(data.investorReturn) > 5) strengths.push("Strong ROI Potential");
    if (data.productStage === "growth" || Number(data.activeUsers) > 1000) strengths.push("Market Traction");
    return strengths.length > 0 ? strengths : ["Reviewing Data..."];
  };

  const getWeaknesses = () => {
    const weaknesses = [];
    if (!data.hasSignedContracts && !data.hasLOIs) weaknesses.push("Lack of Contracts/LOIs");
    if (Number(data.monthlyRevenue) === 0) weaknesses.push("Pre-revenue Stage");
    if (!data.isFullTime) weaknesses.push("Part-time Founder");
    if (!data.competitors) weaknesses.push("Unclear Competitive Landscape");
    return weaknesses.length > 0 ? weaknesses : ["No major red flags detected"];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <GlassCard className="max-w-3xl w-full p-8 md:p-10 space-y-8 relative z-10" gradient>
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Assessment Complete</h1>
          <p className="text-white/60">
            Analysis for <span className="text-white font-medium">{data.companyName}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Score & Class */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <CircularProgress score={totalScore} />

            <div className={`px-4 py-2 rounded-full border ${classification.bg} ${classification.border} ${classification.color} font-bold text-lg flex items-center gap-2`}>
              {totalScore >= 120 ? <Trophy className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              {classification.label}
            </div>

            <p className="text-center text-sm text-white/60 max-w-xs">
              {classification.desc}
            </p>
          </div>

          {/* Right Column: Insights */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {getStrengths().map((s, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" /> Areas to Improve
              </h3>
              <div className="flex flex-wrap gap-2">
                {getWeaknesses().map((w, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-red-300">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center">
          <GlowButton onClick={() => alert("Downloading Report...")} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </GlowButton>

          <GlowButton variant="secondary" onClick={() => alert("Share Link Copied!")} className="w-full sm:w-auto">
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </GlowButton>

          {onRestart && (
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-colors w-full sm:w-auto px-4 py-2"
            >
              <RefreshCw className="w-4 h-4" />
              Restart Application
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default FundingResult;

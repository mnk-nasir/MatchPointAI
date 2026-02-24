import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { ChevronRight, ChevronLeft, Trophy } from "lucide-react";
import StepIdentity from "../../components/form/StepIdentity";
import StepProblemSolution from "../../components/form/StepProblemSolution";
import StepMarket from "../../components/form/StepMarket";
import StepTraction from "../../components/form/StepTraction";
import StepFinancials from "../../components/form/StepFinancials";
import StepTeam from "../../components/form/StepTeam";
import StepExit from "../../components/form/StepExit";
import FundingResult from "../../components/form/FundingResult";

// Steps configuration
const STEPS = [
  { id: 1, title: "Company Identity", description: "Structure & Details" },
  { id: 2, title: "Problem & Solution", description: "Core Value Proposition" },
  { id: 3, title: "Market", description: "Market analysis" },
  { id: 4, title: "Traction", description: "Metrics & Validation" },
  { id: 5, title: "Team Overview", description: "Core Members" },
  { id: 6, title: "Financials", description: "Financial projections" },
  { id: 7, title: "Founder & Vision", description: "Leadership Details" },
  { id: 8, title: "Exit & ROI", description: "Strategy & Returns" },
];

export default function FundingApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>({
    companyName: "",
    legalStructure: "",
    incorporationYear: "",
    country: "",
    capTableSummary: "",
    stage: "",
    previousFunding: "",
    // Step 2
    coreProblem: "",
    solution: "",
    whyNow: "",
    uniqueAdvantage: "",
    // Step 3
    tam: "",
    sam: "",
    som: "",
    targetCustomer: "",
    competitors: "",
    marketGrowth: "",
    competitiveAdvantageScore: 5,
    // Step 4
    monthlyRevenue: "",
    revenueGrowth: "",
    activeUsers: "",
    payingCustomers: "",
    retentionRate: "",
    hasSignedContracts: false,
    hasLOIs: false,
    hasPartnerships: false,
  });

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  // Calculate score dynamically
  useEffect(() => {
    let score = 0;
    const currentYear = new Date().getFullYear();

    // Step 1 Scoring Logic
    if (
      formData.incorporationYear &&
      currentYear - Number(formData.incorporationYear) > 2
    ) {
      score += 5;
    }
    if (Number(formData.previousFunding) > 0) {
      score += 10;
    }
    // "Beyond Seed" means Series A, B, C+, IPO
    if (
      ["series-a", "series-b", "series-c", "public"].includes(formData.stage)
    ) {
      score += 10;
    }

    // Step 2 Scoring Logic
    if (
      formData.coreProblem &&
      formData.solution &&
      formData.whyNow &&
      formData.uniqueAdvantage
    ) {
      score += 15;
    }
    if (formData.uniqueAdvantage && formData.uniqueAdvantage.length > 50) {
      score += 10;
    }

    // Step 3 Scoring Logic
    if (Number(formData.tam) > 100000000) {
      score += 10;
    }
    if (Number(formData.marketGrowth) > 10) {
      score += 10;
    }
    if (Number(formData.competitiveAdvantageScore) > 7) {
      score += 10;
    }

    // Step 4 Scoring Logic
    if (Number(formData.monthlyRevenue) > 0) {
      score += 15;
    }
    if (Number(formData.revenueGrowth) > 10) {
      score += 10;
    }
    if (Number(formData.retentionRate) > 60) {
      score += 10;
    }
    if (formData.hasSignedContracts) score += 5;
    if (formData.hasLOIs) score += 5;
    if (formData.hasPartnerships) score += 5;

    // Step 7 Scoring Logic
    if (Number(formData.domainExperience) > 5) score += 10;
    if (formData.prevStartupExp) score += 10;
    if (formData.isFullTime) score += 10;

    setTotalScore(score);
  }, [formData]);

  const handleNext = () => {
    // Basic validation for Step 1
    if (currentStep === 1) {
      if (!formData.companyName) return alert("Please enter Company Name");
      if (!formData.legalStructure) return alert("Please select Legal Structure");
      if (!formData.incorporationYear) return alert("Please enter Incorporation Year");
      if (!formData.country) return alert("Please enter Country");
      if (!formData.stage) return alert("Please select Stage");
    }

    // Validation for Step 2
    if (currentStep === 2) {
      if (!formData.coreProblem) return alert("Please describe the Core Problem");
      if (!formData.solution) return alert("Please describe Your Solution");
      if (!formData.whyNow) return alert("Please explain Why Now");
      if (!formData.uniqueAdvantage) return alert("Please explain your Unique Advantage");
    }

    // Validation for Step 3
    if (currentStep === 3) {
      if (!formData.tam) return alert("Please enter TAM");
      if (!formData.sam) return alert("Please enter SAM");
      if (!formData.som) return alert("Please enter SOM");
      if (!formData.targetCustomer) return alert("Please enter Target Customer");
      if (!formData.competitors) return alert("Please list Competitors");
    }

    // Validation for Step 4
    if (currentStep === 4) {
      if (formData.monthlyRevenue === "") return alert("Please enter Monthly Revenue");
      if (formData.revenueGrowth === "") return alert("Please enter Revenue Growth");
      if (formData.activeUsers === "") return alert("Please enter Active Users");
      if (formData.payingCustomers === "") return alert("Please enter Paying Customers");
      if (formData.retentionRate === "") return alert("Please enter Retention Rate");
    }

    // Validation for Step 6
    if (currentStep === 6) {
      if (!formData.amountRaising) return alert("Please enter Amount Raising");
      if (!formData.preMoneyValuation) return alert("Please enter Pre-money Valuation");
      if (!formData.equityOffered) return alert("Please enter Equity Offered");
      if (!formData.fundUse) return alert("Please enter Use of Funds");
    }

    // Validation for Step 7
    if (currentStep === 7) {
      if (!formData.founderBackground) return alert("Please describe your Founder Background");
      if (!formData.domainExperience) return alert("Please enter Domain Experience");
    }

    // Validation for Step 8
    if (currentStep === 8) {
      if (!formData.exitStrategy) return alert("Please select an Exit Strategy");
      if (!formData.investorReturn) return alert("Please enter Investor Return Projection");
    }

    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const handleRestart = () => {
    setCurrentStep(1);
    setTotalScore(0);
    setIsSubmitted(false);
    setFormData({
      companyName: "",
      legalStructure: "",
      incorporationYear: "",
      country: "",
      capTableSummary: "",
      stage: "",
      previousFunding: "",
      coreProblem: "",
      solution: "",
      whyNow: "",
      uniqueAdvantage: "",
      tam: "",
      sam: "",
      som: "",
      targetCustomer: "",
      competitors: "",
      marketGrowth: "",
      competitiveAdvantageScore: 5,
      monthlyRevenue: "",
      revenueGrowth: "",
      activeUsers: "",
      payingCustomers: "",
      retentionRate: "",
      hasSignedContracts: false,
      hasLOIs: false,
      hasPartnerships: false,
      isFullTime: false,
      keyHires: "",
      advisoryBoard: "",
      exitStrategy: "",
      investorReturn: "",
      amountRaising: "",
      preMoneyValuation: "",
      equityOffered: "",
      fundUse: "",
      nextRound: "",
      exitValuation: "",
      exitTimeline: "",
      founderBackground: "",
      domainExperience: "",
      prevStartupExp: false,
    });
  };

  if (isSubmitted) {
    return <FundingResult totalScore={totalScore} data={formData} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-web3-bg text-white font-sans selection:bg-web3-primary/30 pb-24 sm:pb-0">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-web3-gradient pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Header & Progress */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Funding Application
              </h1>
              <p className="text-white/60 mt-1">
                Step {currentStep} of {STEPS.length}:{" "}
                <span className="text-web3-primary font-medium">
                  {STEPS[currentStep - 1].title}
                </span>
              </p>
            </div>

            {/* Score Display (Optional but cool) */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-web3-primary/30 bg-web3-primary/10 px-4 py-2 text-sm font-medium text-web3-primary">
              <Trophy className="h-4 w-4" />
              <span>Score: {totalScore}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-web3-primary to-web3-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Main Card */}
        <GlassCard className="min-h-[500px] p-6 sm:p-10" gradient>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">{STEPS[currentStep - 1].title}</h2>
            <p className="text-white/60">{STEPS[currentStep - 1].description}</p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentStep === 1 && (
                <StepIdentity data={formData} updateData={updateFormData} />
              )}

              {currentStep === 2 && (
                <StepProblemSolution data={formData} updateData={updateFormData} />
              )}

              {currentStep === 3 && (
                <StepMarket data={formData} updateData={updateFormData} />
              )}

              {currentStep === 4 && (
                <StepTraction data={formData} updateData={updateFormData} />
              )}

              {currentStep === 5 && (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5">
                  <p className="text-white/40">Step 5 (Team) content coming soon...</p>
                </div>
              )}

              {currentStep === 6 && (
                <StepFinancials data={formData} updateData={updateFormData} />
              )}

              {currentStep === 7 && (
                <StepTeam data={formData} updateData={updateFormData} />
              )}

              {currentStep === 8 && (
                <StepExit data={formData} updateData={updateFormData} />
              )}
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        {/* Desktop Navigation */}
        <div className="mt-8 hidden sm:flex items-center justify-between">
          <GlowButton
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </GlowButton>

          <GlowButton onClick={handleNext}>
            {currentStep === STEPS.length ? "Submit Application" : "Next Step"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </GlowButton>
        </div>
      </div>

      {/* Mobile Sticky Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#02030a]/80 backdrop-blur-xl p-4 sm:hidden z-50">
        <div className="flex items-center justify-between gap-4">
          <GlowButton
            variant="secondary"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex-1"
          >
            Back
          </GlowButton>
          <div className="flex items-center gap-2 text-xs font-medium text-web3-primary bg-web3-primary/10 px-3 py-1 rounded-full">
            <Trophy className="h-3 w-3" />
            {totalScore}
          </div>
          <GlowButton size="sm" onClick={handleNext} className="flex-1">
            {currentStep === STEPS.length ? "Submit" : "Next"}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}

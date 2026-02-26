import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { ChevronRight, ChevronLeft, Trophy, Loader2, AlertCircle } from "lucide-react";
import StepIdentity from "../../components/form/StepIdentity";
import StepProblemSolution from "../../components/form/StepProblemSolution";
import StepMarket from "../../components/form/StepMarket";
import StepTraction from "../../components/form/StepTraction";
import StepFinancials from "../../components/form/StepFinancials";
import StepTeam from "../../components/form/StepTeam";
import StepExit from "../../components/form/StepExit";
import FundingResult from "../../components/form/FundingResult";
import { evaluationService } from "../../services/evaluation";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendResult, setBackendResult] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    // Step 1: Identity
    companyName: "",
    legalStructure: "",
    incorporationYear: "",
    country: "",
    capTableSummary: "",
    stage: "",
    previousFunding: "", // Maps to funding_raised in backend

    // Step 2: Problem & Solution
    coreProblem: "",
    solution: "",
    whyNow: "",
    uniqueAdvantage: "",

    // Step 3: Market
    tam: "", // Maps to tam_size
    sam: "",
    som: "",
    targetCustomer: "",
    competitors: "", // Maps to competition_level or generic field
    marketGrowth: "",
    competitiveAdvantageScore: 5,

    // Step 4: Traction
    monthlyRevenue: "", // Maps to mrr
    revenueGrowth: "",
    activeUsers: "", // Maps to active_users
    payingCustomers: "",
    retentionRate: "",
    hasSignedContracts: false,
    hasLOIs: false,
    hasPartnerships: false,

    // Step 5 & 7: Team
    foundersCount: 1, // Maps to founders_count
    hasTechnicalFounder: false, // Maps to has_technical_founder
    teamSize: 1, // Maps to team_size

    // Step 6: Financials
    burnRate: "", // Maps to burn_rate

    // Step 8: Exit
    exitStrategy: "", // Maps to exit_strategy
  });

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        step1: {
          companyName: formData.companyName,
          legalStructure: formData.legalStructure,
          incorporationYear: formData.incorporationYear,
          country: formData.country,
          stage: formData.stage,
          previousFunding: formData.previousFunding,
          capTableSummary: formData.capTableSummary,
        },
        step2: {
          coreProblem: formData.coreProblem,
          solution: formData.solution,
          whyNow: formData.whyNow,
          uniqueAdvantage: formData.uniqueAdvantage,
        },
        step3: {
          tam: formData.tam,
          sam: formData.sam,
          som: formData.som,
          targetCustomer: formData.targetCustomer,
          competitors: formData.competitors,
          marketGrowth: formData.marketGrowth,
          competitiveAdvantageScore: formData.competitiveAdvantageScore,
        },
        step4: {
          monthlyRevenue: formData.monthlyRevenue,
          revenueGrowth: formData.revenueGrowth,
          activeUsers: formData.activeUsers,
          payingCustomers: formData.payingCustomers,
          retentionRate: formData.retentionRate,
          hasSignedContracts: formData.hasSignedContracts,
          hasLOIs: formData.hasLOIs,
          hasPartnerships: formData.hasPartnerships,
        },
        step5: {
          foundersCount: formData.foundersCount,
          hasTechnicalFounder: formData.hasTechnicalFounder,
          teamSize: formData.teamSize,
          isFullTime: formData.isFullTime,
          keyHires: formData.keyHires,
          advisoryBoard: formData.advisoryBoard,
          founderBackground: formData.founderBackground,
          domainExperience: formData.domainExperience,
          prevStartupExp: formData.prevStartupExp,
        },
        step6: {
          amountRaising: formData.amountRaising,
          preMoneyValuation: formData.preMoneyValuation,
          equityOffered: formData.equityOffered,
          fundUse: formData.fundUse,
          burnRate: formData.burnRate,
          nextRound: formData.nextRound,
        },
        step7: {
          founderBackground: formData.founderBackground,
          isFullTime: formData.isFullTime,
          vision: formData.vision,
        },
        step8: {
          exitStrategy: formData.exitStrategy,
          investorReturn: formData.investorReturn,
          exitValuation: formData.exitValuation,
          exitTimeline: formData.exitTimeline,
        },
      } as const;

      const result = await evaluationService.submitFullEvaluation(payload as any);
      setBackendResult(result);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step - submit
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };



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

  if (isSubmitted && backendResult) {
    return (
      <FundingResult
        totalScore={backendResult.total_score}
        rating={backendResult.rating}
        strengths={backendResult.strengths}
        weaknesses={backendResult.weaknesses}
        data={formData}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-mp-bg text-white font-sans selection:bg-mp-primary/30 pb-24 sm:pb-0 pt-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-mp-gradient pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Header & Progress */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-mp-primary">
                Funding Application
              </h1>
              <p className="text-white/60 mt-1">
                Step {currentStep} of {STEPS.length}:{" "}
                <span className="text-mp-primary font-medium">
                  {STEPS[currentStep - 1].title}
                </span>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-mp-primary to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Main Card */}
        <GlassCard className="min-h-[500px] p-6 sm:p-10 border-mp-primary/20" gradient>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-white">{STEPS[currentStep - 1].title}</h2>
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
                <StepTeam data={formData} updateData={updateFormData} />
              )}

              {currentStep === 6 && (
                <StepFinancials data={formData} updateData={updateFormData} />
              )}

              {currentStep === 7 && (
                <StepTeam data={formData} updateData={updateFormData} isFounderVision={true} />
              )}

              {currentStep === 8 && (
                <StepExit data={formData} updateData={updateFormData} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${currentStep === 1
                ? "opacity-0 pointer-events-none"
                : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <GlowButton
              onClick={nextStep}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === STEPS.length ? (
                "Submit Evaluation"
              ) : (
                <>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </GlowButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Building2, Globe, Calendar, DollarSign } from "lucide-react";

interface IdentityData {
  companyName: string;
  legalStructure: string;
  incorporationYear: number | "";
  country: string;
  capTableSummary: string;
  stage: string;
  previousFunding: number | "";
}

interface StepIdentityProps {
  data: IdentityData;
  updateData: (data: Partial<IdentityData>) => void;
}

const LEGAL_STRUCTURES = [
  { value: "c-corp", label: "C-Corporation" },
  { value: "s-corp", label: "S-Corporation" },
  { value: "llc", label: "LLC" },
  { value: "partnership", label: "Partnership" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "other", label: "Other" },
];

const STAGES = [
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B" },
  { value: "series-c", label: "Series C+" },
  { value: "public", label: "Public (IPO)" },
];

export default function StepIdentity({ data, updateData }: StepIdentityProps) {
  // Animation variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full max-w-3xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Input
            label="Company Name"
            placeholder="e.g. Acme Innovations Inc."
            value={data.companyName || ""}
            onChange={(e) => updateData({ companyName: e.target.value })}
            icon={<Building2 className="h-4 w-4" />}
            autoFocus
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Select
            label="Legal Structure"
            options={LEGAL_STRUCTURES}
            value={data.legalStructure || ""}
            onChange={(e) => updateData({ legalStructure: e.target.value })}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Incorporation Year"
            type="number"
            placeholder="YYYY"
            value={data.incorporationYear || ""}
            onChange={(e) =>
              updateData({ incorporationYear: parseInt(e.target.value) || "" })
            }
            icon={<Calendar className="h-4 w-4" />}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Country / HQ"
            placeholder="e.g. United States"
            value={data.country || ""}
            onChange={(e) => updateData({ country: e.target.value })}
            icon={<Globe className="h-4 w-4" />}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Select
            label="Current Stage"
            options={STAGES}
            value={data.stage || ""}
            onChange={(e) => updateData({ stage: e.target.value })}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
          <Input
            label="Previous Funding Raised (USD)"
            type="number"
            placeholder="0"
            value={data.previousFunding || ""}
            onChange={(e) =>
              updateData({ previousFunding: parseFloat(e.target.value) || 0 })
            }
            icon={<DollarSign className="h-4 w-4" />}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
          <Textarea
            label="Cap Table Summary"
            placeholder="Briefly describe ownership structure (e.g. Founders 60%, Investors 30%, ESOP 10%)"
            rows={4}
            value={data.capTableSummary || ""}
            onChange={(e) => updateData({ capTableSummary: e.target.value })}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

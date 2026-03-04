import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Building2, Globe, Calendar, Mail, Phone, Image as ImageIcon } from "lucide-react";
import { currencySymbol } from "../../utils/currency";
import { GlassCard } from "../ui/GlassCard";

interface IdentityData {
  companyName: string;
  legalStructure: string;
  incorporationYear: number | "";
  country: string;
  currency?: string;
  companyLogoUrl?: string;
  capTableSummary: string;
  stage: string;
  previousFunding: number | "";
  contactEmail?: string;
  contactPhone?: string;
}

interface StepIdentityProps {
  data: IdentityData;
  updateData: (data: Partial<IdentityData>) => void;
  errors?: Record<string, string>;
  onFieldBlur?: (name: keyof IdentityData) => void;
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
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP Launched" },
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "growth", label: "Growth" },
];

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  "united states": "USD",
  usa: "USD",
  "u.s.a": "USD",
  "united states of america": "USD",
  "united kingdom": "GBP",
  uk: "GBP",
  "great britain": "GBP",
  england: "GBP",
  india: "INR",
  canada: "CAD",
  australia: "AUD",
  "new zealand": "NZD",
  singapore: "SGD",
  "united arab emirates": "AED",
  uae: "AED",
  "saudi arabia": "SAR",
  japan: "JPY",
  china: "CNY",
  brazil: "BRL",
  mexico: "MXN",
  "south africa": "ZAR",
  germany: "EUR",
  france: "EUR",
  spain: "EUR",
  italy: "EUR",
  netherlands: "EUR",
  belgium: "EUR",
  ireland: "EUR",
  portugal: "EUR",
  eurozone: "EUR",
};

const DEFAULT_CURRENCY = "USD";

export default function StepIdentity({ data, updateData, errors = {}, onFieldBlur }: StepIdentityProps) {
  const [currencyError, setCurrencyError] = useState<string | undefined>();

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

  const resolveCurrency = (countryValue: string) => {
    const key = countryValue.trim().toLowerCase();
    if (!key) {
      setCurrencyError(undefined);
      updateData({ currency: "" });
      return;
    }
    const code = COUNTRY_TO_CURRENCY[key];
    if (code) {
      setCurrencyError(undefined);
      updateData({ currency: code });
    } else {
      setCurrencyError("Country not recognised, defaulting to USD.");
      updateData({ currency: DEFAULT_CURRENCY });
    }
  };

  const handleCountryInput = (value: string) => {
    updateData({ country: value });
    resolveCurrency(value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full max-w-3xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
            <Building2 className="text-web3-primary" />
            <h3 className="text-lg font-semibold text-white">Company Basics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Company Name"
                placeholder="e.g. Acme Innovations Inc."
                value={data.companyName || ""}
                onChange={(e) => updateData({ companyName: e.target.value })}
                onBlur={() => onFieldBlur && onFieldBlur("companyName")}
                id="field-companyName"
                required
                error={errors["companyName"]}
                icon={<Building2 className="h-4 w-4" />}
                autoFocus
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Company Logo URL (optional)"
                placeholder="https://example.com/logo.png"
                value={data.companyLogoUrl || ""}
                onChange={(e) => updateData({ companyLogoUrl: e.target.value })}
                onBlur={() => onFieldBlur && onFieldBlur("companyLogoUrl" as any)}
                id="field-companyLogoUrl"
                icon={<ImageIcon className="h-4 w-4" />}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
            <Globe className="text-web3-purple" />
            <h3 className="text-lg font-semibold text-white">Registration & Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Legal Structure"
              options={LEGAL_STRUCTURES}
              value={data.legalStructure || ""}
              onChange={(e) => updateData({ legalStructure: e.target.value })}
              onBlur={() => onFieldBlur && onFieldBlur("legalStructure")}
              id="field-legalStructure"
              required
              error={errors["legalStructure"]}
            />
            <Input
              label="Incorporation Year"
              type="number"
              placeholder="YYYY"
              value={data.incorporationYear || ""}
              onChange={(e) =>
                updateData({ incorporationYear: parseInt(e.target.value) || "" })
              }
              onBlur={() => onFieldBlur && onFieldBlur("incorporationYear")}
              id="field-incorporationYear"
              required
              error={errors["incorporationYear"]}
              icon={<Calendar className="h-4 w-4" />}
            />
            <Input
              label="Country / HQ"
              placeholder="e.g. United States"
              value={data.country || ""}
              onChange={(e) => handleCountryInput(e.target.value)}
              onBlur={() => onFieldBlur && onFieldBlur("country")}
              id="field-country"
              required
              error={errors["country"]}
              icon={<Globe className="h-4 w-4" />}
            />
            <Input
              label="Currency"
              placeholder={DEFAULT_CURRENCY}
              value={data.currency || ""}
              readOnly
              icon={<span className="text-white/50">{currencySymbol(data.currency)}</span>}
              error={currencyError}
            />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
            <Mail className="text-web3-primary" />
            <h3 className="text-lg font-semibold text-white">Contacts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              placeholder="you@company.com"
              value={data.contactEmail || ""}
              onChange={(e) => updateData({ contactEmail: e.target.value })}
              onBlur={() => onFieldBlur && onFieldBlur("contactEmail" as any)}
              id="field-contactEmail"
              required
              error={errors["contactEmail" as any]}
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="+1 555 123 4567"
              value={data.contactPhone || ""}
              onChange={(e) => updateData({ contactPhone: e.target.value })}
              onBlur={() => onFieldBlur && onFieldBlur("contactPhone" as any)}
              id="field-contactPhone"
              required
              error={errors["contactPhone" as any]}
              icon={<Phone className="h-4 w-4" />}
            />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
            <Building2 className="text-web3-primary" />
            <h3 className="text-lg font-semibold text-white">Stage & Ownership</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Current Stage"
              options={STAGES}
              value={data.stage || ""}
              onChange={(e) => updateData({ stage: e.target.value })}
              onBlur={() => onFieldBlur && onFieldBlur("stage")}
              id="field-stage"
              required
              error={errors["stage"]}
            />
            <Input
              label={`Previous Funding Raised (${data.currency || DEFAULT_CURRENCY})`}
              type="number"
              placeholder="0"
              value={data.previousFunding || ""}
              onChange={(e) =>
                updateData({ previousFunding: parseFloat(e.target.value) || 0 })
              }
              onBlur={() => onFieldBlur && onFieldBlur("previousFunding")}
              id="field-previousFunding"
              icon={<span className="text-white/50">{currencySymbol(data.currency)}</span>}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Cap Table Summary"
                placeholder="Briefly describe ownership structure (e.g. Founders 60%, Investors 30%, ESOP 10%)"
                rows={4}
                value={data.capTableSummary || ""}
                onChange={(e) => updateData({ capTableSummary: e.target.value })}
                onBlur={() => onFieldBlur && onFieldBlur("capTableSummary" as any)}
                id="field-capTableSummary"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

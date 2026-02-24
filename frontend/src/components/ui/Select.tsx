import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="relative space-y-2">
        {label && (
          <label className="text-sm font-medium text-white/70">{label}</label>
        )}
        <div className="relative">
          <motion.select
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={cn(
              "w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-sm transition-all duration-200 focus:border-web3-primary/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
              error && "border-red-500/50 focus:border-red-500",
              className
            )}
            {...props}
          >
            <option value="" disabled className="bg-[#0f0f0f] text-white/50">
              Select an option
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#0f0f0f] text-white"
              >
                {option.label}
              </option>
            ))}
          </motion.select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

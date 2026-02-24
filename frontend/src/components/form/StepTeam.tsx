import React from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Toggle } from "../ui/Toggle";
import { GlassCard } from "../ui/GlassCard";
import { Users, Briefcase, Award, GraduationCap } from "lucide-react";

interface StepTeamProps {
  data: any;
  updateData: (data: any) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const StepTeam: React.FC<StepTeamProps> = ({ data, updateData }) => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Founder Profile Section */}
      <motion.div variants={item}>
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="text-web3-primary" />
            Founder Profile
          </h3>
          
          <div className="space-y-4">
            <Textarea
              label="Founder Background"
              placeholder="Tell us about your journey, expertise, and what drives you..."
              value={data.founderBackground}
              onChange={(e) => updateData({ founderBackground: e.target.value })}
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Domain Experience (Years)"
                type="number"
                placeholder="e.g. 7"
                value={data.domainExperience}
                onChange={(e) => updateData({ domainExperience: e.target.value })}
                icon={<Briefcase className="w-4 h-4 text-white/50" />}
              />
              
              <div className="flex items-end pb-1">
                 <p className="text-xs text-white/40 italic">
                   Relevant industry experience is a key indicator of success.
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <Toggle
                label="Previous Startup Experience"
                description="Have you founded a startup before?"
                checked={data.prevStartupExp || false}
                onChange={(checked) => updateData({ prevStartupExp: checked })}
              />

              <Toggle
                label="Full-time Founder"
                description="Are you working on this full-time?"
                checked={data.isFullTime || false}
                onChange={(checked) => updateData({ isFullTime: checked })}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Team Expansion Section */}
      <motion.div variants={item}>
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="text-web3-purple" />
            Team Expansion
          </h3>

          <div className="space-y-4">
            <Textarea
              label="Key Hires Needed"
              placeholder="Who do you need to hire next? (e.g. CTO, Sales Lead, Growth Marketer)"
              value={data.keyHires}
              onChange={(e) => updateData({ keyHires: e.target.value })}
              rows={3}
            />

            <Textarea
              label="Advisory Board"
              placeholder="List any advisors, mentors, or industry experts supporting you..."
              value={data.advisoryBoard}
              onChange={(e) => updateData({ advisoryBoard: e.target.value })}
              rows={3}
            />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default StepTeam;

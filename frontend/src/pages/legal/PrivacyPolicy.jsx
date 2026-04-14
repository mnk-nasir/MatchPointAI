import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "April 14, 2026";

  return (
    <div className="min-h-screen bg-[#02030a] pt-32 pb-20 px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider">
            <Shield className="h-3 w-3" />
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
              <p className="text-gray-400 leading-relaxed">
                At MatchPointAI, we collect information that you provide directly to us when you register for an account, subscribe to our newsletter, or fill out investment/startup interest forms. This may include:
              </p>
              <ul className="space-y-4 text-gray-400 list-disc pl-6 leading-relaxed">
                <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and physical mailing address.</li>
                <li><strong>Professional Information:</strong> Company name, job title, and professional background.</li>
                <li><strong>Financial Information:</strong> For investors, ticket size preferences and investment history.</li>
                <li><strong>Platform Usage:</strong> Log data, IP address, browser type, and interaction patterns within the MatchPointAI ecosystem.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">2. How We Use Your Data</h2>
              <p className="text-gray-400 leading-relaxed">
                We process your personal information for the following purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Eye, title: "Service Delivery", desc: "To provide the core matching and analytics services." },
                  { icon: Lock, title: "Security", desc: "To protect our platform and your account from unauthorized access." },
                  { icon: FileText, title: "Compliance", desc: "To meet our legal obligations and regulatory requirements." },
                  { icon: Shield, title: "Personalization", desc: "To tailor investment opportunities to your specific profile." }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <item.icon className="h-5 w-5 text-blue-400 mb-3" />
                    <h4 className="text-white font-medium mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">3. Your GDPR Rights</h2>
              <p className="text-gray-400 leading-relaxed">
                Under GDPR, you have several rights regarding your personal data:
              </p>
              <ul className="space-y-4 text-gray-400 list-disc pl-6 leading-relaxed">
                <li><strong>Right to Access:</strong> You can request a copy of the data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You can ask us to correct inaccurate data.</li>
                <li><strong>Right to Erasure:</strong> You can request that we delete your personal data ("Right to be Forgotten").</li>
                <li><strong>Right to Portability:</strong> You can request your data in a structured, machine-readable format.</li>
              </ul>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="p-6 rounded-2xl bg-[#0a0c14] border border-white/10 sticky top-32">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Privacy Team</h3>
              <p className="text-sm text-gray-400 mb-6">
                If you have questions about this policy or want to exercise your rights, please reach out.
              </p>
              <a 
                href="mailto:privacy@matchpoint.ai" 
                className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                Email Data Officer
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Globe, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
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
            <Scale className="h-3 w-3" />
            Platform Terms
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </motion.div>

        <div className="prose prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using MatchPointAI (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              2. Use of License
            </h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <p className="text-gray-400 leading-relaxed m-0">
                MatchPointAI grants you a limited, non-exclusive, non-transferable license to use the Platform for your professional business or investment activities. You may not:
              </p>
              <ul className="space-y-2 text-gray-400 m-0 list-disc pl-6">
                <li>Reverse engineer or attempt to extract the source code of the Platform.</li>
                <li>Use the Platform for any illegal or unauthorized purpose.</li>
                <li>Scrape data from the Platform using automated tools without prior consent.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
            <p className="text-gray-400 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. Any activities that occur under your account are your responsibility. MatchPointAI reserves the right to terminate accounts that violate these terms.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              4. Disclaimer
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The information provided on MatchPointAI is for informational purposes only and does not constitute financial, investment, or legal advice. MatchPointAI does not guarantee the accuracy or completeness of any data on the Platform.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">5. Governing Law</h2>
            <p className="text-gray-400 leading-relaxed">
              These terms are governed by and construed in accordance with the laws of the jurisdiction in which MatchPointAI operates, without regard to its conflict of law principles.
            </p>
          </section>
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Have questions about our terms?</h3>
          <p className="text-gray-400 mb-6">Our legal team is here to help you understand your rights and responsibilities.</p>
          <button className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

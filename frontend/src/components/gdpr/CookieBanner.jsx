import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'all');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gdpr-consent', 'essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 z-[9999] mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c14]/90 backdrop-blur-xl shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Cookie className="h-6 w-6 text-blue-400" />
                </div>
                
                <div className="flex-grow space-y-2">
                  <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    We use cookies to enhance your experience, analyze our traffic, and provide secure environment. 
                    By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                    <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Manage
                    <ChevronRight className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-6 py-2.5 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    Accept All
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-400" />
                          <h4 className="font-medium text-white">Essential Cookies</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-green-400/10 text-green-400 border border-green-400/20 uppercase">Required</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          These cookies are necessary for the website to function and cannot be switched off in our systems.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded bg-blue-400/10 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-blue-400" />
                          </div>
                          <h4 className="font-medium text-white">Analytics Cookies</h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;

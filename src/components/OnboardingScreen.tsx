import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    id: 1,
    illustration: '🚊',
    gradient: 'from-[#1A56DB] to-[#3F83F8]',
    accentBg: 'bg-blue-50 dark:bg-blue-950',
    title: 'Know Before You Go',
    subtitle: 'Get real-time crowd predictions for buses, trains, and metro — all in one place.',
    dots: ['🚌', '🚇', '🚍'],
  },
  {
    id: 2,
    illustration: '🗺️',
    gradient: 'from-[#0E9F6E] to-[#31C48D]',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950',
    title: 'Find Your Perfect Route',
    subtitle: 'AI-powered recommendations to get you there comfortably, even during rush hour.',
    dots: ['📍', '⚡', '🎯'],
  },
  {
    id: 3,
    illustration: '🔔',
    gradient: 'from-[#FF8A4C] to-[#FDBA8C]',
    accentBg: 'bg-orange-50 dark:bg-orange-950',
    title: 'Stay Ahead of the Rush',
    subtitle: 'Instant alerts about delays, peak hours, and the perfect time to leave.',
    dots: ['⏰', '📊', '🛡️'],
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => onComplete();

  const current = onboardingData[currentStep];
  const isLast = currentStep === onboardingData.length - 1;

  return (
    <div className={`h-screen ${current.accentBg} flex flex-col transition-colors duration-500 overflow-hidden`}>
      {/* Skip Button */}
      <div className="flex justify-end px-6 pt-12 pb-4">
        <button
          onClick={handleSkip}
          className="text-neutral-400 dark:text-gray-500 text-sm font-bold hover:text-neutral-600 dark:hover:text-gray-300 transition-colors px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Illustration Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full text-center"
          >
            {/* Illustration Card */}
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className={`w-52 h-52 mx-auto mb-8 bg-gradient-to-br ${current.gradient} rounded-[36px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden`}
              style={{ boxShadow: `0 24px 60px -12px rgba(0,0,0,0.25)` }}
            >
              {/* Shine overlay */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/15 rounded-t-[36px]" />
              <span className="text-8xl leading-none relative z-10 select-none">{current.illustration}</span>
              {/* Floating accent dots */}
              <div className="absolute bottom-4 flex gap-2 z-10">
                {current.dots.map((dot, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg"
                  >
                    {dot}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-neutral-900 dark:text-white text-[28px] font-black mb-3 tracking-tight leading-tight"
            >
              {current.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-neutral-500 dark:text-gray-400 text-[15px] font-medium leading-relaxed max-w-xs mx-auto"
            >
              {current.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-8 pb-12">
        {/* Progress dots */}
        <div className="flex justify-center mb-8 gap-2">
          {onboardingData.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: index === currentStep ? 28 : 8,
                opacity: index === currentStep ? 1 : 0.35,
              }}
              transition={{ duration: 0.3 }}
              className={`h-2 rounded-full bg-gradient-to-r ${current.gradient}`}
            />
          ))}
        </div>

        {/* Next / Get Started Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className={`w-full bg-gradient-to-r ${current.gradient} text-white py-4 rounded-2xl font-black text-[16px] shadow-xl flex items-center justify-center gap-2 transition-all`}
          style={{ boxShadow: isLast ? '0 12px 32px rgba(26, 86, 219, 0.35)' : '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          {isLast ? '🚀 Get Started' : (
            <>
              Next <ChevronRight size={20} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
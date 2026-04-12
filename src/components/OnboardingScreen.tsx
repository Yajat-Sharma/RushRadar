import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, Route, Bell } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    id: 1,
    icon: Users,
    title: "Know Before You Go",
    subtitle: "Get real-time crowd predictions for all transport modes",
    illustration: "🚊",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    icon: Route,
    title: "Find Your Perfect Route",
    subtitle: "AI-powered recommendations for comfortable journeys",
    illustration: "🗺️",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    icon: Bell,
    title: "Stay Informed",
    subtitle: "Receive instant alerts about delays and overcrowding",
    illustration: "🔔",
    color: "from-orange-500 to-red-600"
  }
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

  const handleSkip = () => {
    onComplete();
  };

  const currentData = onboardingData[currentStep];

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12">
        <div className="w-12" /> {/* Spacer */}
        <button
          onClick={handleSkip}
          className="text-neutral-medium text-base font-medium"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Illustration */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`w-64 h-64 mx-auto mb-8 bg-gradient-to-br ${currentData.color} rounded-3xl flex items-center justify-center shadow-xl`}
            >
              <span className="text-8xl">{currentData.illustration}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-neutral-dark text-3xl font-bold mb-4"
            >
              {currentData.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-neutral-medium text-lg leading-relaxed max-w-xs mx-auto"
            >
              {currentData.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-8 pb-12">
        {/* Progress Dots */}
        <div className="flex justify-center mb-8 space-x-3">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary-blue w-6' : 'bg-neutral-light'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-primary-blue to-secondary-teal text-white py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-2"
        >
          <span>{currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
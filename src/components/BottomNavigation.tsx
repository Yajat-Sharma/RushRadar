import React from 'react';
import { motion } from 'framer-motion';
import { Home, Map as MapIcon, Bookmark, User, Navigation } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Search' },
    { id: 'map', icon: MapIcon, label: 'Live' },
    { id: 'routes', icon: Navigation, label: 'Routes' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="px-4 pb-5 pt-2">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-neutral-200/50 dark:border-gray-700/50 shadow-xl rounded-[28px] px-2 py-2 flex justify-between items-center relative overflow-hidden transition-colors duration-200">
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent" />

        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id ||
            (tab.id === 'routes' && currentScreen === 'analytics');

          return (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id as Screen)}
              className="relative p-3 rounded-2xl flex flex-col items-center justify-center min-w-[58px] outline-none"
              whileTap={{ scale: 0.88 }}
            >
              {isActive && (
                <motion.div
                  layoutId="navBubble"
                  className="absolute inset-0 bg-primary-blue/12 dark:bg-primary-blue/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                />
              )}
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={`z-10 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-blue'
                    : 'text-neutral-400 dark:text-gray-500'
                }`}
              />
              <span className={`text-[10px] font-bold mt-0.5 z-10 tracking-tight transition-colors duration-200 ${
                isActive ? 'text-primary-blue' : 'text-neutral-400 dark:text-gray-500'
              }`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
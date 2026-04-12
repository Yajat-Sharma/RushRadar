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
    <div className="px-6 pb-6 pt-2">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-glass rounded-[32px] px-2 py-2 flex justify-between items-center relative overflow-hidden">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id || 
            (tab.id === 'routes' && currentScreen === 'analytics');
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id as Screen)}
              className="relative p-3 rounded-2xl flex flex-col items-center justify-center min-w-[60px] outline-none"
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-primary-blue-light/15 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`z-10 transition-colors ${isActive ? 'text-primary-blue' : 'text-neutral-medium'}`} 
              />
              <span className={`text-[10px] font-semibold mt-1 z-10 transition-colors ${isActive ? 'text-primary-blue' : 'text-neutral-medium'}`}>
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
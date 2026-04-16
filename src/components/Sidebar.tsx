import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map as MapIcon, Bookmark, User, Navigation, Bell, Settings } from 'lucide-react';
import { Screen } from '../App';
import { useAppContext } from '../contexts/AppContext';
import { IconButton } from './ui/IconButton';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const { state } = useAppContext();
  
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: MapIcon, label: 'Live Map' },
    { id: 'routes', icon: Navigation, label: 'Routes' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="hidden md:flex flex-col w-20 lg:w-64 bg-white dark:bg-gray-900 border-r border-neutral-200 dark:border-gray-800 h-[100dvh] z-50 transition-colors duration-300">
      {/* Brand & Logo */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 w-full shrink-0 border-b border-neutral-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-blue flex-shrink-0 to-primary-blue-light flex items-center justify-center shadow-md">
          <Navigation size={22} className="text-white transform -rotate-45" />
        </div>
        <span className="hidden lg:block ml-3 font-black text-xl text-neutral-dark dark:text-white tracking-tight">CrowdSense</span>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-6 px-3 lg:px-4 space-y-2 overflow-y-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id || (tab.id === 'routes' && currentScreen === 'analytics');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id as Screen)}
              className="w-full relative px-3 py-3 rounded-2xl flex lg:flex-row flex-col items-center justify-center lg:justify-start outline-none transition-all group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarBubble"
                  className="absolute inset-0 bg-primary-blue/10 dark:bg-primary-blue/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                />
              )}
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={`z-10 transition-colors duration-200 lg:mr-3 ${
                  isActive
                    ? 'text-primary-blue'
                    : 'text-neutral-500 dark:text-gray-400 group-hover:text-primary-blue/70'
                }`}
              />
              <span className={`text-[10px] lg:text-sm font-bold mt-1 lg:mt-0 z-10 tracking-tight transition-colors duration-200 ${
                isActive ? 'text-primary-blue' : 'text-neutral-500 dark:text-gray-400 group-hover:text-primary-blue/70'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Info / Extra Actions */}
      <div className="p-4 border-t border-neutral-100 dark:border-gray-800">
        <button 
          onClick={() => onNavigate('notifications')}
          className="w-full relative px-3 py-3 rounded-2xl flex lg:flex-row flex-col items-center justify-center lg:justify-start outline-none transition-all hover:bg-neutral-50 dark:hover:bg-gray-800/50 text-neutral-500 dark:text-gray-400"
        >
          <Bell size={22} strokeWidth={2} className="z-10 lg:mr-3" />
          <span className="text-[10px] lg:text-sm font-bold mt-1 lg:mt-0 z-10 tracking-tight">Notifications</span>
          {state.notificationCount > 0 && (
            <div className="absolute top-2 right-2 lg:relative lg:top-0 lg:right-0 lg:ml-auto w-4 h-4 rounded-full bg-danger-red flex items-center justify-center text-[9px] text-white font-black">
              {state.notificationCount}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

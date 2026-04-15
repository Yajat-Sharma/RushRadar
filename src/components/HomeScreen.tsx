import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpDown, Search, AlertTriangle, Clock, Bell, User } from 'lucide-react';
import { Screen } from '../App';
import { getCurrentRegion } from '../config/regions';
import { INDIA_STATIONS } from '../data/indiaTransitData';
import { useAppContext } from '../contexts/AppContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { LocationInput } from './ui/LocationInput';
import { generateMockRoutes } from '../utils/routeGenerator';
import { IconButton } from './ui/IconButton';
import { AIAssistant } from './AIAssistant';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const regionConfig = getCurrentRegion();
  const { state, setFromLocation, setToLocation, swapLocations, setGeneratedRoutes } = useAppContext();
  const [isSearching, setIsSearching] = useState(false);

  const nearbyStations = INDIA_STATIONS;

  const getCrowdColor = (level: number) => {
    if (level <= 30) return 'text-success-green';
    if (level <= 70) return 'text-warning-orange';
    return 'text-danger-red';
  };

  const getCrowdRingColor = (level: number) => {
    if (level <= 30) return 'stroke-success-green';
    if (level <= 70) return 'stroke-warning-orange';
    return 'stroke-danger-red';
  };

  const getCrowdBg = (level: number) => {
    if (level <= 30) return 'bg-emerald-50 dark:bg-emerald-900/20';
    if (level <= 70) return 'bg-orange-50 dark:bg-orange-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const getCrowdLabel = (level: number) => {
    if (level <= 30) return 'Low';
    if (level <= 70) return 'Moderate';
    return 'Crowded';
  };

  const handleSearchClick = () => {
    if (!state.fromLocation || !state.toLocation) return;
    setIsSearching(true);
    setTimeout(() => {
      const routes = generateMockRoutes(state.fromLocation, state.toLocation);
      setGeneratedRoutes(routes);
      setIsSearching(false);
      onNavigate('routes');
    }, 800);
  };

  const handleStationTap = (stationName: string) => {
    setToLocation(stationName);
    if (state.fromLocation) {
      setIsSearching(true);
      setTimeout(() => {
        const routes = generateMockRoutes(state.fromLocation, stationName);
        setGeneratedRoutes(routes);
        setIsSearching(false);
        onNavigate('routes');
      }, 600);
    }
  };

  const displayName = state.user?.name
    ? state.user.name.split(' ')[0]
    : state.isGuest ? 'Guest' : 'there';

  const notifCount = state.notificationCount;

  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-4 pt-10 sticky top-0 z-20 border-b border-neutral-100/50 dark:border-gray-800/50 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('map')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-blue-light flex items-center justify-center shadow-md">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <p className="text-neutral-dark dark:text-white font-bold text-sm tracking-tight">
                {greeting}, {displayName} 👋
              </p>
              <p className="text-neutral-medium dark:text-gray-400 text-xs font-medium">{regionConfig.locationContext.locationSubtitle}</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <IconButton variant="secondary" size="md" onClick={() => onNavigate('notifications')}>
                <Bell size={18} className="text-neutral-dark dark:text-white" />
              </IconButton>
              {notifCount > 0 && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-danger-red rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                  <span className="text-white text-[8px] font-black">{notifCount}</span>
                </div>
              )}
            </div>
            <IconButton variant="primary" size="md" onClick={() => onNavigate('profile')}>
              <User size={18} />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 no-scrollbar">
        {/* Search Section */}
        <div className="p-5">
          <Card className="shadow-md border-none !bg-white dark:!bg-gray-800">
            <h2 className="text-lg font-black text-neutral-dark dark:text-white mb-4 tracking-tight">Where are you going?</h2>
            <LocationInput
              value={state.fromLocation}
              onChange={setFromLocation}
              placeholder="Current Location"
            />
            <div className="absolute right-8 top-[88px] z-10">
              <IconButton
                variant="secondary"
                size="md"
                onClick={swapLocations}
                className="shadow-md border-[3px] border-white dark:border-gray-700"
              >
                <ArrowUpDown size={16} className="text-neutral-medium dark:text-gray-300" />
              </IconButton>
            </div>
            <div className="mb-4 mt-2">
              <LocationInput
                value={state.toLocation}
                onChange={setToLocation}
                placeholder="Where to?"
                isDestination={true}
              />
            </div>
            <Button
              fullWidth
              size="lg"
              onClick={handleSearchClick}
              isLoading={isSearching}
              disabled={!state.fromLocation || !state.toLocation}
              className="!rounded-2xl !py-4 text-[15px] font-black"
            >
              {!isSearching && <Search size={18} className="mr-2" />}
              {isSearching ? 'Finding Routes…' : 'Find Routes'}
            </Button>
          </Card>
        </div>

        {/* Peak Hour Banner */}
        <div className="px-5 mb-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/25 dark:to-red-900/25 border border-warning-orange/25 dark:border-orange-700/40 rounded-2xl p-4 shadow-sm flex items-center space-x-3"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm shrink-0">
              <AlertTriangle size={16} className="text-warning-orange" />
            </div>
            <div className="flex-1">
              <p className="text-orange-900 dark:text-orange-300 font-bold text-sm">
                Peak Hours ({regionConfig.peakHours.morning})
              </p>
              <p className="text-orange-800/70 dark:text-orange-400/80 font-medium text-xs mt-0.5">
                Heavy rush expected on Western Line
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-bold text-warning-orange dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2.5 py-1 rounded-lg shrink-0"
            >
              Details
            </button>
          </motion.div>
        </div>

        {/* Nearby Stations */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-dark dark:text-white font-black text-lg tracking-tight">Nearby Stations</h3>
            <button
              className="text-primary-blue text-sm font-bold hover:underline"
              onClick={() => onNavigate('map')}
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {nearbyStations.map((station, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card
                  interactive
                  onClick={() => handleStationTap(station.name)}
                  className="flex items-center justify-between !p-4 !border-neutral-100 dark:!border-gray-700"
                >
                  <div className="flex-1 pr-3">
                    <h4 className="text-neutral-dark dark:text-white font-black text-[15px]">{station.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-neutral-medium dark:text-gray-400 font-medium text-xs">{station.distance}</p>
                      <span className="w-1 h-1 bg-neutral-300 dark:bg-gray-600 rounded-full" />
                      <div className="flex items-center space-x-1">
                        <Clock size={11} className="text-success-green" />
                        <p className="text-success-green text-xs font-bold">{station.nextArrival}</p>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
                      {station.modes.map((mode, i) => (
                        <span key={i} className="text-[11px] bg-neutral-100 dark:bg-gray-700 text-neutral-dark dark:text-gray-200 px-2 py-0.5 rounded-lg font-semibold border border-neutral-200 dark:border-gray-600">
                          {mode}
                        </span>
                      ))}
                      {station.specialFeatures && station.specialFeatures.length > 0 && (
                        <span className="text-[10px] bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-blue-300 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wide">
                          {station.specialFeatures[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Crowd Ring Indicator */}
                  <div className="flex flex-col items-center justify-center gap-1 pl-2">
                    <div className={`relative w-12 h-12 rounded-full ${getCrowdBg(station.crowdLevel)} flex items-center justify-center`}>
                      <svg className="w-12 h-12 transform -rotate-90 absolute inset-0">
                        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3.5" fill="none" className="text-neutral-200 dark:text-gray-700" />
                        <motion.circle
                          initial={{ strokeDasharray: '0 113' }}
                          animate={{ strokeDasharray: `${(station.crowdLevel / 100) * 113} ${113 - (station.crowdLevel / 100) * 113}` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 * index }}
                          cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3.5" fill="none"
                          strokeLinecap="round"
                          className={getCrowdRingColor(station.crowdLevel)}
                        />
                      </svg>
                      <span className={`text-[11px] font-black z-10 ${getCrowdColor(station.crowdLevel)}`}>
                        {station.crowdLevel}%
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold ${getCrowdColor(station.crowdLevel)}`}>
                      {getCrowdLabel(station.crowdLevel)}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Commute Assistant FAB */}
      <AIAssistant onNavigate={onNavigate} />
    </div>
  );
};

export default HomeScreen;
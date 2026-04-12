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
    // Auto-navigate to routes if origin is already set
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

  return (
    <div className="h-full bg-neutral-card flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-5 py-4 pt-10 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('map')}
          >
            <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary-blue" />
            </div>
            <div>
              <p className="text-neutral-dark font-bold text-sm tracking-tight">
                Hi, {displayName} 👋
              </p>
              <p className="text-neutral-medium text-xs font-medium">{regionConfig.locationContext.locationSubtitle}</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <IconButton variant="secondary" size="md" onClick={() => onNavigate('notifications')}>
                <Bell size={18} />
              </IconButton>
              {notifCount > 0 && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-danger-red rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white text-[8px] font-bold">{notifCount}</span>
                </div>
              )}
            </div>
            <IconButton variant="primary" size="md" onClick={() => onNavigate('profile')}>
              <User size={18} />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Search Section */}
        <div className="p-5">
          <Card className="shadow-lg border-none bg-white relative">
            <h2 className="text-lg font-bold text-neutral-dark mb-4">Where are you going?</h2>
            <LocationInput
              value={state.fromLocation}
              onChange={setFromLocation}
              placeholder="Current Location"
            />
            <div className="absolute right-8 top-[85px] z-10">
              <IconButton
                variant="secondary"
                size="md"
                onClick={swapLocations}
                className="shadow-md border-white border-[3px]"
              >
                <ArrowUpDown size={16} className="text-neutral-medium" />
              </IconButton>
            </div>
            <div className="mb-5">
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
            >
              <Search size={18} className="mr-2" />
              Find Routes
            </Button>
          </Card>
        </div>

        {/* Peak Hour Banner */}
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 border border-warning-orange/30 rounded-2xl p-4 shadow-sm flex items-start space-x-3"
          >
            <div className="p-1.5 bg-white rounded-full shadow-sm">
              <AlertTriangle size={18} className="text-warning-orange" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-orange-900 font-bold text-sm">Peak Hours ({regionConfig.peakHours.morning})</p>
              <p className="text-orange-800/80 font-medium text-xs mt-0.5">Heavy rush expected on Western Line</p>
            </div>
          </motion.div>
        </div>

        {/* Nearby Stations */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-dark font-bold text-lg">Nearby Stations</h3>
            <button
              className="text-primary-blue text-sm font-semibold hover:underline"
              onClick={() => onNavigate('map')}
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {nearbyStations.map((station, index) => (
              <Card
                key={index}
                interactive
                onClick={() => handleStationTap(station.name)}
                className="flex items-center justify-between !p-4"
              >
                <div className="flex-1">
                  <h4 className="text-neutral-dark font-bold text-[15px]">{station.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-neutral-medium font-medium text-xs">{station.distance}</p>
                    <span className="w-1 h-1 bg-neutral-light rounded-full" />
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-success-green" />
                      <p className="text-success-green text-xs font-bold">{station.nextArrival}</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
                    {station.modes.map((mode, i) => (
                      <span key={i} className="text-xs bg-neutral-light/70 text-neutral-dark px-2 py-0.5 rounded-md font-medium border border-neutral-200">
                        {mode}
                      </span>
                    ))}
                    {station.specialFeatures && station.specialFeatures.length > 0 && (
                      <span className="text-[10px] bg-primary-blue/10 text-primary-blue-dark px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                        {station.specialFeatures[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Crowd Indicator */}
                <div className="flex flex-col items-center justify-center pl-3 relative">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="#F3F4F6" strokeWidth="4" fill="none" />
                    <motion.circle
                      initial={{ strokeDasharray: '0 100' }}
                      animate={{ strokeDasharray: `${station.crowdLevel} ${100 - station.crowdLevel}` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="none"
                      strokeLinecap="round"
                      className={getCrowdRingColor(station.crowdLevel)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ${getCrowdColor(station.crowdLevel)}`}>
                      {station.crowdLevel}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
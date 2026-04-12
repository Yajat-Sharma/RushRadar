import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Users, Navigation } from 'lucide-react';
import { Screen } from '../App';
import { formatCurrency } from '../config/regions';
import { useAppContext } from '../contexts/AppContext';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { generateMockRoutes } from '../utils/routeGenerator';

interface RouteResultsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RouteResultsScreen: React.FC<RouteResultsScreenProps> = ({ onNavigate }) => {
  const { state, setSelectedRouteId } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('Fastest');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Derive route summaries, handle default fallbacks if state is empty
  const fromLoc = state.fromLocation || 'Andheri (W)';
  const toLoc = state.toLocation || 'Churchgate';

  const filters = ['Fastest', 'Least Crowded', 'Cheapest', 'Fewest Transfers'];

  const getCrowdColorClasses = (level: number) => {
    if (level <= 30) return { bg: 'bg-success-green', text: 'text-success-green', lightBg: 'bg-green-100' };
    if (level <= 70) return { bg: 'bg-warning-orange', text: 'text-warning-orange', lightBg: 'bg-orange-100' };
    return { bg: 'bg-danger-red', text: 'text-danger-red', lightBg: 'bg-red-100' };
  };

  const getComfortGradient = (comfort: string) => {
    if (comfort === 'Comfortable') return 'from-success-green to-[#0E9F6E]';
    if (comfort === 'Moderate') return 'from-warning-orange to-[#E07A5F]';
    return 'from-danger-red to-[#C1121F]';
  };

  // Dummy filter logic
  const filteredRoutes = useMemo(() => {
    // Fallback if state gets cleared (e.g., page refresh)
    const baseRoutes = state.generatedRoutes.length > 0 
      ? state.generatedRoutes 
      : generateMockRoutes(fromLoc, toLoc);

    let routes = [...baseRoutes];
    if (activeFilter === 'Cheapest') {
      routes.sort((a, b) => a.fare - b.fare);
    } else if (activeFilter === 'Least Crowded') {
      routes.sort((a, b) => a.crowdLevel - b.crowdLevel);
    }
    return routes;
  }, [activeFilter, state.generatedRoutes, fromLoc, toLoc]);

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id);
    onNavigate('map'); // Start navigation on the map
  };

  return (
    <div className="h-full bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 pt-10 border-b border-neutral-light sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <IconButton variant="ghost" onClick={() => onNavigate('home')}>
            <ArrowLeft size={22} className="text-neutral-dark" />
          </IconButton>
          <h1 className="text-[17px] font-bold text-neutral-dark tracking-tight">Route Options</h1>
          <IconButton variant="secondary" size="md">
            <Filter size={18} className="text-neutral-dark" />
          </IconButton>
        </div>
      </div>

      {/* Route Summary Bar */}
      <div className="bg-white shadow-sm px-5 py-3 border-b border-neutral-200 z-10">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <p className="text-neutral-dark font-bold text-[15px] truncate">{fromLoc} <span className="text-neutral-medium mx-1">→</span> {toLoc}</p>
            <p className="text-neutral-medium font-medium text-[11px] mt-0.5">Departing now • Live updates</p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-[#F5F7FA] px-1 py-3 z-0">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar px-4 pb-1">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive 
                    ? 'bg-neutral-dark text-white shadow-md transform scale-105' 
                    : 'bg-white text-neutral-medium border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Route Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 pt-1">
        <AnimatePresence mode="popLayout">
          {filteredRoutes.map((route, index) => {
            const isExpanded = expandedRouteId === String(route.id);
            const crowdColors = getCrowdColorClasses(route.crowdLevel);
            
            return (
              <motion.div
                layout
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={`relative overflow-hidden transition-shadow ${isExpanded ? 'shadow-lg border-primary-blue/30' : 'hover:shadow-md'}`}
                  onClick={() => !isExpanded && setExpandedRouteId(String(route.id))}
                  interactive={!isExpanded}
                >
                  {/* Decorative Gradient Line at Top */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getComfortGradient(route.comfort)}`} />

                  {/* Least Crowded Badge */}
                  {route.isLeastCrowded && activeFilter !== 'Least Crowded' && (
                    <div className="absolute top-4 right-4 bg-success-green/10 text-success-green px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-success-green/20">
                      Best Option
                    </div>
                  )}

                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <div>
                      <h3 className="text-3xl font-black text-neutral-dark tracking-tighter">{route.time}</h3>
                    </div>
                  </div>

                  {/* Transport Modes Line */}
                  <div className="flex items-center space-x-2.5 mb-4">
                    {route.modes.map((mode, i) => (
                      <React.Fragment key={i}>
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-xl shadow-sm border border-neutral-200">
                          {mode}
                        </div>
                        {i < route.modes.length - 1 && (
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                            <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                            <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Crowd Information */}
                  <div className="bg-[#F8FAFC] rounded-xl p-3.5 mb-4 border border-neutral-100">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2">
                        <Users size={14} className={crowdColors.text} />
                        <span className="text-xs font-bold text-neutral-dark">
                          {route.crowdLevel}% Crowd Level
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${crowdColors.lightBg} ${crowdColors.text}`}>
                        Seat: {route.seatProbability}%
                      </span>
                    </div>
                    
                    {/* Segmented Crowd Level Bar */}
                    <div className="w-full flex space-x-1 h-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((segment) => {
                        const segmentThreshold = segment * 10;
                        const isFilled = route.crowdLevel >= segmentThreshold;
                        const isPartial = !isFilled && route.crowdLevel > (segment - 1) * 10;
                        
                        let bgColor = 'bg-neutral-200';
                        if (isFilled || isPartial) {
                          bgColor = crowdColors.bg;
                        }
                        
                        return (
                          <div 
                            key={segment} 
                            className={`flex-1 rounded-full ${bgColor} ${isPartial ? 'opacity-50' : ''}`}
                            style={isPartial ? { width: `${(route.crowdLevel % 10) * 10}%`, flex: 'none' } : {}}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-neutral-dark">{formatCurrency(route.fare)}</p>
                      <p className="text-[11px] font-medium text-neutral-medium">
                        {route.specialFeatures?.includes('First Class') ? 'First Class' : 'General'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {isExpanded ? (
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedRouteId(null); }}>
                          Less
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedRouteId(String(route.id)); }}>
                          Details
                        </Button>
                      )}
                      
                      <Button variant="primary" size="sm" onClick={() => handleSelectRoute(String(route.id))}>
                        Go
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-neutral-dark font-medium text-sm mb-3 leading-relaxed">{route.details}</p>
                          
                          {route.specialFeatures && route.specialFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {route.specialFeatures.map((feature, i) => (
                                <span key={i} className="text-[10px] bg-primary-blue/10 text-primary-blue-light px-2.5 py-1 rounded-md font-bold">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="bg-neutral-50 rounded-lg p-3 space-y-2 border border-neutral-100">
                            {route.platform && (
                              <div className="flex items-center text-[11px] text-neutral-dark font-semibold">
                                <span className="w-5 text-center mr-2 opacity-70">🚉</span>
                                {route.platform}
                              </div>
                            )}
                            {route.coachSuggestion && (
                              <div className="flex items-center text-[11px] text-success-green font-bold">
                                <span className="w-5 text-center mr-2 opacity-70">💡</span>
                                {route.coachSuggestion}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RouteResultsScreen;
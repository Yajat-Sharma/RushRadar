import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Navigation, Clock, Zap, AlertCircle, CheckCircle, ChevronDown, ChevronUp, GitCompare } from 'lucide-react';
import { Screen } from '../App';
import { formatCurrency } from '../config/regions';
import { useAppContext } from '../contexts/AppContext';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { generateMockRoutes } from '../utils/routeGenerator';
import { IndiaRoute, CoachData } from '../data/indiaTransitData';

interface RouteResultsScreenProps {
  onNavigate: (screen: Screen) => void;
}

// Coach Visualizer
const CoachVisualizer: React.FC<{ coaches: CoachData[] }> = ({ coaches }) => {
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);

  const getCoachColor = (type: CoachData['type'], crowd: number) => {
    if (type === 'ladies') return { bg: 'bg-pink-100 border-pink-300', text: 'text-pink-700', label: '♀' };
    if (type === 'first') return { bg: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-700', label: '1C' };
    if (crowd <= 35) return { bg: 'bg-green-100 border-green-300', text: 'text-green-700', label: `${crowd}%` };
    if (crowd <= 70) return { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-700', label: `${crowd}%` };
    return { bg: 'bg-red-100 border-red-300', text: 'text-red-700', label: `${crowd}%` };
  };

  return (
    <div className="mt-3">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Coach Crowd Map — Tap a coach</p>
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
        {coaches.map(coach => {
          const { bg, text, label } = getCoachColor(coach.type, coach.crowd);
          const isSelected = selectedCoach === coach.num;
          return (
            <button
              key={coach.num}
              onClick={() => setSelectedCoach(isSelected ? null : coach.num)}
              className={`shrink-0 w-10 h-10 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${bg} ${isSelected ? 'ring-2 ring-primary-blue scale-110' : ''}`}
            >
              <span className={`text-[8px] font-black ${text}`}>{coach.num}</span>
              <span className={`text-[7px] font-bold ${text} mt-0.5`}>{coach.type === 'ladies' ? '♀' : coach.type === 'first' ? '1C' : ''}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCoach !== null && (() => {
          const c = coaches.find(c => c.num === selectedCoach)!;
          const { text } = getCoachColor(c.type, c.crowd);
          return (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 overflow-hidden">
              <p className="text-[12px] font-bold text-neutral-800">
                Coach {selectedCoach} — {c.type === 'ladies' ? '🩷 Ladies' : c.type === 'first' ? '⭐ First Class' : '🚊 General'}
              </p>
              <p className={`text-[11px] font-semibold ${text} mt-0.5`}>Crowd: {c.crowd}% · {c.crowd <= 35 ? 'Seats available' : c.crowd <= 70 ? 'Limited seats' : 'Standing room only'}</p>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex gap-3 mt-2 flex-wrap">
        {[
          { color: 'bg-pink-300', label: 'Ladies' },
          { color: 'bg-yellow-300', label: 'First Class' },
          { color: 'bg-green-300', label: 'Low crowd' },
          { color: 'bg-orange-300', label: 'Moderate' },
          { color: 'bg-red-300', label: 'High' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-sm ${l.color}`} />
            <span className="text-[9px] text-neutral-500 font-medium">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Delay Badge
const DelayBadge: React.FC<{ delay: number }> = ({ delay }) => {
  if (delay === 0) return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-success-green bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      <CheckCircle size={10} /> On Time
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-danger-red bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <AlertCircle size={10} /> +{delay} min
    </span>
  );
};

// LocalType Badge
const LocalTypeBadge: React.FC<{ type: IndiaRoute['localType'] }> = ({ type }) => {
  const map: Record<string, { label: string; color: string }> = {
    fast: { label: '⚡ Fast', color: 'bg-blue-50 text-primary-blue border-blue-200' },
    slow: { label: '🐢 Slow', color: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
    express: { label: '🚄 Express', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    bus: { label: '🚌 Bus', color: 'bg-orange-50 text-warning-orange border-orange-200' },
    metro: { label: '🚇 Metro', color: 'bg-teal-50 text-secondary-teal border-teal-200' },
  };
  if (!type || !map[type]) return null;
  const { label, color } = map[type];
  return <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${color}`}>{label}</span>;
};

const RouteResultsScreen: React.FC<RouteResultsScreenProps> = ({ onNavigate }) => {
  const { state, setSelectedRouteId } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('Fastest');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const [localTypeFilter, setLocalTypeFilter] = useState<'all' | 'fast' | 'slow'>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

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

  const filteredRoutes = useMemo(() => {
    const baseRoutes = state.generatedRoutes.length > 0
      ? state.generatedRoutes
      : generateMockRoutes(fromLoc, toLoc);

    let routes = [...baseRoutes];
    if (localTypeFilter !== 'all') {
      routes = routes.filter(r => r.localType === localTypeFilter || r.localType === 'metro' || r.localType === 'bus');
    }
    if (activeFilter === 'Cheapest') routes.sort((a, b) => a.fare - b.fare);
    else if (activeFilter === 'Least Crowded') routes.sort((a, b) => a.crowdLevel - b.crowdLevel);
    return routes;
  }, [activeFilter, localTypeFilter, state.generatedRoutes, fromLoc, toLoc]);

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id);
    onNavigate('map');
  };

  const handleCompareToggle = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const compareRoutes = filteredRoutes.filter(r => compareIds.includes(String(r.id)));

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-md px-4 py-3 pt-10 border-b border-neutral-light dark:border-gray-700 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <IconButton variant="ghost" onClick={() => onNavigate('home')}>
            <ArrowLeft size={22} className="text-neutral-dark dark:text-white" />
          </IconButton>
          <h1 className="text-[17px] font-bold text-neutral-dark dark:text-white tracking-tight">Route Options</h1>
          <button
            onClick={() => { setCompareMode(!compareMode); setCompareIds([]); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors ${compareMode ? 'bg-primary-blue text-white' : 'bg-neutral-100 text-neutral-600'}`}
          >
            <GitCompare size={14} />
            {compareMode ? 'Comparing' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Route Summary */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-5 py-3 border-b border-neutral-200 dark:border-gray-700 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-neutral-dark dark:text-white font-bold text-[15px] truncate">{fromLoc} <span className="text-neutral-medium mx-1">→</span> {toLoc}</p>
            <p className="text-neutral-medium text-[11px] font-medium mt-0.5">Departing now · Live updates</p>
          </div>
          {/* Fast/Slow toggle */}
          <div className="flex bg-neutral-100 dark:bg-gray-700 rounded-xl p-0.5 gap-0.5 ml-3">
            {(['all', 'fast', 'slow'] as const).map(t => (
              <button
                key={t}
                onClick={() => setLocalTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${localTypeFilter === t ? 'bg-white dark:bg-gray-600 text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-medium'}`}
              >
                {t === 'all' ? 'All' : t === 'fast' ? '⚡ Fast' : '🐢 Slow'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-[#F5F7FA] dark:bg-gray-900 px-1 py-3 z-0">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar px-4 pb-1">
          {filters.map(filter => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive ? 'bg-neutral-dark dark:bg-primary-blue text-white shadow-md scale-105' : 'bg-white dark:bg-gray-800 text-neutral-medium border border-neutral-200 dark:border-gray-700'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compare Mode Banner */}
      <AnimatePresence>
        {compareMode && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-primary-blue/5 border-b border-primary-blue/20 px-5 py-2.5 overflow-hidden">
            <p className="text-[12px] font-bold text-primary-blue">
              {compareIds.length === 0 ? 'Select 2 routes to compare' : compareIds.length === 1 ? 'Select 1 more route' : 'Showing comparison below ↓'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 pt-2 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredRoutes.map((route, index) => {
            const isExpanded = expandedRouteId === String(route.id);
            const isSelectedForCompare = compareIds.includes(String(route.id));
            const crowdColors = getCrowdColorClasses(route.crowdLevel);

            return (
              <motion.div
                layout key={route.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all dark:bg-gray-800 dark:border-gray-700 ${
                    isExpanded ? 'shadow-lg border-primary-blue/30' : 'hover:shadow-md'
                  } ${isSelectedForCompare ? 'ring-2 ring-primary-blue' : ''}`}
                  onClick={() => {
                    if (compareMode) { handleCompareToggle(String(route.id)); return; }
                    if (!isExpanded) setExpandedRouteId(String(route.id));
                  }}
                  interactive={!isExpanded || compareMode}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getComfortGradient(route.comfort)}`} />

                  {route.isLeastCrowded && (
                    <div className="absolute top-4 right-4 bg-success-green/10 text-success-green px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-success-green/20">
                      Best Option
                    </div>
                  )}

                  {/* Route Header */}
                  <div className="flex items-start justify-between mb-3 mt-1">
                    <div>
                      <h3 className="text-3xl font-black text-neutral-dark dark:text-white tracking-tighter">{route.time}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <LocalTypeBadge type={route.localType} />
                        {typeof route.delay === 'number' && <DelayBadge delay={route.delay} />}
                        {route.hasLadiesCoach && (
                          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">🩷 Ladies Coach</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Platform Badge */}
                  {route.platform && (
                    <div className="flex items-center gap-1.5 mb-3 bg-neutral-50 dark:bg-gray-700 rounded-lg px-3 py-1.5 w-fit border border-neutral-200 dark:border-gray-600">
                      <span className="text-sm">🚉</span>
                      <span className="text-[11px] font-bold text-neutral-700 dark:text-gray-300">{route.platform}</span>
                    </div>
                  )}

                  {/* Transport Modes */}
                  <div className="flex items-center space-x-2.5 mb-4">
                    {route.modes.map((mode, i) => (
                      <React.Fragment key={i}>
                        <div className="w-10 h-10 bg-neutral-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl shadow-sm border border-neutral-200 dark:border-gray-600">
                          {mode}
                        </div>
                        {i < route.modes.length - 1 && (
                          <div className="flex space-x-1">
                            {[0, 1, 2].map(d => <div key={d} className="w-1 h-1 bg-neutral-300 rounded-full" />)}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Crowd Bar */}
                  <div className="bg-[#F8FAFC] dark:bg-gray-700/50 rounded-xl p-3.5 mb-4 border border-neutral-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center space-x-2">
                        <Users size={14} className={crowdColors.text} />
                        <span className="text-xs font-bold text-neutral-dark dark:text-white">{route.crowdLevel}% Crowd</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${crowdColors.lightBg} ${crowdColors.text}`}>
                        Seat: {route.seatProbability}%
                      </span>
                    </div>
                    <div className="w-full flex space-x-1 h-1.5">
                      {[1,2,3,4,5,6,7,8,9,10].map(s => {
                        const isFilled = route.crowdLevel >= s * 10;
                        return <div key={s} className={`flex-1 rounded-full ${isFilled ? crowdColors.bg : 'bg-neutral-200 dark:bg-gray-600'}`} />;
                      })}
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-neutral-dark dark:text-white">{formatCurrency(route.fare)}</p>
                      <p className="text-[11px] font-medium text-neutral-medium">
                        {route.specialFeatures?.includes('First Class') ? 'First Class' : 'General'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {!compareMode && (
                        <>
                          {isExpanded ? (
                            <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setExpandedRouteId(null); }}>
                              <ChevronUp size={14} className="mr-1" /> Less
                            </Button>
                          ) : (
                            <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); setExpandedRouteId(String(route.id)); }}>
                              <ChevronDown size={14} className="mr-1" /> Details
                            </Button>
                          )}
                          <Button variant="primary" size="sm" onClick={() => handleSelectRoute(String(route.id))}>
                            <Navigation size={13} className="mr-1" /> Go
                          </Button>
                        </>
                      )}
                      {compareMode && (
                        <Button variant={isSelectedForCompare ? 'primary' : 'secondary'} size="sm"
                          onClick={e => { e.stopPropagation(); handleCompareToggle(String(route.id)); }}>
                          {isSelectedForCompare ? '✓ Selected' : 'Select'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && !compareMode && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-gray-600">
                          <p className="text-neutral-dark dark:text-gray-300 font-medium text-sm mb-3 leading-relaxed">{route.details}</p>

                          {route.specialFeatures && route.specialFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {route.specialFeatures.map((f, i) => (
                                <span key={i} className="text-[10px] bg-primary-blue/10 text-primary-blue px-2.5 py-1 rounded-md font-bold">
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}

                          {route.coachSuggestion && (
                            <div className="mb-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2.5 flex items-start gap-2">
                              <span>💡</span>
                              <p className="text-[12px] font-bold text-success-green">{route.coachSuggestion}</p>
                            </div>
                          )}

                          {/* Coach Visualizer */}
                          {route.coachData && <CoachVisualizer coaches={route.coachData} />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Route Comparison Panel */}
        <AnimatePresence>
          {compareMode && compareRoutes.length === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <div className="bg-primary-blue px-4 py-3 flex items-center gap-2">
                <GitCompare size={16} className="text-white" />
                <p className="text-white font-bold text-[14px]">Route Comparison</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-neutral-200 dark:divide-gray-700">
                {compareRoutes.map((route, i) => {
                  const crowd = getCrowdColorClasses(route.crowdLevel);
                  return (
                    <div key={route.id} className="p-4 space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-black text-neutral-dark dark:text-white">{route.time}</p>
                        <LocalTypeBadge type={route.localType} />
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { icon: '👥', label: 'Crowd', value: `${route.crowdLevel}%`, color: crowd.text },
                          { icon: '💺', label: 'Seat', value: `${route.seatProbability}%`, color: 'text-neutral-dark dark:text-white' },
                          { icon: '₹', label: 'Fare', value: formatCurrency(route.fare), color: 'text-neutral-dark dark:text-white' },
                          { icon: '🚉', label: 'Platform', value: route.platform ?? '—', color: 'text-neutral-dark dark:text-white' },
                          { icon: '⏱', label: 'Delay', value: route.delay === 0 ? 'On time' : `+${route.delay}m`, color: route.delay === 0 ? 'text-success-green' : 'text-danger-red' },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between bg-neutral-50 dark:bg-gray-700 rounded-lg px-2.5 py-1.5">
                            <span className="text-[10px] font-bold text-neutral-500">{row.icon} {row.label}</span>
                            <span className={`text-[11px] font-bold ${row.color}`}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="primary" size="sm" fullWidth onClick={() => handleSelectRoute(String(route.id))}>
                        Go with this
                      </Button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RouteResultsScreen;
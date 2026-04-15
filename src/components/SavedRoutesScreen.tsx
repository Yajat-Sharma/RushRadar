import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit, Plus, Clock, Users, Navigation, Bookmark, Trash2, BookmarkCheck } from 'lucide-react';
import { Screen } from '../App';
import { SAVED_ROUTES_INDIA } from '../data/indiaTransitData';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from './ui/Toast';
import { generateMockRoutes } from '../utils/routeGenerator';

interface SavedRoutesScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SavedRoutesScreen: React.FC<SavedRoutesScreenProps> = ({ onNavigate }) => {
  const { state, setFromLocation, setToLocation, setGeneratedRoutes, unsaveRoute } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'saved' | 'quick'>('saved');

  const userSavedRoutes = state.savedRoutes;

  const getCrowdColor = (level: number) => {
    if (level <= 30) return 'text-success-green';
    if (level <= 70) return 'text-warning-orange';
    return 'text-danger-red';
  };

  const getCrowdRingStroke = (level: number) => {
    if (level <= 30) return 'stroke-success-green';
    if (level <= 70) return 'stroke-warning-orange';
    return 'stroke-danger-red';
  };

  const handleGoRoute = (from: string, to: string) => {
    setFromLocation(from);
    setToLocation(to);
    const routes = generateMockRoutes(from, to);
    setGeneratedRoutes(routes);
    toast.info(`Finding routes: ${from} → ${to}`);
    setTimeout(() => onNavigate('routes'), 350);
  };

  const handleDeleteSaved = (id: string, name: string) => {
    unsaveRoute(id);
    toast.info(`"${name}" removed`);
  };

  const handleAddRoute = () => {
    toast.info('Search for a route to save it');
    setTimeout(() => onNavigate('home'), 550);
  };

  const QUICK_ROUTES = [
    {
      from: 'Andheri (W)', to: 'Churchgate',
      label: '🏠 → 🏢', tag: 'Morning Commute',
      crowd: 78, variant: 'warning' as const,
    },
    {
      from: 'Churchgate', to: 'Andheri (W)',
      label: '🏢 → 🏠', tag: 'Evening Return',
      crowd: 91, variant: 'danger' as const,
    },
    {
      from: 'Andheri (W)', to: 'Bandra',
      label: '🏠 → 🛍️', tag: 'Weekend Trip',
      crowd: 32, variant: 'success' as const,
    },
    {
      from: 'Andheri (W)', to: 'Mumbai Airport T1',
      label: '🏠 → ✈️', tag: 'Airport Run',
      crowd: 44, variant: 'info' as const,
    },
  ];

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-950 flex flex-col relative overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-4 pt-10 flex items-center justify-between border-b border-neutral-100 dark:border-gray-800 shadow-sm transition-colors">
        <IconButton variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft size={22} className="text-neutral-dark dark:text-white" />
        </IconButton>
        <div className="flex items-center gap-2">
          <Bookmark size={17} className="text-neutral-dark dark:text-white" />
          <h1 className="text-[17px] font-black text-neutral-dark dark:text-white tracking-tight">Saved Routes</h1>
        </div>
        <IconButton variant="secondary" size="md" onClick={handleAddRoute}>
          <Plus size={17} className="text-primary-blue" />
        </IconButton>
      </div>

      {/* Tabs */}
      <div className="absolute top-[72px] left-0 right-0 z-10 bg-[#F5F7FA] dark:bg-gray-950 px-5 py-3 border-b border-neutral-100 dark:border-gray-800 transition-colors">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'saved' ? 'bg-primary-blue text-white shadow-md' : 'bg-white dark:bg-gray-800 text-neutral-medium dark:text-gray-400 border border-neutral-200 dark:border-gray-700'}`}
          >
            My Saves ({userSavedRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'quick' ? 'bg-primary-blue text-white shadow-md' : 'bg-white dark:bg-gray-800 text-neutral-medium dark:text-gray-400 border border-neutral-200 dark:border-gray-700'}`}
          >
            Quick Access
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-36 pb-24 no-scrollbar px-5">
        <AnimatePresence mode="wait">
          {activeTab === 'saved' ? (
            <motion.div key="saved" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {userSavedRoutes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-neutral-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                    <BookmarkCheck size={36} className="text-neutral-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-black text-neutral-dark dark:text-white mb-2">No Saved Routes Yet</h3>
                  <p className="text-neutral-medium dark:text-gray-400 text-sm font-medium mb-6 max-w-xs">
                    Search for a route and tap the bookmark icon to save it for quick access.
                  </p>
                  <Button variant="primary" onClick={handleAddRoute} className="!rounded-2xl">
                    <Plus size={16} className="mr-2" /> Find & Save a Route
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {userSavedRoutes.map((saved, idx) => {
                    const crowd = saved.route.crowdLevel;
                    return (
                      <motion.div
                        key={saved.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: 0.04 * idx }}
                      >
                        <Card className="!p-4 shadow-sm relative overflow-hidden" interactive onClick={() => handleGoRoute(saved.from, saved.to)}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-3">
                              <h3 className="font-black text-neutral-dark dark:text-white text-[15px]">{saved.name}</h3>
                              <p className="text-[11px] text-neutral-medium dark:text-gray-400 font-medium mt-0.5">
                                {saved.route.time} · {saved.route.localType?.toUpperCase() ?? 'LOCAL'}
                              </p>
                              <div className="flex items-center flex-wrap gap-2 mt-3">
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${crowd > 70 ? 'bg-red-50 dark:bg-red-900/20 text-danger-red' : crowd > 40 ? 'bg-orange-50 dark:bg-orange-900/20 text-warning-orange' : 'bg-green-50 dark:bg-green-900/20 text-success-green'}`}>
                                  <Users size={10} />
                                  {crowd}% crowd
                                </div>
                                <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-gray-700 px-2 py-1 rounded-lg border border-neutral-100 dark:border-gray-600">
                                  <Clock size={10} className="text-neutral-500 dark:text-gray-400" />
                                  <span className="text-[10px] font-bold text-neutral-600 dark:text-gray-300">{saved.route.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                className="!text-[11px] !py-1.5 !px-3 !rounded-xl shadow-sm"
                                onClick={e => { e.stopPropagation(); handleGoRoute(saved.from, saved.to); }}
                              >
                                <Navigation size={11} className="mr-1" /> Go
                              </Button>
                              <button
                                onClick={e => { e.stopPropagation(); handleDeleteSaved(saved.id, saved.name); }}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <Trash2 size={14} className="text-danger-red" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="quick" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="pt-2">
              <p className="text-[11px] font-black text-neutral-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">Common Routes</p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ROUTES.map((r, i) => (
                  <Card
                    key={i}
                    className="!p-4 shadow-sm flex flex-col justify-between !border-neutral-100 dark:!border-gray-700 cursor-pointer"
                    interactive
                    onClick={() => handleGoRoute(r.from, r.to)}
                  >
                    <p className="text-2xl mb-2">{r.label}</p>
                    <div>
                      <p className="font-black text-neutral-dark dark:text-white text-sm leading-tight mb-1.5">{r.tag}</p>
                      <p className="text-[10px] font-medium text-neutral-medium dark:text-gray-400 mb-2 truncate">{r.from} → {r.to}</p>
                      <div className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full w-fit ${r.crowd > 70 ? 'bg-red-50 dark:bg-red-900/20 text-danger-red' : r.crowd > 40 ? 'bg-orange-50 dark:bg-orange-900/20 text-warning-orange' : 'bg-green-50 dark:bg-green-900/20 text-success-green'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${r.crowd > 70 ? 'bg-danger-red' : r.crowd > 40 ? 'bg-warning-orange' : 'bg-success-green'}`} />
                        {r.crowd}% now
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Static saved routes list */}
              <p className="text-[11px] font-black text-neutral-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1 mt-5">Frequent Routes</p>
              <div className="space-y-3">
                {SAVED_ROUTES_INDIA.map((route, idx) => (
                  <motion.div key={route.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
                    <Card className="!p-4 shadow-sm relative overflow-hidden" interactive onClick={() => handleGoRoute(route.from, route.to)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <h3 className="font-black text-neutral-dark dark:text-white text-[15px]">{route.name}</h3>
                          <p className="text-neutral-medium dark:text-gray-400 text-[11px] font-medium mt-0.5">
                            {route.from} <span className="mx-1 opacity-50">→</span> {route.to}
                          </p>
                          <div className="flex items-center flex-wrap gap-2 mt-3">
                            <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-gray-700/60 px-2 py-1 rounded-lg border border-neutral-100 dark:border-gray-700">
                              <Clock size={10} className="text-neutral-500 dark:text-gray-400" />
                              <span className="text-[10px] font-bold text-neutral-600 dark:text-gray-300">{route.avgTime} avg</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-gray-700/60 px-2 py-1 rounded-lg border border-neutral-100 dark:border-gray-700">
                              <Users size={10} className="text-neutral-500 dark:text-gray-400" />
                              <span className="text-[10px] font-bold text-neutral-600 dark:text-gray-300">{route.currentCrowd}% now</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 pt-1">
                          <div className="relative w-10 h-10">
                            <svg className="w-10 h-10 transform -rotate-90">
                              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3.5" fill="none" className="text-neutral-200 dark:text-gray-700" />
                              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3.5" fill="none"
                                strokeDasharray={`${(route.currentCrowd / 100) * 100.5} ${100.5 - (route.currentCrowd / 100) * 100.5}`}
                                strokeLinecap="round"
                                className={getCrowdRingStroke(route.currentCrowd)}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-[10px] font-black ${getCrowdColor(route.currentCrowd)}`}>{route.currentCrowd}%</span>
                            </div>
                          </div>
                          <Button variant="primary" size="sm" className="!text-[11px] !py-1.5 !px-3 shadow-sm !rounded-xl"
                            onClick={e => { e.stopPropagation(); handleGoRoute(route.from, route.to); }}>
                            <Navigation size={11} className="mr-1" /> Go
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedRoutesScreen;
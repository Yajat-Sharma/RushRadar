import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Plus, Clock, Users, Navigation, Bookmark } from 'lucide-react';
import { Screen } from '../App';
import { SAVED_ROUTES_INDIA } from '../data/indiaTransitData';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from './ui/Toast';

interface SavedRoutesScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SavedRoutesScreen: React.FC<SavedRoutesScreenProps> = ({ onNavigate }) => {
  const { setFromLocation, setToLocation, setGeneratedRoutes } = useAppContext();
  const { toast } = useToast();
  const [savedRoutes] = useState(SAVED_ROUTES_INDIA);

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

  const handleGoRoute = (route: typeof SAVED_ROUTES_INDIA[0]) => {
    setFromLocation(route.from);
    setToLocation(route.to);
    setGeneratedRoutes([]);
    toast.info(`Loading: ${route.from} → ${route.to}`);
    setTimeout(() => onNavigate('home'), 350);
  };

  const handleAddRoute = () => {
    toast.info('Search for a route to save it');
    setTimeout(() => onNavigate('home'), 550);
  };

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
        <IconButton variant="secondary" size="md" onClick={() => toast.info('Edit mode coming soon')}>
          <Edit size={17} className="text-primary-blue" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-y-auto pt-24 pb-24 no-scrollbar">
        {/* Quick Access */}
        <div className="px-5 mb-5">
          <h2 className="text-[11px] font-black text-neutral-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                from: 'Andheri (W)', to: 'Churchgate',
                homeEmoji: '🏠', workEmoji: '🏢',
                crowd: 78, crowdLabel: 'Moderate', crowdColor: 'text-warning-orange',
                badge: <Badge variant="neutral" size="sm">Ladies Coach Open</Badge>,
              },
              {
                from: 'Churchgate', to: 'Andheri (W)',
                homeEmoji: '🏢', workEmoji: '🏠',
                crowd: 92, crowdLabel: 'Peak', crowdColor: 'text-danger-red',
                badge: <Badge variant="warning" size="sm">First Class Rec.</Badge>,
              },
            ].map((r, i) => (
              <Card
                key={i}
                className="!p-4 shadow-sm flex flex-col justify-between !border-neutral-100 dark:!border-gray-700"
                interactive
                onClick={() => {
                  setFromLocation(r.from);
                  setToLocation(r.to);
                  setGeneratedRoutes([]);
                  toast.info(`Opening: ${r.from} → ${r.to}`);
                  setTimeout(() => onNavigate('home'), 350);
                }}
              >
                <div className="flex items-center space-x-1.5 mb-3 opacity-80">
                  <span className="text-lg">{r.homeEmoji}</span>
                  <span className="text-xs font-bold text-neutral-300 dark:text-gray-500">→</span>
                  <span className="text-lg">{r.workEmoji}</span>
                </div>
                <div>
                  <p className="font-black text-neutral-dark dark:text-white text-sm leading-tight mb-1.5">
                    {r.from}<br />to {r.to}
                  </p>
                  <div className={`flex items-center space-x-1 mb-2`}>
                    <div className={`w-2 h-2 rounded-full ${r.crowd > 70 ? 'bg-danger-red' : 'bg-warning-orange'}`} />
                    <p className={`text-[10px] font-bold ${r.crowdColor}`}>{r.crowdLabel} ({r.crowd}%)</p>
                  </div>
                  {r.badge}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Saved Routes List */}
        <div className="px-5">
          <h2 className="text-[11px] font-black text-neutral-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">All Saved Routes</h2>
          <div className="space-y-3">
            {savedRoutes.map((route, idx) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <Card className="!p-4 shadow-sm relative overflow-hidden" interactive onClick={() => handleGoRoute(route)}>
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
                          <span className="text-[10px] font-bold text-neutral-600 dark:text-gray-300">{route.avgCrowd}% avg</span>
                        </div>
                      </div>
                      {route.specialFeatures && route.specialFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {route.specialFeatures.map((feature, i) => (
                            <span key={i} className="text-[9px] uppercase tracking-wider font-black bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-blue-300 px-1.5 py-0.5 rounded-md">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-between space-y-3 pt-1">
                      <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 transform -rotate-90">
                          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3.5" fill="none" className="text-neutral-200 dark:text-gray-700" />
                          <circle
                            cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3.5" fill="none"
                            strokeDasharray={`${(route.currentCrowd / 100) * 100.5} ${100.5 - (route.currentCrowd / 100) * 100.5}`}
                            strokeLinecap="round"
                            className={getCrowdRingColor(route.currentCrowd)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-[10px] font-black ${getCrowdColor(route.currentCrowd)}`}>
                            {route.currentCrowd}%
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="!text-[11px] !py-1.5 !px-3 shadow-sm !rounded-xl"
                        onClick={(e) => { e.stopPropagation(); handleGoRoute(route); }}
                      >
                        <Navigation size={11} className="mr-1" /> Go
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Route FAB */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleAddRoute}
        className="absolute bottom-28 right-5 w-14 h-14 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-2xl shadow-xl flex items-center justify-center z-30"
      >
        <Plus size={24} className="text-white" />
      </motion.button>
    </div>
  );
};

export default SavedRoutesScreen;
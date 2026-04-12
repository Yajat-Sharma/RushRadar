import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Plus, Clock, Users } from 'lucide-react';
import { Screen } from '../App';
import { SAVED_ROUTES_INDIA } from '../data/indiaTransitData';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface SavedRoutesScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SavedRoutesScreen: React.FC<SavedRoutesScreenProps> = ({ onNavigate }) => {
  const savedRoutes = SAVED_ROUTES_INDIA;

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

  return (
    <div className="h-full bg-[#F5F7FA] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 pt-10 flex items-center justify-between border-b border-white/40">
        <IconButton variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft size={22} className="text-neutral-dark" />
        </IconButton>
        <h1 className="text-[17px] font-bold text-neutral-dark tracking-tight">Saved Routes</h1>
        <IconButton variant="secondary" size="md">
          <Edit size={18} className="text-primary-blue" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-y-auto pt-24 pb-24 no-scrollbar">
        {/* Quick Access */}
        <div className="px-5 mb-6">
          <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3 ml-1">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="!p-4 bg-white/80 shadow-sm border border-neutral-100 flex flex-col justify-between" interactive>
              <div className="flex items-center space-x-1.5 mb-3 opacity-80">
                <span className="text-lg">🏠</span>
                <span className="text-xs font-bold text-neutral-300">→</span>
                <span className="text-lg">🏢</span>
              </div>
              <div>
                <p className="font-bold text-neutral-dark text-sm leading-tight mb-1">Andheri <br/>to Churchgate</p>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="w-2 h-2 rounded-full bg-warning-orange"></div>
                  <p className="text-warning-orange text-[10px] font-bold">78% crowded</p>
                </div>
                <Badge variant="neutral" size="sm">Ladies Coach Open</Badge>
              </div>
            </Card>

            <Card className="!p-4 bg-white/80 shadow-sm border border-neutral-100 flex flex-col justify-between" interactive>
              <div className="flex items-center space-x-1.5 mb-3 opacity-80">
                <span className="text-lg">🏢</span>
                <span className="text-xs font-bold text-neutral-300">→</span>
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <p className="font-bold text-neutral-dark text-sm leading-tight mb-1">Churchgate <br/>to Andheri</p>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="w-2 h-2 rounded-full bg-danger-red"></div>
                  <p className="text-danger-red text-[10px] font-bold">Peak (92%)</p>
                </div>
                <Badge variant="warning" size="sm">First Class Rec.</Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Saved Routes List */}
        <div className="px-5">
          <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3 ml-1">All Saved Routes</h2>
          <div className="space-y-4">
            {savedRoutes.map((route) => (
              <Card key={route.id} className="!p-4 border border-neutral-100 shadow-sm relative overflow-hidden" interactive>
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h3 className="font-black text-neutral-dark text-[15px]">{route.name}</h3>
                    <p className="text-neutral-medium text-[11px] font-medium mt-0.5">{route.from} <span className="mx-1">→</span> {route.to}</p>
                    
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
                        <Clock size={10} className="text-neutral-500" />
                        <span className="text-[10px] font-bold text-neutral-600">{route.avgTime} avg</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
                        <Users size={10} className="text-neutral-500" />
                        <span className="text-[10px] font-bold text-neutral-600">{route.avgCrowd}% avg crowd</span>
                      </div>
                    </div>
                    
                    {/* Indian-specific features */}
                    {route.specialFeatures && route.specialFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {route.specialFeatures.map((feature, i) => (
                          <span key={i} className="text-[9px] uppercase tracking-wider font-bold bg-primary-blue/10 text-primary-blue-dark px-1.5 py-0.5 rounded-[4px]">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-between space-y-3 pt-1">
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle cx="20" cy="20" r="16" stroke="#F3F4F6" strokeWidth="4" fill="none" />
                        <circle
                          cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="none"
                          strokeDasharray={`${route.currentCrowd * 1.0} ${100 - route.currentCrowd * 1.0}`}
                          strokeLinecap="round"
                          className={getCrowdRingColor(route.currentCrowd)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-[10px] font-bold ${getCrowdColor(route.currentCrowd)}`}>
                          {route.currentCrowd}%
                        </span>
                      </div>
                    </div>

                    <Button variant="primary" size="sm" className="w-full text-[11px] py-1 shadow-sm">
                      Go
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add Route FAB */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-28 right-5 w-14 h-14 bg-neutral-dark rounded-2xl shadow-xl flex items-center justify-center z-30"
      >
        <Plus size={24} className="text-white" />
      </motion.button>
    </div>
  );
};

export default SavedRoutesScreen;
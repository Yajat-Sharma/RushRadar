import React from 'react';
import { ArrowLeft, TrendingUp, Clock, Target, Calendar } from 'lucide-react';
import { Screen } from '../App';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';

interface AnalyticsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full bg-[#F5F7FA] flex flex-col relative overflow-hidden">
      {/* Dynamic Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 pt-10 flex items-center justify-between">
        <IconButton variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft size={22} className="text-neutral-dark" />
        </IconButton>
        <h1 className="text-[17px] font-bold text-neutral-dark tracking-tight">Crowd Analytics</h1>
        <IconButton variant="secondary" size="md">
          <Calendar size={18} className="text-neutral-dark" />
        </IconButton>
      </div>
      
      <div className="flex-1 p-5 pt-24 pb-24 overflow-y-auto no-scrollbar">
        <Card className="mb-5 bg-gradient-to-br from-primary-blue to-primary-blue-dark border-none shadow-md overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-lg font-bold text-white mb-4 relative z-10">Today's Forecast</h2>
          <div className="h-44 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 relative z-10">
            <div className="flex flex-col items-center">
              <TrendingUp size={32} className="text-white opacity-80 mb-2" />
              <p className="text-white/90 font-medium text-sm">Interactive Prediction Chart</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <Card className="shadow-sm border border-neutral-100 flex flex-col items-start pt-5">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-3">
              <Clock className="text-warning-orange" size={20} />
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Peak Hours</span>
            <p className="text-[22px] font-black text-neutral-dark tracking-tight">8-9 AM</p>
            <div className="mt-2 bg-red-50 text-danger-red px-2 py-0.5 rounded text-[10px] font-bold">
              +15% vs last week
            </div>
          </Card>

          <Card className="shadow-sm border border-neutral-100 flex flex-col items-start pt-5">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
              <Target className="text-success-green" size={20} />
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Best Time</span>
            <p className="text-[22px] font-black text-neutral-dark tracking-tight">2:30 PM</p>
            <div className="mt-2 bg-green-50 text-success-green px-2 py-0.5 rounded text-[10px] font-bold">
              67% less crowded
            </div>
          </Card>
        </div>

        <Card className="shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center">
                <TrendingUp className="text-primary-blue" size={16} />
              </div>
              <span className="font-bold text-neutral-dark text-[15px]">Smart Recommendations</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-xl mr-3 mt-0.5 opacity-80">🏃</span>
              <div>
                <p className="text-sm font-bold text-neutral-dark">Leave 15 mins earlier</p>
                <p className="text-[11px] font-medium text-neutral-medium mt-0.5">Beat the 8:30 AM rush hour spike</p>
              </div>
            </div>
            <div className="flex items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-xl mr-3 mt-0.5 opacity-80">🗺️</span>
              <div>
                <p className="text-sm font-bold text-neutral-dark">Consider Alternative Route</p>
                <p className="text-[11px] font-medium text-neutral-medium mt-0.5">Western line is 23% less crowded today</p>
              </div>
            </div>
            <div className="flex items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              <span className="text-xl mr-3 mt-0.5 opacity-80">📊</span>
              <div>
                <p className="text-sm font-bold text-neutral-dark">Weekly Trend Alert</p>
                <p className="text-[11px] font-medium text-neutral-medium mt-0.5">Tuesdays are 30% busier than Mondays</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
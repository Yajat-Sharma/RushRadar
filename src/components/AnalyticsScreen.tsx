import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Clock, Target, Calendar, Flame, Zap, Users } from 'lucide-react';
import { Screen } from '../App';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';

interface AnalyticsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WEEKLY_DATA = [
  { day: 'Mon', crowd: 82, time: 45, delay: 4 },
  { day: 'Tue', crowd: 88, time: 51, delay: 7 },
  { day: 'Wed', crowd: 74, time: 42, delay: 0 },
  { day: 'Thu', crowd: 79, time: 44, delay: 2 },
  { day: 'Fri', crowd: 92, time: 58, delay: 11 },
  { day: 'Sat', crowd: 35, time: 30, delay: 0 },
  { day: 'Sun', crowd: 22, time: 27, delay: 0 },
];

const HEATMAP = [
  [20, 35, 78, 90, 85, 40, 18],
  [22, 30, 82, 92, 88, 38, 15],
  [18, 28, 75, 86, 80, 42, 20],
  [15, 25, 70, 80, 75, 35, 16],
];
const HEATMAP_HOURS = ['6AM', '8AM', '10AM', '12PM', '2PM', '5PM', '8PM'];
const HEATMAP_LABELS = ['Mon', 'Wed', 'Fri', 'Sun'];

const getCrowdHeatColor = (v: number) => {
  if (v < 30) return 'bg-green-200';
  if (v < 55) return 'bg-yellow-200';
  if (v < 75) return 'bg-orange-300';
  return 'bg-red-400';
};

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');
  const maxCrowd = Math.max(...WEEKLY_DATA.map(d => d.crowd));
  const avgCrowd = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.crowd, 0) / WEEKLY_DATA.length);
  const avgDelay = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.delay, 0) / WEEKLY_DATA.length);

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-5 py-4 pt-10 flex items-center justify-between border-b border-neutral-100 dark:border-gray-700">
        <IconButton variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft size={22} className="text-neutral-dark dark:text-white" />
        </IconButton>
        <h1 className="text-[17px] font-bold text-neutral-dark dark:text-white tracking-tight">Crowd Analytics</h1>
        <div className="flex bg-neutral-100 dark:bg-gray-700 rounded-xl p-0.5">
          {(['week', 'month'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors capitalize ${activeTab === t ? 'bg-white dark:bg-gray-600 text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-medium'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-5 pt-24 pb-24 overflow-y-auto no-scrollbar space-y-5">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: 'Avg Crowd', value: `${avgCrowd}%`, sub: 'This week', color: 'text-warning-orange', iconBg: 'bg-orange-50' },
            { icon: Clock, label: 'Avg Delay', value: `${avgDelay}m`, sub: 'Per trip', color: 'text-danger-red', iconBg: 'bg-red-50' },
            { icon: Flame, label: 'Streak', value: '5 days', sub: 'Smart commutes', color: 'text-primary-blue', iconBg: 'bg-blue-50' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="!p-3 border border-neutral-100 dark:border-gray-700 dark:bg-gray-800 shadow-sm flex flex-col items-start">
                <div className={`w-8 h-8 ${stat.iconBg} rounded-xl flex items-center justify-center mb-2`}>
                  <Icon size={15} className={stat.color} />
                </div>
                <p className="text-[18px] font-black text-neutral-dark dark:text-white tracking-tight leading-none">{stat.value}</p>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Weekly Crowd Bar Chart */}
        <Card className="border border-neutral-100 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-dark dark:text-white text-[15px]">Weekly Crowd Levels</h3>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">% capacity</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {WEEKLY_DATA.map((d) => {
              const heightPct = (d.crowd / maxCrowd) * 100;
              const isWeekend = d.day === 'Sat' || d.day === 'Sun';
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-bold text-neutral-500">{d.crowd}%</span>
                  <div className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${heightPct}%`,
                      background: isWeekend
                        ? 'linear-gradient(to top, #10B981, #6EE7B7)'
                        : d.crowd > 80
                        ? 'linear-gradient(to top, #F05252, #FC8181)'
                        : 'linear-gradient(to top, #1A56DB, #3F83F8)'
                    }}
                  />
                  <span className="text-[9px] font-bold text-neutral-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Peak Time Heatmap */}
        <Card className="border border-neutral-100 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <h3 className="font-bold text-neutral-dark dark:text-white text-[15px] mb-1">Crowd Heatmap</h3>
          <p className="text-[11px] text-neutral-500 mb-3">By day & time of week</p>
          <div className="flex gap-1.5">
            <div className="flex flex-col gap-1.5 justify-end">
              {HEATMAP_LABELS.map(l => (
                <div key={l} className="h-7 flex items-center">
                  <span className="text-[9px] font-bold text-neutral-400 w-7">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-1 mb-1">
                {HEATMAP_HOURS.map(h => (
                  <div key={h} className="flex-1 text-center">
                    <span className="text-[8px] font-bold text-neutral-400">{h}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {HEATMAP.map((row, ri) => (
                  <div key={ri} className="flex gap-1">
                    {row.map((val, ci) => (
                      <div key={ci} className={`flex-1 h-7 rounded-md ${getCrowdHeatColor(val)} flex items-center justify-center`}>
                        <span className="text-[8px] font-bold text-white/80">{val}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {[
              { color: 'bg-green-200', label: 'Low' },
              { color: 'bg-yellow-200', label: 'Med' },
              { color: 'bg-orange-300', label: 'High' },
              { color: 'bg-red-400', label: 'Peak' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                <span className="text-[9px] font-bold text-neutral-400">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Peak Hours + Best Time */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm border border-neutral-100 dark:border-gray-700 dark:bg-gray-800 flex flex-col items-start pt-4">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-3">
              <Clock className="text-warning-orange" size={20} />
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Peak Hours</span>
            <p className="text-[20px] font-black text-neutral-dark dark:text-white tracking-tight">8–9 AM</p>
            <div className="mt-2 bg-red-50 text-danger-red px-2 py-0.5 rounded text-[10px] font-bold">+15% vs last week</div>
          </Card>
          <Card className="shadow-sm border border-neutral-100 dark:border-gray-700 dark:bg-gray-800 flex flex-col items-start pt-4">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
              <Target className="text-success-green" size={20} />
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Best Time</span>
            <p className="text-[20px] font-black text-neutral-dark dark:text-white tracking-tight">2:30 PM</p>
            <div className="mt-2 bg-green-50 text-success-green px-2 py-0.5 rounded text-[10px] font-bold">67% less crowded</div>
          </Card>
        </div>

        {/* Weekly Delay Trend */}
        <Card className="border border-neutral-100 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-danger-red" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-dark dark:text-white text-[14px]">Delay Tracker</h3>
              <p className="text-[10px] text-neutral-500">Average minutes late per day</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-16">
            {WEEKLY_DATA.map(d => {
              const h = d.delay === 0 ? 4 : (d.delay / 12) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t" style={{ height: `${h}%`, minHeight: '4px', background: d.delay === 0 ? '#D1FAE5' : d.delay > 6 ? '#FCA5A5' : '#FED7AA' }} />
                  <span className="text-[8px] font-bold text-neutral-500">{d.delay === 0 ? '✓' : `${d.delay}m`}</span>
                  <span className="text-[8px] font-bold text-neutral-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Smart Recommendations */}
        <Card className="shadow-sm border border-neutral-100 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center">
              <TrendingUp className="text-primary-blue" size={16} />
            </div>
            <span className="font-bold text-neutral-dark dark:text-white text-[15px]">Smart Recommendations</span>
          </div>
          <div className="space-y-3">
            {[
              { emoji: '🏃', title: 'Leave 15 mins earlier', desc: 'Beat the 8:30 AM rush hour spike on Fridays' },
              { emoji: '🗺️', title: 'Harbour Line on Tuesdays', desc: 'Western Line is 23% more crowded on Tuesdays' },
              { emoji: '📊', title: 'Weekend travel sweet spot', desc: 'Trains run at 22% capacity on Sunday mornings' },
            ].map(r => (
              <div key={r.title} className="flex items-start bg-neutral-50 dark:bg-gray-700 p-3 rounded-xl border border-neutral-100 dark:border-gray-600">
                <span className="text-xl mr-3 mt-0.5">{r.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-neutral-dark dark:text-white">{r.title}</p>
                  <p className="text-[11px] font-medium text-neutral-medium mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AnalyticsScreen;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Info, Route, Wrench, CheckCircle2, Bell, X, ExternalLink } from 'lucide-react';
import { Screen } from '../App';
import { INDIA_NOTIFICATIONS } from '../data/indiaTransitData';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from './ui/Toast';

interface NotificationsScreenProps {
  onNavigate: (screen: Screen) => void;
}

// Extra detail content for each notification (for the detail modal)
const NOTIFICATION_DETAIL: Record<number, { body: string; impact: string; tip: string }> = {
  1: {
    body: 'The Western Line Fast Locals are currently running at 95% capacity between Andheri and Dadar. This is 12% higher than yesterday\'s peak.',
    impact: '🕐 Expected to persist until 10:30 AM. Consider delaying your trip by 30–45 minutes.',
    tip: '💡 Ladies Coach (Coach 1 & 12) is only at 58% capacity — the best option right now.',
  },
  2: {
    body: 'The Harbour Line slow locals via Kurla–Wadala are running at 42% capacity, significantly less crowded than Western Line alternatives.',
    impact: '⏱ Add 8 minutes to your journey but travel in comfort with a guaranteed seat.',
    tip: '💡 Coaches 6–9 on Harbour Line tend to be the least crowded at this time of day.',
  },
  3: {
    body: 'IMD has issued a heavy rain warning for Mumbai and suburbs between 4 PM and 8 PM today. Waterlogging is expected at Sion and Kurla.',
    impact: '🌧 Local trains may run 10–20 minutes late. BEST buses may face diversions.',
    tip: '💡 Plan to leave office by 3:30 PM to beat the rush, or consider work-from-home.',
  },
  4: {
    body: 'Due to track maintenance work, the Churchgate Fast Local will now depart from Platform 3 instead of the regular Platform 1. This change is in effect until further notice.',
    impact: '🚉 Allow extra 3 minutes to change platforms. Signage has been updated.',
    tip: '💡 The platform change does NOT affect train schedules — only the boarding platform.',
  },
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  const { clearNotificationCount } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(INDIA_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = useState<typeof INDIA_NOTIFICATIONS[0] | null>(null);

  const tabs = ['All', 'Alerts', 'Updates', 'Routes'];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Alerts') return n.type === 'alert';
    if (activeTab === 'Updates') return n.type === 'info' || n.type === 'system';
    if (activeTab === 'Routes') return n.type === 'route';
    return true;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    clearNotificationCount();
  };

  const handleDismiss = (id: number | string) => {
    setNotifications(prev => prev.filter(n => String(n.id) !== String(id)));
    setSelectedNotif(null);
    toast.info('Notification dismissed');
  };

  const handlePrimaryAction = (action: string) => {
    setSelectedNotif(null);
    if (action.toLowerCase().includes('route') || action.toLowerCase().includes('view') || action.toLowerCase().includes('alternative')) {
      toast.info('Finding alternative routes…');
      setTimeout(() => onNavigate('routes'), 600);
    } else if (action.toLowerCase().includes('map') || action.toLowerCase().includes('live') || action.toLowerCase().includes('track')) {
      toast.info('Opening live map…');
      setTimeout(() => onNavigate('map'), 600);
    } else if (action.toLowerCase().includes('plan')) {
      onNavigate('home');
    } else {
      toast.success(`✅ ${action}`);
    }
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'alert': return { Icon: AlertTriangle, bg: 'bg-red-50 dark:bg-red-900/25', text: 'text-danger-red dark:text-red-400', border: 'border-red-100 dark:border-red-800/40' };
      case 'route': return { Icon: Route, bg: 'bg-blue-50 dark:bg-blue-900/25', text: 'text-primary-blue dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800/40' };
      case 'info': return { Icon: Info, bg: 'bg-orange-50 dark:bg-orange-900/25', text: 'text-warning-orange dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800/40' };
      case 'system': return { Icon: Wrench, bg: 'bg-neutral-100 dark:bg-gray-800', text: 'text-neutral-500 dark:text-gray-400', border: 'border-neutral-200 dark:border-gray-700' };
      default: return { Icon: Info, bg: 'bg-neutral-100 dark:bg-gray-800', text: 'text-neutral-500 dark:text-gray-400', border: 'border-neutral-200 dark:border-gray-700' };
    }
  };

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-950 flex flex-col relative overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-4 pt-10 flex items-center justify-between border-b border-neutral-100 dark:border-gray-800 shadow-sm transition-colors">
        <IconButton variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft size={22} className="text-neutral-dark dark:text-white" />
        </IconButton>
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-neutral-dark dark:text-white" />
          <h1 className="text-[17px] font-black text-neutral-dark dark:text-white tracking-tight">Notifications</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Tabs */}
      <div className="absolute top-[72px] left-0 right-0 z-10 bg-[#F5F7FA] dark:bg-gray-950 px-4 py-3 border-b border-neutral-100 dark:border-gray-800 transition-colors">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === 'All' ? notifications.length : notifications.filter(n => {
              if (tab === 'Alerts') return n.type === 'alert';
              if (tab === 'Updates') return n.type === 'info' || n.type === 'system';
              if (tab === 'Routes') return n.type === 'route';
              return false;
            }).length;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                  isActive ? 'bg-primary-blue text-white shadow-md' : 'bg-white dark:bg-gray-800 text-neutral-medium dark:text-gray-400 border border-neutral-200 dark:border-gray-700'
                }`}
              >
                {tab}{count > 0 && <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'opacity-60'}`}>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-36 pb-24 px-4 space-y-3 no-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <CheckCircle2 size={44} className="text-neutral-400 dark:text-gray-600 mb-3" />
            <p className="text-sm font-black text-neutral-400 dark:text-gray-600 uppercase tracking-widest">All clear</p>
            <p className="text-xs font-medium text-neutral-400 dark:text-gray-600 mt-1">No notifications here</p>
          </div>
        ) : (
          filteredNotifications.map((notification, idx) => {
            const { Icon, bg, text, border } = getIconConfig(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx }}
              >
                <Card
                  className="!p-4 border-none shadow-sm relative overflow-hidden cursor-pointer"
                  interactive
                  onClick={() => setSelectedNotif(notification)}
                >
                  <div className="flex space-x-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                      <Icon size={18} className={text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h3 className="font-black text-neutral-dark dark:text-white text-[14px] leading-tight flex-1">{notification.title}</h3>
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-gray-500 shrink-0 mt-0.5">{notification.timestamp}</span>
                      </div>
                      <p className="text-neutral-medium dark:text-gray-400 text-[12px] mb-2 leading-snug">{notification.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary-blue dark:text-blue-400 flex items-center gap-1">
                          <ExternalLink size={9} /> Tap for details
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}

        {filteredNotifications.length > 0 && (
          <div className="flex flex-col items-center justify-center py-6 opacity-40">
            <CheckCircle2 size={28} className="text-neutral-400 dark:text-gray-600 mb-2" />
            <p className="text-xs font-black text-neutral-400 dark:text-gray-600 uppercase tracking-widest">You're all caught up</p>
          </div>
        )}
      </div>

      {/* ─── Notification Detail Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedNotif && (() => {
          const { Icon, bg, text, border } = getIconConfig(selectedNotif.type);
          const detail = NOTIFICATION_DETAIL[selectedNotif.id as number];
          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNotif(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[28px] z-50 border-t border-neutral-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-neutral-200 dark:bg-gray-700 rounded-full" />
                </div>

                <div className="px-5 pb-8 pt-2">
                  {/* Icon + title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                      <Icon size={22} className={text} />
                    </div>
                    <div>
                      <h2 className="text-[17px] font-black text-neutral-900 dark:text-white leading-snug">{selectedNotif.title}</h2>
                      <p className="text-[11px] text-neutral-400 dark:text-gray-500 font-bold mt-0.5">{selectedNotif.timestamp}</p>
                    </div>
                    <button
                      onClick={() => setSelectedNotif(null)}
                      className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-gray-800"
                    >
                      <X size={15} className="text-neutral-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Body */}
                  <p className="text-neutral-700 dark:text-gray-300 text-[14px] font-medium leading-relaxed mb-4">
                    {selectedNotif.description}
                  </p>

                  {detail && (
                    <div className="space-y-3 mb-5">
                      <div className="bg-neutral-50 dark:bg-gray-800 rounded-2xl p-4 border border-neutral-100 dark:border-gray-700">
                        <p className="text-[13px] font-semibold text-neutral-700 dark:text-gray-300 leading-relaxed">{detail.body}</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-3.5 border border-orange-100 dark:border-orange-800/40">
                        <p className="text-[12px] font-bold text-orange-800 dark:text-orange-300 leading-relaxed">{detail.impact}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3.5 border border-blue-100 dark:border-blue-800/40">
                        <p className="text-[12px] font-bold text-primary-blue dark:text-blue-300 leading-relaxed">{detail.tip}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2.5">
                    {selectedNotif.actions?.map((action, idx) => (
                      <Button
                        key={action}
                        variant={idx === 0 ? 'primary' : 'secondary'}
                        size="md"
                        className="flex-1 !rounded-2xl"
                        onClick={() => idx === 0 ? handlePrimaryAction(action) : handleDismiss(selectedNotif.id)}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsScreen;
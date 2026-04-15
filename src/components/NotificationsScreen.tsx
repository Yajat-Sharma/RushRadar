import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Info, Route, Wrench, CheckCircle2, Bell } from 'lucide-react';
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

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  const { clearNotificationCount } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(INDIA_NOTIFICATIONS);

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
    toast.info('Notification dismissed');
  };

  const handlePrimaryAction = (action: string) => {
    if (action.toLowerCase().includes('route') || action.toLowerCase().includes('view')) {
      onNavigate('routes');
    } else if (action.toLowerCase().includes('map') || action.toLowerCase().includes('live')) {
      onNavigate('map');
    } else {
      toast.info(`Action: ${action}`);
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
                  isActive
                    ? 'bg-primary-blue text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-neutral-medium dark:text-gray-400 border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'opacity-60'}`}>{count}</span>
                )}
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
            const getIconConfig = (type: string) => {
              switch (type) {
                case 'alert': return { Icon: AlertTriangle, bg: 'bg-red-50 dark:bg-red-900/25', text: 'text-danger-red dark:text-red-400', border: 'border-red-100 dark:border-red-800/40' };
                case 'route': return { Icon: Route, bg: 'bg-blue-50 dark:bg-blue-900/25', text: 'text-primary-blue dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800/40' };
                case 'info': return { Icon: Info, bg: 'bg-orange-50 dark:bg-orange-900/25', text: 'text-warning-orange dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800/40' };
                case 'system': return { Icon: Wrench, bg: 'bg-neutral-100 dark:bg-gray-800', text: 'text-neutral-500 dark:text-gray-400', border: 'border-neutral-200 dark:border-gray-700' };
                default: return { Icon: Info, bg: 'bg-neutral-100 dark:bg-gray-800', text: 'text-neutral-500 dark:text-gray-400', border: 'border-neutral-200 dark:border-gray-700' };
              }
            };

            const { Icon, bg, text, border } = getIconConfig(notification.type);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx }}
              >
                <Card className="!p-4 border-none shadow-sm relative overflow-hidden">
                  <div className="flex space-x-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                      <Icon size={18} className={text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h3 className="font-black text-neutral-dark dark:text-white text-[14px] leading-tight flex-1">{notification.title}</h3>
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-gray-500 shrink-0 mt-0.5">{notification.timestamp}</span>
                      </div>
                      <p className="text-neutral-medium dark:text-gray-400 text-[12px] mb-3 leading-snug">{notification.description}</p>

                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2 pt-2 border-t border-neutral-100 dark:border-gray-700">
                          {notification.actions.map((action, index) => (
                            <Button
                              key={action}
                              variant={index === 0 ? 'primary' : 'secondary'}
                              size="sm"
                              className={`text-[11px] !py-1.5 !px-3 shadow-none !rounded-xl ${index !== 0 ? '!text-neutral-600 dark:!text-gray-300' : ''}`}
                              onClick={() => index === 0 ? handlePrimaryAction(action) : handleDismiss(notification.id)}
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
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
    </div>
  );
};

export default NotificationsScreen;
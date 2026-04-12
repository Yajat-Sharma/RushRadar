import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Info, Route, Wrench, CheckCircle2 } from 'lucide-react';
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
    toast.success('Notification dismissed');
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
    <div className="h-full bg-[#F5F7FA] flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 pt-10 flex items-center justify-between border-b border-white/40 shadow-sm">
        <IconButton variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft size={22} className="text-neutral-dark" />
        </IconButton>
        <h1 className="text-[17px] font-bold text-neutral-dark tracking-tight">Notifications</h1>
        <IconButton variant="secondary" size="md" onClick={() => onNavigate('profile')}>
          <AlertTriangle size={18} className="text-neutral-dark" />
        </IconButton>
      </div>

      {/* Tabs */}
      <div className="absolute top-20 left-0 right-0 z-10 bg-[#F5F7FA] px-2 py-3 border-b border-neutral-100 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar px-3">
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
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-neutral-dark text-white shadow-md'
                    : 'bg-white text-neutral-medium border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {tab} {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-36 pb-24 px-4 space-y-4 no-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 opacity-50">
            <CheckCircle2 size={40} className="text-neutral-400 mb-3" />
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Nothing here</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const getIconConfig = (type: string) => {
              switch (type) {
                case 'alert': return { Icon: AlertTriangle, bg: 'bg-red-50', text: 'text-danger-red', border: 'border-red-100' };
                case 'route': return { Icon: Route, bg: 'bg-blue-50', text: 'text-primary-blue', border: 'border-blue-100' };
                case 'info': return { Icon: Info, bg: 'bg-orange-50', text: 'text-warning-orange', border: 'border-orange-100' };
                case 'system': return { Icon: Wrench, bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200' };
                default: return { Icon: Info, bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200' };
              }
            };

            const { Icon, bg, text, border } = getIconConfig(notification.type);

            return (
              <Card key={notification.id} className="!p-4 border-none shadow-sm relative overflow-hidden">
                <div className="flex space-x-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                    <Icon size={20} className={text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <h3 className="font-bold text-neutral-dark text-[14px] leading-tight flex-1">{notification.title}</h3>
                      <span className="text-[10px] font-bold text-neutral-400 shrink-0 mt-0.5">{notification.timestamp}</span>
                    </div>
                    <p className="text-neutral-medium text-[13px] mb-3 leading-snug">{notification.description}</p>

                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex space-x-2 pt-1 border-t border-neutral-100">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={action}
                            variant={index === 0 ? 'primary' : 'outline'}
                            size="sm"
                            className={index === 0 ? 'text-[11px] py-1 px-3 shadow-none' : 'text-[11px] py-1 px-3 bg-neutral-50 border-neutral-200 text-neutral-600'}
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
            );
          })
        )}

        <div className="flex flex-col items-center justify-center py-6 opacity-40">
          <CheckCircle2 size={32} className="text-neutral-400 mb-2" />
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">You're all caught up</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
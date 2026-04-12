import React from 'react';
import { ArrowLeft, Bell, Globe, Palette, MapPin, Shield, Star, LogOut, Info, Settings, Accessibility } from 'lucide-react';
import { Screen } from '../App';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: Bell, title: 'Notifications', subtitle: 'Alerts, updates, and recommendations', value: '' },
        { icon: Accessibility, title: 'Preferred Transport', subtitle: 'Bus, Train, Metro', value: 'All' },
        { icon: MapPin, title: 'Max Walking Distance', subtitle: 'Up to 0.5 km to stations', value: '0.5 km' }
      ]
    },
    {
      title: 'App Settings',
      items: [
        { icon: Palette, title: 'Appearance', subtitle: 'Light theme enabled', value: 'Light' },
        { icon: Globe, title: 'Language', subtitle: 'English (US)', value: 'English' },
        { icon: Settings, title: 'Map Style', subtitle: 'Standard rendering', value: 'Standard' }
      ]
    },
    {
      title: 'Privacy & Data',
      items: [
        { icon: Shield, title: 'Privacy', subtitle: 'Data handling and permissions', value: '' },
        { icon: MapPin, title: 'Location Access', subtitle: 'Precise location always', value: 'On' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Star, title: 'Rate RushRadar', subtitle: '', value: '' },
        { icon: Info, title: 'Help & FAQ', subtitle: '', value: '' }
      ]
    }
  ];

  return (
    <div className="h-full bg-[#F5F7FA] flex flex-col overflow-hidden relative">
      {/* Dynamic Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 pt-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <IconButton variant="glass" onClick={() => onNavigate('home')}>
            <ArrowLeft size={22} className="text-white" />
          </IconButton>
        </div>
        <h1 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md">Profile</h1>
        <div className="w-10 pointer-events-none" />
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Profile Info Hero */}
        <div className="bg-gradient-to-br from-primary-blue to-primary-blue-dark pt-24 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-5 relative z-10">
            <div className="w-[72px] h-[72px] bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20 transform rotate-3">
              <span className="text-3xl -rotate-3">👤</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-2xl font-black tracking-tight drop-shadow-md">Sarah Johnson</h2>
              <p className="text-white/80 font-medium text-sm mt-0.5">sarah.j@email.com</p>
              <div className="mt-2.5">
                <Badge variant="info" size="sm">PREMIUM MEMBER</Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center relative z-10">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Time Saved</p>
              <p className="text-white font-black text-xl">2.5 hours</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Crowd Avoided</p>
              <p className="text-white font-black text-xl">14 times</p>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="px-5 mt-6 space-y-5">
          {settingsGroups.map((group, groupIndex) => (
            <div key={group.title}>
              <h3 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-3 ml-2">{group.title}</h3>
              <Card className="!p-0 border-none shadow-sm overflow-hidden bg-white">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors ${
                        itemIndex < group.items.length - 1 ? 'border-b border-neutral-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center">
                          <Icon size={18} className="text-neutral-600" />
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-neutral-dark tracking-tight">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-[12px] font-medium text-neutral-medium mt-0.5">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      
                      {item.value && (
                        <span className="text-[13px] font-bold text-primary-blue bg-primary-blue/5 px-2.5 py-1 rounded-md">{item.value}</span>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}

          {/* Sign Out */}
          <div className="pt-2 pb-6">
            <Button variant="danger" fullWidth size="lg" className="shadow-none bg-red-50 text-danger-red border border-red-100 hover:bg-red-100 hover:text-red-700 font-bold">
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
import React, { useState } from 'react';
import { ArrowLeft, Bell, Globe, Palette, MapPin, Shield, Star, LogOut, Info, Settings, Accessibility, ChevronRight, Edit2, User as UserIcon } from 'lucide-react';
import { Screen } from '../App';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Toggle } from './ui/Toggle';
import { Modal } from './ui/Modal';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from './ui/Toast';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { state, logout, updateUser, updateSettings } = useAppContext();
  const { toast } = useToast();
  const user = state.user;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      onNavigate('login');
    }
  };

  const handleOpenEdit = () => {
    setEditName(user?.name ?? '');
    setEditEmail(user?.email ?? '');
    setEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ name: editName.trim(), email: editEmail.trim() });
      setIsSaving(false);
      setEditModalOpen(false);
      toast.success('Profile updated successfully!');
    }, 600);
  };

  const displayName = user?.name ?? (state.isGuest ? 'Guest User' : 'User');
  const displayEmail = user?.email ?? (state.isGuest ? 'guest@crowdsense.app' : '');
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="h-full bg-[#F5F7FA] flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 pt-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <IconButton variant="glass" onClick={() => onNavigate('home')}>
            <ArrowLeft size={22} className="text-white" />
          </IconButton>
        </div>
        <h1 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md">Profile</h1>
        <div className="pointer-events-auto">
          <IconButton variant="glass" onClick={handleOpenEdit}>
            <Edit2 size={18} className="text-white" />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-blue to-primary-blue-dark pt-24 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-5 relative z-10">
            {/* Avatar with initials */}
            <div className="w-[72px] h-[72px] bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20">
              <span className="text-primary-blue text-2xl font-black">{initials || <UserIcon size={28} />}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-2xl font-black tracking-tight drop-shadow-md">{displayName}</h2>
              <p className="text-white/80 font-medium text-sm mt-0.5">{displayEmail}</p>
              <div className="mt-2.5">
                {state.isGuest
                  ? <Badge variant="neutral" size="sm">GUEST MODE</Badge>
                  : <Badge variant="info" size="sm">MEMBER</Badge>
                }
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

        <div className="px-5 mt-6 space-y-5">
          {/* Preferences — Toggles */}
          <div>
            <h3 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-3 ml-2">Preferences</h3>
            <Card className="!p-0 border-none shadow-sm overflow-hidden bg-white">
              {[
                {
                  icon: Bell,
                  title: 'Notifications',
                  subtitle: 'Alerts and recommendations',
                  setting: 'notifications' as const,
                },
                {
                  icon: MapPin,
                  title: 'Peak Hour Alerts',
                  subtitle: 'Warn before rush hours',
                  setting: 'peakHourAlerts' as const,
                },
                {
                  icon: Accessibility,
                  title: 'Location Access',
                  subtitle: 'Precise live location',
                  setting: 'locationAccess' as const,
                },
                {
                  icon: Palette,
                  title: 'Compact View',
                  subtitle: 'Denser station list',
                  setting: 'compactView' as const,
                },
                {
                  icon: Globe,
                  title: 'Dark Mode',
                  subtitle: 'Easy on the eyes at night',
                  setting: 'darkMode' as const,
                },
              ].map((item, i, arr) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`px-4 py-3.5 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center">
                        <Icon size={18} className="text-neutral-600" />
                      </div>
                      <div>
                        <p className="font-bold text-[15px] text-neutral-900 tracking-tight">{item.title}</p>
                        <p className="text-[12px] font-medium text-neutral-500 mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={state.settings[item.setting]}
                      onChange={(val) => {
                        updateSettings({ [item.setting]: val });
                        toast.info(`${item.title} ${val ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                );
              })}
            </Card>
          </div>

          {/* App Settings — Navigate */}
          <div>
            <h3 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-3 ml-2">App Settings</h3>
            <Card className="!p-0 border-none shadow-sm overflow-hidden bg-white">
              {[
                { icon: Globe, title: 'Language', value: 'English', action: () => toast.info('Language settings coming soon') },
                { icon: Settings, title: 'Map Style', value: 'Standard', action: () => toast.info('Map style settings coming soon') },
              ].map((item, i, arr) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors ${i < arr.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center">
                        <Icon size={18} className="text-neutral-600" />
                      </div>
                      <p className="font-bold text-[15px] text-neutral-900 tracking-tight">{item.title}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[13px] font-bold text-primary-blue bg-primary-blue/5 px-2.5 py-1 rounded-md">{item.value}</span>
                      <ChevronRight size={16} className="text-neutral-400" />
                    </div>
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-neutral-400 text-xs uppercase tracking-wider mb-3 ml-2">Support</h3>
            <Card className="!p-0 border-none shadow-sm overflow-hidden bg-white">
              {[
                {
                  icon: Shield,
                  title: 'Privacy Policy',
                  action: () => toast.info('Opening privacy policy…'),
                },
                {
                  icon: Star,
                  title: 'Rate CrowdSense',
                  action: () => toast.success('Thanks for your support! ⭐'),
                },
                {
                  icon: Info,
                  title: 'Help & FAQ',
                  action: () => toast.info('Help center coming soon'),
                },
              ].map((item, i, arr) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors ${i < arr.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 bg-[#F5F7FA] rounded-xl flex items-center justify-center">
                        <Icon size={18} className="text-neutral-600" />
                      </div>
                      <p className="font-bold text-[15px] text-neutral-900 tracking-tight">{item.title}</p>
                    </div>
                    <ChevronRight size={16} className="text-neutral-400" />
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Sign Out */}
          <div className="pt-2 pb-6">
            <Button
              variant="danger"
              fullWidth
              size="lg"
              onClick={handleLogout}
              className="shadow-none bg-red-50 text-danger-red border border-red-100 hover:bg-red-100 font-bold"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-[#F5F7FA] border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[#F5F7FA] border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
            />
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isSaving}
            onClick={handleSaveProfile}
            className="mt-2"
          >
            {!isSaving && 'Save Changes'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileScreen;
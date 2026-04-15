import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Globe, Palette, MapPin, Shield, Star, LogOut, Info, Settings, Accessibility, ChevronRight, Edit2, User as UserIcon, Moon } from 'lucide-react';
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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const handleOpenEdit = () => {
    setEditName(user?.name ?? '');
    setEditEmail(user?.email ?? '');
    setEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) { toast.error('Name cannot be empty'); return; }
    if (!editEmail.trim() || !editEmail.includes('@')) { toast.error('Please enter a valid email'); return; }
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ name: editName.trim(), email: editEmail.trim() });
      setIsSaving(false);
      setEditModalOpen(false);
      toast.success('Profile updated!');
    }, 600);
  };

  const displayName = user?.name ?? (state.isGuest ? 'Guest User' : 'User');
  const displayEmail = user?.email ?? (state.isGuest ? 'guest@crowdsense.app' : '');
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: Bell, title: 'Notifications', subtitle: 'Alerts and recommendations', setting: 'notifications' as const },
        { icon: MapPin, title: 'Peak Hour Alerts', subtitle: 'Warn before rush hours', setting: 'peakHourAlerts' as const },
        { icon: Accessibility, title: 'Location Access', subtitle: 'Precise live location', setting: 'locationAccess' as const },
        { icon: Palette, title: 'Compact View', subtitle: 'Denser station list', setting: 'compactView' as const },
        { icon: Moon, title: 'Dark Mode', subtitle: 'Easy on the eyes at night', setting: 'darkMode' as const },
      ],
    },
  ];

  const appSettings = [
    { icon: Globe, title: 'Language', value: 'English', action: () => toast.info('Language settings coming soon') },
    { icon: Settings, title: 'Map Style', value: 'Standard', action: () => toast.info('Map style settings coming soon') },
  ];

  const supportItems = [
    { icon: Shield, title: 'Privacy Policy', action: () => toast.info('Opening privacy policy…') },
    { icon: Star, title: 'Rate CrowdSense', action: () => toast.success('Thanks for the love! ⭐') },
    { icon: Info, title: 'Help & FAQ', action: () => toast.info('Help center coming soon') },
  ];

  const inputCls = 'w-full bg-[#F5F7FA] dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all dark:placeholder-gray-500';

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-950 flex flex-col overflow-hidden relative transition-colors duration-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 pt-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <IconButton variant="glass" onClick={() => onNavigate('home')}>
            <ArrowLeft size={20} className="text-white" />
          </IconButton>
        </div>
        <h1 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md">Profile & Settings</h1>
        <div className="pointer-events-auto">
          <IconButton variant="glass" onClick={handleOpenEdit}>
            <Edit2 size={17} className="text-white" />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-blue via-primary-blue-dark to-secondary-teal pt-24 pb-8 px-6 rounded-b-[36px] shadow-lg relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center space-x-4 relative z-10">
            {/* Avatar */}
            <div className="w-[72px] h-[72px] rounded-2xl shadow-xl border-[3px] border-white/20 flex items-center justify-center bg-white relative overflow-hidden shrink-0">
              <span className="text-primary-blue text-2xl font-black">
                {initials || <UserIcon size={28} className="text-primary-blue" />}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-xl font-black tracking-tight leading-tight truncate">{displayName}</h2>
              <p className="text-white/70 font-medium text-sm mt-0.5 truncate">{displayEmail}</p>
              <div className="mt-2">
                {state.isGuest
                  ? <Badge variant="neutral" size="sm">GUEST MODE</Badge>
                  : <Badge variant="info" size="sm">✓ MEMBER</Badge>
                }
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-around items-center relative z-10">
            {[
              { label: 'Time Saved', value: '2.5 hrs' },
              { label: 'Crowd Avoided', value: '14×' },
              { label: 'Routes Used', value: '38' },
            ].map((stat, i, arr) => (
              <React.Fragment key={stat.label}>
                <div className="text-center">
                  <p className="text-white font-black text-xl leading-none">{stat.value}</p>
                  <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
                {i < arr.length - 1 && <div className="h-10 w-px bg-white/20" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="px-5 mt-5 space-y-5">
          {/* Preferences Toggles */}
          {settingsGroups.map(group => (
            <div key={group.title}>
              <h3 className="font-bold text-neutral-400 dark:text-gray-500 text-[11px] uppercase tracking-wider mb-3 ml-2">{group.title}</h3>
              <Card className="!p-0 border-none shadow-sm overflow-hidden !bg-white dark:!bg-gray-800">
                {group.items.map((item, i, arr) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`px-4 py-3.5 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-neutral-100 dark:border-gray-700' : ''}`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.setting === 'darkMode'
                            ? 'bg-indigo-50 dark:bg-indigo-900/30'
                            : 'bg-[#F5F7FA] dark:bg-gray-700'
                        }`}>
                          <Icon size={18} className={item.setting === 'darkMode' ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-600 dark:text-gray-300'} />
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-neutral-900 dark:text-white tracking-tight">{item.title}</p>
                          <p className="text-[12px] font-medium text-neutral-500 dark:text-gray-400 mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>
                      <Toggle
                        checked={state.settings[item.setting]}
                        onChange={(val) => {
                          updateSettings({ [item.setting]: val });
                          if (item.setting !== 'darkMode') {
                            toast.info(`${item.title} ${val ? 'enabled' : 'disabled'}`);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}

          {/* App Settings */}
          <div>
            <h3 className="font-bold text-neutral-400 dark:text-gray-500 text-[11px] uppercase tracking-wider mb-3 ml-2">App Settings</h3>
            <Card className="!p-0 border-none shadow-sm overflow-hidden !bg-white dark:!bg-gray-800">
              {appSettings.map((item, i, arr) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-gray-700 active:bg-neutral-100 dark:active:bg-gray-600 transition-colors ${i < arr.length - 1 ? 'border-b border-neutral-100 dark:border-gray-700' : ''}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 bg-[#F5F7FA] dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <Icon size={18} className="text-neutral-600 dark:text-gray-300" />
                      </div>
                      <p className="font-bold text-[15px] text-neutral-900 dark:text-white tracking-tight">{item.title}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[13px] font-bold text-primary-blue bg-primary-blue/8 dark:bg-primary-blue/15 px-2.5 py-1 rounded-lg">{item.value}</span>
                      <ChevronRight size={16} className="text-neutral-400 dark:text-gray-500" />
                    </div>
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-neutral-400 dark:text-gray-500 text-[11px] uppercase tracking-wider mb-3 ml-2">Support</h3>
            <Card className="!p-0 border-none shadow-sm overflow-hidden !bg-white dark:!bg-gray-800">
              {supportItems.map((item, i, arr) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-gray-700 active:bg-neutral-100 dark:active:bg-gray-600 transition-colors ${i < arr.length - 1 ? 'border-b border-neutral-100 dark:border-gray-700' : ''}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 bg-[#F5F7FA] dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <Icon size={18} className="text-neutral-600 dark:text-gray-300" />
                      </div>
                      <p className="font-bold text-[15px] text-neutral-900 dark:text-white tracking-tight">{item.title}</p>
                    </div>
                    <ChevronRight size={16} className="text-neutral-400 dark:text-gray-500" />
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Sign Out */}
          <div className="pb-4">
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-danger-red dark:text-red-400 border border-red-100 dark:border-red-800/40 font-bold py-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-[0.99] transition-all text-[15px]"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Your full name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputCls}
            />
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isSaving}
            onClick={handleSaveProfile}
            className="mt-2 !rounded-2xl"
          >
            {!isSaving && 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="Sign Out">
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-gray-400 text-[15px] font-medium leading-relaxed">
            Are you sure you want to sign out of CrowdSense?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="flex-1 bg-neutral-100 dark:bg-gray-800 text-neutral-700 dark:text-gray-200 font-bold py-3.5 rounded-2xl hover:bg-neutral-200 dark:hover:bg-gray-700 transition-colors text-[14px]"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-danger-red text-white font-bold py-3.5 rounded-2xl hover:bg-red-600 transition-colors text-[14px] shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileScreen;
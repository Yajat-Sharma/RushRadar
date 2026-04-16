import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import RouteResultsScreen from './components/RouteResultsScreen';
import LiveMapScreen from './components/LiveMapScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import NotificationsScreen from './components/NotificationsScreen';
import SavedRoutesScreen from './components/SavedRoutesScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import ForgotPasswordScreen from './components/auth/ForgotPasswordScreen';
import BottomNavigation from './components/BottomNavigation';
import Sidebar from './components/Sidebar';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ToastProvider } from './components/ui/Toast';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'home'
  | 'routes'
  | 'map'
  | 'analytics'
  | 'notifications'
  | 'saved'
  | 'profile';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.02, y: -10 }
};

const pageTransition: any = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

function AppContent() {
  const { state } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [showBottomNav, setShowBottomNav] = useState(false);

  // Monitor auth state to force login screen
  useEffect(() => {
    if (['splash', 'onboarding', 'login', 'signup', 'forgot-password'].includes(currentScreen)) return;
    if (!state.user && !state.isGuest) {
      setCurrentScreen('login');
      setShowBottomNav(false);
    }
  }, [state.user, state.isGuest, currentScreen]);

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen);
    if (['home', 'routes', 'map', 'notifications', 'profile', 'analytics', 'saved'].includes(screen)) {
      setShowBottomNav(true);
    } else {
      setShowBottomNav(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen key="splash" onComplete={() => handleScreenChange('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen key="onboarding" onComplete={() => {
          if (state.user || state.isGuest) handleScreenChange('home');
          else handleScreenChange('login');
        }} />;
      case 'login':
        return <LoginScreen key="login" onNavigate={handleScreenChange} />;
      case 'signup':
        return <SignupScreen key="signup" onNavigate={handleScreenChange} />;
      case 'forgot-password':
        return <ForgotPasswordScreen key="forgot-password" onNavigate={handleScreenChange} />;
      case 'home':
        return <HomeScreen key="home" onNavigate={handleScreenChange} />;
      case 'routes':
        return <RouteResultsScreen key="routes" onNavigate={handleScreenChange} />;
      case 'map':
        return <LiveMapScreen key="map" onNavigate={handleScreenChange} />;
      case 'analytics':
        return <AnalyticsScreen key="analytics" onNavigate={handleScreenChange} />;
      case 'notifications':
        return <NotificationsScreen key="notifications" onNavigate={handleScreenChange} />;
      case 'saved':
        return <SavedRoutesScreen key="saved" onNavigate={handleScreenChange} />;
      case 'profile':
        return <ProfileScreen key="profile" onNavigate={handleScreenChange} />;
      default:
        return <HomeScreen key="default" onNavigate={handleScreenChange} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-200 dark:bg-gray-950 flex transition-colors duration-300">
      {/* Desktop Sidebar (hidden on mobile) */}
      <AnimatePresence>
        {showBottomNav && (
          <Sidebar currentScreen={currentScreen} onNavigate={handleScreenChange} />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#F5F7FA] dark:bg-gray-950 relative overflow-hidden flex flex-col transition-colors duration-300 w-full">
        <div className="flex-1 overflow-y-auto relative no-scrollbar pb-24 md:pb-0 h-[100dvh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="min-h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav (hidden on desktop) */}
        <AnimatePresence>
          {showBottomNav && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
            >
              <div className="pointer-events-auto">
                <BottomNavigation
                  currentScreen={currentScreen}
                  onNavigate={handleScreenChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
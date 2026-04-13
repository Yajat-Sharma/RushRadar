import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndiaRoute } from '../data/indiaTransitData';

export interface User {
  id: string;
  name: string;
  email: string;
  savedHome: string;
  savedWork: string;
  avatar?: string;
}

export interface AppSettings {
  notifications: boolean;
  peakHourAlerts: boolean;
  locationAccess: boolean;
  compactView: boolean;
  darkMode: boolean;
}

const defaultSettings: AppSettings = {
  notifications: true,
  peakHourAlerts: true,
  locationAccess: true,
  compactView: false,
  darkMode: false,
};

interface AppState {
  fromLocation: string;
  toLocation: string;
  selectedRouteId: string | null;
  selectedStationId: string | null;
  user: User | null;
  isGuest: boolean;
  generatedRoutes: IndiaRoute[];
  settings: AppSettings;
  notificationCount: number;
}

interface AppContextType {
  state: AppState;
  setFromLocation: (loc: string) => void;
  setToLocation: (loc: string) => void;
  swapLocations: () => void;
  setSelectedRouteId: (id: string | null) => void;
  setSelectedStationId: (id: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setGuestMode: (isGuest: boolean) => void;
  savePreferences: (home: string, work: string) => void;
  setGeneratedRoutes: (routes: IndiaRoute[]) => void;
  updateUser: (patch: Partial<User>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  clearNotificationCount: () => void;
}

const defaultState: AppState = {
  fromLocation: 'Current Location',
  toLocation: '',
  selectedRouteId: null,
  selectedStationId: null,
  user: null,
  isGuest: false,
  generatedRoutes: [],
  settings: defaultSettings,
  notificationCount: 3,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const savedUser = localStorage.getItem('crowdsense_user');
      const savedSettings = localStorage.getItem('crowdsense_settings');
      const savedGuest = localStorage.getItem('crowdsense_guest');
      return {
        ...defaultState,
        user: savedUser ? JSON.parse(savedUser) : null,
        isGuest: savedGuest === 'true',
        settings: savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings,
      };
    } catch {
      return defaultState;
    }
  });

  // Persist user to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('crowdsense_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('crowdsense_user');
    }
    localStorage.setItem('crowdsense_guest', String(state.isGuest));
  }, [state.user, state.isGuest]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('crowdsense_settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const setFromLocation = (loc: string) => setState(s => ({ ...s, fromLocation: loc }));
  const setToLocation = (loc: string) => setState(s => ({ ...s, toLocation: loc }));
  const swapLocations = () => setState(s => ({ ...s, fromLocation: s.toLocation, toLocation: s.fromLocation }));
  const setSelectedRouteId = (id: string | null) => setState(s => ({ ...s, selectedRouteId: id }));
  const setSelectedStationId = (id: string | null) => setState(s => ({ ...s, selectedStationId: id }));

  const login = (user: User) => setState(s => ({ ...s, user, isGuest: false }));

  const logout = () => {
    localStorage.removeItem('crowdsense_user');
    localStorage.removeItem('crowdsense_guest');
    setState({ ...defaultState });
  };

  const setGuestMode = (isGuest: boolean) => setState(s => ({ ...s, isGuest }));

  const savePreferences = (savedHome: string, savedWork: string) => {
    setState(s => {
      if (!s.user) return s;
      return { ...s, user: { ...s.user, savedHome, savedWork } };
    });
  };

  const updateUser = (patch: Partial<User>) => {
    setState(s => {
      if (!s.user) return s;
      const updated = { ...s.user, ...patch };
      return { ...s, user: updated };
    });
  };

  const updateSettings = (patch: Partial<AppSettings>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...patch } }));
  };

  const clearNotificationCount = () => setState(s => ({ ...s, notificationCount: 0 }));

  const setGeneratedRoutes = (routes: IndiaRoute[]) => setState(s => ({ ...s, generatedRoutes: routes }));

  return (
    <AppContext.Provider value={{
      state,
      setFromLocation,
      setToLocation,
      swapLocations,
      setSelectedRouteId,
      setSelectedStationId,
      login,
      logout,
      setGuestMode,
      savePreferences,
      setGeneratedRoutes,
      updateUser,
      updateSettings,
      clearNotificationCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

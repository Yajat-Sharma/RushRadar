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

export interface SavedRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  savedAt: number; // timestamp
  route: IndiaRoute;
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
  savedRoutes: SavedRoute[];
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
  saveRoute: (route: IndiaRoute, from: string, to: string) => void;
  unsaveRoute: (id: string) => void;
  isRouteSaved: (routeId: number) => boolean;
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
  savedRoutes: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const savedUser = localStorage.getItem('crowdsense_user');
      const savedSettings = localStorage.getItem('crowdsense_settings');
      const savedGuest = localStorage.getItem('crowdsense_guest');
      const savedRoutes = localStorage.getItem('crowdsense_saved_routes');
      return {
        ...defaultState,
        user: savedUser ? JSON.parse(savedUser) : null,
        isGuest: savedGuest === 'true',
        settings: savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings,
        savedRoutes: savedRoutes ? JSON.parse(savedRoutes) : [],
      };
    } catch {
      return defaultState;
    }
  });

  // ─── Dark mode on <html> ─────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.darkMode]);

  // Initialize dark mode from persisted on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('crowdsense_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.darkMode) document.documentElement.classList.add('dark');
      }
    } catch {}
  }, []);

  // Persist user
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('crowdsense_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('crowdsense_user');
    }
    localStorage.setItem('crowdsense_guest', String(state.isGuest));
  }, [state.user, state.isGuest]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('crowdsense_settings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Persist saved routes
  useEffect(() => {
    localStorage.setItem('crowdsense_saved_routes', JSON.stringify(state.savedRoutes));
  }, [state.savedRoutes]);

  const setFromLocation = (loc: string) => setState(s => ({ ...s, fromLocation: loc }));
  const setToLocation = (loc: string) => setState(s => ({ ...s, toLocation: loc }));
  const swapLocations = () => setState(s => ({ ...s, fromLocation: s.toLocation, toLocation: s.fromLocation }));
  const setSelectedRouteId = (id: string | null) => setState(s => ({ ...s, selectedRouteId: id }));
  const setSelectedStationId = (id: string | null) => setState(s => ({ ...s, selectedStationId: id }));

  const login = (user: User) => setState(s => ({ ...s, user, isGuest: false }));

  const logout = () => {
    localStorage.removeItem('crowdsense_user');
    localStorage.removeItem('crowdsense_guest');
    localStorage.removeItem('crowdsense_saved_routes');
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
      return { ...s, user: { ...s.user, ...patch } };
    });
  };

  const updateSettings = (patch: Partial<AppSettings>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...patch } }));
  };

  const clearNotificationCount = () => setState(s => ({ ...s, notificationCount: 0 }));

  const setGeneratedRoutes = (routes: IndiaRoute[]) => setState(s => ({ ...s, generatedRoutes: routes }));

  // ─── Save / Unsave Route ─────────────────────────────────────────────────────
  const saveRoute = (route: IndiaRoute, from: string, to: string) => {
    const id = `saved-${route.id}`;
    const newSaved: SavedRoute = {
      id,
      name: `${from} → ${to}`,
      from,
      to,
      savedAt: Date.now(),
      route,
    };
    setState(s => ({
      ...s,
      savedRoutes: [newSaved, ...s.savedRoutes.filter(r => r.id !== id)],
    }));
  };

  const unsaveRoute = (id: string) => {
    setState(s => ({ ...s, savedRoutes: s.savedRoutes.filter(r => r.id !== id) }));
  };

  const isRouteSaved = (routeId: number): boolean => {
    return state.savedRoutes.some(r => r.id === `saved-${routeId}`);
  };

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
      saveRoute,
      unsaveRoute,
      isRouteSaved,
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

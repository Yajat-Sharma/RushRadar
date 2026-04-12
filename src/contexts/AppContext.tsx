import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndiaRoute } from '../data/indiaTransitData';

export interface User {
  id: string;
  name: string;
  email: string;
  savedHome: string;
  savedWork: string;
}

interface AppState {
  fromLocation: string;
  toLocation: string;
  selectedRouteId: string | null;
  selectedStationId: string | null;
  user: User | null;
  isGuest: boolean;
  generatedRoutes: IndiaRoute[];
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
}

const defaultState: AppState = {
  fromLocation: 'Current Location',
  toLocation: '',
  selectedRouteId: null,
  selectedStationId: null,
  user: null,
  isGuest: false,
  generatedRoutes: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Try to load from local storage
    const saved = localStorage.getItem('rushradar_state');
    if (saved) {
      try {
        return { ...defaultState, ...JSON.parse(saved) };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Persist state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('rushradar_state', JSON.stringify({
      user: state.user,
      isGuest: state.isGuest,
      fromLocation: state.fromLocation,
      toLocation: state.toLocation
    }));
  }, [state.user, state.isGuest, state.fromLocation, state.toLocation]);

  const setFromLocation = (loc: string) => setState(s => ({ ...s, fromLocation: loc }));
  const setToLocation = (loc: string) => setState(s => ({ ...s, toLocation: loc }));
  const swapLocations = () => setState(s => ({ ...s, fromLocation: s.toLocation, toLocation: s.fromLocation }));
  const setSelectedRouteId = (id: string | null) => setState(s => ({ ...s, selectedRouteId: id }));
  const setSelectedStationId = (id: string | null) => setState(s => ({ ...s, selectedStationId: id }));
  
  // Auth Fake Methods
  const login = (user: User) => setState(s => ({ ...s, user, isGuest: false }));
  const logout = () => setState(s => ({ ...defaultState }));
  const setGuestMode = (isGuest: boolean) => setState(s => ({ ...s, isGuest }));
  
  const savePreferences = (savedHome: string, savedWork: string) => {
    setState(s => {
      if (!s.user) return s;
      return { ...s, user: { ...s.user, savedHome, savedWork } };
    });
  };

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
      setGeneratedRoutes
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

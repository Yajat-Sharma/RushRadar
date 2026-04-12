import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Navigation } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface LocationInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
  isDestination?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  icon: Icon = Search,
  isDestination = false
}) => {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    ...(state.user?.savedHome ? [{ label: 'Home', sub: state.user.savedHome, icon: '🏠' }] : []),
    ...(state.user?.savedWork ? [{ label: 'Work', sub: state.user.savedWork, icon: '🏢' }] : []),
    { label: 'Andheri (W)', sub: 'Mumbai, Maharashtra', icon: '📍' },
    { label: 'Churchgate', sub: 'Mumbai, Maharashtra', icon: '📍' },
    { label: 'Thane Station', sub: 'Thane, Maharashtra', icon: '📍' },
    { label: 'Bandra Kurla Complex', sub: 'Mumbai, Maharashtra', icon: '📍' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      onChange("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Fake reverse geocoding for MVP demo
          setTimeout(() => onChange("Current Location (Andheri)"), 600);
        },
        () => onChange("Location Access Denied")
      );
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className={`flex items-center bg-white rounded-2xl px-4 py-3 border transition-colors ${isOpen ? 'border-primary-blue shadow-md' : 'border-neutral-light shadow-sm'} ${isDestination ? 'ml-0' : ''}`}>
        <Icon size={20} className={isDestination ? 'text-danger-red' : 'text-primary-blue'} />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none flex-1 ml-3 text-neutral-dark placeholder-neutral-medium font-medium text-sm"
        />
        {!isDestination && (
          <div className="w-2 h-2 rounded-full absolute -left-1 top-1/2 transform -translate-y-1/2 bg-primary-blue shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
        )}
        {isDestination && (
          <div className="w-2 h-2 rounded-full absolute -left-1 top-1/2 transform -translate-y-1/2 border-2 border-danger-red bg-white" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-light overflow-hidden z-30"
          >
            {!isDestination && (
              <button 
                className="w-full flex items-center px-4 py-3 hover:bg-neutral-50 border-b border-neutral-light text-left"
                onClick={handleUseLocation}
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-primary-blue">
                  <Navigation size={16} />
                </div>
                <span className="font-bold text-primary-blue text-sm">Use My Current Location</span>
              </button>
            )}

            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center px-4 py-3 hover:bg-neutral-50 text-left"
                  onClick={() => handleSelect(item.label)}
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-card flex items-center justify-center mr-3 text-lg opacity-80">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-dark text-sm leading-tight">{item.label}</p>
                    {item.sub && <p className="text-xs font-medium text-neutral-medium">{item.sub}</p>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

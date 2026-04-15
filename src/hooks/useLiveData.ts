import { useState, useEffect, useCallback } from 'react';
import { IndiaStation } from '../data/indiaTransitData';

// Fluctuate a value by ±max, clamped to [min, maxVal]
const fluctuate = (value: number, max: number = 8, min = 5, maxVal = 98): number => {
  const delta = Math.floor((Math.random() - 0.48) * max * 2);
  return Math.max(min, Math.min(maxVal, value + delta));
};

const fmtSecondsAgo = (sec: number): string => {
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ago`;
};

interface LiveStation extends IndiaStation {
  liveAgo: number; // seconds since last update
}

export const useLiveData = (initialStations: IndiaStation[]) => {
  const [stations, setStations] = useState<LiveStation[]>(
    initialStations.map(s => ({ ...s, liveAgo: 0 }))
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [updateTick, setUpdateTick] = useState(0);

  // Tick every second for "last updated" counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSinceUpdate(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live data update every 22 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setUpdateTick(t => t + 1);

      setTimeout(() => {
        setStations(prev =>
          prev.map(station => ({
            ...station,
            crowdLevel: fluctuate(station.crowdLevel, 9),
            liveAgo: 0,
          }))
        );
        setSecondsSinceUpdate(0);
        setIsUpdating(false);
      }, 900); // brief "updating" pause for realism
    }, 22000);

    return () => clearInterval(interval);
  }, []);

  const lastUpdatedLabel = fmtSecondsAgo(secondsSinceUpdate);

  return { stations, isUpdating, lastUpdatedLabel, updateTick };
};

// ETA Countdown — ticks down from a starting minute string
export const useETACountdown = (initialMinutes: number) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const label = seconds < 60
    ? `${seconds}s`
    : `${mins}:${secs.toString().padStart(2, '0')}`;

  return { label, totalSeconds: seconds, isAlmostDue: seconds < 120 };
};

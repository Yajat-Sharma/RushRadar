import { IndiaRoute, CoachData } from '../data/indiaTransitData';

const generateCoachData = (crowdLevel: number, hasLadies: boolean, hasFirst: boolean): CoachData[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const isLadies = hasLadies && (num === 1 || num === 12);
    const isFirst = hasFirst && (num === 5 || num === 6);
    const variance = Math.floor(Math.sin(num * 3.7) * 18);
    const base = isLadies
      ? Math.max(8, crowdLevel - 32)
      : isFirst
      ? Math.max(12, crowdLevel - 18)
      : Math.min(100, crowdLevel + variance);
    return {
      num,
      type: isLadies ? 'ladies' : isFirst ? 'first' : 'general',
      crowd: Math.max(5, Math.min(100, base)),
    };
  });
};

// Deterministic-ish seed from strings so same pair always feels consistent
const hashStr = (s: string): number =>
  s.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);

const seededRand = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return Math.floor(min + frac * (max - min));
};

// Route templates per local type for variety
const ROUTE_FLAVORS = [
  {
    localType: 'fast' as const,
    modes: ['🚶‍♂️', '🚊', '🚶‍♂️'],
    comfortBase: 88,
    fareBase: 18,
    timeBase: 38,
    label: 'Fast Local',
    icon: '⚡',
    features: ['Fast Local', 'High Frequency', 'Ladies Coach'],
    coachTip: 'Board Coach 9–12 for less crowd at this time',
    platform: (seed: number) => `Platform ${(Math.abs(seed) % 3) + 1}`,
    hasFirst: false,
  },
  {
    localType: 'bus' as const,
    modes: ['🚶‍♂️', '🚌', '🚶‍♂️'],
    comfortBase: 35,
    fareBase: 28,
    timeBase: 55,
    label: 'AC Bus',
    icon: '🚌',
    features: ['AC Seating', 'Guaranteed Seat', 'Ladies Seat Reserved'],
    coachTip: 'Front section has reserved ladies seats',
    platform: () => 'Bus Stop A',
    hasFirst: false,
  },
  {
    localType: 'metro' as const,
    modes: ['🚶‍♂️', '🚇', '🚊', '🚶‍♂️'],
    comfortBase: 60,
    fareBase: 42,
    timeBase: 44,
    label: 'Metro + Local',
    icon: '🚇',
    features: ['AC Metro', 'First Class', 'Ladies Coach', 'Smart Card'],
    coachTip: 'Take the first 2 metro coaches — less crowded',
    platform: () => 'Platform A',
    hasFirst: true,
  },
  {
    localType: 'slow' as const,
    modes: ['🚶‍♂️', '🚊', '🚶‍♂️'],
    comfortBase: 45,
    fareBase: 12,
    timeBase: 62,
    label: 'Slow Local',
    icon: '🐢',
    features: ['Slow Local', 'Budget Option', 'Ladies Coach'],
    coachTip: 'Coaches 1–3 are typically emptier on slow locals',
    platform: (seed: number) => `Platform ${(Math.abs(seed) % 2) + 2}`,
    hasFirst: false,
  },
];

export const generateMockRoutes = (from: string, to: string): IndiaRoute[] => {
  const baseSeed = hashStr(from + to);
  const isPeakHour = [7, 8, 9, 17, 18, 19].includes(new Date().getHours());

  const now = Date.now();

  return ROUTE_FLAVORS.map((flavor, idx) => {
    const seed = baseSeed + idx * 1337;
    const peakBoost = isPeakHour ? seededRand(seed + 99, 10, 25) : 0;

    const crowdLevel = Math.min(98, Math.max(12, flavor.comfortBase - seededRand(seed, 0, 30) + peakBoost));
    const fare = Math.max(8, flavor.fareBase + seededRand(seed + 10, -5, 15));
    const travelTime = flavor.timeBase + seededRand(seed + 20, -10, 15);
    const walkMins = seededRand(seed + 30, 2, 6);
    const totalTime = travelTime + walkMins * 2;
    const seatProb = Math.max(5, Math.min(95, 100 - crowdLevel + seededRand(seed + 40, -8, 8)));
    const delay = [0, 0, 0, 0, 2, 4, 5][Math.abs(seed + idx) % 7];

    const comfort: string =
      crowdLevel <= 38 ? 'Comfortable' : crowdLevel <= 68 ? 'Moderate' : 'Crowded';

    const isLeast = idx === ROUTE_FLAVORS.reduce(
      (minIdx, _, i) => {
        const c = Math.min(98, Math.max(12, ROUTE_FLAVORS[i].comfortBase - seededRand(baseSeed + i * 1337, 0, 30) + peakBoost));
        const minC = Math.min(98, Math.max(12, ROUTE_FLAVORS[minIdx].comfortBase - seededRand(baseSeed + minIdx * 1337, 0, 30) + peakBoost));
        return c < minC ? i : minIdx;
      }, 0
    );

    return {
      id: now + idx,
      time: `${totalTime} min`,
      modes: flavor.modes,
      crowdLevel,
      fare,
      seatProbability: seatProb,
      comfort,
      isLeastCrowded: isLeast,
      details: buildDetails(flavor.label, from, to, travelTime, walkMins),
      specialFeatures: flavor.features,
      platform: flavor.platform(seed),
      coachSuggestion: crowdLevel > 55 ? flavor.coachTip : undefined,
      delay,
      localType: flavor.localType,
      hasLadiesCoach: true,
      coachData: generateCoachData(crowdLevel, true, flavor.hasFirst),
    };
  });
};

const buildDetails = (label: string, from: string, to: string, travel: number, walk: number): string => {
  return `Walk ${walk}min → ${label} (${from} → ${to}) ${travel}min → Walk ${walk - 1 < 1 ? 1 : walk - 1}min`;
};

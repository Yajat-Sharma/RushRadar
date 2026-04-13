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

export const generateMockRoutes = (from: string, to: string): IndiaRoute[] => {
  const seed = from.length + to.length;
  const randomize = (base: number, variance: number) =>
    Math.floor(base + (seed % Math.max(1, Math.floor(variance))) - variance / 2);

  const delayOptions = [0, 0, 0, 2, 4, 7, 0, 0, 3]; // mostly on time

  const route1Crowd = Math.min(99, randomize(85, 20));
  const route2Crowd = Math.min(99, randomize(40, 20));
  const route3Crowd = Math.min(99, randomize(65, 20));

  return [
    {
      id: Date.now() + 1,
      time: `${randomize(35, 15)} min`,
      modes: ['🚶‍♂️', '🚊', '🚶‍♂️'],
      crowdLevel: route1Crowd,
      fare: randomize(15, 10),
      seatProbability: randomize(15, 20),
      comfort: 'Crowded',
      isLeastCrowded: false,
      details: `Walk 4min → Fast Local (${from} → ${to}) ${randomize(28, 10)}min → Walk 3min`,
      specialFeatures: ['Fast Local', 'High Frequency', 'Ladies Coach'],
      platform: `Platform ${(seed % 3) + 1}`,
      coachSuggestion: 'Coaches 9–12 tend to be less crowded',
      delay: delayOptions[seed % delayOptions.length],
      localType: 'fast',
      hasLadiesCoach: true,
      coachData: generateCoachData(route1Crowd, true, false),
    },
    {
      id: Date.now() + 2,
      time: `${randomize(50, 20)} min`,
      modes: ['🚶‍♂️', '🚌', '🚶‍♂️'],
      crowdLevel: route2Crowd,
      fare: randomize(25, 10),
      seatProbability: randomize(70, 20),
      comfort: 'Comfortable',
      isLeastCrowded: true,
      details: `Walk 2min → AC Bus ${randomize(400, 100)} (${from} → ${to}) ${randomize(45, 15)}min → Walk 2min`,
      specialFeatures: ['AC Coach', 'Guaranteed Seat', 'Ladies Seat Reserved'],
      platform: 'Bus Stop A',
      delay: 0,
      localType: 'bus',
      hasLadiesCoach: true,
      coachData: generateCoachData(route2Crowd, true, false),
    },
    {
      id: Date.now() + 3,
      time: `${randomize(40, 15)} min`,
      modes: ['🚶‍♂️', '🚇', '🚊', '🚶‍♂️'],
      crowdLevel: route3Crowd,
      fare: randomize(45, 15),
      seatProbability: randomize(40, 20),
      comfort: 'Moderate',
      isLeastCrowded: false,
      details: `Walk 5min → Metro Line → Transfer → Slow Local (${to}) → Walk 5min`,
      specialFeatures: ['Fastest Route', 'AC Metro', 'First Class', 'Ladies Coach'],
      platform: `Platform A`,
      delay: delayOptions[(seed + 3) % delayOptions.length],
      localType: 'metro',
      hasLadiesCoach: true,
      coachData: generateCoachData(route3Crowd, true, true),
    },
  ];
};

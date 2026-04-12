import { IndiaRoute } from '../data/indiaTransitData';

export const generateMockRoutes = (from: string, to: string): IndiaRoute[] => {
  // We use string lengths to seed the pseudo-random generation to keep it consistent
  const seed = from.length + to.length;
  
  const randomize = (base: number, variance: number) => {
    return Math.floor(base + (seed % variantize(variance)) - variance / 2);
  };
  
  const variantize = (val: number) => Math.max(1, Math.floor(val));

  return [
    {
      id: Date.now() + 1,
      time: `${randomize(35, 15)} min`,
      modes: ['🚶‍♂️', '🚊', '🚶‍♂️'],
      crowdLevel: randomize(85, 20),
      fare: randomize(15, 10),
      seatProbability: randomize(15, 20),
      comfort: 'Crowded',
      isLeastCrowded: false,
      details: `Walk 4min → Fast Local (${from}-${to}) ${randomize(28, 10)}min → Walk 3min`,
      specialFeatures: ['Fast Local', 'High Frequency'],
    },
    {
      id: Date.now() + 2,
      time: `${randomize(50, 20)} min`,
      modes: ['🚶‍♂️', '🚌', '🚶‍♂️'],
      crowdLevel: randomize(40, 20),
      fare: randomize(25, 10),
      seatProbability: randomize(70, 20),
      comfort: 'Comfortable',
      isLeastCrowded: true,
      details: `Walk 2min → AC Bus route ${randomize(400, 100)} (${from} to ${to}) ${randomize(45, 15)}min → Walk 2min`,
      specialFeatures: ['AC Coach', 'Guaranteed Seat'],
    },
    {
      id: Date.now() + 3,
      time: `${randomize(40, 15)} min`,
      modes: ['🚶‍♂️', '🚇', '🚊', '🚶‍♂️'],
      crowdLevel: randomize(65, 20),
      fare: randomize(45, 15),
      seatProbability: randomize(40, 20),
      comfort: 'Moderate',
      isLeastCrowded: false,
      details: `Walk 5min → Metro Line to exchange → Transfer to Local (${to}) → Walk 5min`,
      specialFeatures: ['Fastest Route', 'AC Metro'],
    }
  ];
};

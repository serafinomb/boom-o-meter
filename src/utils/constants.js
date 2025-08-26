// Constants for flash calculations
export const ALL_POWER_LEVELS = [
  "1/1",
  "1/2",
  "1/4",
  "1/8",
  "1/16",
  "1/32",
  "1/64",
  "1/128",
];

export const ALL_APERTURES = [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
export const ALL_ISOS = [100, 160, 200, 400, 800, 1600, 3200];

export const DEFAULT_SETTINGS = {
  guideNumber: 30,
  availableISOs: [100, 160, 200, 400, 800, 1600],
  availableApertures: [2, 2.8, 4, 5.6, 8, 11, 16],
  minDistance: 0.6,
  maxDistance: 5.0,
  priorityWeights: {
    efficiency: 0.7,
    depthOfField: 0.5,
    accuracy: 0.3,
  },
  batterySavingMode: false,
  photographyMode: "digital",
  fixedISO: 400,
};

export const POWER_LEVEL_COLORS = [
  { power: "1/128", color: "bg-green-400" },
  { power: "1/64", color: "bg-lime-400" },
  { power: "1/32", color: "bg-yellow-400" },
  { power: "1/16", color: "bg-amber-400" },
  { power: "1/8", color: "bg-orange-400" },
  { power: "1/4", color: "bg-orange-500" },
  { power: "1/2", color: "bg-red-400" },
  { power: "1/1", color: "bg-red-500" },
];

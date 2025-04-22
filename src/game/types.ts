// Types and constants for the waste sorting game

// Waste bin categories in France
export enum BinType {
  YELLOW = "YELLOW", // Recyclables (plastic, metal, cardboard, paper)
  GREEN = "GREEN",   // Glass
  BROWN = "BROWN",   // Organic waste
  COLLECTION = "COLLECTION", // Special collection points
  GRAY = "GRAY",     // General waste
}

// Waste item interface
export interface WasteItem {
  id: string;
  type: BinType;
  name: string;
  imageUrl: string;
  speed: number;
  points: number;
}

// Bin interface
export interface Bin {
  type: BinType;
  name: string;
  imageUrl: string;
  position: { x: number, width: number };
}

// Game state interface
export interface GameState {
  score: number;
  wasteItems: WasteItem[];
  bins: Bin[];
  isPlaying: boolean;
  gameSpeed: number;
}

// Sample waste items
export const SAMPLE_WASTE_ITEMS: WasteItem[] = [
  // YELLOW bin items (recyclables)
  {
    id: "plastic-bottle",
    type: BinType.YELLOW,
    name: "Bouteille en plastique",
    imageUrl: "/images/bottle.png",
    speed: 1,
    points: 1,
  },
  {
    id: "newspaper",
    type: BinType.YELLOW,
    name: "Journal",
    imageUrl: "/images/newspaper.png",
    speed: 0.7,
    points: 1,
  },
  {
    id: "cardboard-box",
    type: BinType.YELLOW,
    name: "Boîte en carton",
    imageUrl: "/images/cardboard.png",
    speed: 0.9,
    points: 1,
  },
  {
    id: "aluminum-can",
    type: BinType.YELLOW,
    name: "Canette en aluminium",
    imageUrl: "/images/can.png",
    speed: 1.1,
    points: 1,
  },
  {
    id: "yogurt-container",
    type: BinType.YELLOW,
    name: "Pot de yaourt",
    imageUrl: "/images/yogurt.png",
    speed: 0.8,
    points: 1,
  },
  {
    id: "cereal-box",
    type: BinType.YELLOW,
    name: "Boîte de céréales",
    imageUrl: "/images/cereal.png",
    speed: 0.7,
    points: 1,
  },
  
  // GREEN bin items (glass)
  {
    id: "glass-bottle",
    type: BinType.GREEN,
    name: "Bouteille en verre",
    imageUrl: "/images/glass.png",
    speed: 1.5,
    points: 1,
  },
  {
    id: "glass-jar",
    type: BinType.GREEN,
    name: "Bocal en verre",
    imageUrl: "/images/jar.png",
    speed: 1.3,
    points: 1,
  },
  {
    id: "wine-bottle",
    type: BinType.GREEN,
    name: "Bouteille de vin",
    imageUrl: "/images/wine.png",
    speed: 1.6,
    points: 1,
  },
  {
    id: "perfume-bottle",
    type: BinType.GREEN,
    name: "Flacon de parfum",
    imageUrl: "/images/perfume.png",
    speed: 1.2,
    points: 1,
  },
  {
    id: "glass-mirror",
    type: BinType.GREEN,
    name: "Miroir cassé",
    imageUrl: "/images/mirror.png",
    speed: 1.4,
    points: 1,
  },
  
  // BROWN bin items (organic waste)
  {
    id: "banana-peel",
    type: BinType.BROWN,
    name: "Peau de banane",
    imageUrl: "/images/banana.png",
    speed: 0.8,
    points: 1,
  },
  {
    id: "apple-core",
    type: BinType.BROWN,
    name: "Trognon de pomme",
    imageUrl: "/images/apple.png",
    speed: 0.9,
    points: 1,
  },
  {
    id: "egg-shells",
    type: BinType.BROWN,
    name: "Coquilles d'œufs",
    imageUrl: "/images/eggshell.png",
    speed: 0.8,
    points: 1,
  },
  {
    id: "tea-bag",
    type: BinType.BROWN,
    name: "Sachet de thé",
    imageUrl: "/images/tea.png",
    speed: 0.7,
    points: 1,
  },
  
  // COLLECTION point items (special items)
  {
    id: "used-clothes",
    type: BinType.COLLECTION,
    name: "Vêtements usagés",
    imageUrl: "/images/clothes.png",
    speed: 0.9,
    points: 1,
  },
  {
    id: "batteries",
    type: BinType.COLLECTION,
    name: "Piles usagées",
    imageUrl: "/images/batteries.png",
    speed: 1.1,
    points: 1,
  },
  {
    id: "ink-cartridge",
    type: BinType.COLLECTION,
    name: "Cartouche d'encre",
    imageUrl: "/images/cartridge.png",
    speed: 1,
    points: 1,
  },
  {
    id: "light-bulb",
    type: BinType.COLLECTION,
    name: "Ampoule économique",
    imageUrl: "/images/bulb.png",
    speed: 0.8,
    points: 1,
  },
  {
    id: "cooking-oil",
    type: BinType.COLLECTION,
    name: "Huile alimentaire usagée",
    imageUrl: "/images/oil.png",
    speed: 1.3,
    points: 1,
  },
  {
    id: "electronic-device",
    type: BinType.COLLECTION,
    name: "Appareil électronique",
    imageUrl: "/images/electronic.png",
    speed: 1.2,
    points: 1,
  },
  {
    id: "medication",
    type: BinType.COLLECTION,
    name: "Médicaments périmés",
    imageUrl: "/images/medication.png",
    speed: 0.9,
    points: 1,
  },
  
  // GRAY bin items (general waste - specific non-recyclable items)
  {
    id: "diaper",
    type: BinType.GRAY,
    name: "Couche jetable",
    imageUrl: "/images/diaper.png",
    speed: 1.2,
    points: 1,
  },
  {
    id: "broken-ceramic",
    type: BinType.GRAY,
    name: "Céramique brisée",
    imageUrl: "/images/ceramic.png",
    speed: 1.3,
    points: 1,
  },
  {
    id: "cigarette-butt",
    type: BinType.GRAY,
    name: "Mégot de cigarette",
    imageUrl: "/images/cigarette.png",
    speed: 0.8,
    points: 1,
  },
  {
    id: "dirty-napkin",
    type: BinType.GRAY,
    name: "Serviette en papier souillée",
    imageUrl: "/images/napkin.png",
    speed: 0.9,
    points: 1,
  },
  {
    id: "styrofoam",
    type: BinType.GRAY,
    name: "Polystyrène expansé",
    imageUrl: "/images/styrofoam.png",
    speed: 0.7,
    points: 1,
  },
];

// Sample bins
export const SAMPLE_BINS: Bin[] = [
  {
    type: BinType.YELLOW,
    name: "Poubelle jaune (recyclables)",
    imageUrl: "/images/yellow-bin.png",
    position: { x: 10, width: 100 },
  },
  {
    type: BinType.GREEN,
    name: "Poubelle verte (verre)",
    imageUrl: "/images/green-bin.png",
    position: { x: 120, width: 100 },
  },
  {
    type: BinType.BROWN,
    name: "Poubelle marron (déchets organiques)",
    imageUrl: "/images/brown-bin.png",
    position: { x: 230, width: 100 },
  },
  {
    type: BinType.COLLECTION,
    name: "Point d'apport (objets spéciaux)",
    imageUrl: "/images/collection-point.png",
    position: { x: 340, width: 100 },
  },
  {
    type: BinType.GRAY,
    name: "Poubelle grise (déchets généraux)",
    imageUrl: "/images/gray-bin.png",
    position: { x: 450, width: 100 },
  },
];
"use client";

import { useState, useEffect, useRef } from "react";
import WasteItemComponent from "@/components/WasteItem";
import BinComponent from "@/components/Bin";
import { WasteItem, Bin, BinType, GameState, SAMPLE_WASTE_ITEMS, SAMPLE_BINS } from "@/game/types";

// Main game component
export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    wasteItems: [],
    bins: [],
    isPlaying: false,
    gameSpeed: 1.5, // Increased base game speed
  });
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track processed items to prevent double scoring
  const processedItemsRef = useRef<Set<string>>(new Set());
  // Maximum number of active items
  const MAX_ACTIVE_ITEMS = 5;

  // Initialize game
  useEffect(() => {
    startGame();
    
    // Update game area dimensions on resize
    const handleResize = () => {
      if (gameAreaRef.current) {
        setGameSize({
          width: gameAreaRef.current.clientWidth,
          height: gameAreaRef.current.clientHeight,
        });
        
        // Update bin positions based on new width
        updateBinPositions();
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, []);
  
  // Update bin positions based on game width
  const updateBinPositions = () => {
    if (!gameAreaRef.current) return;
    
    const areaWidth = gameAreaRef.current.clientWidth;
    const binWidth = Math.max(80, Math.min(100, areaWidth / 6));
    const bins = [...SAMPLE_BINS];
    
    // Distribute bins evenly
    bins.forEach((bin, index) => {
      const spacing = areaWidth / (bins.length + 1);
      bin.position.x = spacing * (index + 1) - binWidth / 2;
      bin.position.width = binWidth;
    });
    
    setGameState(prev => ({ ...prev, bins }));
  };
  
  // Start the game
  const startGame = () => {
    // Initialize with sample bins
    updateBinPositions();
    
    // Reset score and start spawning items
    setGameState(prev => ({
      ...prev,
      score: 0,
      wasteItems: [],
      isPlaying: true,
      gameSpeed: 1.5, // Keep consistent with initial state
    }));
    
    // Clear processed items set when restarting
    processedItemsRef.current.clear();
    
    // Start spawning waste items
    scheduleNextSpawn();
  };
  
  // Schedule the next waste item spawn
  const scheduleNextSpawn = () => {
    if (spawnTimerRef.current) {
      clearTimeout(spawnTimerRef.current);
    }
    
    // Check if we already have the maximum number of items
    if (gameState.wasteItems.length >= MAX_ACTIVE_ITEMS) {
      // Try again in a short time
      spawnTimerRef.current = setTimeout(scheduleNextSpawn, 500);
      return;
    }
    
    // Increased delay between spawns to reduce difficulty
    const delay = Math.random() * 1200 + 1500 / gameState.gameSpeed;
    spawnTimerRef.current = setTimeout(spawnWasteItem, delay);
  };
  
  // Spawn a new waste item
  const spawnWasteItem = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_WASTE_ITEMS.length);
    const template = SAMPLE_WASTE_ITEMS[randomIndex];
    
    const newItem: WasteItem = {
      ...template,
      id: `${template.id}-${Date.now()}`,
      speed: template.speed * gameState.gameSpeed,
    };
    
    setGameState(prev => ({
      ...prev,
      wasteItems: [...prev.wasteItems, newItem],
    }));
    
    // Schedule next spawn
    scheduleNextSpawn();
  };
  
  // Handle waste item starting to be dragged
  const handleDragStart = (id: string) => {
    // Pause falling animation for this item
  };
  
  // Handle waste item being dropped
  const handleDragEnd = (id: string, x: number, y: number) => {
    // Check for collision with bins
    const collidingBin = checkCollision(x, y);
    
    if (collidingBin) {
      handleItemInBin(id, collidingBin);
    } else {
      // Item continues falling
    }
  };
  
  // Check if item collides with a bin
  const checkCollision = (x: number, y: number): BinType | null => {
    if (!gameAreaRef.current) return null;
    
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const itemCenterX = x + 25; // Item is 50px wide
    const itemBottom = y + 50; // Item is 50px tall
    
    // Calculate the bottom area of the game
    const bottomAreaTop = gameRect.height - 120;
    
    // Item needs to be near the bottom of the game area
    if (y < bottomAreaTop - 10) {
      return null;
    }
    
    // Check which bin the item is over
    for (const bin of gameState.bins) {
      const binLeft = bin.position.x;
      const binRight = bin.position.x + bin.position.width;
      
      if (itemCenterX >= binLeft && itemCenterX <= binRight) {
        return bin.type;
      }
    }
    
    return null;
  };
  
  // Handle an item being placed in a bin
  const handleItemInBin = (itemId: string, binType: BinType) => {
    const item = gameState.wasteItems.find(item => item.id === itemId);
    
    if (!item || processedItemsRef.current.has(itemId)) return;
    
    processedItemsRef.current.add(itemId);
    
    let scoreChange = 0;
    
    // Check if correct bin
    if (item.type === binType) {
      // Correct bin - add points
      scoreChange = item.points;
    } else {
      // Incorrect bin - subtract points
      scoreChange = -item.points;
    }
    
    // Remove item and update score
    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreChange,
      wasteItems: prev.wasteItems.filter(w => w.id !== itemId),
    }));
  };
  
  // Handle an item dropping to the bottom
  const handleItemDropped = (itemId: string, x: number, y: number) => {
    const item = gameState.wasteItems.find(item => item.id === itemId);
    
    if (!item || processedItemsRef.current.has(itemId)) return;
    
    processedItemsRef.current.add(itemId);
    
    // Check if item falls directly into a bin
    const collidingBin = checkCollision(x, y);
    
    if (collidingBin && item.type === collidingBin) {
      // Correct bin - add points (natural drop into correct bin)
      setGameState(prev => ({
        ...prev,
        score: prev.score + item.points,
        wasteItems: prev.wasteItems.filter(w => w.id !== itemId),
      }));
    } else {
      // Subtract points for missed item or wrong bin
      setGameState(prev => ({
        ...prev,
        score: prev.score - item.points,
        wasteItems: prev.wasteItems.filter(w => w.id !== itemId),
      }));
    }
  };
  
  const restartGame = () => {
    if (spawnTimerRef.current) {
      clearTimeout(spawnTimerRef.current);
    }
    processedItemsRef.current.clear();
    startGame();
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Tri des déchets</h1>
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">
            Score: {gameState.score}
          </div>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={restartGame}
          >
            Redémarrer
          </button>
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
      >
        {/* Waste items */}
        {gameState.wasteItems.map(item => (
          <WasteItemComponent
            key={item.id}
            item={item}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onItemDropped={handleItemDropped}
            speed={item.speed}
            gameHeight={gameSize.height}
          />
        ))}
        
        {/* Bins */}
        {gameState.bins.map(bin => (
          <BinComponent
            key={bin.type}
            bin={bin}
            onCollision={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
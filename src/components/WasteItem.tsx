"use client";

import { useState, useRef, useEffect } from "react";
import { WasteItem } from "@/game/types";

interface WasteItemProps {
  item: WasteItem;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onItemDropped: (id: string, x: number, y: number) => void;
  speed: number;
  gameHeight: number;
}

// Component for a draggable waste item
export default function WasteItemComponent({
  item,
  onDragStart,
  onDragEnd,
  onItemDropped,
  speed,
  gameHeight,
}: WasteItemProps) {
  const [position, setPosition] = useState({ x: 0, y: -50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef({ x: 0, y: -50 });
  const isDraggingRef = useRef(false); // Reference to track dragging state in real-time
  const fallSpeedMultiplier = 1; // Increased speed multiplier
  
  // Keep the position ref in sync with state
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  
  // Keep the isDragging ref in sync with state
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);
  
  // Initialize position when component mounts
  useEffect(() => {
    // Random x position within the game area
    const randomX = Math.random() * (window.innerWidth - 100);
    const initialPosition = { x: randomX, y: -100 };
    setPosition(initialPosition);
    positionRef.current = initialPosition;
    lastTimeRef.current = Date.now();
    
    // Start the falling animation
    animationRef.current = requestAnimationFrame(updatePosition);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update the position of the falling waste item
  const updatePosition = () => {
    // Use the ref for immediate response to dragging state changes
    if (!isDraggingRef.current) {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      
      // Calculate new position with increased speed
      const currentPos = positionRef.current;
      const newY = currentPos.y + speed * fallSpeedMultiplier * deltaTime * 60;
      
      const newPosition = { ...currentPos, y: newY };
      positionRef.current = newPosition;
      setPosition(newPosition);
      
      // Check if item has reached the bottom
      if (newY > gameHeight - 50) {
        // Pass the final position when item is dropped to check if it's over a bin
        onItemDropped(item.id, currentPos.x, newY);
        return;
      }
    }
    
    animationRef.current = requestAnimationFrame(updatePosition);
  };

  // Start dragging the item
  const handleMouseDown = (e: React.MouseEvent) => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      
      // Update both state and ref for immediate effect
      setIsDragging(true);
      isDraggingRef.current = true;
      
      onDragStart(item.id);
      
      // Add global event listeners for more reliable dragging
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
  };
  
  // Global mouse move handler for more reliable dragging
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault(); // Prevent text selection during drag
      
      // Calculate new position in both axes (x and y)
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      
      const newPosition = { x, y };
      positionRef.current = newPosition;
      setPosition(newPosition);
    }
  };
  
  // Global mouse up handler
  const handleGlobalMouseUp = (e: MouseEvent) => {
    if (isDraggingRef.current) {
      // Update both state and ref
      setIsDragging(false);
      isDraggingRef.current = false;
      
      const currentPos = positionRef.current;
      onDragEnd(item.id, currentPos.x, currentPos.y);
      
      // Resume falling from current position
      lastTimeRef.current = Date.now();
      
      // Remove global event listeners
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  };

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className="absolute cursor-grab select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "50px",
        height: "50px",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 100 : 10,
      }}
      onMouseDown={handleMouseDown}
    >
      {item.imageUrl ? (
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-contain" 
          style={{ 
            width: "140px", // Increased from 100px
            height: "140px", // Increased from 100px
            position: "absolute",
            top: "-30px", // Adjusted to center the larger image
            left: "-40px" // Adjusted to center the larger image
          }}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center rounded-md bg-gray-100 shadow-md"
          style={{ border: `2px solid ${getBinColor(item.type)}` }}
        >
          <div className="text-xs text-center">{item.name}</div>
        </div>
      )}
    </div>
  );
}

// Helper function to get color based on bin type
function getBinColor(type: string): string {
  switch (type) {
    case "YELLOW": return "#F9DC5C";
    case "GREEN": return "#2BAC76";
    case "BROWN": return "#8D6449";
    case "COLLECTION": return "#E05780"; // Pink color for collection points
    case "GRAY": return "#A4A5A6";
    default: return "#CCCCCC";
  }
}
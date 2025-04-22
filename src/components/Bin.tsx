"use client";

import { Bin, BinType } from "@/game/types";

interface BinComponentProps {
  bin: Bin;
  onCollision: (binType: BinType, x: number, y: number, width: number) => void;
}

// Component for a waste bin
export default function BinComponent({ bin, onCollision }: BinComponentProps) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${bin.position.x}px`,
        width: `${bin.position.width}px`,
        height: "120px",
        bottom: "20px", // Added padding at the bottom to prevent cutting off
      }}
    >
      <div className="text-xs text-center mb-1">{bin.name}</div>
      
      {bin.imageUrl ? (
        <img
          src={bin.imageUrl}
          alt={bin.name}
          className="w-full h-full object-contain"
          data-bin-type={bin.type}
          style={{
            filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))",
            height: "150px"
          }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center rounded-t-lg shadow-md"
          style={{
            backgroundColor: getBinColor(bin.type),
            border: "2px solid #333",
          }}
          data-bin-type={bin.type}
        >
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-16 h-8 bg-black/20 rounded-full mb-1"
              style={{ border: "1px solid rgba(0,0,0,0.3)" }}
            ></div>
            <div className="text-sm font-bold text-center text-white">{getBinLabel(bin.type)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get color based on bin type
function getBinColor(type: BinType): string {
  switch (type) {
    case BinType.YELLOW: return "#F9DC5C";
    case BinType.GREEN: return "#2BAC76"; 
    case BinType.BROWN: return "#8D6449";
    case BinType.COLLECTION: return "#E05780"; // Pink color for collection points
    case BinType.GRAY: return "#A4A5A6";
    default: return "#CCCCCC";
  }
}

// Helper function to get label
function getBinLabel(type: BinType): string {
  switch (type) {
    case BinType.YELLOW: return "RECYCLABLES";
    case BinType.GREEN: return "VERRE";
    case BinType.BROWN: return "COMPOST";
    case BinType.COLLECTION: return "POINT D'APPORT";
    case BinType.GRAY: return "DÉCHETS";
    default: return "";
  }
}
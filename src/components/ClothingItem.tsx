
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface ClothingItemProps {
  id: string;
  type: string;
  name: string;
  src: string;
  isCustom?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const ClothingItem = ({
  id,
  type,
  name,
  src,
  isCustom = false,
  width = 20,
  height = 20,
  className
}: ClothingItemProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("application/json", JSON.stringify({
      id,
      type,
      src,
      width,
      height,
      isCustom
    }));
    e.dataTransfer.effectAllowed = "copy";
    
    // Use a ghost image if needed
    const img = new Image();
    img.src = src;
    e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={cn(
        "border rounded-md p-2 flex flex-col items-center draggable-item transition-all",
        isDragging ? "opacity-50 scale-105" : "opacity-100",
        isCustom && "border-primary",
        className
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-16 h-16 relative">
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mt-1 text-xs font-medium text-center truncate w-full">
        {name}
      </div>
    </div>
  );
};

export default ClothingItem;

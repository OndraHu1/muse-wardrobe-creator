
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ClothingItemProps {
  id: string;
  type: string;
  name: string;
  src: string;
  isCustom?: boolean;
  width?: number;
  height?: number;
  className?: string;
  onItemClick?: (item: Omit<ClothingItemProps, 'onItemClick'>) => void;
}

const ClothingItem = ({
  id,
  type,
  name,
  src,
  isCustom = false,
  width = 20,
  height = 20,
  className,
  onItemClick
}: ClothingItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const [isPressed, setIsPressed] = useState(false);

  // Pro desktopy - standardní drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    if (isMobile) return;
    
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
  
  // Pro mobily - implementace kliknutí
  const handleClick = () => {
    if (isMobile && onItemClick) {
      onItemClick({
        id,
        type,
        name,
        src,
        isCustom,
        width,
        height,
        className
      });
    }
  };
  
  const handlePressStart = () => {
    setIsPressed(true);
  };
  
  const handlePressEnd = () => {
    setIsPressed(false);
  };

  return (
    <div 
      className={cn(
        "border rounded-md p-2 flex flex-col items-center transition-all relative",
        isDragging ? "opacity-50 scale-105" : "opacity-100",
        isPressed ? "scale-95 bg-primary/10" : "",
        isCustom && "border-primary",
        isMobile ? "active:scale-95 active:bg-primary/10" : "draggable-item",
        className
      )}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
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
      
      {/* Efekt dotyku pro mobilní zařízení */}
      {isMobile && (
        <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 transition-opacity active:opacity-100" />
      )}
    </div>
  );
};

export default ClothingItem;

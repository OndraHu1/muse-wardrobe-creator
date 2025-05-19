import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CharacterDisplayProps {
  gender: 'male' | 'female';
  className?: string;
}

const CharacterDisplay = ({ gender, className }: CharacterDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [droppedItems, setDroppedItems] = useState<Array<{
    id: string;
    type: string;
    src: string;
    x: number;
    y: number;
    zIndex: number;
    width: number;
    height: number;
  }>>([]);
  
  // Updated character images with transparent backgrounds
  const characterSrc = gender === 'male' 
    ? "https://www.svgrepo.com/show/318940/male-body-shape.svg" // Male character silhouette
    : "https://www.svgrepo.com/show/318942/female-body-shape.svg"; // Female character silhouette

  useEffect(() => {
    // Set up drop target
    const container = containerRef.current;
    if (!container) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      container.classList.add("border-primary");
    };

    const handleDragLeave = () => {
      container.classList.remove("border-primary");
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      container.classList.remove("border-primary");
      
      if (!e.dataTransfer) return;
      
      const itemData = e.dataTransfer.getData("application/json");
      if (!itemData) return;
      
      try {
        const item = JSON.parse(itemData);
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        
        setDroppedItems(prev => [
          ...prev,
          {
            ...item,
            x,
            y,
            zIndex: prev.length + 1,
            width: item.width || 25, // Slightly bigger for better visibility
            height: item.height || 25 // Slightly bigger for better visibility
          }
        ]);
      } catch (error) {
        console.error("Failed to parse dropped item data:", error);
      }
    };

    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("dragleave", handleDragLeave);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("dragleave", handleDragLeave);
      container.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Handle repositioning of dropped items
  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    const item = droppedItems[index];
    e.dataTransfer.setData("application/json", JSON.stringify({
      ...item,
      index
    }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    
    const itemData = e.dataTransfer.getData("application/json");
    if (!itemData) return;
    
    try {
      const item = JSON.parse(itemData);
      
      if (typeof item.index === 'number') {
        // This is repositioning an existing item
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        
        setDroppedItems(prev => prev.map((prevItem, i) => 
          i === item.index ? { ...prevItem, x, y } : prevItem
        ));
      }
    } catch (error) {
      console.error("Failed to handle item drop:", error);
    }
  };

  const handleRemoveItem = (index: number) => {
    setDroppedItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative border-2 border-dashed rounded-lg overflow-hidden transition-colors",
        "flex items-center justify-center bg-muted/20 min-h-[500px]",
        className
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleItemDrop}
    >
      {/* Character base image */}
      <img 
        src={characterSrc} 
        alt={gender === 'male' ? "Mužská postava" : "Ženská postava"}
        className="max-h-full max-w-full object-contain"
        style={{ maxHeight: "90%" }}
      />

      {/* Dropped clothing items */}
      {droppedItems.map((item, index) => (
        <div 
          key={`${item.id}-${index}`}
          className="absolute draggable-item cursor-move hover:ring-2 ring-primary"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.width}%`,
            height: `${item.height}%`,
            zIndex: item.zIndex,
            transform: "translate(-50%, -50%)"
          }}
          draggable
          onDragStart={(e) => handleItemDragStart(e, index)}
        >
          <img 
            src={item.src} 
            alt={item.type} 
            className="w-full h-full object-contain"
          />
          <button
            onClick={() => handleRemoveItem(index)}
            className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center -mt-2 -mr-2"
            aria-label="Odstranit"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default CharacterDisplay;

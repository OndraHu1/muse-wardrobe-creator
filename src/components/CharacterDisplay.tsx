
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Camera, RotateCcw, Copy, Trash2, MoveHorizontal, MoveVertical } from "lucide-react";
import type { ClothingItemProps } from "./ClothingItem";

interface CharacterDisplayProps {
  gender: 'male' | 'female' | 'boy' | 'girl';
  className?: string;
  onAddItemSuccess?: () => void;
}

const CharacterDisplay = ({ gender, className, onAddItemSuccess }: CharacterDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
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
  
  // Selected item for resizing and dragging on mobile
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // Hodnoty pro ovládání pomocí tlačítek
  const moveStep = 2; // Velikost kroku pohybu v procentech
  const sizeStep = 2; // Velikost kroku změny velikosti v procentech
  
  // Efekty položek
  const [itemEffects, setItemEffects] = useState<Record<number, { 
    rotation: number,
    flipped: boolean,
    opacity: number
  }>>({});
  const [lastClickPosition, setLastClickPosition] = useState<{ x: number, y: number } | null>(null);
  
  // Použití lokálních obrázků postav z našich složek
  const getCharacterSrc = () => {
    // Fallback pokud obrázky nejsou k dispozici
    const fallbackImage = "/fallback-figure.svg";
    
    try {
      switch(gender) {
        case 'male':
          return "/Muz/muz.png";
        case 'female':
          return "/Zena/zena.png";
        case 'boy':
          return "/Chlapec/chlapec.png";
        case 'girl':
          return "/Devce/devce.png";
        default:
          return "/Muz/muz.png";
      }
    } catch (e) {
      console.error("Chyba při načítání obrázku:", e);
      return fallbackImage;
    }
  };
  
  const characterSrc = getCharacterSrc();

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
        
        // Kontrola, zda nejde o přesun existujícího prvku
        // Pokud item obsahuje index nebo příznak isExistingItem, znamená to, že jde o přesun existujícího oblečení
        if (typeof item.index === 'number' || item.isExistingItem === true) {
          console.log("Detekován přesun existujícího prvku, nebude přidán nový");
          // Tento případ bude zpracován v handleItemDrop
          return;
        }
        
        // Jde o nový prvek z menu oblečení, přidáme ho
        setDroppedItems(prev => [
          ...prev,
          {
            ...item,
            x,
            y,
            zIndex: prev.length + 1,
            width: item.width || 25,
            height: item.height || 25
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
    
    // Přidáme příznak, že jde o existující prvek
    const item = droppedItems[index];
    
    // Důležité je přidat index, aby bylo jasné, že jde o přesun existujícího prvku
    e.dataTransfer.setData("application/json", JSON.stringify({
      ...item,
      index,
      isExistingItem: true // Explicitní příznak pro lepší kontrolu
    }));
    
    // Nastavení efektu pro přesun (ne kopírování)
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Zajistí, že se událost nebude šířit dále
    
    const container = containerRef.current;
    if (!container) return;
    
    const itemData = e.dataTransfer.getData("application/json");
    if (!itemData) return;
    
    try {
      const item = JSON.parse(itemData);
      
      if (typeof item.index === 'number' || item.isExistingItem === true) {
        // Přesun existujícího prvku
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        
        // Aktualizujeme pozici pouze pokud máme validní index
        if (typeof item.index === 'number') {
          setDroppedItems(prev => prev.map((prevItem, i) => 
            i === item.index ? { ...prevItem, x, y } : prevItem
          ));
        }
      }
      // Ignorujeme případy, kdy nemáme index - ty jsou zpracovány v handleDrop
    } catch (error) {
      console.error("Failed to handle item drop:", error);
    }
  };

  const handleRemoveItem = (index: number) => {
    setDroppedItems(prev => prev.filter((_, i) => i !== index));
  };

  // Resize functionality
  const handleResizeStart = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item = droppedItems[index];
    setSelectedItem(index);
    setIsResizing(true);
    setStartSize({ width: item.width, height: item.height });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = (e: React.MouseEvent) => {
    if (!isResizing || selectedItem === null) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    // Přímá změna velikosti bez faktoru citlivosti pro přesnější ovládání
    const widthChange = (deltaX / containerRect.width) * 100;
    const heightChange = (deltaY / containerRect.height) * 100;
    
    setDroppedItems(prev => prev.map((item, i) => {
      if (i === selectedItem) {
        return {
          ...item,
          width: Math.max(5, startSize.width + widthChange), // Minimum 5% width
          height: Math.max(5, startSize.height + heightChange) // Minimum 5% height
        };
      }
      return item;
    }));
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setSelectedItem(null);
  };

  // Add event listeners for resize
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => {
        handleResizeMove(e as unknown as React.MouseEvent);
      };
      
      const handleMouseUp = () => {
        handleResizeEnd();
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Funkce pro zpracování dotykových událostí pro mobilní zařízení
  // Pohyb pomocí tlačítek
  const moveItem = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (selectedItem === null) return;
    
    setDroppedItems(prev => prev.map((item, i) => {
      if (i === selectedItem) {
        let newX = item.x;
        let newY = item.y;
        
        switch (direction) {
          case 'up':
            newY = Math.max(0, item.y - moveStep);
            break;
          case 'down':
            newY = Math.min(100, item.y + moveStep);
            break;
          case 'left':
            newX = Math.max(0, item.x - moveStep);
            break;
          case 'right':
            newX = Math.min(100, item.x + moveStep);
            break;
        }
        
        return { ...item, x: newX, y: newY };
      }
      return item;
    }));
  };
  
  // Změna velikosti pomocí tlačítek
  const resizeItem = (action: 'wider' | 'narrower' | 'taller' | 'shorter') => {
    if (selectedItem === null) return;
    
    setDroppedItems(prev => prev.map((item, i) => {
      if (i === selectedItem) {
        let newWidth = item.width;
        let newHeight = item.height;
        
        switch (action) {
          case 'wider':
            newWidth = Math.min(100, item.width + sizeStep);
            break;
          case 'narrower':
            newWidth = Math.max(5, item.width - sizeStep);
            break;
          case 'taller':
            newHeight = Math.min(100, item.height + sizeStep);
            break;
          case 'shorter':
            newHeight = Math.max(5, item.height - sizeStep);
            break;
        }
        
        return { ...item, width: newWidth, height: newHeight };
      }
      return item;
    }));
  };
  
  // Jednoduchý výběr prvku kliknutím
  const handleItemClick = (index: number) => {
    setSelectedItem(index === selectedItem ? null : index);
  };
  
  // Funkce pro přidání položky po kliknutí (pro mobilní zařízení)
  const handleAddItemFromClick = (item: Omit<ClothingItemProps, 'onItemClick'>) => {
    const container = containerRef.current;
    if (!container) return;
    
    // Pokud máme poslední kliknutí, použijeme jeho pozici, jinak položíme na střed
    const position = lastClickPosition || { x: 50, y: 50 };
    
    // Přidáme položku do seznamu
    setDroppedItems(prev => [
      ...prev,
      {
        ...item,
        x: position.x,
        y: position.y,
        zIndex: prev.length + 1,
        width: item.width || 25,
        height: item.height || 25
      }
    ]);
    
    // Oznámíme úspěšné přidání
    if (onAddItemSuccess) {
      onAddItemSuccess();
    }
    
    // Pro lepší UI zážitek, vybereme přidaný prvek
    setTimeout(() => {
      setSelectedItem(droppedItems.length);
    }, 100);
  };
  
  // Funkce pro zaznamenání pozice kliknutí na plátno
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isMobile) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Resetujeme vybraný prvek
    setSelectedItem(null);
    
    // Uložíme pozici kliknutí pro pozdější použití
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setLastClickPosition({ x, y });
  };
  
  // Funkce pro rotaci položky
  const rotateItem = (direction: 'clockwise' | 'counterclockwise') => {
    if (selectedItem === null) return;
    
    setItemEffects(prev => {
      const currentEffect = prev[selectedItem] || { rotation: 0, flipped: false, opacity: 1 };
      const rotationChange = direction === 'clockwise' ? 15 : -15;
      
      return {
        ...prev,
        [selectedItem]: {
          ...currentEffect,
          rotation: currentEffect.rotation + rotationChange
        }
      };
    });
  };
  
  // Funkce pro duplikování položky
  const duplicateItem = () => {
    if (selectedItem === null) return;
    
    const itemToDuplicate = droppedItems[selectedItem];
    
    setDroppedItems(prev => [
      ...prev,
      {
        ...itemToDuplicate,
        id: `${itemToDuplicate.id}-copy-${Date.now()}`,
        x: itemToDuplicate.x + 5,
        y: itemToDuplicate.y + 5,
        zIndex: prev.length + 1
      }
    ]);
    
    // Vybereme novou položku
    setTimeout(() => {
      setSelectedItem(droppedItems.length);
    }, 100);
  };
  
  // Funkce pro přepnutí zrcadlení
  const toggleFlip = () => {
    if (selectedItem === null) return;
    
    setItemEffects(prev => {
      const currentEffect = prev[selectedItem] || { rotation: 0, flipped: false, opacity: 1 };
      return {
        ...prev,
        [selectedItem]: {
          ...currentEffect,
          flipped: !currentEffect.flipped
        }
      };
    });
  };
  
  // Funkce pro úpravu průhlednosti
  const adjustOpacity = (value: number) => {
    if (selectedItem === null) return;
    
    setItemEffects(prev => {
      const currentEffect = prev[selectedItem] || { rotation: 0, flipped: false, opacity: 1 };
      return {
        ...prev,
        [selectedItem]: {
          ...currentEffect,
          opacity: Math.min(1, Math.max(0.1, (currentEffect.opacity || 1) + value))
        }
      };
    });
  };
  
  // Funkce pro reset efektů položky
  const resetItemEffects = () => {
    if (selectedItem === null) return;
    
    setItemEffects(prev => {
      const newEffects = { ...prev };
      delete newEffects[selectedItem];
      return newEffects;
    });
  };
  
  // Funkce pro vytvoření snímku aktuálně vytvořené postavy
  const saveSnapshot = () => {
    const container = containerRef.current;
    if (!container) return;
    
    try {
      // Vytvoření canvas pro snímek
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Nastavení velikosti canvas
      const containerRect = container.getBoundingClientRect();
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      
      // Vykreslení html2canvas kódu
      const html2canvas = import('html2canvas').then(async (module) => {
        const html2canvas = module.default;
        
        const snapshot = await html2canvas(container, {
          backgroundColor: null,
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        // Vytvoření odkazu pro stažení
        const link = document.createElement('a');
        link.download = `postava-${gender}-${Date.now()}.png`;
        link.href = snapshot.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(error => {
        console.error('Chyba při vytváření snímku:', error);
        alert('Nepodařilo se vytvořit snímek. ' + error.message);
      });
    } catch (error) {
      console.error('Chyba při vytváření snímku:', error);
      alert('Nepodařilo se vytvořit snímek.');
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Panel menu pro mobilní verzi */}
      {isMobile && selectedItem !== null && (
        <div className="flex flex-col gap-2 p-3 mb-2 border rounded bg-background shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Úprava položky</span>
            <div className="flex gap-1">
              <button 
                className="p-1 rounded hover:bg-primary/10 text-primary"
                onClick={() => duplicateItem()}
                title="Duplikovat"
              >
                <Copy size={16} />
              </button>
              <button 
                className="p-1 text-red-500 rounded hover:bg-red-50"
                onClick={() => handleRemoveItem(selectedItem)}
                title="Odstranit"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Ovládací prvky pro pohyb */}
          <div className="grid grid-cols-3 gap-1 my-1">
            <div className="col-start-2">
              <button 
                className="w-full p-2 border rounded-lg hover:bg-primary/10 flex items-center justify-center"
                onClick={() => moveItem('up')}
                aria-label="Posunout nahoru"
              >
                <MoveVertical size={16} className="rotate-180" />
              </button>
            </div>
            <div className="col-start-1 row-start-2">
              <button 
                className="w-full p-2 border rounded-lg hover:bg-primary/10 flex items-center justify-center"
                onClick={() => moveItem('left')}
                aria-label="Posunout doleva"
              >
                <MoveHorizontal size={16} className="rotate-180" />
              </button>
            </div>
            <div className="col-start-3 row-start-2">
              <button 
                className="w-full p-2 border rounded-lg hover:bg-primary/10 flex items-center justify-center"
                onClick={() => moveItem('right')}
                aria-label="Posunout doprava"
              >
                <MoveHorizontal size={16} />
              </button>
            </div>
            <div className="col-start-2 row-start-2">
              <button 
                className="w-full p-2 border rounded-lg text-sm font-bold hover:bg-primary/10"
                onClick={() => setSelectedItem(null)}
                aria-label="Hotovo"
              >
                OK
              </button>
            </div>
            <div className="col-start-2 row-start-3">
              <button 
                className="w-full p-2 border rounded-lg hover:bg-primary/10 flex items-center justify-center"
                onClick={() => moveItem('down')}
                aria-label="Posunout dolů"
              >
                <MoveVertical size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mt-1">
            <div className="flex-1">
              <div className="text-xs font-medium mb-1 text-center">Otáčení</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  className="p-2 border rounded hover:bg-primary/10 flex items-center justify-center"
                  onClick={() => rotateItem('counterclockwise')}
                  aria-label="Otočit doleva"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 flex items-center justify-center"
                  onClick={() => rotateItem('clockwise')}
                  aria-label="Otočit doprava"
                >
                  <RotateCcw size={16} className="rotate-180" />
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="text-xs font-medium mb-1 text-center">Velikost</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => resizeItem('wider')}
                >
                  Širší
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => resizeItem('narrower')}
                >
                  Užší
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => resizeItem('taller')}
                >
                  Vyšší
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => resizeItem('shorter')}
                >
                  Nižší
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mt-1">
            <div className="flex-1">
              <div className="text-xs font-medium mb-1 text-center">Efekty</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => toggleFlip()}
                >
                  Zrcadlit
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => adjustOpacity(-0.1)}
                >
                  Průhlednější
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => adjustOpacity(0.1)}
                >
                  Neprůhlednější
                </button>
                <button 
                  className="p-2 border rounded hover:bg-primary/10 text-xs"
                  onClick={() => resetItemEffects()}
                >
                  Reset efektů
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-1 mt-1">
            <button 
              className="p-2 border rounded hover:bg-primary/10 text-xs flex items-center justify-center gap-1"
              onClick={duplicateItem}
            >
              <Copy size={14} />
              Duplikovat
            </button>
          </div>
        </div>
      )}
      
      {/* Hlavní plocha s postavou */}
      <div className="relative w-full">
        {/* Tlačítko pro vytvoření a stažení snímku */}
        <Button 
          onClick={saveSnapshot}
          className="absolute top-2 right-2 z-10 flex items-center gap-2"
          size="sm"
        >
          <Camera size={16} />
          <span>{isMobile ? "Uložit" : "Uložit obrázek"}</span>
        </Button>
        
        <div 
          ref={containerRef}
          className={cn(
            "relative border-2 border-dashed rounded-lg overflow-hidden transition-colors",
            "flex items-center justify-center bg-muted/20 min-h-[500px] w-full",
            className
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleItemDrop}
        >
        {/* Character base image */}
        <div className="relative flex items-center justify-center h-full" style={{maxWidth: "80%"}}>
          <img 
            src={characterSrc} 
            alt={`${gender} postava`}
            className="max-h-full max-w-full object-contain"
            style={{ maxHeight: "90%" }}
            onError={(e) => {
              console.warn("Obrázek se nepodařilo načíst, používám fallback");
              e.currentTarget.src = "/fallback-figure.svg";
            }}
          />
          
          {/* Položky oblečení jsou umístěny relativně vůči postavě */}
          {droppedItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              className={cn(
                "absolute draggable-item",
                isMobile ? "touch-manipulation" : "cursor-move",
                selectedItem === index ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary"
              )}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.width}%`,
                height: `${item.height}%`,
                zIndex: item.zIndex,
                opacity: itemEffects[index]?.opacity !== undefined ? itemEffects[index].opacity : 1,
                transform: `translate(-50%, -50%) ${itemEffects[index]?.flipped ? 'scaleX(-1)' : ''} rotate(${(itemEffects[index]?.rotation || 0)}deg)`
              }}
              draggable={!isMobile}
              onDragStart={isMobile ? undefined : (e) => handleItemDragStart(e, index)}
              onClick={() => handleItemClick(index)}
            >
              <img 
                src={item.src} 
                alt={item.type} 
                className="w-full h-full object-contain"
              />
              
              {/* Remove button - skrytý na mobilních zařízeních */}
              {!isMobile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(index);
                  }}
                  className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center -mt-2 -mr-2"
                  aria-label="Odstranit"
                >
                  ×
                </button>
              )}
              
              {/* Indikátor, že je prvek vybraný (pouze pokud není mobilní zařízení) */}
              {selectedItem === index && !isMobile && (
                <div 
                  className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full"
                  style={{ cursor: 'se-resize', touchAction: 'none' }}
                  onMouseDown={(e) => handleResizeStart(e, index)}
                />
              )}
              
              {/* Zvýraznění vybrané položky na mobilních zařízeních */}
              {selectedItem === index && isMobile && (
                <div className="absolute inset-0 border-2 border-primary rounded"></div>
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDisplay;

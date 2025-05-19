
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { ClothingItemProps } from './ClothingItem';

interface CustomDesignerProps {
  addCustomItem: (item: ClothingItemProps) => void;
}

const CustomDesigner = ({ addCustomItem }: CustomDesignerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState([5]);
  const [itemName, setItemName] = useState('Vlastní návrh');
  const [itemType, setItemType] = useState<'top' | 'bottom' | 'hat' | 'footwear'>('top');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Initialize with transparent background
    clearCanvas();
    
    // Setup drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position for mouse or touch
    let x, y;
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth[0];
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position for mouse or touch
    let x, y;
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a thin border to show canvas boundaries
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };
  
  const saveDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      // Use PNG format to preserve transparency
      const dataUrl = canvas.toDataURL('image/png');
      const newItem: ClothingItemProps = {
        id: `custom-${Date.now()}`,
        type: itemType,
        name: itemName || 'Vlastní návrh',
        src: dataUrl,
        isCustom: true,
        width: 25,
        height: 25
      };
      
      addCustomItem(newItem);
      toast.success('Váš návrh byl uložen!');
      clearCanvas();
      setItemName('Vlastní návrh');
    } catch (error) {
      console.error('Failed to save design:', error);
      toast.error('Něco se pokazilo při ukládání vašeho návrhu.');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">Vytvořit vlastní návrh</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="itemName" className="block text-sm font-medium">
              Název návrhu
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Zadejte název..."
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="itemType" className="block text-sm font-medium">
              Typ oblečení
            </label>
            <select
              id="itemType"
              value={itemType}
              onChange={(e) => setItemType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="top">Topy</option>
              <option value="bottom">Kalhoty</option>
              <option value="hat">Pokrývky hlavy</option>
              <option value="footwear">Obuv</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">
              Barva čáry
            </label>
            <div 
              className="w-8 h-8 rounded-full border" 
              style={{ backgroundColor: color }}
            ></div>
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Tloušťka čáry: {lineWidth[0]}px
          </label>
          <Slider
            value={lineWidth}
            onValueChange={setLineWidth}
            min={1}
            max={20}
            step={1}
          />
        </div>
        
        <div className="border rounded bg-transparent aspect-square w-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full custom-drawing-canvas bg-white/10"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearCanvas} className="flex-1">
            Vymazat
          </Button>
          <Button onClick={saveDesign} className="flex-1">
            Uložit návrh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomDesigner;

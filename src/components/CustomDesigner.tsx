
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { ClothingItemProps } from './ClothingItem';
import { Paintbrush, Square, Circle, Type, Pipette, Trash2 } from 'lucide-react';

interface CustomDesignerProps {
  addCustomItem: (item: ClothingItemProps) => void;
}

type DrawingTool = 'brush' | 'fill' | 'rectangle' | 'circle' | 'line' | 'text' | 'eraser';

const CustomDesigner = ({ addCustomItem }: CustomDesignerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState([5]);
  const [itemName, setItemName] = useState('Vlastní návrh');
  const [itemType, setItemType] = useState<'top' | 'bottom' | 'hat' | 'footwear'>('top');
  const [drawingTool, setDrawingTool] = useState<DrawingTool>('brush');
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number, y: number } | null>(null);
  
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

  // Get position from mouse or touch event
  const getEventPosition = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const pos = getEventPosition(e, canvas);
    setStartPos(pos);
    
    if (drawingTool === 'brush' || drawingTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = drawingTool === 'eraser' ? 'rgba(0,0,0,0)' : color;
      ctx.lineWidth = lineWidth[0];
      ctx.globalCompositeOperation = drawingTool === 'eraser' ? 'destination-out' : 'source-over';
    } else if (drawingTool === 'text') {
      setTextPosition(pos);
      setShowTextInput(true);
    } else if (drawingTool === 'fill') {
      floodFill(canvas, pos.x, pos.y, hexToRgba(color));
    }
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || drawingTool === 'fill' || drawingTool === 'text') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getEventPosition(e, canvas);
    
    if (drawingTool === 'brush' || drawingTool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(false);
    
    if (startPos && ['rectangle', 'circle', 'line'].includes(drawingTool)) {
      const mouseEvent = window.event as MouseEvent;
      const pos = { 
        x: 0, 
        y: 0 
      };
      
      if (mouseEvent) {
        const rect = canvas.getBoundingClientRect();
        pos.x = mouseEvent.clientX - rect.left;
        pos.y = mouseEvent.clientY - rect.top;
      }
      
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth[0];
      ctx.globalCompositeOperation = 'source-over';
      
      if (drawingTool === 'rectangle') {
        ctx.beginPath();
        ctx.rect(
          Math.min(startPos.x, pos.x),
          Math.min(startPos.y, pos.y),
          Math.abs(pos.x - startPos.x),
          Math.abs(pos.y - startPos.y)
        );
        ctx.stroke();
      } else if (drawingTool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pos.x - startPos.x, 2) + 
          Math.pow(pos.y - startPos.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (drawingTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    }
    
    setStartPos(null);
  };

  // Convert hex color to rgba format
  const hexToRgba = (hex: string, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, a: Math.floor(alpha * 255) };
  };

  // Flood fill algorithm
  const floodFill = (canvas: HTMLCanvasElement, x: number, y: number, fillColor: { r: number, g: number, b: number, a: number }) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    x = Math.floor(x);
    y = Math.floor(y);
    
    const getPixelIndex = (x: number, y: number) => (y * width + x) * 4;
    const targetIdx = getPixelIndex(x, y);
    
    // Get target color (what we're replacing)
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];
    const targetA = data[targetIdx + 3];
    
    // Return if the target is the same as fill color
    if (
      targetR === fillColor.r &&
      targetG === fillColor.g &&
      targetB === fillColor.b &&
      targetA === fillColor.a
    ) {
      return;
    }
    
    // Use a queue for flood fill to avoid stack overflow
    const queue: [number, number][] = [];
    queue.push([x, y]);
    
    while (queue.length > 0) {
      const [currX, currY] = queue.shift()!;
      
      if (
        currX < 0 || currX >= width ||
        currY < 0 || currY >= height
      ) {
        continue;
      }
      
      const idx = getPixelIndex(currX, currY);
      
      // Check if this pixel matches what we're replacing
      if (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      ) {
        // Fill the pixel
        data[idx] = fillColor.r;
        data[idx + 1] = fillColor.g;
        data[idx + 2] = fillColor.b;
        data[idx + 3] = fillColor.a;
        
        // Add neighbors to queue
        queue.push([currX + 1, currY]);
        queue.push([currX - 1, currY]);
        queue.push([currX, currY + 1]);
        queue.push([currX, currY - 1]);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  const addTextToCanvas = () => {
    if (!textInput || !textPosition) {
      setShowTextInput(false);
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = color;
    ctx.font = `${lineWidth[0] * 3}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    setShowTextInput(false);
    setTextInput('');
    setTextPosition(null);
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
              Barva
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
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant={drawingTool === 'brush' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('brush')}
            title="Štětec"
          >
            <Paintbrush size={16} />
          </Button>
          {/* Swapped fill and eyedropper positions */}
          <Button 
            variant={drawingTool === 'fill' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('fill')}
            title="Výplň (Kyblík)"
          >
            <Pipette size={16} />
          </Button>
          <Button 
            variant={drawingTool === 'line' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('line')}
            title="Čára"
          >
            ⎯
          </Button>
          <Button 
            variant={drawingTool === 'rectangle' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('rectangle')}
            title="Obdélník"
          >
            <Square size={16} />
          </Button>
          <Button 
            variant={drawingTool === 'circle' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('circle')}
            title="Kruh"
          >
            <Circle size={16} />
          </Button>
          <Button 
            variant={drawingTool === 'text' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('text')}
            title="Text"
          >
            <Type size={16} />
          </Button>
          <Button 
            variant={drawingTool === 'eraser' ? "default" : "outline"} 
            size="sm"
            onClick={() => setDrawingTool('eraser')}
            title="Guma"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        
        <div className="border rounded bg-transparent aspect-square w-full relative">
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
          
          {showTextInput && (
            <div className="absolute top-0 left-0 right-0 mt-4 mx-4 bg-background p-2 rounded-md border shadow-md">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Zadejte text..."
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTextInput(false)}
                >
                  Zrušit
                </Button>
                <Button 
                  size="sm" 
                  onClick={addTextToCanvas}
                >
                  Přidat
                </Button>
              </div>
            </div>
          )}
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

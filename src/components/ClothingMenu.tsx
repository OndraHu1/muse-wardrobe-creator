
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClothingItem, { ClothingItemProps } from "./ClothingItem";
import { Shirt, Pants, Hat, Shoes } from "lucide-react";

interface ClothingMenuProps {
  customItems: ClothingItemProps[];
  gender: 'male' | 'female';
}

const ClothingMenu = ({ customItems, gender }: ClothingMenuProps) => {
  // Static clothing items categorized by type
  const [clothingItems, setClothingItems] = useState<{
    tops: ClothingItemProps[];
    bottoms: ClothingItemProps[];
    hats: ClothingItemProps[];
    footwear: ClothingItemProps[];
  }>({
    tops: [],
    bottoms: [],
    hats: [],
    footwear: []
  });

  useEffect(() => {
    // In a real app, you might fetch this from an API based on gender selection
    const maleItems = {
      tops: [
        { id: "m-shirt-1", type: "top", name: "Tričko", src: "/placeholder.svg" },
        { id: "m-shirt-2", type: "top", name: "Košile", src: "/placeholder.svg" }
      ],
      bottoms: [
        { id: "m-pants-1", type: "bottom", name: "Kalhoty", src: "/placeholder.svg" },
        { id: "m-pants-2", type: "bottom", name: "Džíny", src: "/placeholder.svg" }
      ],
      hats: [
        { id: "m-hat-1", type: "hat", name: "Klobouk", src: "/placeholder.svg" },
        { id: "m-hat-2", type: "hat", name: "Čepice", src: "/placeholder.svg" }
      ],
      footwear: [
        { id: "m-shoes-1", type: "footwear", name: "Boty", src: "/placeholder.svg" },
        { id: "m-shoes-2", type: "footwear", name: "Sandály", src: "/placeholder.svg" }
      ]
    };

    const femaleItems = {
      tops: [
        { id: "f-shirt-1", type: "top", name: "Halenka", src: "/placeholder.svg" },
        { id: "f-shirt-2", type: "top", name: "Tričko", src: "/placeholder.svg" }
      ],
      bottoms: [
        { id: "f-skirt-1", type: "bottom", name: "Sukně", src: "/placeholder.svg" },
        { id: "f-pants-1", type: "bottom", name: "Kalhoty", src: "/placeholder.svg" }
      ],
      hats: [
        { id: "f-hat-1", type: "hat", name: "Klobouk", src: "/placeholder.svg" },
        { id: "f-hat-2", type: "hat", name: "Čelenka", src: "/placeholder.svg" }
      ],
      footwear: [
        { id: "f-shoes-1", type: "footwear", name: "Boty", src: "/placeholder.svg" },
        { id: "f-shoes-2", type: "footwear", name: "Sandály", src: "/placeholder.svg" }
      ]
    };

    setClothingItems(gender === 'male' ? maleItems : femaleItems);
  }, [gender]);

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <Tabs defaultValue="tops">
        <TabsList className="w-full grid grid-cols-5 h-auto">
          <TabsTrigger value="tops" className="py-2 flex flex-col items-center">
            <Shirt className="h-4 w-4 mb-1" />
            <span className="text-xs">Topy</span>
          </TabsTrigger>
          <TabsTrigger value="bottoms" className="py-2 flex flex-col items-center">
            <Pants className="h-4 w-4 mb-1" />
            <span className="text-xs">Kalhoty</span>
          </TabsTrigger>
          <TabsTrigger value="hats" className="py-2 flex flex-col items-center">
            <Hat className="h-4 w-4 mb-1" />
            <span className="text-xs">Pokrývky</span>
          </TabsTrigger>
          <TabsTrigger value="footwear" className="py-2 flex flex-col items-center">
            <Shoes className="h-4 w-4 mb-1" />
            <span className="text-xs">Obuv</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="py-2 flex flex-col items-center">
            <span className="h-4 w-4 mb-1">✏️</span>
            <span className="text-xs">Vlastní</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4 max-h-[300px] overflow-y-auto">
          <TabsContent value="tops" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.tops.map((item) => (
              <ClothingItem key={item.id} {...item} />
            ))}
          </TabsContent>
          
          <TabsContent value="bottoms" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.bottoms.map((item) => (
              <ClothingItem key={item.id} {...item} />
            ))}
          </TabsContent>
          
          <TabsContent value="hats" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.hats.map((item) => (
              <ClothingItem key={item.id} {...item} />
            ))}
          </TabsContent>
          
          <TabsContent value="footwear" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.footwear.map((item) => (
              <ClothingItem key={item.id} {...item} />
            ))}
          </TabsContent>
          
          <TabsContent value="custom" className="grid grid-cols-3 gap-2 mt-0">
            {customItems.length > 0 ? (
              customItems.map((item) => (
                <ClothingItem key={item.id} {...item} isCustom />
              ))
            ) : (
              <p className="col-span-3 text-center text-muted-foreground py-4">
                Zatím žádné vlastní oblečení. Vytvořte si vlastní návrh pomocí nástroje dole.
              </p>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ClothingMenu;

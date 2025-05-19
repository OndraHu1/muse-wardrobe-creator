
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClothingItem, { ClothingItemProps } from "./ClothingItem";
import { Shirt, User, GraduationCap, Footprints } from "lucide-react";

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
    // Real online images with transparent backgrounds
    const maleItems = {
      tops: [
        { id: "m-shirt-1", type: "top", name: "Tričko", src: "https://i.imgur.com/6RmLZoE.png" },
        { id: "m-shirt-2", type: "top", name: "Košile", src: "https://i.imgur.com/z5mZ4Pg.png" }
      ],
      bottoms: [
        { id: "m-pants-1", type: "bottom", name: "Kalhoty", src: "https://i.imgur.com/uJyfpce.png" },
        { id: "m-pants-2", type: "bottom", name: "Džíny", src: "https://i.imgur.com/3njxPMo.png" }
      ],
      hats: [
        { id: "m-hat-1", type: "hat", name: "Klobouk", src: "https://i.imgur.com/8yDXi0A.png" },
        { id: "m-hat-2", type: "hat", name: "Čepice", src: "https://i.imgur.com/AYwS92h.png" }
      ],
      footwear: [
        { id: "m-shoes-1", type: "footwear", name: "Boty", src: "https://i.imgur.com/mTZuTBj.png" },
        { id: "m-shoes-2", type: "footwear", name: "Sandály", src: "https://i.imgur.com/ODiPJPH.png" }
      ]
    };

    const femaleItems = {
      tops: [
        { id: "f-shirt-1", type: "top", name: "Halenka", src: "https://i.imgur.com/Z9YHylf.png" },
        { id: "f-shirt-2", type: "top", name: "Tričko", src: "https://i.imgur.com/dXSgVh0.png" }
      ],
      bottoms: [
        { id: "f-skirt-1", type: "bottom", name: "Sukně", src: "https://i.imgur.com/vpHLLZ2.png" },
        { id: "f-pants-1", type: "bottom", name: "Kalhoty", src: "https://i.imgur.com/F5eDXjH.png" }
      ],
      hats: [
        { id: "f-hat-1", type: "hat", name: "Klobouk", src: "https://i.imgur.com/URonWK6.png" },
        { id: "f-hat-2", type: "hat", name: "Čelenka", src: "https://i.imgur.com/vLnKGro.png" }
      ],
      footwear: [
        { id: "f-shoes-1", type: "footwear", name: "Boty", src: "https://i.imgur.com/XKzxZdf.png" },
        { id: "f-shoes-2", type: "footwear", name: "Sandály", src: "https://i.imgur.com/kLSMu4V.png" }
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
            <User className="h-4 w-4 mb-1" />
            <span className="text-xs">Kalhoty</span>
          </TabsTrigger>
          <TabsTrigger value="hats" className="py-2 flex flex-col items-center">
            <GraduationCap className="h-4 w-4 mb-1" />
            <span className="text-xs">Pokrývky</span>
          </TabsTrigger>
          <TabsTrigger value="footwear" className="py-2 flex flex-col items-center">
            <Footprints className="h-4 w-4 mb-1" />
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

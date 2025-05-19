
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClothingItem, { ClothingItemProps } from "./ClothingItem";
import { Shirt, User, GraduationCap, Footprints } from "lucide-react";

interface ClothingMenuProps {
  customItems: ClothingItemProps[];
  gender: 'male' | 'female' | 'boy' | 'girl';
  onItemClick?: (item: Omit<ClothingItemProps, 'onItemClick'>) => void;
}

const ClothingMenu = ({ customItems, gender, onItemClick }: ClothingMenuProps) => {
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
    // Použití lokálních obrázků ze složek
    const maleItems = {
      tops: [
        { id: "m-shirt-1", type: "top", name: "Tričko 1", src: "/Muz/muz_obleceni_1.png", width: 30, height: 30 },
        { id: "m-shirt-2", type: "top", name: "Tričko 2", src: "/Muz/muz_obleceni_2.png", width: 30, height: 30 },
        { id: "m-shirt-3", type: "top", name: "Tričko 3", src: "/Muz/muz_obleceni_3.png", width: 30, height: 30 },
        { id: "m-shirt-4", type: "top", name: "Tričko 4", src: "/Muz/muz_obleceni_4.png", width: 30, height: 30 },
        { id: "m-shirt-5", type: "top", name: "Tričko 5", src: "/Muz/muz_obleceni_5.png", width: 30, height: 30 },
      ],
      bottoms: [
        { id: "m-pants-1", type: "bottom", name: "Kalhoty 1", src: "/Muz/muz_obleceni_6.png", width: 30, height: 40 },
        { id: "m-pants-2", type: "bottom", name: "Kalhoty 2", src: "/Muz/muz_obleceni_7.png", width: 30, height: 40 },
        { id: "m-pants-3", type: "bottom", name: "Kalhoty 3", src: "/Muz/muz_obleceni_9.png", width: 30, height: 40 },
      ],
      hats: [
        { id: "m-hat-1", type: "hat", name: "Klobouk", src: "https://www.svgrepo.com/show/378172/hat-clothing-fashion.svg", width: 25, height: 20 },
        { id: "m-hat-2", type: "hat", name: "Čepice", src: "https://www.svgrepo.com/show/378171/cap-clothing-fashion.svg", width: 25, height: 20 }
      ],
      footwear: [
        { id: "m-shoes-1", type: "footwear", name: "Boty", src: "https://www.svgrepo.com/show/378193/shoes-sneakers-clothing.svg", width: 25, height: 15 },
        { id: "m-shoes-2", type: "footwear", name: "Sandály", src: "https://www.svgrepo.com/show/417201/shoes-sandals.svg", width: 25, height: 15 }
      ]
    };

    const femaleItems = {
      tops: [
        { id: "f-shirt-1", type: "top", name: "Tričko 1", src: "/Zena/zena_obleceni_1.png", width: 30, height: 30 },
        { id: "f-shirt-2", type: "top", name: "Tričko 2", src: "/Zena/zena_obleceni_2.png", width: 30, height: 30 },
        { id: "f-shirt-3", type: "top", name: "Tričko 3", src: "/Zena/zena_obleceni_3.png", width: 30, height: 30 },
      ],
      bottoms: [
        { id: "f-bottom-1", type: "bottom", name: "Kalhoty 1", src: "/Zena/zena_obleceni_4.png", width: 30, height: 40 },
        { id: "f-bottom-2", type: "bottom", name: "Kalhoty 2", src: "/Zena/zena_obleceni_5.png", width: 30, height: 40 },
        { id: "f-bottom-3", type: "bottom", name: "Sukně", src: "/Zena/zena_obleceni_6.png", width: 30, height: 35 },
        { id: "f-bottom-4", type: "bottom", name: "Šaty", src: "/Zena/zena_obleceni_7.png", width: 35, height: 50 },
        { id: "f-bottom-5", type: "bottom", name: "Šaty s puntíky", src: "/Zena/zena_obleceni_8.png", width: 35, height: 50 },
        { id: "f-bottom-6", type: "bottom", name: "Dlouhé šaty", src: "/Zena/zena_obleceni_9.png", width: 35, height: 50 },
      ],
      hats: [
        { id: "f-hat-1", type: "hat", name: "Klobouk", src: "https://www.svgrepo.com/show/378174/hat-women-summer.svg", width: 25, height: 20 },
        { id: "f-hat-2", type: "hat", name: "Čelenka", src: "https://www.svgrepo.com/show/378173/headband-fashion-accessory.svg", width: 25, height: 10 }
      ],
      footwear: [
        { id: "f-shoes-1", type: "footwear", name: "Boty", src: "https://www.svgrepo.com/show/378192/shoes-high-heel.svg", width: 25, height: 15 },
        { id: "f-shoes-2", type: "footwear", name: "Sandály", src: "https://www.svgrepo.com/show/378165/flip-flops-summer-beach.svg", width: 25, height: 15 }
      ]
    };

    // Přidání oblečení pro chlapce a dívky
    const boyItems = {
      tops: [
        { id: "b-shirt-1", type: "top", name: "Tričko 1", src: "/Chlapec/chlapec_obleceni_1.png", width: 30, height: 30 },
        { id: "b-shirt-2", type: "top", name: "Tričko 2", src: "/Chlapec/chlapec_obleceni_2.png", width: 30, height: 30 },
      ],
      bottoms: [
        { id: "b-pants-1", type: "bottom", name: "Kalhoty 1", src: "/Chlapec/chlapec_obleceni_3.png", width: 30, height: 40 },
        { id: "b-pants-2", type: "bottom", name: "Kalhoty 2", src: "/Chlapec/chlapec_obleceni_4.png", width: 30, height: 40 },
      ],
      hats: [
        { id: "b-hat-1", type: "hat", name: "Klobouk", src: "https://www.svgrepo.com/show/378172/hat-clothing-fashion.svg", width: 25, height: 20 },
      ],
      footwear: [
        { id: "b-shoes-1", type: "footwear", name: "Boty", src: "https://www.svgrepo.com/show/378193/shoes-sneakers-clothing.svg", width: 25, height: 15 },
      ]
    };

    const girlItems = {
      tops: [
        { id: "g-shirt-1", type: "top", name: "Tričko 1", src: "/Devce/devce_obleceni_1.png", width: 30, height: 30 },
        { id: "g-shirt-2", type: "top", name: "Tričko 2", src: "/Devce/devce_obleceni_2.png", width: 30, height: 30 },
      ],
      bottoms: [
        { id: "g-bottom-1", type: "bottom", name: "Sukýnka", src: "/Devce/devce_obleceni_3.png", width: 30, height: 35 },
        { id: "g-bottom-2", type: "bottom", name: "Šaty", src: "/Devce/devce_obleceni_4.png", width: 35, height: 50 },
      ],
      hats: [
        { id: "g-hat-1", type: "hat", name: "Klobouk", src: "https://www.svgrepo.com/show/378174/hat-women-summer.svg", width: 25, height: 20 },
      ],
      footwear: [
        { id: "g-shoes-1", type: "footwear", name: "Boty", src: "https://www.svgrepo.com/show/378192/shoes-high-heel.svg", width: 25, height: 15 },
      ]
    };

    // Výběr položek podle zvolené postavy
    switch(gender) {
      case 'male':
        setClothingItems(maleItems);
        break;
      case 'female':
        setClothingItems(femaleItems);
        break;
      case 'boy':
        setClothingItems(boyItems);
        break;
      case 'girl':
        setClothingItems(girlItems);
        break;
      default:
        setClothingItems(maleItems);
    }
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
              <ClothingItem key={item.id} {...item} onItemClick={onItemClick} />
            ))}
          </TabsContent>
          
          <TabsContent value="bottoms" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.bottoms.map((item) => (
              <ClothingItem key={item.id} {...item} onItemClick={onItemClick} />
            ))}
          </TabsContent>
          
          <TabsContent value="hats" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.hats.map((item) => (
              <ClothingItem key={item.id} {...item} onItemClick={onItemClick} />
            ))}
          </TabsContent>
          
          <TabsContent value="footwear" className="grid grid-cols-3 gap-2 mt-0">
            {clothingItems.footwear.map((item) => (
              <ClothingItem key={item.id} {...item} onItemClick={onItemClick} />
            ))}
          </TabsContent>
          
          <TabsContent value="custom" className="grid grid-cols-3 gap-2 mt-0">
            {customItems.length > 0 ? (
              customItems.map((item) => (
                <ClothingItem key={item.id} {...item} isCustom onItemClick={onItemClick} />
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

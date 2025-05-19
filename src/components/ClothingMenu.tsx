
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
    // Using uploaded transparent images
    const maleItems = {
      tops: [
        { id: "m-shirt-1", type: "top", name: "Tričko", src: "/lovable-uploads/17728081-f9c3-4adb-8298-35c87414bcce.png", width: 30, height: 30 },
        { id: "m-shirt-2", type: "top", name: "Košile", src: "/lovable-uploads/5b1c5cbe-c853-4005-a514-343cf3526818.png", width: 30, height: 30 },
        { id: "m-shirt-3", type: "top", name: "Tričko s dinosaurem", src: "/lovable-uploads/99f06446-8f08-4628-8443-67167c58820c.png", width: 30, height: 30 },
        { id: "m-shirt-4", type: "top", name: "Tričko se sluníčkem", src: "/lovable-uploads/60c8e7fc-683a-4e48-8fd1-369aef5e65ff.png", width: 30, height: 30 },
      ],
      bottoms: [
        { id: "m-pants-1", type: "bottom", name: "Šortky", src: "/lovable-uploads/b2c45122-b8cc-4016-9c72-3ff23a682a5b.png", width: 30, height: 40 },
        { id: "m-pants-2", type: "bottom", name: "Kraťasy", src: "/lovable-uploads/2b9c2f01-75df-443d-aabe-37de4e6cbf23.png", width: 30, height: 40 },
        { id: "m-overall", type: "bottom", name: "Lacláče", src: "/lovable-uploads/194774e2-ff83-463b-8d96-46f1562d3f38.png", width: 40, height: 60 },
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
        { id: "f-shirt-1", type: "top", name: "Halenka", src: "/lovable-uploads/7b37099e-1f02-4319-98c5-3d0fa574550a.png", width: 30, height: 30 },
        { id: "f-shirt-2", type: "top", name: "Tričko", src: "/lovable-uploads/8f3cff71-e297-4007-b8ef-9b918022ecae.png", width: 30, height: 30 },
        { id: "f-shirt-3", type: "top", name: "Pruhované tričko", src: "/lovable-uploads/cab543f6-9faa-4e81-afbd-bd3f37c39a3e.png", width: 30, height: 30 },
      ],
      bottoms: [
        { id: "f-skirt-1", type: "bottom", name: "Sukně", src: "/lovable-uploads/113c634e-b401-4163-864c-d9cb7952e649.png", width: 30, height: 30 },
        { id: "f-dress-1", type: "bottom", name: "Šaty", src: "/lovable-uploads/04664fdf-ba23-44fc-9ee7-4cda3c7db630.png", width: 35, height: 50 },
        { id: "f-dress-2", type: "bottom", name: "Růžové šaty", src: "/lovable-uploads/e1605196-938c-4774-824a-67607f4673da.png", width: 35, height: 50 },
        { id: "f-dress-3", type: "bottom", name: "Šaty se srdíčky", src: "/lovable-uploads/863b0e64-bdb8-4421-9e77-a50b4b35f4ee.png", width: 35, height: 50 },
        { id: "f-overall", type: "bottom", name: "Lacláče", src: "/lovable-uploads/c107da29-8709-46ee-a108-be1d24621059.png", width: 35, height: 50 },
        { id: "f-outfit-1", type: "bottom", name: "Modrý outfit", src: "/lovable-uploads/29e08e69-a859-4170-b28d-702652c392f7.png", width: 35, height: 45 },
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


import { useState } from 'react';
import Layout from '@/components/Layout';
import CharacterDisplay from '@/components/CharacterDisplay';
import ClothingMenu from '@/components/ClothingMenu';
import CustomDesigner from '@/components/CustomDesigner';
import GenderToggle from '@/components/GenderToggle';
import { ClothingItemProps } from '@/components/ClothingItem';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [gender, setGender] = useState<'male' | 'female' | 'boy' | 'girl'>('male');
  const [customItems, setCustomItems] = useState<ClothingItemProps[]>([]);

  const addCustomItem = (item: ClothingItemProps) => {
    setCustomItems(prev => [...prev, item]);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <Card className="w-full">
          <CardContent className="p-6 flex flex-col items-center">
            <GenderToggle gender={gender} setGender={setGender} />
          </CardContent>
        </Card>
        
        {/* Na malých obrazovkách je postava nahoře, menu dole */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobilní layout: Postava je první */}
          <div className="block lg:hidden mb-4">
            <CharacterDisplay 
              gender={gender} 
              className="min-h-[50vh]"
            />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <ClothingMenu 
              gender={gender} 
              customItems={customItems}
            />
            
            <CustomDesigner addCustomItem={addCustomItem} />
          </div>
          
          {/* Desktop layout: Postava je v pravé části */}
          <div className="hidden lg:block lg:col-span-2">
            <CharacterDisplay 
              gender={gender} 
              className="h-full min-h-[70vh]"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

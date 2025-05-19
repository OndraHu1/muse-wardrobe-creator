
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shirt, Dress } from "lucide-react";

interface GenderToggleProps {
  gender: 'male' | 'female';
  setGender: (gender: 'male' | 'female') => void;
}

const GenderToggle = ({ gender, setGender }: GenderToggleProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-lg font-medium">Vyberte postavu</h3>
      <RadioGroup
        value={gender}
        onValueChange={(value) => setGender(value as 'male' | 'female')}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="male" />
          <Label htmlFor="male" className="flex items-center space-x-1 cursor-pointer">
            <Shirt className="h-5 w-5" />
            <span>Muž</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="female" />
          <Label htmlFor="female" className="flex items-center space-x-1 cursor-pointer">
            <Dress className="h-5 w-5" />
            <span>Žena</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GenderToggle;

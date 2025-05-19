
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shirt, User, Baby } from "lucide-react";

interface GenderToggleProps {
  gender: 'male' | 'female' | 'boy' | 'girl';
  setGender: (gender: 'male' | 'female' | 'boy' | 'girl') => void;
}

const GenderToggle = ({ gender, setGender }: GenderToggleProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-lg font-medium">Vyberte postavu</h3>
      <RadioGroup
        value={gender}
        onValueChange={(value) => setGender(value as 'male' | 'female' | 'boy' | 'girl')}
        className="flex flex-wrap gap-4 justify-center"
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
            <User className="h-5 w-5" />
            <span>Žena</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="boy" id="boy" />
          <Label htmlFor="boy" className="flex items-center space-x-1 cursor-pointer">
            <Baby className="h-5 w-5" />
            <span>Chlapec</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="girl" id="girl" />
          <Label htmlFor="girl" className="flex items-center space-x-1 cursor-pointer">
            <Baby className="h-5 w-5" />
            <span>Dívka</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GenderToggle;

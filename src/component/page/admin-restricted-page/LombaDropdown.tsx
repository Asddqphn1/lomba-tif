import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface LombaDropdownProps {
  lomba: string;
  setLomba: (value: string) => void;
  lombaOptions: { id: string; nama: string }[];
}

const LombaDropdown: React.FC<LombaDropdownProps> = ({
  lomba,
  setLomba,
  lombaOptions,
}) => {
  const selectedLomba = lombaOptions.find((item) => item.id === lomba);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedLomba ? selectedLomba.nama : "Pilih Lomba"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => setLomba("")}>
          Semua Lomba
        </DropdownMenuItem>
        {lombaOptions.map((option) => (
          <DropdownMenuItem key={option.id} onClick={() => setLomba(option.id)}>
            {option.nama}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LombaDropdown;

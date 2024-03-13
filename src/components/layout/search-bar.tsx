import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function SearchBar() {
  return (
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
          placeholder="Buscar Reporte"
          type="search"
        />
      </div>
    </form>
  );
}

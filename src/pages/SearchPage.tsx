import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  return (
    <div className="p-4 mt-16">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10" autoFocus />
      </div>
    </div>
  );
}

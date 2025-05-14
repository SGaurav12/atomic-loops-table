import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const [input, setInput] = useState(value);
  const debounced = useDebounce(input, 500);

  useEffect(() => {
    if (debounced.trim().length >= 2 || debounced.trim() === "") {
      onChange(debounced);
    }
  }, [debounced, onChange]);

  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
      <input
        type="text"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full pl-10 pr-4 py-2 h-10 border rounded-lg focus:outline-none focus:border-transparent"
      />
    </div>
  );
}
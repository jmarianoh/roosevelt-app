import { Search } from 'lucide-react';

interface SearchBoxProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  shortcut?: string;
}

export function SearchBox({ placeholder, value, onChange, shortcut }: SearchBoxProps) {
  return (
    <label className="searchbox">
      <Search size={16} />
      <input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {shortcut && <kbd>{shortcut}</kbd>}
    </label>
  );
}

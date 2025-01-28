import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props<T = string> = {
  options: T[];
  value: T | undefined;
  onSelectItem: (bank: T) => void;
  placeholder?: string;
};

export default function Dropdown<T extends string>({
  options,
  value,
  onSelectItem,
  placeholder,
}: Props<T>) {
  return (
    <Select defaultValue={value} onValueChange={onSelectItem}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

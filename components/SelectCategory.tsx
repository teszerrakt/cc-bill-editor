import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health",
  "Subscription",
];

type Props = {
  value: string;
  onSelectCategory: (category: string) => void;
};

export default function SelectCategory({ onSelectCategory, value }: Props) {
  return (
    <Select defaultValue={value} onValueChange={onSelectCategory}>
      <SelectTrigger>
        <SelectValue placeholder="Select Bank" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

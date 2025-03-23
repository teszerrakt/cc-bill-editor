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
  "Grooming",
  "Skin Care",
  "Subscription",
  "Rent",
  "Electricity",
  "Cash Out",
  "Credit Card",
];

type Props = {
  value: string;
  onSelectCategory: (category: string) => void;
};

export default function SelectCategory({ onSelectCategory, value }: Props) {
  return (
    <Select defaultValue={value} onValueChange={onSelectCategory}>
      <SelectTrigger>
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {CATEGORIES.sort().map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

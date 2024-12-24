import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Types
import type { IssuingBanks } from "@/lib/pdf-parser/factories";

type Props = {
  bankList: IssuingBanks[];
  issuingBank: IssuingBanks | undefined;
  onSelectBank: (bank: IssuingBanks) => void;
};

export default function SelectBank({
  bankList,
  onSelectBank,
  issuingBank,
}: Props) {
  return (
    <Select defaultValue={issuingBank} onValueChange={onSelectBank}>
      <SelectTrigger>
        <SelectValue placeholder="Select Bank" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {bankList.map((bank) => (
            <SelectItem key={bank} value={bank}>
              {bank}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

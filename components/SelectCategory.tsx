import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CATEGORIES = [
  // ======================================
  // #region Supergroup Social            #
  // ======================================
  "Social",
  "Charity & Donation",
  "Gifts",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Shoppping         #
  // ======================================
  "Shopping",
  "Groceries",
  "Fashion",
  "Gadget & Electronics",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Installments      #
  // ======================================
  "Installments",
  "Vehicle",
  "Loan",
  "Mortgage",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Entertainments    #
  // ======================================
  "Entertainment",
  "Movies",
  "Music",
  "Games",
  "Hobbies",
  "Books",
  "Streaming",
  "Vacation",
  "Hang Out",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Family            #
  // ======================================
  "Family",
  "Kids",
  "Parents",
  "Laundry",
  "Pet",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Health            #
  // ======================================
  "Health",
  "Doctor",
  "Medicine",
  "Gym",
  "Skin Care",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Foods             #
  // ======================================
  "Foods",
  "Cafe",
  "Restaurant",
  "Food Delivery",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Transportation    #
  // ======================================
  "Transportation",
  "Fuel",
  "Parking",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Bills             #
  // ======================================
  "Bills",
  "Electricity",
  "Water",
  "Internet",
  "Room Rent",
  "Credit Card",
  // ======================================
  // #endregion                           #
  // ======================================

  // ======================================
  // #region Supergroup Others            #
  // ======================================
  "Others",
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

// Factories
import { factory as BRIBillingFactory } from "./bri";
import { factory as JeniusBillingFactory } from "./jenius";
import { factory as OtherBillingFactory } from "./other";

// Types
import { BillingFactoryFn } from "../types";

export type IssuingBanks = "BRI" | "JENIUS" | "OTHER";

export const billingFactory: Record<IssuingBanks, BillingFactoryFn> = {
  BRI: BRIBillingFactory,
  JENIUS: JeniusBillingFactory,
  OTHER: OtherBillingFactory,
};

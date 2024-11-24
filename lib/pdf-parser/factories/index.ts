// Factories
import { factory as BRIBillingFactory } from "./bri";
import { factory as JeniusBillingFactory } from "./jenius";

// Types
import { BillingFactoryFn } from "../types";

export type IssuingBanks = "BRI" | "JENIUS";

export const billingFactory: Record<IssuingBanks, BillingFactoryFn> = {
  BRI: BRIBillingFactory,
  JENIUS: JeniusBillingFactory,
};

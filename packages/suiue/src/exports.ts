export { createSuiue } from "@/installer.ts";

export { useWalletState } from "@/context/walletState.ts";
export { useWalletActions } from "@/context/walletActions.ts";
export { useWalletQuery } from "@/context/walletQuery.ts";

import SuiueProvider from "@/components/SuiueProvider.vue";
export { SuiueProvider }

export type { SuiueProviderConfig } from "@/components/SuiueProvider.vue"
export type { SuiNetworksType, BrowserWalletType} from "@/types.ts"


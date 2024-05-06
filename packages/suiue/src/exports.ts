export { createSuiue } from "@/installer.ts";

export { useWalletState } from "@/context/walletState.ts";
export { useWalletActions } from "@/context/walletActions.ts";
export { useWalletQuery } from "@/context/walletQuery";

import SuiueProvider from "@/components/SuiueProvider.vue";
import NConnectButton from "@/components/nConnectButton.vue";
export { SuiueProvider, NConnectButton }

export type { SuiueProviderConfig } from "@/components/SuiueProvider.vue"
export type { 
    SuiNetworksType, 
    BrowserWalletType, 
    SuiAddress, 
    SuiTypeIdentifier, 
    WalletBalance, 
    WalletObject
} from "@/types.ts"

export { consts } from "@/consts.ts"
export * from "@/errors.ts"



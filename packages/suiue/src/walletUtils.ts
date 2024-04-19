import type {walletConnectionInfoType} from "@/types.ts";
import type {
    Wallet,
    WalletWithSuiFeatures,
    StandardConnectFeature, StandardDisconnectFeature, StandardEventsFeature,
    SuiSignTransactionBlockFeature, SuiSignAndExecuteTransactionBlockFeature,
    SuiSignPersonalMessageFeature,
} from "@mysten/wallet-standard";

export function getWalletIdentifier(wallet: Wallet) {
    return wallet.id ? wallet.id : wallet.name
}

type AllFeaturesStr = keyof WalletWithSuiFeatures["features"]

type FeaturesMap = {
    "standard:connect": StandardConnectFeature,
    "standard:disconnect": StandardDisconnectFeature,
    "standard:events": StandardEventsFeature,
    "sui:signTransactionBlock": SuiSignTransactionBlockFeature,
    "sui:signAndExecuteTransactionBlock": SuiSignAndExecuteTransactionBlockFeature,
    "sui:signPersonalMessage": SuiSignPersonalMessageFeature,
    "sui:signMessage": never
}

export type MapStrArrayToFeaturesType<T extends AllFeaturesStr[]> = {
  [K in keyof T]: T[K] extends keyof FeaturesMap ? FeaturesMap[T[K]] : never;
}[number];



export function updateWalletConnectionInfo(info: walletConnectionInfoType) {
    localStorage.setItem(`suiue:wallet-connection-info`, JSON.stringify(info))
}

export function getWalletConnectionInfo(): walletConnectionInfoType | null {
    let info = localStorage.getItem(`suiue:wallet-connection-info`)
    if (info) {
        return JSON.parse(info)
    }
    return null
}
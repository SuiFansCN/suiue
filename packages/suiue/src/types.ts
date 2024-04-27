import type {WalletWithSuiFeatures} from "@mysten/wallet-standard";

export type SuiNetworksType = "mainnet" | "testnet" | "devnet" | "localnet";

export type AutoConnectType = "enable" | "disable" | "last";

export type BrowserWalletType = WalletWithSuiFeatures;

export type walletConnectionInfoType = {
    wallet_ident: string | null | undefined,
    account_addr: string | null | undefined,
}

export type SuiAddress = `0x${string}`;
export type SuiTypeIdentifier = `${SuiAddress}::${string}::${string}`

export interface WalletObject<ContentType = object> {
    type: SuiTypeIdentifier,
    address: SuiAddress,
    version: number,
    content: ContentType
    digest?: string,
    display?: Object,
}

export interface WalletBalance {
    type: SuiTypeIdentifier,
    coinObjectCount: number,
    totalBalance: BigInt,
}

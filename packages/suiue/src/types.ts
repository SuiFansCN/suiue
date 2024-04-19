import type {WalletWithSuiFeatures} from "@mysten/wallet-standard";

export type ArrayToUnion<T extends string[]> = T[number];

export type SuiNetworksType = "mainnet" | "testnet" | "devnet" | "localnet";

export type AutoConnectType = "enable" | "disable" | "last";

export type BrowserWalletType = WalletWithSuiFeatures;

export type walletConnectionInfoType = {
    wallet_ident: string | null | undefined,
    account_addr: string | null | undefined,
}
import type {Wallet} from "@mysten/wallet-standard";

export type SuiNetworksType = "mainnet" | "testnet" | "devnet" | "localnet";

export type AutoConnectType = "enable" | "disable" | "last";

export type BrowserWalletType = Wallet;
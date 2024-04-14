import type {Wallet} from "@mysten/wallet-standard";

export type SuiNetworksType = "mainnet" | "testnet" | "devnet" | "localnet";

export type AutoConnectType = "enable" | "disable" | "last";

export type BrowserWalletType = Wallet;

export type walletConnectionInfoType = {
    wallet_ident: string | null | undefined,
    account_addr: string | null | undefined,
}
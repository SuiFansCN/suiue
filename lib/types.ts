export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type SuiNetworks = "mainnet" | "testnet" | "devnet" | "localnet";
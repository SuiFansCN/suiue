import type {getWallets, WalletWithRequiredFeatures} from "@mysten/wallet-standard";

declare global {
    interface Window {
        wallets: WalletWithRequiredFeatures[]
        getWallets: ReturnType<typeof getWallets>
    }
}

import type {BrowserWalletType} from "@/types.ts";
import type {walletConnectionInfoType} from "@/types.ts";

export function getWalletIdentifier(wallet: BrowserWalletType) {
    return wallet.id ? wallet.id : wallet.name
}

export function updateWalletConnectionInfo(provider_id: string, info: walletConnectionInfoType) {
    localStorage.setItem(`sui-dapp-kit:wallet-connection-info:${provider_id}`, JSON.stringify(info))
}

export function getWalletConnectionInfo(provider_id: string): walletConnectionInfoType | null {
    let info = localStorage.getItem(`sui-dapp-kit:wallet-connection-info:${provider_id}`)
    if (info) {
        return JSON.parse(info)
    }
    return null
}
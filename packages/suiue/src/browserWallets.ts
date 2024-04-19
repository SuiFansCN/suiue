import {shallowRef, triggerRef} from "vue"
import {getWallets} from "@mysten/wallet-standard"
import type {Wallet, WalletWithSuiFeatures} from "@mysten/wallet-standard";

type WalletFilterType = (wallet: Wallet) => boolean
type RequiredFeatureType = (keyof WalletWithSuiFeatures["features"])[]
type PreferredWalletType = string[]
export type RegisterWalletOptions = {
    walletFilter?: WalletFilterType
    requiredFeatures?: RequiredFeatureType
    preferredWallets?: PreferredWalletType
}

/*
* why use `shallowRef` instead of `ref`?
* because `ref` can't wrapper the wallet obj directly, it will crash.
*/
export const browserWallets = shallowRef<Wallet[]>([])

export function registerWallet() {

    let walletsApi = getWallets();

    function appendWallet(wallet: Wallet) {
        browserWallets.value.push(wallet)
        triggerRef(browserWallets)
    }


    // add event listener for new wallet
    walletsApi.on("register", (wallet) => {
        appendWallet(wallet)
    })

    // get current all wallets
    walletsApi.get().forEach((wallet) => appendWallet(wallet))

    // add event listener for wallet removed
    walletsApi.on("unregister", (wallet) => {
        let index = browserWallets.value.indexOf(wallet as any)
        if (index >= 0) {
            browserWallets.value.splice(index, 1)
            triggerRef(browserWallets)
        }
    })
}
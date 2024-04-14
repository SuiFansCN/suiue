import {inject, type Ref} from "vue";
import type {WalletWithRequiredFeatures } from "@mysten/wallet-standard";
import {
    PluginNotInstallError,
    WalletProviderNoExists,
    WalletNotConnectedError,
    WalletAccountNotFoundError,
} from "@/errors.ts";

import type { SuiClient } from "@mysten/sui.js/client";
import type {WalletStoreType} from "@/components/SuiWalletProvider/store";
import {getWallets} from "@mysten/wallet-standard";

export const CONTEXT_NAMES = {
    allBrowserWallets: "$sui:all-browser-wallets",
    allEligibleWallets: "$sui:all-eligible-wallets",
    wallet: "$sui:current-wallet",
}

/*
    * check if the returned value of target function is undefined or null, if so, throw the error
 */
function checkIsUndefinedReturned<Func extends (...args: any[]) => any>(
    err: Error,
    target: Func
): (...args: Parameters<Func>) => Exclude<ReturnType<Func>, undefined | null> {
    function deco(...args: any[]) {
        try {
            var result = target(...args)
        } catch {
            throw err
        }

        if (result === undefined || result === null) {
            throw err
        }

        return result
    }

    return deco
}

export const getAllBrowserWallets = checkIsUndefinedReturned(
    new PluginNotInstallError("sui-dapp-kit: plugin not installed"),
    () => inject<Ref<WalletWithRequiredFeatures[]>>(CONTEXT_NAMES.allBrowserWallets)?.value
)


export const getWallet = checkIsUndefinedReturned(
    new WalletProviderNoExists("sui-dapp-kit: current provider not found, check it is installed or not"),
    () => inject<WalletStoreType>(CONTEXT_NAMES['wallet'])
)


export const getAccount = checkIsUndefinedReturned(
    new WalletAccountNotFoundError("sui-dapp-kit: current account not found, check it is selected or not"),
    () => getWallet().currentAccount
)

export const getSuiClient = checkIsUndefinedReturned(
    new WalletNotConnectedError("sui-dapp-kit: wallet not connected, please connect wallet first"),
    () => getWallet().client as InstanceType<typeof SuiClient>
    // Do not delete the type assertion here, otherwise an error will be reported
)

export function onWalletConnect<T extends CallableFunction>(func: T): T {
    for(let wallet of getAllBrowserWallets()){
        wallet.features["standard:events"].on("change", func as any)
    }
    return func
}


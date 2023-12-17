import {inject, type Ref} from "vue";
import {WalletWithRequiredFeatures, ReadonlyWalletAccount} from "@mysten/wallet-standard";
import {
    PluginNotInstallError,
    WalletProviderNoExists,
    WalletNotConnectedError,
    WalletAccountNotFoundError,
} from "@/errors.ts";

export const CONTEXT_NAMES = {
    "wallets": "$sui:wallets",
    "currentProvider": "$sui:current-provider",
    "currentWallet": "$sui:current-wallet",
    "currentAccount": "$sui:current-account"
}

/*
    * check if the returned value of target function is undefined, if so, throw the error
 */
function checkIsUndefinedReturned<Func extends (...args: any[]) => any>(
    e: Error,
    target: Func
): (...args: Parameters<Func>) => Exclude<ReturnType<Func>, undefined> {
    function deco(...args: any[]) {
        let result = target(...args)
        if (result === undefined) {
            throw e
        }
        return result
    }

    return deco
}

export const getWallets = checkIsUndefinedReturned(
    new PluginNotInstallError("sui-dapp-kit: plugin not installed"),
    () => inject<WalletWithRequiredFeatures[]>(CONTEXT_NAMES['wallets'])
)

// rewrite as below
export const getCurrentProvider = checkIsUndefinedReturned(
    new WalletProviderNoExists("sui-dapp-kit: current provider not found, check it is installed or not"),
    () => inject<Ref<WalletWithRequiredFeatures>>(CONTEXT_NAMES['currentProvider'])
)

export const getCurrentWallet = checkIsUndefinedReturned(
    new WalletNotConnectedError("sui-dapp-kit: current wallet not found, check it is connected or not"),
    () => inject<Ref<WalletWithRequiredFeatures>>(CONTEXT_NAMES['currentWallet'])?.value
)

export const getCurrentAccount = checkIsUndefinedReturned(
    new WalletAccountNotFoundError("sui-dapp-kit: current account not found, check it is selected or not"),
    () => inject<Ref<ReadonlyWalletAccount>>(CONTEXT_NAMES['currentAccount'])?.value
)

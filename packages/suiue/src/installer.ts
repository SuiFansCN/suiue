import type {Plugin} from "vue";
import type {Wallet} from "@mysten/wallet-standard";
import {getWallets} from "@mysten/wallet-standard";
import {getActivePinia} from "pinia";
import {shallowRef} from "vue";

import {CONTEXT_NAMES} from "./walletContext.ts";
import {PiniaNotReadyError} from "./errors.ts";

export const SuiDappKit: Plugin = {
    install: (
        app,
        options?: {
            walletFilter?: (wallet: Wallet) => boolean
        }
    ) => {
        if (!getActivePinia()) {
            throw new PiniaNotReadyError("sui-dapp-kit: Pinia not found, please install pinia first")
        }


        // ============ install context-wallets ============
        let wallets = shallowRef<Wallet[]>([]);
        app.provide(CONTEXT_NAMES.allBrowserWallets, wallets);
        // =================================================


        function appendWallet(wallet: Wallet) {
            if (options?.walletFilter && !(options?.walletFilter(wallet))) {
                return
            }

            wallets.value.push(wallet)
        }

        let walletsApi = getWallets();

        // get current all wallets
        for (let wallet of walletsApi.get()) {
            appendWallet(wallet)
        }

        // add event listener for new wallet
        walletsApi.on("register", (wallet) => {
            appendWallet(wallet)
        })

        // add event listener for wallet removed
        walletsApi.on("unregister", (wallet) => {
            let index = wallets.value.indexOf(wallet)
            if (index >= 0) {
                wallets.value.splice(index, 1)
            }
        })

    }
}
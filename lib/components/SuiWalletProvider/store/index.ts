import {defineStore, getActivePinia} from "pinia";
import type {SuiClient} from "@mysten/sui.js/client";
import type {AutoConnectType, SuiNetworksType, BrowserWalletType} from "@/types.ts";
import {WalletError} from "@/errors.ts";

import type {
    WalletWithRequiredFeatures,
    WalletAccount,
} from '@mysten/wallet-standard';


export type WalletStoreType = ReturnType<typeof createWalletStore>

export function createWalletStore(options: {
    id: string;
    network: SuiNetworksType;
    suiClient: InstanceType<typeof SuiClient>,
    autoConnect: AutoConnectType
}) {
    // check if the wallet provider already exists
    if (getActivePinia()?.state.value[options.id]) {
        console.warn(`sui-dapp-kit: wallet provider id:${options.id} already exists, if you want to work-by multi wallet, please append a unique id to each wallet provider`)
        // throw new WalletProviderAlreadyExists(`sui-dapp-kit: wallet provider id:${options.id} already exists`)
        return getActivePinia()?.state.value[options.id]
    }

    return defineStore(options.id, {
        state: () => ({
            client: options.suiClient,
            network: options.network,
            accounts: [] as WalletAccount[],
            currentAccount: null as WalletAccount | null,

            _browserWallet: null as BrowserWalletType | null,
            _lastConnectedWalletName: null as string | null,
            _lastConnectedAccountAddress: null as string | null,
        }),
        getters: {
            isConnected: (state) => state.currentAccount !== null,

            walletNetwork: (state) => `sui:${state.network}`,

        },
        actions: {
            // async autoConnect() {
            //     let connectStorage = JSON.parse(
            //         localStorage.getItem(`sui-dapp-kit:connect:${options.id}`) || "{}"
            //     )
            //
            //     // TODO
            //
            // },
            async connect(wallet: WalletWithRequiredFeatures) {
                try {
                    var result = await wallet.features["standard:connect"].connect()
                } catch {
                    throw new WalletError("sui-dapp-kit: connect wallet failed")
                }
                this._browserWallet = wallet
                this.accounts.push(...result.accounts)
                this.currentAccount = result.accounts[0]
                this._lastConnectedAccountAddress = result.accounts[0].address
                this._lastConnectedWalletName = wallet.name

                // listen disconnect for wallet-side
                wallet.features["standard:events"].on("change", (params) => {
                    if (params.accounts?.length === 0) {
                        this.disconnect()
                    }
                })
                return result
            },
            disconnect() {
                this.accounts.length = 0;
                this.currentAccount = null
                this._browserWallet = null
                this._lastConnectedAccountAddress = null
                this._lastConnectedWalletName = null
            },
            async signPersonalMessage() {

            },
            async signTransactionBlock() {

            },
            async signAndExecuteTransactionBlock() {

            },
            // async callCustomWalletMethod(method: string, params: any[]) {
            //
            // }

        }
        // () is important here
    })()
}
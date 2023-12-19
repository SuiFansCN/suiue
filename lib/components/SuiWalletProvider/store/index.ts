import {defineStore, getActivePinia} from "pinia";
import {WalletError} from "@/errors.ts";

import type {SuiClient} from "@mysten/sui.js/client";
import type {AutoConnectType, SuiNetworksType, BrowserWalletType} from "@/types.ts";
import type {
    WalletWithRequiredFeatures,
    WalletAccount,
} from '@mysten/wallet-standard';
import {getWalletIdentifier, updateWalletConnectionInfo} from "@/walletUtils.ts";


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
        }),
        getters: {
            isConnected: (state) => state.currentAccount !== null,
            walletNetwork: (state) => `sui:${state.network}`,
        },
        actions: {
            async connect(wallet: WalletWithRequiredFeatures) {
                this.isConnected && this.disconnect()
                
                try {
                    var result = await wallet.features["standard:connect"].connect()
                } catch {
                    throw new WalletError("sui-dapp-kit: connect wallet failed")
                }
                this._browserWallet = wallet
                this.accounts.push(...result.accounts)
                this.currentAccount = result.accounts[0]

                updateWalletConnectionInfo(this.$id, {
                    wallet_ident: getWalletIdentifier(wallet),
                    account_addr: this.currentAccount.address
                })

                // listen disconnect or change for wallet-side
                wallet.features["standard:events"].on("change", (params) => {
                    if (params.accounts?.length === 0) {
                        this.disconnect()
                    }
                })
                return result
            },
            disconnect() {
                this.accounts.splice(0, this.accounts.length);
                this.currentAccount = null
                this._browserWallet = null
                updateWalletConnectionInfo(this.$id, {
                    wallet_ident: null,
                    account_addr: null
                })
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
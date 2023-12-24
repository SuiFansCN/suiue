import {defineStore, getActivePinia} from "pinia";
import {WalletError} from "@/errors.ts";

import type {Store, StateTree, _GettersTree, _ActionsTree} from "pinia"
import type {SuiClient} from "@mysten/sui.js/client";
import type {AutoConnectType, SuiNetworksType, BrowserWalletType} from "@/types.ts";
import type {
    WalletWithRequiredFeatures,
    WalletAccount,
    SuiSignPersonalMessageInput,
    SuiSignPersonalMessageOutput,
    SuiSignTransactionBlockInput,
    SuiSignTransactionBlockOutput,
    SuiSignAndExecuteTransactionBlockInput,
    SuiSignAndExecuteTransactionBlockOutput,
    StandardConnectOutput
} from '@mysten/wallet-standard';
import {getWalletIdentifier, updateWalletConnectionInfo} from "@/walletUtils.ts";

interface StoreStateType extends StateTree {
    identify: string | null,
    client: InstanceType<typeof SuiClient>,
    network: SuiNetworksType,
    accounts: WalletAccount[],
    currentAccount: WalletAccount | null,
    _browserWallet: BrowserWalletType | null,
}

interface StoreGettersType<S extends StateTree> extends _GettersTree<S> {
    isConnected: () => boolean,
    walletNetwork: () => string,
}


interface StoreActionsType extends _ActionsTree {
    connect: (wallet: WalletWithRequiredFeatures) => Promise<StandardConnectOutput>,
    disconnect: () => void,
    signPersonalMessage: (input: SuiSignPersonalMessageInput) => Promise<SuiSignPersonalMessageOutput>,
    signTransactionBlock: (input: SuiSignTransactionBlockInput) => Promise<SuiSignTransactionBlockOutput>,
    signAndExecuteTransactionBlock: (input: SuiSignAndExecuteTransactionBlockInput) => Promise<SuiSignAndExecuteTransactionBlockOutput>,
    callCustomWalletMethod: (method: string, params: object) => Promise<object>,
}

export type WalletStoreType = Store<string, StoreStateType, StoreGettersType<StoreStateType>, StoreActionsType>

export function createWalletStore<Id extends string>(options: {
    id: Id;
    network: SuiNetworksType;
    suiClient: InstanceType<typeof SuiClient>,
    autoConnect: AutoConnectType
}): WalletStoreType<Id> {
    // check if the wallet provider already exists
    if (getActivePinia()?.state.value[options.id]) {
        console.warn(`sui-dapp-kit: wallet provider id:${options.id} already exists, if you want to work-by multi wallet, please append a unique id to each wallet provider`)
        // throw new WalletProviderAlreadyExists(`sui-dapp-kit: wallet provider id:${options.id} already exists`)
        return getActivePinia()?.state.value[options.id] as any
    }

    return defineStore<Id, StoreStateType, StoreGettersType<StoreStateType>, StoreActionsType>(options.id, {
        state: () => ({
            identify: null as string | null,
            client: options.suiClient,
            network: options.network,
            accounts: [] as WalletAccount[],
            currentAccount: null as WalletAccount | null,

            _browserWallet: null as BrowserWalletType | null,
        }),
        getters: {
            isConnected() {
                return this.currentAccount !== null
            },
            walletNetwork() {
                return `sui:${this.network}`
            },
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
                this.identify = getWalletIdentifier(wallet)

                updateWalletConnectionInfo(this.$id, {
                    wallet_ident: getWalletIdentifier(wallet),
                    account_addr: result.accounts[0].address
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
                this.identify = null
                updateWalletConnectionInfo(this.$id, {
                    wallet_ident: null,
                    account_addr: null
                })
            },
            async signPersonalMessage(input: SuiSignPersonalMessageInput) {

            },
            async signTransactionBlock(input: SuiSignTransactionBlockInput) {

            },
            async signAndExecuteTransactionBlock(input: SuiSignAndExecuteTransactionBlockInput) {
                this._browserWallet?.features["sui:sign-and-execute-transaction-block"].signAndExecuteTransactionBlock(input)
            },
            // async callCustomWalletMethod(method: string, params: any[]) {
            //
            // }
        }
        // () is important here
    })()
}
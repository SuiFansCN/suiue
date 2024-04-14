import {defineStore, getActivePinia} from "pinia";
import {WalletError} from "@/errors.ts";

import type {Store, StateTree, _GettersTree, _ActionsTree} from "pinia"
import type {SuiClient, SuiTransactionBlockResponseOptions} from "@mysten/sui.js/client";
import type {TransactionBlock} from '@mysten/sui.js/transactions';
import type {AutoConnectType, BrowserWalletType, SuiNetworksType} from "@/types.ts";
import type {
    WalletWithSuiFeatures,
    WalletWithRequiredFeatures,
    WalletAccount,
    SuiSignPersonalMessageOutput,
    SuiSignTransactionBlockOutput,
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
    _browserWallet: WalletWithSuiFeatures | null,
}

interface StoreGettersType<S extends StateTree> extends _GettersTree<S> {
    isConnected: () => boolean,
    walletNetwork: () => string,
}


interface StoreActionsType extends _ActionsTree {
    connect: (wallet: BrowserWalletType) => Promise<StandardConnectOutput>,
    disconnect: () => void,
    signPersonalMessage: (message: Uint8Array) => Promise<SuiSignPersonalMessageOutput>,
    signTransactionBlock: (transactionBlock: TransactionBlock) => Promise<SuiSignTransactionBlockOutput>,
    signAndExecuteTransactionBlock: (transactionBlock: TransactionBlock, options: SuiTransactionBlockResponseOptions) => Promise<SuiSignAndExecuteTransactionBlockOutput>,
}

export type WalletStoreType = Store<string, StoreStateType, StoreGettersType<StoreStateType>, StoreActionsType>

export function createWalletStore<Id extends string>(options: {
    id: Id;
    network: SuiNetworksType;
    suiClient: InstanceType<typeof SuiClient>,
    autoConnect: AutoConnectType
}): WalletStoreType {
    // check if the wallet provider already exists
    if (getActivePinia()?.state.value[options.id]) {
        console.warn(`sui-dapp-kit: wallet provider id:${options.id} already exists, if you want to work-by multi wallet, please append a unique id to each wallet provider`)
        // throw new WalletProviderAlreadyExists(`sui-dapp-kit: wallet provider id:${options.id} already exists`)
        return getActivePinia()?.state.value[options.id] as any
    }

    return defineStore<Id, StoreStateType, StoreGettersType<StoreStateType>, StoreActionsType>(options.id, {
        state: () => ({
            identify: null,
            client: options.suiClient,
            network: options.network,
            accounts: [],
            currentAccount: null,

            _browserWallet: null,
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
            async connect(wallet: BrowserWalletType) {
                this.isConnected && this.disconnect()

                try {
                    var result = await (wallet as WalletWithRequiredFeatures).features["standard:connect"].connect()
                } catch {
                    throw new WalletError("sui-dapp-kit: connect wallet failed")
                }

                this._browserWallet = wallet as any
                this.accounts.push(...result.accounts)
                this.currentAccount = result.accounts[0]
                this.identify = getWalletIdentifier(wallet)

                updateWalletConnectionInfo(this.$id, {
                    wallet_ident: getWalletIdentifier(wallet),
                    account_addr: result.accounts[0].address
                });

                // listen disconnect or change for wallet-side
                (wallet as WalletWithRequiredFeatures).features["standard:events"].on("change", (params) => {
                    if (params.accounts?.length === 0) {
                        this.disconnect()
                    }
                });
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
            async signPersonalMessage(message: Uint8Array) {
                return await this._browserWallet!.features["sui:signPersonalMessage"].signPersonalMessage({
                    message,
                    account: this.currentAccount!
                })
            },
            async signTransactionBlock(transactionBlock: TransactionBlock,) {
                return await this._browserWallet!.features["sui:signTransactionBlock"].signTransactionBlock({
                    transactionBlock,
                    chain: this.walletNetwork as any,
                    account: this.currentAccount!,
                });
            },
            async signAndExecuteTransactionBlock(transactionBlock: TransactionBlock, options: SuiTransactionBlockResponseOptions) {
                return await this._browserWallet!.features["sui:signAndExecuteTransactionBlock"].signAndExecuteTransactionBlock({
                    transactionBlock: transactionBlock,
                    chain: this.walletNetwork as any,
                    account: this.currentAccount!,
                    options,
                })
            }
        }
        // () is important here
    })()
}
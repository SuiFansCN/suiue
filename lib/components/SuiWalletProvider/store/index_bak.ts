import {defineStore} from "pinia";
import {SuiClient} from "@mysten/sui.js/client";
import type {
    // SuiSignPersonalMessageInput,
    // SuiSignPersonalMessageOutput,
    // SuiSignAndExecuteTransactionBlockInput,
    // SuiSignAndExecuteTransactionBlockOutput,
    // SuiSignTransactionBlockInput,
    // SuiSignTransactionBlockOutput,
    Wallet,
    WalletAccount,
    SuiChain,
    SuiFeatures,
    StandardFeatures
} from "@mysten/wallet-standard";

import {SUI_MAINNET_CHAIN} from "@mysten/wallet-standard";
import {getRegisteredWallets} from "@/utils/walletUtils";
import {ref, reactive} from "vue";

import {PartialBy} from "@/typeUtils.ts";

// ====================
const SUI_WALLET_NAME = 'Sui Wallet';
// ====================

export type SuiWalletStoreType = ReturnType<typeof createProviderStore>;
type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected';


type CreateWalletStoreOptions = {
    storeID: string,
    suiClient: SuiClient,
    autoConnectEnabled: boolean,
    network: SuiChain,
    preferredWallets: string[],
    requiredFeatures: (keyof StandardFeatures | keyof SuiFeatures)[],
}

type CreateWalletStoreParams = PartialBy<
    CreateWalletStoreOptions,
    "storeID" | "autoConnectEnabled" | "network" | "preferredWallets" | "requiredFeatures"
>;

// ====================

export function createProviderStore(
    _options: CreateWalletStoreParams
) {

    // deal with options

    let {
        storeID, autoConnectEnabled, network,
        suiClient, preferredWallets, requiredFeatures
    } = {
        ...{
            storeID: `SuiWalletStore-${Symbol('SuiWalletStore').toString()}`,
            autoConnectEnabled: false,
            network: SUI_MAINNET_CHAIN,
            preferredWallets: [SUI_WALLET_NAME],
            requiredFeatures: ["sui:signTransactionBlock", ],

        }, // create default options
        ..._options,
    } as CreateWalletStoreOptions;


    if (!suiClient) {
        throw new Error('param: `SuiClient` is required')
    }

    // TODO: autoConnectEnabled

    const wallets = getRegisteredWallets(
        preferredWallets,
        requiredFeatures
    )

    return defineStore(storeID, {
        state: () => ({
            // any
            client: suiClient,
            autoConnectEnabled: ref<boolean>(autoConnectEnabled),

            wallets: reactive<Wallet[]>(wallets),
            accounts: reactive<WalletAccount[]>([]),

            currentWallet: ref<Wallet | null>(null),
            currentAccount: ref<WalletAccount | null>(null),
            currentNetwork: ref<SuiChain>(network),

            lastConnectedAccountAddress: ref<string | null>(null),
            lastConnectedWalletName: ref<string | null>(null),
            connectionStatus: ref<WalletConnectionStatus>('disconnected')
        }),
        getters: {
            // isConnected(): boolean {
            //
            // },
            // currentAccount(): string {
            //
            // },
            // currentNetwork(): string {
            //
            // },
        },
        actions: {
            // async signPersonalMessage(
            //     input: PartialBy<SuiSignPersonalMessageInput, "account">
            // ): Promise<SuiSignPersonalMessageOutput> {
            //
            // },
            // signTransactionBlock(
            //     input: PartialBy<SuiSignTransactionBlockInput, "account", | "chain">
            // ): Promise<SuiSignTransactionBlockOutput> {
            //
            // },
            // signAndExecuteTransactionBlock(
            //     input: PartialBy<SuiSignAndExecuteTransactionBlockInput, "account" | "chain">
            // ): Promise<SuiSignAndExecuteTransactionBlockOutput>{
            //
            // }

        }

    })
}
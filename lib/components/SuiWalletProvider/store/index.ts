import {defineStore} from "pinia";
import {getWallets, isWalletWithRequiredFeatureSet} from "@mysten/wallet-standard";
import {WalletProviderAlreadyExists} from "@/errors.ts"
import type { SuiClient} from "@mysten/sui.js/client";
import type {SuiNetworks} from "@/types.ts";

const Stores: any[] = []

export function createProviderStore(options: {
    id: string,
    suiClient: SuiClient,
    autoConnectEnabled: boolean | "enable" | "disable" | "last",
    network: SuiNetworks,
    preferredWallets: string[],
    requiredFeatures: string[],
}) {
    // 查找是否已经存在
    if(Stores.find((store) => store.id === options.id)){
        throw new WalletProviderAlreadyExists(`sui-dapp-kit: wallet provider id:${options.id} already exists`)
    }

    let store = defineStore(options.id, {
        state: () => ({
            suiClient: options.suiClient,
            autoConnectEnabled: options.autoConnectEnabled,
            network: options.network,
            preferredWallets: options.preferredWallets,
            requiredFeatures: options.requiredFeatures,
            currentWallet: null,
            currentAccount: null,
        }),
    })

    Stores.push(store)
    return store
}
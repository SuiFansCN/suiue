<template>
    <slot/>
</template>

<script setup lang="ts">
import {computed, inject, provide, Ref} from "vue";
import {getFullnodeUrl} from "@mysten/sui.js/client"
import {SuiClient} from "@mysten/sui.js/client";

import {CONTEXT_NAMES} from "@/walletContext.ts";
import {isWalletWithRequiredFeatureSet} from "@mysten/wallet-standard";
import {createWalletStore, type WalletStoreType} from "./store"
import type {IdentifierString} from "@mysten/wallet-standard";
import type {SuiClientOptions} from "@mysten/sui.js/client";
import type {SuiNetworksType, AutoConnectType, BrowserWalletType} from "@/types.ts";


const props = defineProps({
    id: {
        type: String,
        default: "vue-sui-dapp-kit-wallet-provider"
    },
    autoConnect: {
        type: String as () => AutoConnectType,
        default: "disable"
    },
    network: {
        type: String as () => SuiNetworksType,
        default: "mainnet"
    },
    customClientParam: {
        type: Object as () => SuiClientOptions,
    },
    preferredWallets: {
        type: Array as () => string[],
        default: () => ["Sui Wallet"]
    },
    requiredFeatures: {
        type: Array as () => IdentifierString[],
        default: () => ["standard:connect", "sui:signAndExecuteTransactionBlock"]
    },

    // v-models
    allBrowserWallets: {
        type: Object as () => BrowserWalletType[],
        required: false
    },
    wallet: {
        type: Object as () => WalletStoreType,
        required: false
    }
})

const emits = defineEmits(["update:allBrowserWallets", "update:wallet"])
const client = new SuiClient(props.customClientParam ? props.customClientParam : {
    url: getFullnodeUrl(props.network),
})

const store = createWalletStore({
    id: props.id,
    network: props.network,
    suiClient: client,
    autoConnect: props.autoConnect
})


const allEligibleWallets = computed((): BrowserWalletType[] => {
    let wallets = inject<Ref<BrowserWalletType[]>>(CONTEXT_NAMES.allBrowserWallets)?.value

    if (!wallets) {
        return []
    }

    // filter by requiredFeatures
    let eligible = wallets.filter(
        (wallet) => isWalletWithRequiredFeatureSet(wallet, props.requiredFeatures)
    )

    // sort wallets by preferredWallets
    return [
        // covert name to wallet
        ...props.preferredWallets
            .map((name) => eligible.find((wallet) => wallet.name === name))
            .filter(Boolean),

        // contain other wallet
        ...eligible.filter((wallet) => !props.preferredWallets.includes(wallet.name))

    ] as BrowserWalletType[]
})

provide(CONTEXT_NAMES.allEligibleWallets, allEligibleWallets.value)
emits("update:allBrowserWallets", allEligibleWallets)

// pass to superior
emits("update:wallet", store)
provide(CONTEXT_NAMES.wallet, store)

</script>

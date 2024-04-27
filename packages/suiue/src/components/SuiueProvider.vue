<template>

    <slot />

</template>

<script setup lang="ts">
import { computed } from "vue";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client"
import { SuiGraphQLClient } from "@mysten/sui.js/graphql"

import { setProvider, useProvider } from "@/provider.ts";
import { forceBindThis } from "@/utils.ts";
import { WalletState } from "@/context/walletState.ts";
import { WalletQuery } from "@/context/walletQuery";
import { WalletActions } from "@/context/walletActions.ts";
import { getWalletConnectionInfo, getWalletIdentifier } from "@/walletUtils.ts";
import { ProviderAlreadyExistsError } from "@/errors.ts"

import type { Wallet, WalletWithSuiFeatures } from "@mysten/wallet-standard";
import type { AutoConnectType, SuiNetworksType } from "@/types.ts";

export type SuiueProviderConfig = {
    id?: string,
    autoConnect?: AutoConnectType,
    network?: SuiNetworksType,
    suiClient?: SuiClient,
    suiClientQL?: SuiGraphQLClient<any>,
    preferredWallets?: string[],
    requiredFeatures?: (keyof WalletWithSuiFeatures["features"])[]
    walletFilter?: (wallet: Wallet) => boolean
}

const props = defineProps({
    config: {
        type: Object as () => SuiueProviderConfig,
        default: () => ({}),
        validator(config: SuiueProviderConfig) {
            if (typeof config !== "object") {
                throw new Error("suiue provider config must be an object")
            }

            if (!config.id) {
                config.id = "suiue-default-provider"
            }

            if (!config.autoConnect) {
                config.autoConnect = "disable"
            }

            if (!config.network) {
                config.network = "mainnet"
            }

            if (!config.suiClientQL) {
                config.suiClientQL = new SuiGraphQLClient({ url: `https://sui-${config.network}}.mystenlabs.com/` })
            }

            if (!config.suiClient) {
                config.suiClient = new SuiClient({ url: getFullnodeUrl(config.network) })
            }

            if (!config.preferredWallets) {
                config.preferredWallets = []
            }

            // 这三功能强制要求，否则无法正常工作
            if (!config.requiredFeatures) {
                config.requiredFeatures = ["standard:connect", "sui:signAndExecuteTransactionBlock", "standard:events", "standard:disconnect"]
            }
            if (!("standard:connect" in config.requiredFeatures)) {
                config.requiredFeatures.push("standard:connect")
            }
            if (!("standard:disconnect" in config.requiredFeatures)) {

                config.requiredFeatures.push("standard:disconnect")
            }
            if (!("standard:events" in config.requiredFeatures)) {
                config.requiredFeatures.push("standard:events")
            }

            if (!config.walletFilter) {
                config.walletFilter = () => true
            }

            return true
        },
    },
    state: {
        type: Object as () => WalletState,
    },
    query: {
        type: Object as () => WalletQuery,
    },
    actions: {
        type: Object as () => WalletActions,
    },
})

const emit = defineEmits(["update:state", "update:query", "update:actions"])

if (useProvider("PROVIDERS").includes(props.config.id!)) {
    throw new ProviderAlreadyExistsError()
}

const walletState = forceBindThis(new WalletState(props.config))
const walletQuery = forceBindThis(new WalletQuery(props.config, walletState))
const walletActions = forceBindThis(new WalletActions(props.config, walletQuery, walletState))

// do not mix up this order
setProvider("PROVIDER", props.config.id!)
setProvider("PROVIDER_CONFIG", props.config)
setProvider("WALLET_STATE", walletState)
setProvider("WALLET_QUERY", walletQuery)
setProvider("WALLET_ACTIONS", walletActions)

emit("update:state", walletState)
emit("update:query", walletQuery)
emit("update:actions", walletActions)


const autoConnectCmp = computed(async () => {
    /* use computed to wait target wallet mount, and stop when success */
    if (props.config.autoConnect === "disable" || walletState.wallets.value.length === 0) {
        autoConnectCmp.effect.stop()
        return
    }

    const connectionInfo = getWalletConnectionInfo()

    async function connectLast() {
        let wallet = walletState.wallets.value.find((wallet) => getWalletIdentifier(wallet) === connectionInfo!.wallet_ident)
        wallet && await walletState.connect(wallet as any, connectionInfo!.account_addr as any)
    }

    // have connection-info
    if (connectionInfo) {
        // auto connect
        if (props.config.autoConnect === "last" || props.config.autoConnect === "enable") {
            await connectLast()
        }
    } else {
        // Not connected yet for every.
        if (props.config.autoConnect === "enable") {
            await walletState.connect(walletState.wallets.value[0] as any)
        }
    }
    autoConnectCmp.effect.stop()
})

// trigger auto connect
autoConnectCmp.effect.run()


</script>

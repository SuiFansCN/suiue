<script setup lang="ts">
import { SuiFeatures, StandardFeatures } from "@mysten/wallet-standard"
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client"
import type { SuiNetworks } from "@/types.ts";

const props = defineProps({
    id: {
        type: String,
        default: "vue-sui-dapp-kit-provider"
    },
    autoConnect: {
        type: String as () => "enable" | "disable" | "last" ,
        default: "disable"
    },
    network: {
        type: String as () => SuiNetworks,
        default: "sui:mainnet"
    },
    customClientRpcUrl: {
        type: String,
    },
    preferredWallets: {
        type: Array as () => string[],
        default: () => ["Sui Wallet"]
    },
    requiredFeatures: {
        type: Array as () => (SuiFeatures | StandardFeatures)[],
        default: () => ["standard:connect", "sui:signAndExecuteTransactionBlock"]
    }
})

let suiClient = new SuiClient({
    url: props.customClientRpcUrl ? props.customClientRpcUrl : getFullnodeUrl(props.network)
})

</script>

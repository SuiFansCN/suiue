// import {computed} from "vue";
import type { SuiClient } from "@mysten/sui.js/client";
import {useProvider} from "@/provider.ts";
import type {WalletState} from "@/context/walletState.ts";


export class WalletQuery{
    public readonly client
    private state

    constructor(client: SuiClient, state: WalletState) {
        this.client = client
        this.state = state
        // this.coins = computed(async () => {
        //     (await this.client.getCoins({
        //         owner: this.state.address.value
        //     })).data[0].
        // })
    }

}

export const useWalletQuery = () => useProvider("WALLET_QUERY")
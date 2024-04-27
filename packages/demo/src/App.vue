<template>
    <!-- <ul>
        <li v-for="wallet in walletState?.wallets.value" :key="wallet.name" @click="walletState.connect(wallet)">{{
            wallet.name }}
        </li>
    </ul>
    <div>{{ address }}</div>
    <div>{{ suiBalance }}</div>
    <div>{{ domain ?? 'no domain' }}</div>
    <ul>
        <li v-for="coin in suiCoins" :key="coin.coinObjectId">
            {{ coin.coinObjectId }}: {{ coin.balance }}
        </li>
    </ul>
    <div><button v-if="isConnected" @click="walletState.disconnect">disconnect</button></div>
    <div><button @click="console.log(actions.signPersonalMessage('hello world'))">sign Message</button></div> -->
    <!--    {{ obj.obj.name }}-->
    <!--    {{ obj.obj.age }}-->
    <!--    <button @click="obj.obj.name = 'json'">change</button>-->

</template>

<script setup lang="ts">

import {ComputedRef, Ref, computed, onMounted, reactive, ref, shallowReactive, shallowRef, toRef, readonly} from "vue";
import {SuiGraphQLClient} from "@mysten/sui.js/graphql"
import {loadCoins} from "@suifans/suiue";
// import { TransactionBlock } from "@mysten/sui.js/transactions"
// import { useWalletState, useWalletActions, useWalletQuery } from "@suifans/suiue";

// const walletState = useWalletState()
// const actions = useWalletActions()
// const query = useWalletQuery()
// const { address, isConnected } = walletState
// const { suiCoins, suiBalance, domain } = query

const client = new SuiGraphQLClient({
    url: "https://sui-mainnet.mystenlabs.com/"
})

onMounted(async () => {
    console.log(
        await loadCoins(client, "0xab73ad38c63f83eda02182422b545395be1d3caeb54b5869159a9f70b678cd56", ["0x2::sui::SUI", "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"])
    )
})


</script>

<template>

    <ul>
        <li
            v-for="wallet in walletState?.wallets.value" :key="wallet.name"
            @click="walletState.connect(wallet)"
        >{{ wallet.name }}
        </li>
    </ul>
    <div>{{ address }}</div>
    <div><button v-if="isConnected" @click="walletState.disconnect">disconnect</button></div>
    <div><button @click="console.log(walletActions.signPersonalMessage('hello world'))">sign Message</button></div>
<!--    <div>{{ wallet.publicKey }}</div>-->
<!--    <button @click="console.log(wallet.publicKey)">connect</button>-->

<!--{{Wrapper.str}}-->
<!--<button @click="Wrapper.changeStr">change</button>-->
<!--    <SuiueProvider :config="{-->

<!--    }"></SuiueProvider>-->
</template>

<script setup lang="ts">

import {computed, inject, onMounted, provide} from "vue";
import { TransactionBlock } from "@mysten/sui.js/transactions"
import { useWalletState, useWalletActions } from "@suifans/suiue";

const walletState = useWalletState()
const walletActions = useWalletActions()
const { address, isConnected } = walletState


// onMounted(() => {
//     console.log(walletState?.wallets.value)
//     // console.log(walletState?.wallets)
// })
// console.log(walletState?.wallets)

// watch(wallet._accounts, () => {
//     console.log(wallet._accounts)
// })
//
// onMounted(async () => {
//     // console.log(suiWallets.value[0])
//     // account.value = await suiWallets.value[0]?.features["standard:connect"].connect()
//
// })


</script>




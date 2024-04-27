<template>
    <ul>
        <li v-for="wallet in walletState?.wallets.value" :key="wallet.name" @click="walletState.connect(wallet)">
            {{ wallet.name }}
        </li>
    </ul>
    <div>{{ address }}</div>
    <div>{{ suiBalance }}</div>
    <div>{{ query.domain ?? 'no domain' }}</div>
    <ul v-if="suiCoins">
        <li v-for="coin in suiCoins" :key="coin.id">
            {{ coin.type }}: {{ coin.contents.balance.value }}
        </li>
    </ul>
    <div><button v-if="isConnected" @click="walletState.disconnect">disconnect</button></div>
    <div><button @click="console.log(actions.signPersonalMessage('hello world'))">sign Message</button></div>

</template>

<script setup lang="ts">

import {onMounted,} from "vue";
// import { TransactionBlock } from "@mysten/sui.js/transactions"
import { useWalletState, useWalletActions, useWalletQuery } from "@suifans/suiue";

const walletState = useWalletState()
const actions = useWalletActions()
const query = useWalletQuery()
const { address, isConnected } = walletState
const { suiCoins, suiBalance } = query

onMounted( () => {

})


</script>

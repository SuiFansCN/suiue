<template>
    <SuiWalletProvider v-model:all-browser-wallets="allWallets" v-model:wallet="wallet">
        <ul>
            <li v-for="browserWallet in allWallets" :key="browserWallet.name" @click="wallet?.connect(browserWallet)">
                <img :src="browserWallet.icon" height="32">
                <span>{{browserWallet.name}}</span>
            </li>
        </ul>
    </SuiWalletProvider>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import { SuiWalletProvider, type WalletStoreType } from "vue-sui-dapp-kit";
import type {BrowserWalletType} from "vue-sui-dapp-kit";

const allWallets = ref<BrowserWalletType[]>()
const wallet = ref<WalletStoreType>()

onMounted(async () => {
    console.log(wallet)
})
</script>




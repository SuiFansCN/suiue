<template>
    <SuiWalletProvider v-model:all-browser-wallets="allWallets" v-model:wallet="wallet">
        <div>
            currentWallet: {{ wallet?.identify }}
        </div>
        <ul>
            <li v-for="browserWallet in allWallets" :key="browserWallet.name">
                <img :src="browserWallet.icon" height="32" alt="wallet logo">
                <span>{{ browserWallet.name }}</span>
                <button @click="wallet?.connect(browserWallet)">Connect</button>
            </li>
        </ul>
        <div>accounts:</div>
        <ul>
            <li v-for="account in wallet?.accounts" :key="account.address">{{account.address}}</li>
        </ul>
    </SuiWalletProvider>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {SuiWalletProvider} from "vue-sui-dapp-kit";
import type {BrowserWalletType, WalletStoreType} from "vue-sui-dapp-kit";

const allWallets = ref<BrowserWalletType[]>()
const wallet = ref<WalletStoreType>()

onMounted(async () => {
    console.log(wallet)
})
</script>




<script setup lang="ts">
import SuiIcon from "@/views/suiIcon.vue";
import { NConnectButton } from "@suifans/suiue"
import Content from "@/views/content.vue";
import { useWalletState, useWalletQuery } from "@suifans/suiue";


const { isConnected, onConnect } = useWalletState()
const { loadAllBalance, loadAllObjects, loadAllCoins } = useWalletQuery()

onConnect(() => {
    loadAllBalance()
    loadAllObjects()
    loadAllCoins()
})

</script>

<template>
    <n-layout>
        <n-layout-header bordered style="width: 100%; padding: 14px">
            <n-page-header title="Suiue Demo">
                <template #avatar><sui-icon/></template>
                <template #extra><n-connect-button/></template>
            </n-page-header>

        </n-layout-header>

        <n-layout bordered position="absolute" content-style="padding: 16px" style="top: 64px; width: 100%">
            <template v-if="isConnected">
                <content />
            </template>
            <template v-else>
                <n-flex style="width: 100%; padding-top: 128px" align="center" justify="center">
                    <n-spin size="large" />
                </n-flex>
            </template>
        </n-layout>

    </n-layout>

</template>

<style scoped>

.n-layout {
    width: 40vw;
    min-width: 480px;
    max-width: 680px;
    height: 85vh;
    border-radius: 15px;
    box-sizing: content-box;
}

</style>

<style>

#app{
    position: relative;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    background: linear-gradient(45deg, #CFDEF3, #E0EAFC);
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>



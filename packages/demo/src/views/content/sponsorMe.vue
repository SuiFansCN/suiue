<script setup lang="ts">
import {useWalletActions, consts} from "suiue";
import {TransactionBlock} from "@mysten/sui.js/transactions";

const {signAndExecuteTransactionBlock, getExactlyCoinAmount} = useWalletActions()
const amount = ref(50)

async function sponsorMe() {
    const txb = new TransactionBlock()

    txb.transferObjects(
        [await getExactlyCoinAmount({
            txb,
            coinType: consts.COIN_SUI,
            amt: amount.value * consts.MIST_PER_SUI
        })],
        "0xcc05ae5fe806c7df585f5b4bd626a33d14045f2e123e794b16fcfd7949e7f3ef"
    )
    console.log(txb.gas)
    await signAndExecuteTransactionBlock(txb)
}
</script>

<template>
    <n-card title="SponsorMe (V我50)">
        <n-flex>
            <n-input-number
                style="flex-grow: 1"
                :min="0"
                :precision="2"
                v-model:value="amount"
                placeholder="Amount"
            >
                <template #prefix>
                    <n-text>SUI</n-text>
                </template>
            </n-input-number>
            <!--        <n-button onClick={useWalletActions().sponsorMe}>Sponsor Me</n-button>-->
            <n-button @click="sponsorMe">Thanks!</n-button>
        </n-flex>
    </n-card>
</template>

<style scoped>

</style>
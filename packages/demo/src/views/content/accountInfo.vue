<script setup lang="ts">
import {useWalletState, useWalletQuery, consts} from "suiue";

const {address} = useWalletState();
const {suiBalance} = useWalletQuery()
</script>

<template>
    <n-card title="Account">
        <n-flex vertical>
            <n-text>
                account: {{ address }}
            </n-text>
            <n-text>
                suiBalance: {{ parseInt(suiBalance) / consts.MIST_PER_SUI }} SUI ({{ suiBalance }} MIST)
            </n-text>
        </n-flex>
    </n-card>
</template>

<style scoped>

</style>
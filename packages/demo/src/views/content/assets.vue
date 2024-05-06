<script setup lang="ts">
import balancesTable from "./assets/balancesTable.vue"
import NftList from "@/views/content/assets/nftList.vue";
</script>


<template>
    <n-card content-style="padding: 0; min-height: 320px">
        <n-tabs
            type="line"
            size="medium"
            animated
            :tabs-padding="20"
            pane-style="padding: 8px; box-sizing: border-box;"
        >
            <n-tab-pane name="BALANCES">
                <balances-table/>
            </n-tab-pane>
            <n-tab-pane name="NFTS">
                <nft-list/>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>


<style scoped>

</style>
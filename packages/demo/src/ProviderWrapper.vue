<script setup lang="ts">
import App from "@/App.vue";
import {SuiueProvider} from "@suifans/suiue";
</script>

<template>
<suiue-provider :config="{
    requiredFeatures: ['sui:signMessage', 'sui:signTransactionBlock', 'sui:signAndExecuteTransactionBlock'],
    autoConnect: 'enable'
}">
    <app></app>
</suiue-provider>
</template>

<style scoped>

</style>
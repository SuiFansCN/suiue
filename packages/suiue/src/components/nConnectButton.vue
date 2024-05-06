<script setup lang="ts">
import 'vfonts/Lato.css'
import {ref} from "vue";
import {NModal, NButton, NGrid, NGridItem, NSpace, NIcon} from "naive-ui";
import {useWalletQuery} from "@/context/walletQuery";
import {useWalletState} from "@/context/walletState";

const showModal = ref<boolean>(false)

const {isConnected, address, connect, disconnect, wallets} = useWalletState();
const {domain} = useWalletQuery()

const toggleModal = () => showModal.value = !showModal.value

const mouseIn = ref<boolean>(false)

</script>

<template>
    <n-button
        @mouseenter="mouseIn = true"
        @mouseleave="mouseIn = false"
        @click="isConnected ? disconnect() : toggleModal()"
        style="width: 128px"
    >
        <template v-if="!mouseIn">
            <span style="text-overflow: ellipsis; overflow: hidden ">
                {{ isConnected ? (domain ? domain : address) : "connect" }}
            </span>
        </template>
        <template v-else>
            <span> {{ isConnected ? "disconnect" : "connect" }} </span>
        </template>
    </n-button>

    <n-modal
        v-model:show="showModal"
        transform-origin="center"
        bordered
        preset="card"
        title="Connect Wallet"
        style="min-width: 480px; max-width: 860px; width: 40vw"
    >
        <template #header-extra>
            Powered by suifans
        </template>

        <n-grid
            :cols="3"
            :x-gap="8"
            :y-gap="8"
        >
            <n-grid-item v-for="wallet in wallets" :key="JSON.stringify(wallet.chains)">
                <n-button @click="connect(wallet).then(toggleModal)" style="height: 114px">
                    <n-space vertical>
                        <n-icon size="64">
                            <img :src="wallet.icon" :alt="wallet.name">
                        </n-icon>
                        <span>{{ wallet.name }}</span>
                    </n-space>
                </n-button>
            </n-grid-item>
        </n-grid>

    </n-modal>
</template>
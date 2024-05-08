<script setup lang="ts">
import {useWalletQuery} from "suiue";

import {computed} from "vue";

interface DisplayObject {
    name?: string,
    description?: string,
    link?: string,
    image_url?: string,
    thumbnail_url?: string,
    project_url?: string,
    creator?: string,
}

const {objects} = useWalletQuery()
const datas = computed(() => {
    const result = [] as DisplayObject[]
    for (const key in objects) {
        for (const obj of objects[key as any]) {

            if (!obj.display) {
                continue
            }

            let newObj = {}
            Object.assign(newObj, obj.display)
            result.push(newObj)
        }
    }
    return result
})

</script>

<template>
    <n-grid :cols="3" x-gap="8" y-gap="8">
        <n-grid-item v-for="obj in datas">
            <n-flex vertical align="center">
                <n-image width="100%" :src="obj.image_url"/>
                <n-text>{{ obj.name }}</n-text>
            </n-flex>
        </n-grid-item>
    </n-grid>

</template>

<style scoped>

</style>
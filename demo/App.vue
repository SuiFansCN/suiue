<template>

</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {defineStore, getActivePinia} from "pinia";

onMounted(async () => {
    defineStore("1", {
        state: () => ({
            count: 0
        }),
        actions: {
            increment() {
                this.count++
            }
        }
    })();
    defineStore("1", {
        state: () => ({
            data: 0
        }),
        actions: {
            increment() {
                this.data++
            }
        }
    })();

    console.log(getActivePinia())
})
</script>




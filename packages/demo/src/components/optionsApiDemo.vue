<script lang="ts">
import {defineComponent} from 'vue'
import { mapState } from "pinia"
import {useWallet} from "@suifans/suiue"

export default defineComponent({
    name: "optionsApiDemo",
    computed:{
        ...mapState(useWallet,["currentAccount"])
    },
})
</script>

<template>
    <div>
        {{currentAccount?.address}}
    </div>

</template>
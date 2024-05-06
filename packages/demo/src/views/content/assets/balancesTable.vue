<script setup lang="ts">
import {useWalletQuery} from "@suifans/suiue";

type BalanceType = {
    icon?: string | null
    name?: string
    symbol?: string
    type: string
    balance: string
    objCount: number
}

const {balances, client} = useWalletQuery()
const datas = ref([] as BalanceType[])

watchEffect(async () => {
    const result = [] as BalanceType[]

    for (const key in balances) {
        const balance = balances[key as any]
        const metadata = await client.getCoinMetadata({
            coinType: balance.type
        })
        result.push({
            icon: metadata?.iconUrl,
            name: metadata?.name,
            symbol: metadata?.symbol,
            type: balance.type,
            balance: (parseFloat(balance.totalBalance) / Math.pow(10, metadata?.decimals || 0)).toFixed(2),
            objCount: balance.coinObjectCount
        })
    }
    datas.value = result
})
</script>

<template>
    <n-table style="width: 100%">
        <thead>
        <tr>
            <th>ICON</th>
            <th>NAME</th>
            <th>SYMBOL</th>
            <th>TYPE</th>
            <th>BALANCE</th>
            <th>OBJS</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="balance in datas" :key="balance.type">
            <td><n-icon><img :src="balance.icon ?? ''" alt="" /></n-icon></td>
            <td>{{ balance.name }}</td>
            <td>{{ balance.symbol }}</td>
            <td>{{ balance.type }}</td>
            <td>{{ balance.balance }}</td>
            <td>{{ balance.objCount }}</td>
        </tr>
        </tbody>

    </n-table>
</template>

<style scoped></style>
<script setup>
import { useWalletState, useWalletQuery, useWalletActions, consts, InsufficientBalanceError } from "suiue"
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { ref } from "vue"
const state = useWalletState()
const query = useWalletQuery()

const { isConnected } =  useWalletState()
const { loadObjects, objects } = useWalletQuery()
const { signAndExecuteTransactionBlock, getExactlyCoinAmount } = useWalletActions()
	
const objType = ref()
const sponsorAmount = ref(5)


async function sponsorMe() {
    const txb = new TransactionBlock()

    try {
        const coinToTransfer = await getExactlyCoinAmount({
            txb: txb,
            coinType: consts.COIN_SUI,
            amt: sponsorAmount.value * consts.MIST_PER_SUI,
        })
    
        txb.transferObjects([coinToTransfer], "0xcc05ae5fe806c7df585f5b4bd626a33d14045f2e123e794b16fcfd7949e7f3ef")
        //                                    my address
    
        await signAndExecuteTransactionBlock(txb)
    } catch (e) {
        if (e instanceof InsufficientBalanceError) {
            alert("Insufficient balance")
            return
        }
        throw e
    }
}
</script>

# quick start

This article guides you how to get started quickly with `Suiue`

Similarly, you can also take a look at the [`demo`](https://github.com/SuiFansCN/suiue/tree/main/packages/demo) that we have prepared to facilitate your understanding.

## Installation

**This tool-kit is developed based on `VUE`, so you need to make sure you have installed `VUE` before using this tool-kit**

```shell
# npm
npm install suiue
# yarn
yarn add suiue
# pnpm
pnpm add suiue
```

## Configuration

First, make sure you have correctly initialized the `VUE` project. If you still don’t know how to create it, you can take a look [here](https://cn.vuejs.org/guide/quick-start.html)

Suppose you have a directory with a structure like this

```
./src
	App.vue
	main.ts
	...
```

Now, we create a component to wrap `App.vue`. This component provides a `suiue-provider`. This is the context that `suiue` required to run.

```vue
<!-- ProviderWrapper.vue -->

<script setup lang="ts">
    import App from "@/App.vue";
    import {SuiueProvider} from "suiue";
</script>

<template>
    <suiue-provider
        :config="{
      requiredFeatures: [
        'sui:signMessage',
        'sui:signTransactionBlock',
        'sui:signAndExecuteTransactionBlock',
      ],
      autoConnect: 'enable',
    }"
    >
        <app></app>
    </suiue-provider>
</template>
```

For detailed configuration instructions, please refer to [Reference](/en_US/reference/components.md#suiueprovider)

Then you need to install `suiue` in `main.ts` and switch the `App.vue` root mount to `ProviderWrapper.vue`

```typescript
// main.ts

import {createApp} from "vue";

// App -> ProviderWrapper
import ProviderWrapper from "./ProviderWrapper.vue";
import {createSuiue} from "suiue";

// App -> ProviderWrapper
const app = createApp(ProviderWrapper);
app.use(createSuiue());
app.mount("#app");
```

At this point, you have completed the preliminary configuration work

## ConnectButton

`suiue` provides a `connect-button` based on naive-ui. If you don’t want to use `naive-ui`, you can still refer to `connect-button`
[Implementation](https://github.com/SuiFansCN/suiue/blob/main/packages/suiue/src/components/nConnectButton.vue) Customize a connect button yourself.

```vue

<script setup lang="ts">
    import {SuiueProvider, NConnectButton} from "suiue";
</script>

<template>
    <n-connect-button/>
</template>
```

<n-connect-button/>

Now you can click the `connect-button` above or in the upper right corner of the website, and a pop-up box will pop up to guide you to connect the wallet.

## useWalletState

According to the usage habits of `VUE`, we encapsulate all states into `useWalletXxx`. If you want to get the status of the wallet, you can use `useWalletState`

```vue

<script setup lang="ts">
    import {useWalletState} from "suiue";

    const state = useWalletState()
</script>

<template>
    isConnected: {{ state.isConnected }}
</template>
```

isConnected: {{ state.isConnected }}

It should be noted that many data in `Suiue` are wrapped with `ref` or `computed`. If you need to reference it in the code, you need to add `.value`

```html

<button
        @click="console.log(state.isConnected.value)"
>
    click to show isConnected
</button>
```

<n-button @click="console.log(state.isConnected.value)">click to show isConnected</n-button>

For more information about state, check out [Reference](./reference/wallet-state.md)

## deconstruction operation

For `useWalletXxx`, destructuring operation is supported and can be used conveniently.

```typescript
import {useWalletState, useWalletQuery} from "suiue"

const {isConnected} = useWalletState()
const {suiBalance} = useWalletQuery()
```

<n-text type="error" strong>! ! Notice! ! If you use these attributes in a template, it is best to deconstruct them, otherwise unexpected effects may occur.</n-text>

```vue

<script lang="ts" setup>
    import {useWalletState, useWalletQuery} from "suiue"

    const state = useWalletState()
    const {isConnected} = state
</script>

<template>

    <!-- Directly using state.isConnected does not take effect, you need to add .value -->
    <template v-if="state.isConnected.value">
        suiBalance: {{ query.suiBalance }} MIST
    </template>

    <!-- isConnected after direct deconstruction takes effect -->
    <template v-if="isConnected">
        suiBalance: {{ query.suiBalance }} MIST
    </template>

</template>
```

## useWalletQuery

`Suiue` helps you encapsulate some common wallet query operations during the `dapp` development process, including `Balances`, `Coins`, `Objects`.

These contents are encapsulated in `useWalletQuery`

```vue

<script lang="ts" setup>
    import {useWalletQuery} from "suiue"

    const {suiBalance} = useWalletQuery()
</script>

<template>
    suiBalance: {{ suiBalance }} MIST
</template>
```

<template v-if="isConnected">
suiBalance: {{ suiBalance }} MIST
</template>
<template v-else>
Connect to show suiBalance
</template>


`Suiue` will query SUI's `Balance` and `coins` by default. If you need to get your own data, you can use `loadXXX` to load it.

```typescript
import {useWalletQuery} from "suiue"

const query = useWalletQuery()

const barObject = await query.loadObjects("0xyourpackage::foo::bar")
```

Since loading requires a network request, you can use `await` to wait for the data to be returned. If you just use the data in the template, you do not need to wait for the return result, which is also responsive.

<n-text type="error" strong>! ! Notice! ! The current loading of assets is a one-time operation. If you think your assets have changed, you should call `loadXxx` again to update your assets. In the future, we will consider adding a listener to monitor asset changes in real time.</n-text>

There are several available methods:

- loadObjects
- loadCoins
- loadBalance
- loadAllBalance
- loadAllCoins
- loadAllObjects

for example：

```vue

<script setup lang="ts">
    import {useWalletQuery} from "suiue"

    const {loadObjects, objects} = useWalletQuery()

    const objType = ref()
</script>

<template>

    <n-input v-model:value="objType"/>
    <n-button @click="objType && loadObjects(objType)">Load</n-button>

    objects:
    <pre>
        {{ objects }}
    </pre>
</template>
```

<template v-if="isConnected">
<n-flex><n-input v-model:value="objType"  /><n-button @click="objType && loadObjects(objType)">Load</n-button></n-flex>

objects:

{{ objects }}
</template>
<template v-else>
connect wallet to show objects
</template>

## useWalletActions

`Suiue` provides `useWalletActions` to interact with the wallet. To use it, you first need to build a `TransactionBlock`. Here we take `Sponsor Me` as an example.

```vue

<script setup lang="ts">
    import {useWalletActions, consts, InsufficientBalanceError} from "suiue"
    import {TransactionBlock} from "@mysten/sui.js/transactions";

    const {signAndExecuteTransactionBlock, getExactlyCoinAmount} = useWalletActions()

    const sponsorAmount = ref(5)

    async function sponsorMe() {
        const txb = new TransactionBlock()

        try {
            const coinToTransfer = await getExactlyCoinAmount({
                txb: txb,
                coinType: consts.COIN_SUI,
                amt: sponsorAmount.value * consts.MIST_PER_SUI,
            })

            txb.transferObjects([coinToTransfer], "0xcc05ae5fe806c7df585f5b4bd626a33d14045f2e123e794b16fcfd7949e7f3ef")
            //                                    my address

            await signAndExecuteTransactionBlock(txb)
        } catch (e) {
            if (e instanceof InsufficientBalanceError) {
                alert("Insufficient balance")
                return
            }
            throw e
        }
    }
</script>

<template>
    <n-flex>
        <n-input-number v-model:value="sponsorAmount"/>
        <n-button @click="sponsorMe()">sponsorMe!!</n-button>
    </n-flex>
</template>
```

<template v-if="isConnected">
<n-flex>
	<n-input-number v-model:value="sponsorAmount" />
	<n-button @click="sponsorMe()">sponsorMe!!</n-button>
</n-flex>
</template>
<template v-else>
connect wallet to show action
</template>

The supported actions are：

- signAndExecuteTransactionBlock
- signTransactionBlock
- signPersonalMessage
- getExactlyCoinAmount

More will be supported in the future

<n-text type="error" strong>! ! Notice! ! Before using the corresponding walletFeatures, you need to set the requiredFeatures in SuiueProvider's config in advance. otherwise an error may be reported!</n-text>
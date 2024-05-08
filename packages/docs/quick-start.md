<script setup>
import { useWalletState, useWalletQuery, useWalletActions, consts, InsufficientBalanceError } from "@suifans/suiue"
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

# 快速上手

这边文章指引你如何快速上手 `Suiue`

同样的，你也可以看看我们已经准备好的 [`demo`](https://github.com/SuiFansCN/suiue/tree/main/packages/demo)，方便你理解

## 安装

**本套件基于 `VUE` 开发，因此在安装本套件之前需要确保你已经安装了 `VUE`**

```shell
# npm
npm install @suifans/suiue
# yarn
yarn add @suifans/suiue
# pnpm
pnpm add @suifans/suiue
```

## 配置

首先确保你已经正确初始化了 `VUE` 项目，如果你还不知道怎么创建，可以看看[这里](https://cn.vuejs.org/guide/quick-start.html)

假设你有一个这样的结构目录

```
./src
	App.vue
	main.ts
	...
```

我们首先创建一个组件，用来包裹 `App.vue`，这个组件提供了一个 `suiue-provider`。这是 `suiue` 运行所必需的上下文。

```vue
<!-- ProviderWrapper.vue -->

<script setup lang="ts">
    import App from "@/App.vue";
    import {SuiueProvider} from "@suifans/suiue";
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

关于详细的配置说明，请在[参考](./reference/components.md#suiueprovider)中查阅

随后你需要在 `main.ts` 中安装 `suiue`，并且将原来挂在至根节点的 `App.vue` 切换为 `ProviderWrapper.vue`

```typescript
// main.ts

import {createApp} from "vue";

// App -> ProviderWrapper
import ProviderWrapper from "./ProviderWrapper.vue";
import {createSuiue} from "@suifans/suiue";

// App -> ProviderWrapper
const app = createApp(ProviderWrapper);
app.use(createSuiue());
app.mount("#app");
```

至此，你已经完成了初步的配置工作

## 连接按钮

`suiue` 提供了一个基于 naive-ui 的 `connect-button`，如果你不希望使用 `naive-ui`，你依然可以参考 `connect-button`
的[实现](https://github.com/SuiFansCN/suiue/blob/main/packages/suiue/src/components/nConnectButton.vue)自己自定义一个连接按钮。

```vue

<script setup lang="ts">
    import {SuiueProvider, NConnectButton} from "@suifans/suiue";
</script>

<template>
    <n-connect-button/>
</template>
```

<n-connect-button/>

现在你可以点击上面或者网站右上角的的 `connect-button`，将会弹出一个弹框引导你连接钱包

## 使用钱包状态

根据 `VUE` 的使用习惯，我们将一切状态封装到了 `useWalletXxx` 中，如果你想获取钱包的状态，可以使用 `useWalletState`

```vue

<script setup lang="ts">
    import {useWalletState} from "@suifans/suiue";

    const state = useWalletState()
</script>

<template>
    isConnected: {{ state.isConnected }}
</template>
```

isConnected: {{ state.isConnected }}

需要注意的是，`Suiue` 的许多数据都是使用 `ref` 或者 `computed` 包裹的，如果你需要在代码中引用，需要加上 `.value`

```html

<button
        @click="console.log(state.isConnected.value)"
>
    click to show isConnected
</button>
```

<n-button @click="console.log(state.isConnected.value)">click to show isConnected</n-button>

有关 state 的更多内容，请在[参考](./reference/wallet-state.md)中查阅

## 解构操作

对于 `useWalletXxx`，支持解构操作，可以方便使用。

```typescript
import {useWalletState, useWalletQuery} from "@suifans/suiue"

const {isConnected} = useWalletState()
const {suiBalance} = useWalletQuery()
```

<n-text type="error" strong>！！注意！！如果你在模板中使用这些属性，最好解构出来，否则可能发生意外的效果</n-text>

```vue

<script lang="ts" setup>
    import {useWalletState, useWalletQuery} from "@suifans/suiue"

    const state = useWalletState()
    const {isConnected} = state
</script>

<template>

    <!-- 直接使用 state.isConnected 不生效，需要加上 .value -->
    <template v-if="state.isConnected.value">
        suiBalance: {{ query.suiBalance }} MIST
    </template>

    <!-- 直接解构之后的 isConnected，生效 -->
    <template v-if="isConnected">
        suiBalance: {{ query.suiBalance }} MIST
    </template>

</template>
```

## 查询钱包

`Suiue` 帮你封装好了在 `dapp` 开发的过程中一些常用的对钱包进行查询的操作，包括 `Balances`, `Coins`, `Objects`。

这些内容被封装在 `useWalletQuery` 中

```vue

<script lang="ts" setup>
    import {useWalletQuery} from "@suifans/suiue"

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


`Suiue` 默认会去查询 SUI 的 `Balance` 和 `coins`，如果你需要获取你自己的数据，可以使用 `loadXXX` 来加载

```typescript
import {useWalletQuery} from "@suifans/suiue"

const query = useWalletQuery()

const barObject = await query.loadObjects("0xyourpackage::foo::bar")
```

由于加载需要进行网络请求，因此你可以使用 `await` 来等待数据返回，如果你只是在模板中引用该数据，则可以不等待返回结果，同样具有响应式

<n-text type="error" strong>！！注意！！目前对资产的加载是一次性的，如果您认为您的资产发生了变化，应该重新调用 loadXxx
以更新您的资产，未来将会考虑加入监听器以实时监听资产的变化</n-text>

可用的方法有：

- loadObjects
- loadCoins
- loadBalance
- loadAllBalance
- loadAllCoins
- loadAllObjects

例子：

```vue

<script setup lang="ts">
    import {useWalletQuery} from "@suifans/suiue"

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

## 钱包交互

`Suiue` 提供了 `useWalletAction` 来与钱包交互，想要使用它，首先你需要构建一个 `TransactionBlock`，这里以 `赞助我` 为例子

```vue

<script setup lang="ts">
    import {useWalletActions, consts, InsufficientBalanceError} from "@suifans/suiue"
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

支持的 actions 有：

- signAndExecuteTransactionBlock
- signTransactionBlock
- signPersonalMessage
- getExactlyCoinAmount

在未来还会支持更多

<n-text type="error" strong>！！注意！！在使用相应的 walletFeatures 之前，需要在 SuiueProvider 的 config 中提前设置好所需的
Features，否则可能会报错！</n-text>
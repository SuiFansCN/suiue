# 快速上手

这边文章指引你如何快速上手 `Suiue`

同样的，你也可以看看我们已经准备好的 `demo`，方便你理解


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
<suiue-provider :config="{
    requiredFeatures: ['sui:signMessage', 'sui:signTransactionBlock', 'sui:signAndExecuteTransactionBlock'],
    autoConnect: 'enable'
}">
    <app></app>
</suiue-provider>
</template>

<style scoped>

</style>
```

关于详细的配置说明，请在[参考](./reference/index.md)中查阅

随后你需要在 `main.ts` 中安装 `suiue`，并且将原来挂在至根节点的 `App.vue` 切换为 `ProviderWrapper.vue`

```typescript
// main.ts

import {createApp} from 'vue'

// App -> ProviderWrapper
import ProviderWrapper from './ProviderWrapper.vue'
import { createSuiue } from "@suifans/suiue";

// App -> ProviderWrapper
const app = createApp(ProviderWrapper)
app.use(createSuiue())
app.mount('#app')


```

至此，你已经完成了初步的配置工作



## 连接按钮

`suiue` 提供了一个基于 naive-ui 的 `connect-button`，如果你不希望使用 `naive-ui`，你依然可以自己实现一个连接按钮，这儿话题我们在这里暂不详细展开。

```vue
```


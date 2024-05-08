# Components

这里对 `Suiue` 提供的 `VUE` 组件提供说明

## SuiueProvider

- props
  - config
```typescript
import {SuiClient} from "@mysten/sui.js/client";
import {SuiGraphQLClient} from "@mysten/sui.js/graphql";

interface SuiueProviderConfig {
    // 指定当前 provider 的 id，用于记录 autoConnect 信息
    // 在有多个 provider 的情况下，需要指定不同的 id, 多个 provider 的情况暂未经过验证, 请谨慎使用
    // 主要用来同时连接多个钱包
    id?: string,
    
    // 是否自动连接钱包, 默认为 "disable"
    // "enable" 为自动连接, last 在用户上次连接过，并且没有断开的情况才会自动连接
    autoConnect?: "enable" | "disable" | "last",
    
    // 指定连接钱包所使用的网络
    // 默认为 "mainnet"
    network?: "mainnet" | "testnet" | "devnet" | "localnet",
    
    // 自定义 suiClient
    suiClient?: SuiClient,
    
    // 自定义 suiClientQL, useWalletQuery 使用 graphql 进行查询
    // 生产环境下建议你自己搭建一个 graphql 服务器，
    // 默认的情况下是使用官方的 graphql 服务器，只支持 mainnet 和 testnet, 而且延迟高，不适合生产环境
    // https://docs.sui.io/guides/developer/getting-started/graphql-rpc
    suiClientQL?: SuiGraphQLClient<any>,
    
    // 可以将希望排在前面的钱包放在这里，例如 ["sui wallet", "okx wallet"]
    // 在用户安装了上面两个钱包的情况下，会优先显示 "sui wallet" 和 "okx wallet"
    preferredWallets?: string[],
    
    // 钱包需要的特性，如果指定了特性，那么只会显示符合特性的钱包
    // 同时，如果调用了没有被指定的特性的方法，会抛出异常
    // 默认为全部特性
    requiredFeatures?: ("standard:connect" | "standard:events" | "standard:disconnect" | "sui:signMessage" | "sui:signTransactionBlock" | "sui:signAndExecuteTransactionBlock" | "sui:signPersonalMessage")[]
    
    // 自定义钱包过滤器，可以根据钱包的信息进行过滤，返回 true 表示符合要求
    walletFilter?: (wallet: Wallet) => boolean
    
    // 在 walletQuery 查询失败时，重试的次数，默认为 5
    queryRetry?: number
    
    // 在 walletQuery 查询失败时，重试的间隔时间，默认为 5000ms
    queryRetryIntervalMs?: number
}
```
- v-models
  - state 同 useWalletState，只是这里双向绑定，方便使用，建议还是使用 useWalletState
  - query 同上
  - actions 同上

## NConnectButton

使用 `naive-ui` 封装的 `connect-button`，未来可能会考虑推出一个原生的按钮，因此使用与 `naive-ui` 相关的 `n` 作为前缀
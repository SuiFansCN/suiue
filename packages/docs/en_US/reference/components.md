# Components

Here is a description of the `VUE` component provided by `Suiue`

## SuiueProvider

- props
  - config
```typescript
import {SuiClient} from "@mysten/sui.js/client";
import {SuiGraphQLClient} from "@mysten/sui.js/graphql";

interface SuiueProviderConfig {
    // Specify the id of the current provider, used to record autoConnect information
    // In the case of multiple providers, different IDs need to be specified. The case of multiple providers has not been verified yet, so please use with caution.
    // Mainly used to connect multiple wallets at the same time
    id?: string,
    
    // Whether to automatically connect to the wallet, the default is "disable"
    // "enable" means automatic connection. "last" will only automatically connect if the user has connected last time and has not been disconnected.
    autoConnect?: "enable" | "disable" | "last",
    
    // specify the network used to connect to the wallet
    // default is "mainnet"
    network?: "mainnet" | "testnet" | "devnet" | "localnet",
    
    // custom suiClient
    suiClient?: SuiClient,
    
    // Customize suiClientQL, useWalletQuery to query using graphql
    // In a production environment, it is recommended that you run a graphql server yourself.
    // By default, the official graphql server is used, which only supports mainnet and testnet, and has high latency and is not suitable for production environments.
    // https://docs.sui.io/guides/developer/getting-started/graphql-rpc
    suiClientQL?: SuiGraphQLClient<any>,
    
    // You can put the wallet you want to be ranked first here, for example ["sui wallet", "okx wallet"]
    // When the user has installed the above two wallets, "sui wallet" and "okx wallet" will be displayed first.
    preferredWallets?: string[],
    
    // Features required by the wallet. If features are specified, only wallets that meet the features will be displayed.
    // At the same time, if a method without specified characteristics is called, an exception will be thrown.
    // Default to all features
    requiredFeatures?: ("standard:connect" | "standard:events" | "standard:disconnect" | "sui:signMessage" | "sui:signTransactionBlock" | "sui:signAndExecuteTransactionBlock" | "sui:signPersonalMessage")[]
    
    // Customize wallet filter, which can be filtered based on the wallet information. Return true to indicate that wallet is qualified.
    walletFilter?: (wallet: Wallet) => boolean
    
    // When walletQuery query fails, the number of retries, the default is 5
    queryRetry?: number
    
    // When walletQuery query fails the retry interval, 5000ms by default.
    queryRetryIntervalMs?: number
}
```
- v-models
  - state: Same as useWalletState, except that it is bound in two directions for convenience. It is recommended to use useWalletState.
  - query: as below
  - actions: as below

## NConnectButton

a `connect-button` encapsulated by `naive-ui`, we may consider launching a native button in the future, so use `n` related to `naive-ui` as a prefix
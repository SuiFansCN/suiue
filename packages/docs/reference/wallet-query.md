# WalletQuery

这个 API 用于查询钱包信息，例如余额，持有对象等。

目前为止，所有的查询都是一次性的，没有监听功能。如果你认为你的资产可能会发生变化，你需要定期查询。

在调用 `loadXXX` 方法时，你可以使用 `await` 来等待查询完毕，如果你只是希望他能够在模板中显示，可以不必等待。

## properties

### balances

- 类型：`Reactive<Record<SuiTypeIdentifier, BalanceStruct>>`

```typescript
interface BalanceStruct {
    type: SuiTypeIdentifier,
    coinObjectCount: number
    totalBalance: string
}
```

储存了所有的余额信息，键是货币类型，值是余额信息。

### objects

- 类型：`Reactive<Record<SuiTypeIdentifier, ObjectStruct[]>>`

```typescript
interface ObjectStruct {
    type: SuiTypeIdentifier,
    id: string,
    digest: string,
    version: number,
    display?: Record<string, string>
    contents?: {
        id: string,
        [key: string]: any
    }
}
```

记录了所有的对象信息，键是对象类型，值是对象数组。

### coins

- 类型：`Computed<Record<SuiTypeIdentifier, CoinObjectStruct[]>>`

```typescript
interface CoinObjectStruct extends ObjectStruct{
    contents: {
        id: string,
        balance: {
            id: string,
            value: string,
        }
    }
}
```

记录了所有的 `COIN` 对象信息，键是货币类型，值是 `COIN` 对象数组。这个属性其实就是过滤了 objects 内不属于 `0x2::sui::coin:COIN` 的对象。

### suiBalance

- 类型：`Computed<BalanceStruct>`

记录了 SUI 的余额信息，等同于 `balances['0x2::sui::sui::SUI']`。

### suiCoins

- 类型：`Computed<CoinObjectStruct[]>`

记录了 `SUI-COIN` 的所有对象信息，等同于 `coins['0x2::sui::sui::SUI']`。


### domain

- 类型：`Computed<string>`

记录了当前账户的 domain, 如果没有则为 `undefined`。

### client

- 类型：`SuiClient`

暴露了 `SuiClient` 对象，可以用来方便地调用其他的 `SuiClient` 方法。

### clientQL

- 类型：`SuiGraphQLClient`

暴露了 `SuiGraphQLClient` 对象，可以用来方便地调用其他的 `SuiGraphQLClient` 方法。


## methods

### async loadBalances(coinType: `SuiTypeIdentifier`)

- 返回值：`BalanceStruct`

加载指定货币类型的余额信息。

### async loadAllBalances()

- 返回值：`Record<SuiTypeIdentifier, BalanceStruct>`

加载账户内所有货币类型的余额信息。

### async loadObjects(objType: `SuiTypeIdentifier`)

- 返回值：`ObjectStruct[]`

加载指定类型的所有对象。

### async loadAllObjects()

- 返回值：`Record<SuiTypeIdentifier, ObjectStruct[]>`

加载账户内所有对象。

### async loadCoins(coinType: `SuiTypeIdentifier`)

- 返回值：`CoinObjectStruct[]`

加载指定货币类型的所有 `COIN` 对象。

loadCoins 实际上调用了 loadObjects 方法，只不过添加了 `0x2::sui::coin::COIN<coinType>` 作为前缀。

因此，所有的货币都会被作为 object 加载到 objects 中。

### async loadAllCoins()

- 返回值：`Record<SuiTypeIdentifier, CoinObjectStruct[]>`

加载账户内所有 `COIN` 对象。
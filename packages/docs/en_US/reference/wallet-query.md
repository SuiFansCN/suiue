# WalletQuery

This API is used to query wallet information, such as balance, holding objects, etc.

So far, all queries have been one-time and there is no listening functionality. If you think your assets may have changed, you need to load again.

When calling the `loadXXX` method, you can use `await` to wait for the query to be completed. If you just want to  display in the template, you don't need to wait.

## properties

### balances

- type：`Reactive<Record<SuiTypeIdentifier, BalanceStruct>>`

```typescript
interface BalanceStruct {
    type: SuiTypeIdentifier,
    coinObjectCount: number
    totalBalance: string
}
```

All balance information is stored, the key is the `coin` type, and the value is the balance information.

### objects

- type：`Reactive<Record<SuiTypeIdentifier, ObjectStruct[]>>`

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

All object information is recorded, the key is the object type, and the value is the object array.

### coins

- type：`Computed<Record<SuiTypeIdentifier, CoinObjectStruct[]>>`

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

All `COIN` object information is recorded, the key is `coin` type, and the value is an array of `COIN` objects. This attribute actually filters out objects that do not belong to `0x2::sui::coin:COIN` in objects.

### suiBalance

- type：`Computed<BalanceStruct>`

Records the balance information of SUI, which is equivalent to `balances['0x2::sui::sui::SUI']`.

### suiCoins

- type：`Computed<CoinObjectStruct[]>`

All object information of `SUI-COIN` is recorded, which is equivalent to `coins['0x2::sui::sui::SUI']`.


### domain

- type：`Computed<string>`

The domain of the current account, or `undefined` if there is none.

### client

- type：`SuiClient`

Exposes the `SuiClient` object, which can be used to conveniently call other `SuiClient` methods.

### clientQL

- type：`SuiGraphQLClient`

Exposed `SuiGraphQLClient` object, which can be used to conveniently call other `SuiGraphQLClient` methods.


## methods

### async loadBalances(coinType: `SuiTypeIdentifier`)

- returns：`BalanceStruct`

Load balance information for the specified `coin` type.

### async loadAllBalances()

- returns：`Record<SuiTypeIdentifier, BalanceStruct>`

Load the balance information of all currency types in the account.

### async loadObjects(objType: `SuiTypeIdentifier`)

- returns：`ObjectStruct[]`

Loads all objects of the specified type.

### async loadAllObjects()

- returns：`Record<SuiTypeIdentifier, ObjectStruct[]>`

Load all objects in the account.

### async loadCoins(coinType: `SuiTypeIdentifier`)

- returns：`CoinObjectStruct[]`

Loads all `COIN` objects of the specified currency type.

`loadCoins` actually calls the `loadObjects` method, but adds `0x2::sui::coin::COIN<coinType>` as a prefix.

so, all `coin` will be loaded to `objects`.

### async loadAllCoins()

- returns：`Record<SuiTypeIdentifier, CoinObjectStruct[]>`

Load all `COIN` objects in the account.
# WalletAction

这个 API 用于执行钱包操作，例如签署交易，签署消息等。

这里面的大多数类型来自于 `@mysten/wallet-standard`。如果你在 `suiue` 中找不到你需要的类型定义，可以查看 [`@mysten/wallet-standard`](https://docs.sui.io/standards/wallet-standard)，或者它的 [repo](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-standard)。

## methods

### signAndExecuteTransactionBlock

```typescript
type signAndExecuteTransactionBlock = (
    txb: TransactionBlock,
    options?: SuiTransactionBlockResponseOptions,
    requestType?: ExecuteTransactionRequestType
) => Promise<SuiSignAndExecuteTransactionBlockOutput>
```

调用钱包插件签署并执行交易块，返回执行的结果。

### signTransactionBlock(txb: TransactionBlock)

调用钱包插件签署而不执行交易块，返回签署的结果。

### signPersonalMessage(message: string | Uint8Array)

调用钱包插件签署消息，返回签署的结果。

### signMessage(message: string | Uint8Array)

signPersonalMessage 的旧版，推荐使用 signPersonalMessage。

### getExactlyCoinAmount

```typescript
import type {TransactionResult, TransactionBlock} from "@mysten/sui.js/transaction";

type getExactlyCoinAmount = (
    options: {
        txb: TransactionBlock,
        coinType: SuiTypeIdentifier,
        amt: bigint | string | number
    }
) => Promise<TransactionResult>
```

获取确切的货币数量，例如，如果你想要转账 5 SUI，那么你可以使用这个方法来获取精准的 5 个 SUI，无论你有多少个 SUI-COIN-OBJECT。如果余额不足，将会抛出 `InsufficientBalanceError`。余额的计算依赖于 `WalletQuery`。
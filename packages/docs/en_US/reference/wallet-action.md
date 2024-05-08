# WalletAction

This API is used to perform wallet operations such as signing transactions, signing messages, etc.

Most of the types here come from `@mysten/wallet-standard`. If you can't find the type definition you need in `suiue`, you can check [`@mysten/wallet-standard`](https://docs.sui.io/standards/wallet-standard), or its [ repo](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-standard).

## methods

### signAndExecuteTransactionBlock

```typescript
type signAndExecuteTransactionBlock = (
    txb: TransactionBlock,
    options?: SuiTransactionBlockResponseOptions,
    requestType?: ExecuteTransactionRequestType
) => Promise<SuiSignAndExecuteTransactionBlockOutput>
```

Call the wallet plug-in to sign and execute the transaction block and return the execution result.

### signTransactionBlock(txb: TransactionBlock)

Call the wallet plug-in to sign without executing the transaction block and return the signed result.

### signPersonalMessage(message: string | Uint8Array)

Call the wallet plug-in to sign the message and return the signed result.

### signMessage(message: string | Uint8Array)

The old version of signPersonalMessage, it is recommended to use signPersonalMessage.

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

Get the exact `COIN` amount, for example, if you want to transfer 5 SUI, then you can use this method to get exactly 5 SUI, no matter that how many SUI-COIN-OBJECTS you have. If the balance is insufficient, an `InsufficientBalanceError` will be thrown. The calculation of balance relies on `WalletQuery`.
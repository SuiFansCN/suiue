# suiue

> the vue dapp-kit for sui

## install

```bash
npm install @suifans/suiue
```

## examples
```typescript

const {
    signPresonalMessage,
    signAndExecuteTransactionBlock,
    SignTransactionBlock,
} = useWalletAction()

// if wallet is not connected, it will open the wallet connect modal and continue
signAndExecuteTransactionBlock(...)


const {
    address
    getAllCoins,
    getSuiCoin
} = useWalletInfo()
```

请看 [vue-sui-dapp-kit-example](./demo/App.vue)

## TODO
- [ ] 改善ts
- [ ] 完善文档
- [ ] 完善demo
- [ ] 添加更多实用方法
- [ ] 添加内置UI组件
- [ ] 嵌入式SUI钱包
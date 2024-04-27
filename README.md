# suiue

> the vue dapp-kit for sui

**本项目目前处于初期预览状态，可能随时会发生改变，请谨慎用于生产环境！**

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
    address,
    getAllCoins,
    getSuiCoin
} = useWalletInfo()
```

请看 [suiue-example](./demo/App.vue)

## TODO
- [ ] 改善ts
- [ ] 添加文档
- [ ] 完善demo
- [ ] 添加更多实用方法
- [ ] 添加内置UI组件
- [ ] 嵌入式SUI钱包
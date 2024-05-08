# WalletState

wallet-state 封装了与钱包状态相关的信息。

## Properties

### wallet

- 类型：`Computed<@mysten/wallet-standard.wallet>`

记录目前已经连接的钱包对象，如果没有连接钱包，则为 `undefined`。

### wallets

- 类型：`Computed<@mysten/wallet-standard.wallet[]>`

记录所有符合标准的钱包对象，主要根据 `requiredFeatures` 和 `preferredWallets` 进行过滤，详见 `SuiueProvider` 的 [配置](./components.md#suiueprovider)。

### account

- 类型：`Computed<@mysten/wallet-standard.ReadonlyAccount>`

目前已经连接的钱包的账户信息，如果没有连接钱包，则为 `undefined`。

### address

- 类型：`Computed<string>`

目前已经连接的钱包的地址，如果没有连接钱包，则为 `undefined`。

### isConnected

- 类型：`Computed<boolean>`

是否已经连接钱包。

## Methods

### async connect()

- 参数：
  - `target: @mysten/wallet-standard.wallet`
  
  可以从 this.wallets 中获取。

  - `preferredAddress?: string`

  如果钱包提供了多个地址，优先选择此地址连接，如果使用了 auto-connect，则不必理会这个参数，将会自动处理。

连接钱包，如果被连接的钱包没有返回账户信息，则会抛出 `WalletAccountNotFoundError`(Sui Wallet 在localhost好像会出现这个问题)；如果连接失败，则会抛出钱包插件本身抛出的错误。

### async disconnect()

- 参数：无

断开钱包连接。有一些钱包插件没有断开连接的功能，将会忽略，只将状态设置为未连接。

### onConnect(callback: () => void)

- 参数：
  - `callback: () => void`
- 返回值：`() => void`

注册一个回调函数，当钱包连接成功时，将会调用这个函数。返回一个函数，调用这个函数将会取消这个回调。
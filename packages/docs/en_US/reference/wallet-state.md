# WalletState

WalletState encapsulates information related to the wallet state.

## Properties

### wallet

- Type: `Computed<@mysten/wallet-standard.wallet>`

Records the currently connected wallet object. If no wallet is connected, it is `undefined`.

### wallets

- Type: `Computed<@mysten/wallet-standard.wallet[]>`

Records all standard-compliant wallet objects, mainly filtered according to `requiredFeatures` and `preferredWallets`.
See the [configuration](./components.md#suiueprovider) of `SuiueProvider`.

### account

- Type: `Computed<@mysten/wallet-standard.ReadonlyAccount>`

The account information of the currently connected wallet. If no wallet is connected, it is `undefined`.

### address

- Type: `Computed<string>`

The address of the currently connected wallet. If no wallet is connected, it is `undefined`.

### isConnected

- Type: `Computed<boolean>`

Whether the wallet is connected.

## Methods

### async connect()

- Parameters:
    - `target: @mysten/wallet-standard.wallet`

      Can be obtained from this.wallets.

    - `preferredAddress?: string`

      If the wallet provides multiple addresses, prefer to connect to this address. If auto-connect is used, you don't
      need to worry about this parameter, it will be handled automatically.

Connects the wallet. If the connected wallet does not return account information, it will
throw `WalletAccountNotFoundError` (Sui Wallet seems to have this problem on localhost); if the connection fails, it
will throw the error thrown by the wallet plugin itself.

### async disconnect()

- Parameters: None

Disconnects the wallet connection. Some wallet plugins do not have the function of disconnecting, they will be ignored,
and the status will be set to disconnected.

### onConnect(callback: () => void)

- Parameters:
    - `callback: () => void`
- Return value: `() => void`

Registers a callback function. When the wallet is successfully connected, this function will be called. Returns a
function, calling this function will cancel this callback.
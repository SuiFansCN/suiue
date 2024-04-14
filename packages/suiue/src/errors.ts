/*
    * This file contains all the errors that can be thrown by the wallet.
*/

/*
    ========= wallet-functions  =========
 */

export class FeatureNotSupportedError extends Error {}

export class WalletNotConnectedError extends Error {}

export class WalletNoAccountSelectedError extends Error {}

export class WalletAccountNotFoundError extends Error {}

export class WalletError extends Error {}


/*
    ========= dev-kit internal =========
 */

export class PiniaNotReadyError extends Error {}

export class PluginNotInstallError extends Error {}

export class WalletProviderNoExists extends Error {}

export class WalletProviderAlreadyExists extends Error {}

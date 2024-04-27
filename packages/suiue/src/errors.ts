/*
    * This file contains all the errors that can be thrown by the wallet.
*/

/*
    ========= wallet-functions  =========
 */

export class FeatureNotSupportedError extends Error {
    message = `suiue: feature not supported by wallet, did you forget to set requiredFeatures in SuiueProvider.vue ?`
}

export class WalletNotConnectedError extends Error {
    message = "wallet not connected, please connect wallet first."
}

export class WalletAccountNotFoundError extends Error {}

export class WalletError extends Error {}

export class ProviderNotExistsError extends Error {
    message = `suiue: provider not exists, do you forget to wrap your component with <SuiueProvider> ?`
}

export class ProviderAlreadyExistsError extends Error {
    message = `suiue: provider already exists, if you want use by multiply, please pass different id in config`
}

export class RequestError extends Error {
    constructor(message: any) {
        super(`suiue-request-error: ${message}`)
    }    
}


/*
    ========= dev-kit internal =========
 */

export class PluginNotInstallError extends Error {}



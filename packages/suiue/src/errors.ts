/*
    * This file contains all the errors that can be thrown by the wallet.
*/

/*
    ========= wallet-functions  =========
*/

class SuiueError extends Error {}

export class FeatureNotSupportedError extends SuiueError {
    message = `suiue: feature not supported by wallet, did you forget to set requiredFeatures in SuiueProvider.vue ?`
}

export class WalletNotConnectedError extends SuiueError {
    message = "suiue: wallet not connected, please connect wallet first."
}

export class WalletAccountNotFoundError extends SuiueError {
    message = `suiue: wallet account not found, please connect wallet first.`
}

export class ProviderNotExistsError extends SuiueError {
    message = "suiue: provider not exists, do you forget to wrap your component with <SuiueProvider> ?"
}

export class ProviderAlreadyExistsError extends SuiueError {
    message = `suiue: provider already exists, if you want use by multiply, please pass different id in config`
}

export class InsufficientBalanceError extends SuiueError {
    message = `suiue: insufficient balance`
}

export class RequestError extends SuiueError {
    constructor(message: any) {
        super(`suiue-request-error: ${message}`)
    }    
}


/*
    ========= dev-kit internal =========
 */

export class PluginNotInstallError extends SuiueError {}



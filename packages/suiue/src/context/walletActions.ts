import { useProvider } from "@/provider.ts";

import { FeatureNotSupportedError } from "@/errors.ts";

import type { SuiTransactionBlockResponseOptions, ExecuteTransactionRequestType } from "@mysten/sui.js/client"
import type { TransactionBlock } from "@mysten/sui.js/transactions"
import type { WalletState } from "@/context/walletState.ts";
import { SuiueProviderConfig } from "@/components/SuiueProvider.vue";


export class WalletActions {
    private state
    private config
    public readonly features

    constructor(config: SuiueProviderConfig, state: WalletState) {
        this.config = config
        this.state = state
        this.features = config.requiredFeatures!
    }

    private checkFeat(feat: string) {
        if (!this.features.includes(feat as any)) {
            throw new FeatureNotSupportedError()
        }
    }

    // a decorator, check feat and connected
    private check(feat: string) {
        this.checkFeat(feat)
        this.state.checkConnected()
    }


    public async signAndExecuteTransactionBlock(
        txb: TransactionBlock,
        options?: SuiTransactionBlockResponseOptions,
        requestType?: ExecuteTransactionRequestType
    ) {
        this.check("sui:signAndExecuteTransactionBlock")
        return await this.state.wallet.value!.features["sui:signAndExecuteTransactionBlock"].signAndExecuteTransactionBlock({
            transactionBlock: txb,
            chain: `sui:${this.config.network}`,
            account: this.state.account.value,
            options,
            requestType
        })
    }

    public async signTransactionBlock(txb: TransactionBlock) {
        this.check("sui:signTransactionBlock")
        return await this.state.wallet.value!.features["sui:signTransactionBlock"].signTransactionBlock({
            transactionBlock: txb,
            account: this.state.account.value,
            chain: `sui:${this.config.network}`
        })
    }

    public async signPersonalMessage(message: string | Uint8Array) {
        this.check("sui:signPersonalMessage")
        if (typeof message === "string") {
            message = new TextEncoder().encode(message)
        }

        return await this.state.wallet.value!.features["sui:signPersonalMessage"].signPersonalMessage({
            message,
            account: this.state.account.value,
        })
    }



}

export const useWalletActions = () => useProvider("WALLET_ACTIONS")
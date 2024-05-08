import {useProvider} from "@/provider.ts";
import {SuiueProviderConfig} from "@/components/SuiueProvider.vue";
import {WalletQuery} from "./walletQuery";
import {SuiTypeIdentifier} from "@/types.ts";
import {FeatureNotSupportedError, InsufficientBalanceError} from "@/errors.ts";
import {TransactionBlock} from "@mysten/sui.js/transactions";


import type {ExecuteTransactionRequestType, SuiTransactionBlockResponseOptions} from "@mysten/sui.js/client"
import type {WalletState} from "@/context/walletState.ts";
import {consts} from "@/consts.ts";


export class WalletActions {
    private state
    private config
    private query
    public readonly features

    constructor(config: SuiueProviderConfig, query: WalletQuery, state: WalletState) {
        this.config = config
        this.state = state
        this.query = query
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

    public async signMessage(message: string | Uint8Array) {
        this.check("sui:signMessage")
        if (typeof message === "string") {
            message = new TextEncoder().encode(message)
        }

        return await this.state.wallet.value!.features["sui:signMessage"]!.signMessage({
            message,
            account: this.state.account.value
        })
    }

    public async getExactlyCoinAmount(
        options: {
            txb: TransactionBlock,
            coinType: SuiTypeIdentifier,
            amt: bigint | string | number
        }
    ) {
        let {txb, coinType, amt} = options
        let isSUI = coinType === consts.COIN_SUI || coinType === "0x2::sui::SUI"


        if (typeof amt === "string" || typeof amt === "number") {
            amt = BigInt(amt)
        }

        const balance = this.query.balances[coinType] ?? await this.query.loadBalance(coinType)

        if (BigInt(balance.totalBalance) < amt) {
            throw new InsufficientBalanceError()
        }

        const coins = this.query.coins.value[coinType] ?? await this.query.loadCoins(coinType)

        if (coins.length === 0) {
            throw new Error("unexpected error: no coin found for the specified coin type")
        }

        if (isSUI){
            return txb.splitCoins(txb.gas, [amt])
        }

        // other coin
        // step1: merge all coin
        // step2: split to exact amount
        let [primaryCoin, ...mergedCoin] = coins.map(coin => txb.object(coin.id))

        if (mergedCoin.length) {
            txb.mergeCoins(primaryCoin, mergedCoin)
        }

        return txb.splitCoins(primaryCoin, [amt])

    }


}

export const useWalletActions = () => useProvider("WALLET_ACTIONS")
// import {computed} from "vue";
import { computed, ref, watch } from "vue";

import { useProvider } from "@/provider.ts";

import { AssertManager } from "@/context/walletQuery/assertManager.ts";
import { forceBindThis } from "@/utils";

import type { ComputedRef, Ref, UnwrapRef } from "vue";
import type { WalletState } from "@/context/walletState.ts";
import type { SuiTypeIdentifier, WalletBalance } from "@/types";
import type { SuiueProviderConfig } from "@/components/SuiueProvider.vue";

interface AsyncComputedWithRef<T> extends ComputedRef<T> {
    refer: Ref<T>
}

function asyncComputed<T>(
    computedAdditional: Ref | ComputedRef,
    fetcher: (data: Ref<UnwrapRef<T>>) => Promise<T | undefined>,
    data?: T,
) {
    /*
    * 如果直接将 computed 定义为 computed(async () => {}), 那么 template 中显示将会出现问题
    * 这里先创建一个 ref，然后调用 fetcher 异步更新 ref 的值，再通过 computed 返回 ref 的值
    *
    * computedAdditional: 依赖于这个 computed 的值，当这个值改变时，重新调用 fetcher 更新 ref
    * */
    let refer = ref<T>(data as T)

    const comp = computed(() => {
        // computedAdditional.value;
        return refer.value
    }) as AsyncComputedWithRef<T>

    comp.refer = refer as Ref<T>

    function updateRefer() {
        fetcher(refer).then((output) => {
            refer.value = output as UnwrapRef<T>
        })
    }

    // 依赖改变时更新
    watch(computedAdditional, updateRefer, { immediate: true })
    return comp
}

export class WalletQuery {
    // TODO: subscribe to account changes

    private state
    private coins
    // coins.load()
    // coins.loadAll()

    public readonly client
    public readonly clientQL
    public readonly domain
    public readonly suiBalance
    public readonly suiCoins
    public readonly coins
    public readonly objects

    constructor(config: SuiueProviderConfig, state: WalletState) {
        this.client = config.suiClient as Omit<SuiClient, "executeTransactionBlock" | "signAndExecuteTransactionBlock">
        this.clientQL = config.suiClientQL
        this.state = state
        this.coins = forceBindThis(new AssertManager<WalletBalance>({
            resetRefer: this.state.isConnected,
            default: () => {return{
               type: "" as SuiTypeIdentifier,
               coinObjectCount: 0,
               totalBalance: BigInt(0) 
            }},
            async loader(keys) {

            },
            async getAllLoader() {

            }
        }))
        this.suiBalance = asyncComputed(
            this.state.address,
            async (_) => BigInt((await this.getSpecifyCoinBalance("0x2::sui::SUI"))?.totalBalance ?? 0),
            BigInt(0)
        )

        this.suiCoins = asyncComputed<CoinStruct[]>(
            this.state.address,
            async (_) => (await this.getSpecifyCoins("0x2::sui::SUI"))?.data!,
            []
        )

        this.domain = asyncComputed<string>(
            this.state.address,
            async (_) => {
                try {
                    return (await this.client.resolveNameServiceNames({ address: this.state.address.value })).data[0] ?? undefined
                } catch {
                    return undefined
                }
            },
            undefined
        )



        // this.suiCoins = this.initSuiCoins()

        // this.coins = computed(async () => {
        //     (await this.client.getCoins({
        //         owner: this.state.address.value
        //     })).data[0].
        // })
    }

    public async getSpecifyCoins(coinType: string, cursor?: string, limit?: number) {
        if (!this.state.address.value) {
            return undefined
        }

        return await this.client.getCoins({
            owner: this.state.address.value,
            coinType,
            cursor,
            limit
        })
    }

    public async getSpecifyCoinBalance(coinType: string) {
        if (!this.state.address.value) {
            return
        }

        return await this.client.getBalance({
            owner: this.state.address.value,
            coinType
        })
    }

}

export const useWalletQuery = () => useProvider("WALLET_QUERY")
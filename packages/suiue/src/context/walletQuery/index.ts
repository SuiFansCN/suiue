import {computed, reactive, readonly, ref, watch} from "vue";

import {useProvider} from "@/provider.ts";
import {loadObjects, loadBalance, loadAllBalance} from "./graphql"


import type {Ref} from "vue";
import type {SuiClient} from "@mysten/sui.js/client";
import type {WalletState} from "@/context/walletState.ts";
import type {SuiueProviderConfig} from "@/components/SuiueProvider.vue";
import type {SuiTypeIdentifier} from "@/types.ts";
import {BalanceStruct, CoinObjectStruct, defaultBalanceStruct, ObjectStruct} from "@/context/walletQuery/types.ts";
import {assignDataToObj} from "@/context/walletQuery/utils.ts";

export class WalletQuery {
    // TODO: subscribe to account changes

    readonly #state

    readonly #balances
    readonly #objects
    // undefined if not resolved, null if not exist
    readonly #domain: Ref<string | null | undefined>

    public readonly client
    public readonly clientQL
    public readonly balances
    public readonly objects
    public readonly coins
    public readonly suiBalance
    public readonly suiCoins

    constructor(config: SuiueProviderConfig, state: WalletState) {
        this.client = config.suiClient as Omit<SuiClient, "executeTransactionBlock" | "signAndExecuteTransactionBlock">
        this.clientQL = config.suiClientQL!
        this.#state = state
        this.#domain = ref<string | null | undefined>(undefined)

        this.#balances = reactive<Record<SuiTypeIdentifier, BalanceStruct>>({})
        this.#objects = reactive<Record<SuiTypeIdentifier, ObjectStruct[]>>({})

        this.balances = readonly(this.#balances)
        this.objects = readonly(this.#objects)

        this.suiBalance = computed(() =>
            this.#balances["0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"] as BalanceStruct | undefined
        )


        this.suiCoins = computed(() =>
                this.coins.value["0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"] as CoinObjectStruct[] | undefined
            // this.#objects["0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<>"]
        )


        this.coins = computed(() => {
            // filter coins in objects
            // start with 0x2::coin::Coin

            return Object.keys(this.#objects)
                .filter(key => key.indexOf("2::coin::Coin<"))
                .reduce((result, key) => {
                    let coinType = key.substring(key.indexOf("<") + 1, key.indexOf(">")) as SuiTypeIdentifier
                    result[coinType] = this.#objects[key as SuiTypeIdentifier] as CoinObjectStruct[];
                    return result;
                }, {} as Record<SuiTypeIdentifier, CoinObjectStruct[]>)


        })


        // on account change, reset
        watch(this.#state.isConnected, (value) => {
            if (value) {
                // on connect
                this.loadBalance("0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI")
                this.loadCoins("0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI")
            } else {
                this.reset()
            }

        })


    }

    private reset() {

        function emptyObj(obj: any) {
            for (let key in obj) {
                delete obj[key]
            }
        }

        this.#domain.value = undefined
        emptyObj(this.#balances)
        emptyObj(this.#objects)
    }

    public get domain() {
        // lazy load domain
        if (this.#domain.value === undefined) {
            // fetch domain
            this.client.resolveNameServiceNames({
                address: this.#state.address.value
            }).then(({data}) => {
                if (data && data[0]) {
                    this.#domain.value = data[0]
                } else {
                    this.#domain.value = null
                }
            })
        }

        return readonly(this.#domain)
    }

    public async loadBalance(coinTypes_: SuiTypeIdentifier | SuiTypeIdentifier[]) {

        let coinTypes: SuiTypeIdentifier[]

        if (typeof coinTypes_ as string === "string") {
            coinTypes = [coinTypes_ as SuiTypeIdentifier,] as SuiTypeIdentifier[]
        } else {
            coinTypes = coinTypes_ as SuiTypeIdentifier[]
        }

        // create default balance struct
        coinTypes.forEach((coinType) => {
            this.#balances[coinType] = defaultBalanceStruct(coinType)
        })

        const result = {} as Record<SuiTypeIdentifier, BalanceStruct>

        for (let coinType of coinTypes) {
            const balance = await loadBalance(coinType)
            this.#balances[coinType] = balance
            result[coinType] = balance
        }

        return result
    }

    public async loadAllBalance() {

        const allBalances = await loadAllBalance()

        Object.assign(this.#balances, allBalances)

        return allBalances
    }

    public async loadObjects(objTypes_: SuiTypeIdentifier | SuiTypeIdentifier[] | "$all") {
        let objTypes: SuiTypeIdentifier[]
        if (typeof objTypes_ as string === "string") {
            objTypes = [objTypes_ as SuiTypeIdentifier,] as SuiTypeIdentifier[]
        } else {
            objTypes = objTypes_ as SuiTypeIdentifier[]
        }


        if (objTypes_ !== "$all") {
            // set default empty array
            objTypes.forEach((objType) => {
                this.#objects[objType] = []
            })
        }


        const result = {} as Record<SuiTypeIdentifier, ObjectStruct[]>
        for (let objType of objTypes) {
            const records = await loadObjects(objType)

            if (Object.keys(records).length === 0) {
                continue
            }

            assignDataToObj(this.#objects, records)
            assignDataToObj(result, records)
        }

        return result
    }

    public async loadAllObjects() {
        return await this.loadObjects("$all")
    }

    public async loadCoins(coinTypes_: SuiTypeIdentifier | SuiTypeIdentifier[]) {
        let coinTypes: SuiTypeIdentifier[]

        if (typeof coinTypes_ as string === "string") {
            coinTypes = [coinTypes_ as SuiTypeIdentifier,] as SuiTypeIdentifier[]
        } else {
            coinTypes = coinTypes_ as SuiTypeIdentifier[]
        }

        coinTypes = coinTypes.map(
            coinType =>
                `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${coinType}>`
        ) as SuiTypeIdentifier[]

        return await this.loadObjects(
            coinTypes
        ) as Record<SuiTypeIdentifier, CoinObjectStruct[]>
    }

    public async loadAllCoins() {
        return await this.loadObjects(
            ["0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin"]
        ) as Record<SuiTypeIdentifier, CoinObjectStruct[]>
    }


}


export const useWalletQuery = () => useProvider("WALLET_QUERY")
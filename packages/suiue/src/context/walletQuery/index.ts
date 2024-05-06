import {computed, reactive, readonly, ref, watch} from "vue";

import {defaultBalanceStruct} from "./types.ts";
import {RequestError, WalletNotConnectedError} from "@/errors.ts";
import {useProvider} from "@/provider.ts";
import {mapDisplayArrayToObject} from "@/context/walletQuery/utils.ts";
import {
    queryBalance,
    queryObject,
    queryBalances,
    QueryDocuments,
    readObject,
    readBalance,
    getNextCursor
} from "./graphql/queryDocuments"

import type {Ref} from "vue";
import type {SuiClient} from "@mysten/sui.js/client";
import type {WalletState} from "@/context/walletState.ts";
import type {SuiueProviderConfig} from "@/components/SuiueProvider.vue";
import type {SuiTypeIdentifier} from "@/types.ts";
import type {BalanceStruct, CoinObjectStruct, ObjectStruct} from "./types.ts";

import type {ResultOf, VariablesOf} from "gql.tada";



type QueryDocuments = typeof QueryDocuments[keyof typeof QueryDocuments]

export class WalletQuery {
    // TODO: subscribe to account changes

    private readonly _state
    private readonly _config


    // undefined if not resolved, null if not exist
    private readonly _domain: Ref<string | null | undefined>

    public readonly balances
    public readonly objects
    public readonly client
    public readonly clientQL
    public readonly coins
    public readonly suiBalance
    public readonly suiCoins

    constructor(config: SuiueProviderConfig, state: WalletState) {
        this.client = config.suiClient as Omit<SuiClient, "executeTransactionBlock" | "signAndExecuteTransactionBlock">
        this.clientQL = config.suiClientQL!
        this._config = config
        this._state = state
        this._domain = ref<string | null | undefined>(undefined)

        this.balances = reactive<Record<SuiTypeIdentifier, BalanceStruct>>({})
        this.objects = reactive<Record<SuiTypeIdentifier, ObjectStruct[]>>({})

        // this.balances = readonly(this.balances)
        // this.objects = readonly(this.objects)

        this.suiBalance = computed(() =>
            this.balances["0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"]?.totalBalance
        )


        this.suiCoins = computed(() =>
            this.coins.value["0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"] as CoinObjectStruct[] | undefined
        )


        this.coins = computed(() => {
            // filter coins in objects
            // start with 0x2::coin::Coin

            return Object.keys(this.objects)
                .filter(key => key.indexOf("2::coin::Coin<"))
                .reduce((result, key) => {
                    let coinType = key.substring(key.indexOf("<") + 1, key.indexOf(">")) as SuiTypeIdentifier
                    result[coinType] = this.objects[key as SuiTypeIdentifier] as CoinObjectStruct[];
                    return result;
                }, {} as Record<SuiTypeIdentifier, CoinObjectStruct[]>)


        })


        // on account change, reset
        watch(this._state.isConnected, (value) => {
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

        this._domain.value = undefined
        emptyObj(this.balances)
        emptyObj(this.objects)
    }

    public get domain() {
        // lazy load domain


        if (this._domain.value === undefined) {
            // fetch domain
            const cancel = watch(this._state.isConnected, (value) => {
                if (value) {
                    this.client.resolveNameServiceNames({
                        address: this._state.address.value
                    }).then(({data}) => {
                        if (data && data[0]) {
                            this._domain.value = data[0]
                        } else {
                            this._domain.value = null
                        }
                    })

                    cancel()
                }
            })

        }

        return readonly(this._domain)
    }

    private async query<T extends QueryDocuments>(
        document: T,
        variables: VariablesOf<T>
    ): Promise<ResultOf<T>> {
        let {queryRetry, queryRetryIntervalMs} = this._config

        async function fail() {
            queryRetry--
            await new Promise((resolve) => setTimeout(resolve, queryRetryIntervalMs))
        }

        while (queryRetry > 0) {
            try {
                const rsp = await this.clientQL.query({
                    query: document,
                    variables: variables as any
                })

                if (rsp.errors) {
                    await fail()
                }

                return rsp.data! as ResultOf<T>

            } catch (e) {
                await fail()
                console.warn("suiue: query error", e)
            }
        }

        throw new RequestError(`suiue: query failed of: ${document}`)
    }

    async queryAll<
        T extends typeof queryObject | typeof queryBalances
    >(
        document: T,
        variables: Omit<VariablesOf<T>, "cursor">,
        getNextCursor: (data: ResultOf<T>) => undefined | string | null,
        dataHandler: (data: ResultOf<T>) => void
    ) {

        let cursor: string | null | undefined = undefined
        do {
            const data = await this.query(document, {
                ...variables,
                cursor
            } as VariablesOf<T>)

            // new cursor
            cursor = getNextCursor(data)
            dataHandler(data)

        } while (cursor)

    }

    public async loadBalance(
        coinType: SuiTypeIdentifier,
    ): Promise<BalanceStruct> {

        const queryAddress = this._state.address.value

        if (!queryAddress) {
            throw new WalletNotConnectedError()
        }

        const _default = defaultBalanceStruct(coinType)

        this.balances[coinType] = _default

        const rsp = await this.query(
            queryBalance,
            {
                queryAddress,
                type: coinType
            }
        )

        if (!rsp.address?.balance) {
            // no balance, return empty
            return _default
        }

        let rawBalance = readBalance(rsp.address?.balance)
        if (rawBalance) {
            this.balances[coinType] = {
                type: rawBalance.coinType.repr as SuiTypeIdentifier,
                coinObjectCount: rawBalance.coinObjectCount!,
                totalBalance: rawBalance.totalBalance as string
            }
        }


        return this.balances[coinType]
    }

    public async loadAllBalance() {

        const queryAddress = this._state.address.value

        if (!queryAddress) {
            throw new WalletNotConnectedError()
        }

        await this.queryAll(
            queryBalances,
            {
                queryAddress
            },
            data => getNextCursor(data.address?.balances.pageInfo),
            data => {
                data.address?.balances.nodes?.forEach((node) => {
                    let rawBalance = readBalance(node)

                    if (!rawBalance) {
                        return
                    }

                    let type = rawBalance.coinType.repr as SuiTypeIdentifier
                    this.balances[type] = {
                        type,
                        totalBalance: rawBalance.totalBalance as string,
                        coinObjectCount: rawBalance.coinObjectCount!
                    }
                })
            }
        )

        return this.balances
    }

    public async loadObjects(
        type: SuiTypeIdentifier | "$all",
    ): Promise<Record<SuiTypeIdentifier, ObjectStruct[]>> {

        const queryAddress = this._state.address.value

        if (!queryAddress) {
            throw new WalletNotConnectedError()
        }

        await this.queryAll(
            queryObject,
            {
                queryAddress,
                type: type === "$all" ? undefined : type
            },
            data => getNextCursor(data.address?.objects.pageInfo),
            data => {
                data.address?.objects.nodes?.forEach((node) => {
                    let rawObj = readObject(node)

                    if (!rawObj) {
                        return
                    }

                    let objType = rawObj.contents!.type.repr as SuiTypeIdentifier
                    let obj = {
                        type: objType,
                        id: rawObj.address,
                        digest: rawObj.digest,
                        version: rawObj.version,
                        contents: rawObj.contents?.json,
                        display: mapDisplayArrayToObject(rawObj.display)
                    } as ObjectStruct

                    if (objType in this.objects) {
                        // find object already exist
                        if (this.objects[objType]?.filter((o) => o.id === obj.id).length === 0) {
                            // not exist, push
                            this.objects[objType].push(obj)
                        } else {
                            // exist, update
                            this.objects[objType] = this.objects[objType].map((o) => {
                                if (o.id === obj.id) {
                                    return obj
                                }
                                return o
                            })
                        }
                    } else {
                        // key not in objects
                        this.objects[objType] = [obj]
                    }


                })
            }
        )

        if (type === "$all") {
            return this.objects
        } else {
            return {
                [type]: this.objects[type]
            }
        }

    }

    public async loadAllObjects() {
        return await this.loadObjects("$all")
    }

    public async loadCoins(coinType: SuiTypeIdentifier) {
        return await this.loadObjects(
            `0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin<${coinType}>`
        ) as Record<SuiTypeIdentifier, CoinObjectStruct[]>
    }

    public async loadAllCoins() {
        return await this.loadObjects(
            "0x0000000000000000000000000000000000000000000000000000000000000002::coin::Coin"
        ) as Record<SuiTypeIdentifier, CoinObjectStruct[]>
    }


}


export const useWalletQuery = () => useProvider("WALLET_QUERY")
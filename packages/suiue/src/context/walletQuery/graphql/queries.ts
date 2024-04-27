import {
    queryBalance,
    queryObject,
    queryBalances,
    QueryDocuments,
    readObject,
    readBalance,
    getNextCursor
} from "./queryDocuments"
import {RequestError} from "@/errors"
import {useProvider} from "@/provider";
import {useWalletQuery} from "@/context/walletQuery";
import {assignDataToObj, mapDisplayArrayToObject} from "../utils.ts";

import type {ResultOf, VariablesOf} from "gql.tada"
import type {SuiTypeIdentifier} from "@/types.ts";
import type {BalanceStruct, ObjectStruct} from "@/context/walletQuery/types.ts";
import {useWalletState} from "@/context/walletState.ts";

type QueryDocuments = typeof QueryDocuments[keyof typeof QueryDocuments]

async function query<T extends QueryDocuments>(
    document: T,
    variables: VariablesOf<T>
): Promise<ResultOf<T>> {
    let {queryRetry, queryRetryIntervalMs} = useProvider("PROVIDER_CONFIG")
    const {clientQL} = useWalletQuery()

    async function fail() {
        queryRetry--
        await new Promise((resolve) => setTimeout(resolve, queryRetryIntervalMs))
    }

    while (queryRetry > 0) {
        try {
            const rsp = await clientQL.query({
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

/** query all the data, auto handler cursor */
async function queryAll<
    D extends any | any[],
    T extends typeof queryObject | typeof queryBalances
>(
    document: T,
    variables: Omit<VariablesOf<T>, "cursor">,
    getNextCursor: (data: ResultOf<T>) => undefined | string | null,
    dataFormatter: (data: ResultOf<T>) => Record<SuiTypeIdentifier, D>
) {

    const result = {} as ReturnType<typeof dataFormatter>

    let cursor: string | null | undefined = undefined
    do {
        const data = await query(document, {
            ...variables,
            cursor
        } as VariablesOf<T>)

        // new cursor
        cursor = getNextCursor(data)
        assignDataToObj(result, dataFormatter(data))

    } while (cursor)


    return result
}



export async function loadBalance(coinType: SuiTypeIdentifier): Promise<BalanceStruct> {

    const _default = {
        type: coinType,
        coinObjectCount: 0,
        totalBalance: BigInt(0)
    }

    let queryAddress = useWalletState().address.value

    if (!queryAddress) {
        return _default
    }

    const rsp = await query(
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
    return {
        type: rawBalance?.coinType.repr as SuiTypeIdentifier,
        coinObjectCount: rawBalance?.coinObjectCount!,
        totalBalance: BigInt(rawBalance?.totalBalance as string)
    }
}


export async function loadAllBalance() {
    let queryAddress = useWalletState().address.value

    if (!queryAddress) {
        return {}
    }

    return await queryAll(
        queryBalances,
        {
            queryAddress
        },
        data => getNextCursor(data.address?.balances.pageInfo),
        data => {
            const result = {} as Record<SuiTypeIdentifier, BalanceStruct>

            data.address?.balances.nodes?.forEach((node) => {
                let rawBalance = readBalance(node)

                if (!rawBalance) {
                    return
                }

                let type = rawBalance.coinType.repr as SuiTypeIdentifier
                result[type] = {
                    type,
                    totalBalance: BigInt(rawBalance.totalBalance as string),
                    coinObjectCount: rawBalance.coinObjectCount!
                }

            })

            return result
        }
    )

}

export async function loadObjects(type: SuiTypeIdentifier | "$all"): Promise<Record<SuiTypeIdentifier, ObjectStruct[]>> {
    let queryAddress = useWalletState().address.value

    if (!queryAddress) {
        if (type === "$all") {
            return {}
        }else {
            return {
                [type]: [] as ObjectStruct[]
            }
        }
    }

    return await queryAll(
        queryObject,
        {
            queryAddress,
            type: type === "$all" ? undefined : type
        },
        data => getNextCursor(data.address?.objects.pageInfo),
        data => {
            const result = {} as Record<SuiTypeIdentifier, ObjectStruct[]>

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

                // coin object, balance value to BigInt
                if (obj.type.indexOf("2::coin::Coin<") && obj.contents && obj.contents.balance?.value){
                    obj.contents.balance.value = BigInt(obj.contents.balance.value)
                }

                assignDataToObj(result, { [objType]: [obj] })
            })

            return result
        }
    )
}

export const loadAllObjects = async () => await loadObjects("$all")
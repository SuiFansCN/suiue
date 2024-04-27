import {queryBalance, queryObject} from "./queries"
import {RequestError} from "@/errors"

import type { ObjectQueryData } from "./types.ts";
import type {SuiGraphQLClient, GraphQLQueryResult} from "@mysten/sui.js/graphql"

// function decorator<T extends (...args: any[]) => any>(fn: T){
//     return (async function (...args: Parameters<T>) {
//         let res = await fn(...args);
//         if ('errors' in res && res.errors) {
//             throw new RequestError(res.errors);
//         }
//         return res.data;
//     }) as (...args: Parameters<T>) => ReturnType<T>["data"];
// }

export async function loadBalance(client: SuiGraphQLClient<any>, address: string, coinTypes: string) {
    const res = await client.query({
        query: queryBalance,
        variables: {
            queryAddress: address,
            type: coinTypes
        }
    })

    if (res.errors) {
        throw new RequestError(res.errors);
    }

    return res.data?.address?.balance
}


export async function loadAllBalance(client: SuiGraphQLClient<any>, address: string) {

}


export async function loadObjects(client: SuiGraphQLClient<any>, queryAddress: string, type: string) {
    async function query(cursor?: string) {
        return await client.query({
            query: queryObject,
            variables: {
                queryAddress,
                type,
                cursor
            }
        })
    }


    const rst: ObjectQueryData[] = []
    let nextCursor = undefined
    while (true) {
        let rst_ = await query(nextCursor)

        if (
            rst_.data?.address?.objects.pageInfo.hasNextPage
            && rst_.data.address.objects.pageInfo.endCursor
        ) {
            nextCursor = rst_.data.address.objects.pageInfo.endCursor
        } else {
            break
        }

        rst.push(...rst_.data?.address?.objects.nodes)
    }

    return rst
}

export function loadAllObjects(address: string) {

}
import type {SuiTypeIdentifier} from "@/types.ts";

export type BalanceStruct = {
    type: SuiTypeIdentifier,
    coinObjectCount: number
    totalBalance: BigInt
}

export type ObjectStruct = {
    type: SuiTypeIdentifier,
    id: string,
    digest: string,
    version: number,
    display?: Record<string, string>
    contents?: {
        id: string,
        [key: string]: any
    }
}

export type CoinObjectStruct = ObjectStruct & {
    contents: {
        id: string,
        balance: {
            id: string,
            value: BigInt,
        }
    }
}

export function defaultBalanceStruct(type: SuiTypeIdentifier): BalanceStruct {
    return {
        type,
        totalBalance: BigInt(0),
        coinObjectCount: 0
    }
}
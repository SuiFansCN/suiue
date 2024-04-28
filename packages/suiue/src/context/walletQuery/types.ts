import type {SuiTypeIdentifier} from "@/types.ts";

export type BalanceStruct = {
    type: SuiTypeIdentifier,
    coinObjectCount: number
    totalBalance: string
}

export interface ObjectStruct {
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

export interface CoinObjectStruct extends ObjectStruct{
    contents: {
        id: string,
        balance: {
            id: string,
            value: string,
        }
    }
}

export function defaultBalanceStruct(type: SuiTypeIdentifier): BalanceStruct {
    return {
        type,
        totalBalance: "0",
        coinObjectCount: 0
    }
}
import {graphql, type FragmentOf} from "./declare"
import {readFragment} from "gql.tada";

export const pageInfoFragment = graphql(`
    fragment PageInfoFragment on PageInfo {
        hasNextPage,
        endCursor
    }
`)

export const balanceFragment = graphql(`
    fragment BalanceFragment on Balance {
        coinType {
            repr
        }
        coinObjectCount
        totalBalance
    }
`)

export const objectFragment = graphql(`
    fragment ObjectFragment on MoveObject {
        digest
        address
        version
        display {
            key
            value
        }
        contents {
            type {
                repr
            }
            json
        }
    }

`)

export const QueryDocuments = {
    balance: graphql(`
        query Balance($queryAddress: SuiAddress!, $type: String!){
            address(address: $queryAddress){
                balance(type: $type){
                    ...BalanceFragment
                }
            }
        }
    `, [balanceFragment]),
    balances: graphql(`
        query Balances($queryAddress: SuiAddress!, $cursor: String){
            address(address: $queryAddress){
                balances(first: 10, after: $cursor){
                    pageInfo {
                        ...PageInfoFragment
                    }
                    nodes {
                        ...BalanceFragment
                    }
                }
            }
        }
    `, [balanceFragment, pageInfoFragment]),
    object: graphql(`
        query Object($queryAddress: SuiAddress!, $type: String, $cursor: String){
            address(address: $queryAddress){
                objects(first: 10, filter: {type: $type}, after: $cursor){
                    pageInfo {
                        ...PageInfoFragment
                    }
                    nodes {
                        ...ObjectFragment
                    }
                }
            }
        }
    `, [pageInfoFragment, objectFragment]),
}

export const queryBalance = QueryDocuments.balance
export const queryBalances = QueryDocuments.balances
export const queryObject = QueryDocuments.object

export function readPageInfo(data: PageInfoData | undefined) {
    return readFragment(pageInfoFragment, data)
}

export function readBalance(data: BalanceQueryData | undefined) {
    return readFragment(balanceFragment, data)
}

export function readObject(data: ObjectQueryData | undefined) {
    return readFragment(objectFragment, data)
}

export function getNextCursor(data: PageInfoData | undefined) {
    const pageInfo = readPageInfo(data)
    return pageInfo?.hasNextPage ? pageInfo?.endCursor : undefined
}

export type ObjectQueryData = FragmentOf<typeof objectFragment>

export type BalanceQueryData = FragmentOf<typeof balanceFragment>

export type PageInfoData = FragmentOf<typeof pageInfoFragment>




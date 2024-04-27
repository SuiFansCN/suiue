import {graphql} from "."

export const Queries = {
    balance: graphql(`
        query Balances ($queryAddress: SuiAddress!, $type: String!){
            address(address: $queryAddress){
                balance(type: $type){
                    coinObjectCount,
                    coinType {
                        repr
                    }
                    totalBalance
                }
            }
        }
    `),
    object: graphql(`
        query Object($queryAddress: SuiAddress!, $type: String!, $cursor: String){
            address(address: $queryAddress){
                objects(first: 20, filter: {type: $type}, after: $cursor){
                    pageInfo {
                        hasNextPage,
                        endCursor
                    }
                    nodes {
                        digest,
                        address,
                        version,
                        contents {
                            json
                        }
                    }
                }
            }
        }
    `)
}

export const queryBalance = Queries.balance
export const queryObject = Queries.object


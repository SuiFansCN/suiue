import type {ResultOf} from "gql.tada"
import {queryObject} from "./queries.ts"

type ExcludeNone<T> = Exclude<T, undefined | null>

export type ObjectQueryData = ExcludeNone<
    ExcludeNone<
        ExcludeNone<
            ResultOf<
                typeof queryObject
            >["address"]>
    >["objects"]
>["nodes"][number]
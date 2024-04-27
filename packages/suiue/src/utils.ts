export function forceBindThis<T extends Object>(obj: T, exclude?: string[]): T {
    // 强制将 this 绑定到 obj 上，使得即使被解构调用，this 也指向 obj
    return new Proxy<T>(obj, {
        get(target, p, receiver) {
            if (exclude && exclude.includes(p as string)) {
                return undefined
            }

            let prop = Reflect.get(target, p, receiver)

            if (typeof prop === "function") {
                // console.log("call function: ", p, receiver)
                return (...arg: any[]) => prop.apply(target, arg)
            }

            return prop
        }
    })
}

/** like Array.filter, return a new obj */
export function filterRecordByKey<K extends string | number | symbol, V>(record: Record<K, V>, filter: (key: K) => boolean): Partial<typeof record> {

    return Object.keys(record).filter((key) => filter(key as K)).reduce(
        (result, key) => {
            result[key as K] = record[key as K];
            return result;
        },
        {} as Record<K, V>
    )

}

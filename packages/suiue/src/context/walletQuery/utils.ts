/** like Object.assign, but if record already exist and is an array, push to. */
export function assignDataToObj<T extends Record<any, any | any[]>>(to: T, from: T){
    Object.keys(from).forEach((_keyInFrom) => {
        let keyInFrom = _keyInFrom as keyof T

        let valueInFrom = from[keyInFrom]
        if (Array.isArray(valueInFrom)) {
            if (!to[keyInFrom]) {
                // not exist in result
                to[keyInFrom] = valueInFrom
            } else {
                // exist in result
                if (Array.isArray(to[keyInFrom])) {
                    // and is Array
                    (to[keyInFrom] as Array<any>).push(...valueInFrom as any[])
                }
            }
        } else {
            // not array
            // overwrite
            to[keyInFrom] = valueInFrom
        }
    })
}

export function mapDisplayArrayToObject(display?: { key: string, value: string | null }[] | null) {
    if (!display) {
        return null
    }

    return display.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
    }, {} as Record<string, string | null>)
}
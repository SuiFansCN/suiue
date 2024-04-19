
export function forceBindThis<T extends Object>(obj: T): T{
    // 强制将 this 绑定到 obj 上，使得即使被解构调用，this 也指向 obj
    return new Proxy<T>(obj, {
        get(target, p, receiver) {
            let prop = Reflect.get(target, p, receiver)

            if (typeof prop === "function") {
                // console.log("call function: ", p, receiver)
                return (...arg: any[]) => prop.apply(target, arg)
            }

            return prop
        }
    })
}

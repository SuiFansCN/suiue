import { reactive, readonly, toRef, watch } from "vue";

import type { ComputedRef, Ref } from "vue";
import type { SuiTypeIdentifier } from "@/types.ts";

export class AssertManager<AssertType extends object> {

    // @TODO: subscribe to asset changes
    // private subscriber
    // private subFilter

    private retentionKeys
    private loader
    private getAllLoader
    private getDefault

    // false to reset all, true to fetch all
    private resetRefer

    private assertMap
    // readonly value 
    public readonly value

    constructor(options: {
        loader: (key: SuiTypeIdentifier[]) => Promise<Record<SuiTypeIdentifier, AssertType>>,
        getAllLoader: () => Promise<Record<SuiTypeIdentifier, AssertType>>,
        default: () => AssertType
        resetRefer: ComputedRef<Boolean> | Ref<Boolean>,
        // refer to flush all when change wallet or account
    }) {
        this.loader = options.loader
        this.getAllLoader = options.getAllLoader
        this.getDefault = options.default

        // the key in that will be retained when reset
        this.retentionKeys = [] as SuiTypeIdentifier[]


        // use to reset all when refer change to false
        this.resetRefer = options.resetRefer

        this.assertMap = reactive<Record<SuiTypeIdentifier, AssertType>>({})
        this.value = readonly(this.assertMap)

        //                        change this
        watch(this.resetRefer, () => this.reset())
    }

    private reset() {
        if (this.resetRefer.value === false) {
            for (let key of Object.keys(this.assertMap) as SuiTypeIdentifier[]) {
                if (this.retentionKeys.includes(key) && key in this.assertMap) {
                    // set to default value, but not delete it.
                    this.assertMap[key] = this.getDefault()
                } else {
                    // not in retentionKeys, delete it
                    delete this.assertMap[key]
                }
            }
        } else {
            this.reload()
        }
    }

    /** fetch and assign to assertMap */
    private async fetch(keys: SuiTypeIdentifier[]) {
        const rst = await this.loader(keys)
        Object.assign(this.assertMap, rst)
        // return rst
    }

    /** update specify assert */
    public async update(keys: SuiTypeIdentifier[]) {
        let existKeys = keys.filter((key) => key in this.assertMap)
        if (existKeys.length === 0) {
            return
        }

        await this.fetch(existKeys)
    }

    /** fetch all the data which key in assertMap, call when reset or manual */
    public async reload() {
        /* call when reset */
        await this.fetch(Object.keys(this.assertMap) as SuiTypeIdentifier[])
    }

    /** load assert, and use it after, await to wait load complete */
    public async load(keys: SuiTypeIdentifier[], toRetention = true): Promise<void> {
        /**
        * 载入一个资源，添加默认结构到 assertMap 中，随后动态加载，使得依赖了 assertMap 的模板可以先显示默认值，然后再显示真实值
        */

        let new_keys = keys.filter((keys) => !(keys in this.assertMap))

        if (new_keys.length === 0) {
            return
        }

        if (toRetention) {
            this.retentionKeys.push(...new_keys)
        }

        for (let key of new_keys) {
            this.assertMap[key] = this.getDefault()
        }

        await this.fetch(new_keys)
    }

    /** get data with specify key, equal to value[key] */
    public get(key: SuiTypeIdentifier) {
        if (key in this.value) {
            return this.value[key]
        }
    }

    // /** get data with specify key，with `reactivity` */
    // public getRef(key: SuiTypeIdentifier): Ref<AssertType> | undefined {
    //     if (key in this.assertMap) {
    //         return toRef(this.assertMap, key)
    //     }
    // }

    public async loadAll(): Promise<void> {
        // TODO: parallel fetch
        let rst = await this.getAllLoader()
        Object.assign(this.assertMap, rst)
    }

    public remove(key: SuiTypeIdentifier) {

        if (key in this.retentionKeys) {
            this.retentionKeys.splice(this.retentionKeys.indexOf(key), 1)
        }

        delete this.assertMap[key]
    }

}
import {computed, shallowRef, readonly} from "vue";

import {browserWallets} from "@/browserWallets.ts";
import {getWalletIdentifier, updateWalletConnectionInfo} from "@/walletUtils.ts";
import {useProvider} from "@/provider.ts";
import {SuiueProviderConfig} from "@/components/SuiueProvider.vue";
import {WalletAccountNotFoundError, WalletNotConnectedError} from "@/errors.ts";

import type {ReadonlyWalletAccount} from "@mysten/wallet-standard";
import {BrowserWalletType} from "@/types.ts";

type OnConnectCallbackType = (state?: ThisType<WalletState>) => void

export class WalletState {

    private _config
    private _wallet
    private _accounts
    private _onConnects
    public readonly wallet
    public readonly wallets
    public readonly account
    public readonly address
    public readonly isConnected

    constructor(config: SuiueProviderConfig) {
        // wallet state 与 config 一起被注册，没有上下级关系所以无法被 inject，手动传入
        this._config = config
        this._wallet = shallowRef<BrowserWalletType>()
        this.wallet = readonly(this._wallet)
        this._accounts = shallowRef<ReadonlyWalletAccount[]>([])
        this._onConnects = [] as OnConnectCallbackType[]
        this.account = computed(() => this._accounts.value[0])

        this.isConnected = computed(() => !!this._wallet.value)
        this.address = computed(() => this.account.value?.address)
        // TODO: type WalletWithFeatures<MapStrArrayToFeaturesType<Exclude<typeof this._config.requiredFeatures, undefined>>>
        this.wallets = computed<BrowserWalletType[]>(() => {
            // filter wallets by required features
            let wallets = browserWallets?.value.filter(
                (wallet) => this._config.requiredFeatures?.every(
                    (feature) => feature in wallet.features
                )
            )

            // filter wallets by network
            wallets = wallets.filter((wallet) => wallet.chains.includes(`sui:${this._config.network}`))

            if (!wallets) {
                return []
            }

            // order wallets by preferred order
            return [
                // Preferred wallets, in order:
                ...(this._config.preferredWallets!.map((name) => wallets.find((wallet) => getWalletIdentifier(wallet).toLowerCase() === name))
                    .filter(Boolean)),

                // Wallets in default order:
                ...wallets.filter((wallet) => !this._config.preferredWallets!.includes(getWalletIdentifier(wallet).toLowerCase())),
            ] as BrowserWalletType[]

        })

        // register event for all wallet
        for (let wallet of this.wallets.value) {
            wallet.features["standard:events"]?.on("change", (_) => {
                // connect to same wallet
                if (this.wallet.value && getWalletIdentifier(this.wallet.value) === getWalletIdentifier(this.wallet.value)) {
                    // reconnect
                    this.disconnect().then(() => this.connect(wallet))
                }
            })
        }
    }


    private updateAccounts(target: BrowserWalletType, accounts: ReadonlyWalletAccount[]) {
        // 为了防止在切换钱包之后，之前的钱包依然发出事件，所以需要在改账户的时候判断当前钱包是否是当前钱包
        if (!this._wallet.value) {
            return
        }

        if (getWalletIdentifier(target) === getWalletIdentifier(this._wallet.value)) {
            this._accounts.value = accounts
        }
    }

    private handlerConnect() {
        for (let cb of this._onConnects) {
            new Promise(() => cb.apply(this, [this,]))
        }
    }

    public async connect(target: BrowserWalletType, preferredAddress?: string) {
        if (this.isConnected) {
            this.disconnect()
        }

        let output = await target.features["standard:connect"].connect();
        if (output.accounts.length === 0) {
            throw new WalletAccountNotFoundError("connect failed: no account provide by wallet.")
        }

        // 重新排序账户，将 preferredAccount 移动到第一个
        let accounts = [
            ...output.accounts.filter((account) => account.address === preferredAddress),
            ...output.accounts.filter((account) => account.address !== preferredAddress)
        ]

        this._wallet.value = target
        this.updateAccounts(target, accounts as ReadonlyWalletAccount[])

        updateWalletConnectionInfo({
            wallet_ident: getWalletIdentifier(target),
            account_addr: this.address.value
        });

        this.handlerConnect()
    }

    public async disconnect() {
        if (!this._wallet.value) {
            return
        }

        try {
            await (this._wallet.value.features["standard:disconnect"])?.disconnect()
        } catch {
        }

        this._wallet.value = undefined
        this._accounts.value = []

        updateWalletConnectionInfo({
            wallet_ident: null,
            account_addr: null
        })
    }

    public checkConnected() {
        if (!this.wallet.value) {
            throw new WalletNotConnectedError()
        }
    }

    /** set a call bcak when connect, call again to cancel 
     * @example
     * ```
     * let cancel = wallet.onConnect((state) => {
     *    useWalletQuery().objects.loadAll()
     * })
     * 
     * // cancel the callback
     * cancel()
    */
    public onConnect(cb: OnConnectCallbackType): () => void{
        const cancel = () => {
            this._onConnects.splice(this._onConnects.indexOf(cb), 1)
        }

        this._onConnects.push(cb)
        return () => cancel.call(this)
    }

}

// 强制修改 this 指向，使得即使被解构调用，this 也指向 wallet
/* wallet-interface */
export const useWalletState = () => useProvider("WALLET_STATE")

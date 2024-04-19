/// <reference types="./global-wallets.d.ts" />

import {createApp} from 'vue'
import App from './ProviderWrapper.vue'
import { createSuiue } from "@suifans/suiue";
import {getWallets, WalletWithRequiredFeatures} from "@mysten/wallet-standard";



const app = createApp(App)
app.use(createSuiue())
app.mount('#app')

document.addEventListener("DOMContentLoaded", () => {
    window.getWallets = getWallets()
    window.wallets =  []

    for (let wallet of window.getWallets.get() as WalletWithRequiredFeatures[]){
        window.wallets.push(wallet)
        wallet.features["standard:events"].on("change", (e) => {
            console.debug(`wallet ${wallet.name} event`)
            console.debug(e)
        })
    }

    window.getWallets.on("register", (wallet: WalletWithRequiredFeatures) => {
        window.wallets.push(wallet)
    })
})

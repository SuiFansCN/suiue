import {registerWallet} from "@/browserWallets.ts"
import type {Plugin} from "vue";


export function createSuiue() {
    return {
        install: (
            app
        ) => {
            // if(!getActivePinia()){
            //     app.use(createPinia())
            // }
            app.provide("PROVIDERS", [])
            registerWallet()
        }
    } as Plugin
}
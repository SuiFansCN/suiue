import { registerWallet } from "@/browserWallets.ts"
import type { App } from "vue";


export function createSuiue() {
    return {
        install: (
            app: App,
        ) => {
            app.provide("PROVIDERS", [])
            registerWallet()
        }
    }
}
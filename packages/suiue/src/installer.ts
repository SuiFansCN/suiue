import { registerWallet } from "@/browserWallets.ts"
import type { App, Plugin } from "vue";


export function createSuiue(): Plugin<[]> {
    return {
        install: (
            app: App,
        ) => {
            app.provide("PROVIDERS", [])
            registerWallet()
        }
    }
}
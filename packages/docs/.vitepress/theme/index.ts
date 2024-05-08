import type { Theme } from 'vitepress'
import layout from "./layout.vue"
import { createSuiue, NConnectButton } from "suiue"
import naive from "naive-ui"
import DefaultTheme from 'vitepress/theme'


export default {
    extends: DefaultTheme,
    Layout: layout,
    enhanceApp({ app }) {
        // install the Suiue plugin
        app.use(createSuiue())
        app.use(naive)

        app.component('NConnectButton', NConnectButton)
    }
} satisfies Theme
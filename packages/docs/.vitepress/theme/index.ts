import type { Theme } from 'vitepress'
import layout from "./layout.vue"
import { createSuiue, NConnectButton} from "@suifans/suiue"
import DefaultTheme from 'vitepress/theme'
import naive from 'naive-ui'

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
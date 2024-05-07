import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export const en = defineConfig({
    lang: 'en-US',
    description: 'A dapp-kit for sui on vue',
    title: "Suiue - Documentations",

    themeConfig: {
        nav: nav(),
        // sidebar: {
        //   '/guide/': { base: '/guide/', items: sidebarGuide() },
        //   '/reference/': { base: '/reference/', items: sidebarReference() }
        // },

    }
})

function nav(): DefaultTheme.NavItem[] {
    return [
        {
            text: 'quick-start',
            link: '/en_US/quick-start.md',
            activeMatch: '/en_US/quick-start'
        },
        {
            text: 'reference',
            link: '/en_US/reference/index.md',
            activeMatch: '/en_US/reference/'
        },
    ]
}
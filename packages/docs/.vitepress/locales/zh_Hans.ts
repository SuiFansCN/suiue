import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)

export const zh = defineConfig({
  lang: 'zh-Hans',
  description: '专为 VUE 设计的 SUI 开发套件',

  themeConfig: {
    nav: nav(),

    // sidebar: {
    //   '/zh_CN/reference/': { base: '/zh/reference/', items: sidebarReference() }
    // },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '快速上手',
      link: '/quick-start.md',
    },
    {
      text: '参考',
      link: '/reference/index.md',
      activeMatch: '/reference/'
    }
  ]
}
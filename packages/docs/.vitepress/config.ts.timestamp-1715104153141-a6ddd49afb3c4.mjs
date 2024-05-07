// .vitepress/config.ts
import { defineConfig as defineConfig2 } from "file:///Users/majoson/CodeSpace/suiue/node_modules/.pnpm/vitepress@1.1.4_@algolia+client-search@4.23.3_@types+node@20.12.7_search-insights@2.13.0_typescript@5.4.5/node_modules/vitepress/dist/node/index.js";

// .vitepress/locales/zh_Hans.ts
import { createRequire } from "module";
import { defineConfig } from "file:///Users/majoson/CodeSpace/suiue/node_modules/.pnpm/vitepress@1.1.4_@algolia+client-search@4.23.3_@types+node@20.12.7_search-insights@2.13.0_typescript@5.4.5/node_modules/vitepress/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/majoson/CodeSpace/suiue/packages/docs/.vitepress/locales/zh_Hans.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var zh = defineConfig({
  lang: "zh-Hans",
  description: "\u4E13\u4E3A VUE \u8BBE\u8BA1\u7684 SUI \u5F00\u53D1\u5957\u4EF6",
  themeConfig: {
    nav: nav(),
    // sidebar: {
    //   '/zh_CN/reference/': { base: '/zh/reference/', items: sidebarReference() }
    // },
    docFooter: {
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875"
    },
    outline: {
      label: "\u9875\u9762\u5BFC\u822A"
    },
    lastUpdated: {
      text: "\u6700\u540E\u66F4\u65B0\u4E8E",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      }
    },
    langMenuLabel: "\u591A\u8BED\u8A00",
    returnToTopLabel: "\u56DE\u5230\u9876\u90E8",
    sidebarMenuLabel: "\u83DC\u5355",
    darkModeSwitchLabel: "\u4E3B\u9898",
    lightModeSwitchTitle: "\u5207\u6362\u5230\u6D45\u8272\u6A21\u5F0F",
    darkModeSwitchTitle: "\u5207\u6362\u5230\u6DF1\u8272\u6A21\u5F0F"
  }
});
function nav() {
  return [
    {
      text: "\u5FEB\u901F\u4E0A\u624B",
      link: "/quick-start.md"
    },
    {
      text: "\u53C2\u8003",
      link: "/reference/index.md",
      activeMatch: "/reference/"
    }
  ];
}

// .vitepress/config.ts
import AutoSidebar from "file:///Users/majoson/CodeSpace/suiue/node_modules/.pnpm/@iminu+vitepress-plugin-auto-sidebar@1.0.3/node_modules/@iminu/vitepress-plugin-auto-sidebar/dist/index.mjs";
var config_default = defineConfig2({
  vite: {
    plugins: [
      AutoSidebar()
    ]
  },
  lang: "zh-Hans",
  cleanUrls: true,
  metaChunk: true,
  // title: "Suiue Documents",
  // description: "a dapp-kit for sui on vue",
  locales: {
    ...zh,
    en_US: {
      label: "English",
      lang: "en-US",
      dir: "./en_US",
      title: "Suiue - Documentations",
      themeConfig: {
        nav: [
          { text: "Home", link: "/en_US/" },
          { text: "References", link: "/en_US/reference" }
        ]
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // i18nRouting: true,
    search: {
      provider: "local"
    },
    footer: {
      copyright: `Made with \u{1F49C} by @suifans`
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/SuiFansCN/suiue" }
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcudHMiLCAiLnZpdGVwcmVzcy9sb2NhbGVzL3poX0hhbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFqb3Nvbi9Db2RlU3BhY2Uvc3VpdWUvcGFja2FnZXMvZG9jcy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFqb3Nvbi9Db2RlU3BhY2Uvc3VpdWUvcGFja2FnZXMvZG9jcy8udml0ZXByZXNzL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFqb3Nvbi9Db2RlU3BhY2Uvc3VpdWUvcGFja2FnZXMvZG9jcy8udml0ZXByZXNzL2NvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcydcbmltcG9ydCB7IHpoIH0gZnJvbSAnLi9sb2NhbGVzL3poX0hhbnMnO1xuaW1wb3J0IEF1dG9TaWRlYmFyIGZyb20gXCJAaW1pbnUvdml0ZXByZXNzLXBsdWdpbi1hdXRvLXNpZGViYXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICB2aXRlOiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIEF1dG9TaWRlYmFyKClcbiAgICAgICAgXVxuICAgIH0sXG4gICAgbGFuZzogJ3poLUhhbnMnLFxuICAgIGNsZWFuVXJsczogdHJ1ZSxcbiAgICBtZXRhQ2h1bms6IHRydWUsXG4gICAgLy8gdGl0bGU6IFwiU3VpdWUgRG9jdW1lbnRzXCIsXG4gICAgLy8gZGVzY3JpcHRpb246IFwiYSBkYXBwLWtpdCBmb3Igc3VpIG9uIHZ1ZVwiLFxuICAgIGxvY2FsZXM6IHtcbiAgICAgICAgLi4uemgsXG4gICAgICAgIGVuX1VTOiB7XG4gICAgICAgICAgICBsYWJlbDogJ0VuZ2xpc2gnLFxuICAgICAgICAgICAgbGFuZzogJ2VuLVVTJyxcbiAgICAgICAgICAgIGRpcjogJy4vZW5fVVMnLFxuICAgICAgICAgICAgdGl0bGU6IFwiU3VpdWUgLSBEb2N1bWVudGF0aW9uc1wiLFxuICAgICAgICAgICAgdGhlbWVDb25maWc6IHtcbiAgICAgICAgICAgICAgICBuYXY6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnSG9tZScsIGxpbms6ICcvZW5fVVMvJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdSZWZlcmVuY2VzJywgbGluazogJy9lbl9VUy9yZWZlcmVuY2UnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB0aGVtZUNvbmZpZzoge1xuICAgICAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG5cbiAgICAgICAgLy8gaTE4blJvdXRpbmc6IHRydWUsXG4gICAgICAgIHNlYXJjaDoge1xuICAgICAgICAgICAgcHJvdmlkZXI6IFwibG9jYWxcIlxuICAgICAgICB9LFxuICAgICAgICBmb290ZXI6IHtcbiAgICAgICAgICAgIGNvcHlyaWdodDogYE1hZGUgd2l0aCBcdUQ4M0RcdURDOUMgYnkgQHN1aWZhbnNgXG4gICAgICAgIH0sXG4gICAgICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICAgICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL1N1aUZhbnNDTi9zdWl1ZScgfVxuICAgICAgICBdXG4gICAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21ham9zb24vQ29kZVNwYWNlL3N1aXVlL3BhY2thZ2VzL2RvY3MvLnZpdGVwcmVzcy9sb2NhbGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFqb3Nvbi9Db2RlU3BhY2Uvc3VpdWUvcGFja2FnZXMvZG9jcy8udml0ZXByZXNzL2xvY2FsZXMvemhfSGFucy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFqb3Nvbi9Db2RlU3BhY2Uvc3VpdWUvcGFja2FnZXMvZG9jcy8udml0ZXByZXNzL2xvY2FsZXMvemhfSGFucy50c1wiO2ltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgRGVmYXVsdFRoZW1lIH0gZnJvbSAndml0ZXByZXNzJ1xuXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpXG5cbmV4cG9ydCBjb25zdCB6aCA9IGRlZmluZUNvbmZpZyh7XG4gIGxhbmc6ICd6aC1IYW5zJyxcbiAgZGVzY3JpcHRpb246ICdcdTRFMTNcdTRFM0EgVlVFIFx1OEJCRVx1OEJBMVx1NzY4NCBTVUkgXHU1RjAwXHU1M0QxXHU1OTU3XHU0RUY2JyxcblxuICB0aGVtZUNvbmZpZzoge1xuICAgIG5hdjogbmF2KCksXG5cbiAgICAvLyBzaWRlYmFyOiB7XG4gICAgLy8gICAnL3poX0NOL3JlZmVyZW5jZS8nOiB7IGJhc2U6ICcvemgvcmVmZXJlbmNlLycsIGl0ZW1zOiBzaWRlYmFyUmVmZXJlbmNlKCkgfVxuICAgIC8vIH0sXG5cbiAgICBkb2NGb290ZXI6IHtcbiAgICAgIHByZXY6ICdcdTRFMEFcdTRFMDBcdTk4NzUnLFxuICAgICAgbmV4dDogJ1x1NEUwQlx1NEUwMFx1OTg3NSdcbiAgICB9LFxuXG4gICAgb3V0bGluZToge1xuICAgICAgbGFiZWw6ICdcdTk4NzVcdTk3NjJcdTVCRkNcdTgyMkEnXG4gICAgfSxcblxuICAgIGxhc3RVcGRhdGVkOiB7XG4gICAgICB0ZXh0OiAnXHU2NzAwXHU1NDBFXHU2NkY0XHU2NUIwXHU0RThFJyxcbiAgICAgIGZvcm1hdE9wdGlvbnM6IHtcbiAgICAgICAgZGF0ZVN0eWxlOiAnc2hvcnQnLFxuICAgICAgICB0aW1lU3R5bGU6ICdtZWRpdW0nXG4gICAgICB9XG4gICAgfSxcblxuICAgIGxhbmdNZW51TGFiZWw6ICdcdTU5MUFcdThCRURcdThBMDAnLFxuICAgIHJldHVyblRvVG9wTGFiZWw6ICdcdTU2REVcdTUyMzBcdTk4NzZcdTkwRTgnLFxuICAgIHNpZGViYXJNZW51TGFiZWw6ICdcdTgzRENcdTUzNTUnLFxuICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6ICdcdTRFM0JcdTk4OTgnLFxuICAgIGxpZ2h0TW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2RDQ1XHU4MjcyXHU2QTIxXHU1RjBGJyxcbiAgICBkYXJrTW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2REYxXHU4MjcyXHU2QTIxXHU1RjBGJ1xuICB9XG59KVxuXG5mdW5jdGlvbiBuYXYoKTogRGVmYXVsdFRoZW1lLk5hdkl0ZW1bXSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NEUwQVx1NjI0QicsXG4gICAgICBsaW5rOiAnL3F1aWNrLXN0YXJ0Lm1kJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTUzQzJcdTgwMDMnLFxuICAgICAgbGluazogJy9yZWZlcmVuY2UvaW5kZXgubWQnLFxuICAgICAgYWN0aXZlTWF0Y2g6ICcvcmVmZXJlbmNlLydcbiAgICB9XG4gIF1cbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZVLFNBQVMsZ0JBQUFBLHFCQUFvQjs7O0FDQUgsU0FBUyxxQkFBcUI7QUFDclksU0FBUyxvQkFBdUM7QUFEa0wsSUFBTSwyQ0FBMkM7QUFHblIsSUFBTUMsV0FBVSxjQUFjLHdDQUFlO0FBRXRDLElBQU0sS0FBSyxhQUFhO0FBQUEsRUFDN0IsTUFBTTtBQUFBLEVBQ04sYUFBYTtBQUFBLEVBRWIsYUFBYTtBQUFBLElBQ1gsS0FBSyxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNVCxXQUFXO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUVBLGFBQWE7QUFBQSxNQUNYLE1BQU07QUFBQSxNQUNOLGVBQWU7QUFBQSxRQUNiLFdBQVc7QUFBQSxRQUNYLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBLElBRUEsZUFBZTtBQUFBLElBQ2Ysa0JBQWtCO0FBQUEsSUFDbEIsa0JBQWtCO0FBQUEsSUFDbEIscUJBQXFCO0FBQUEsSUFDckIsc0JBQXNCO0FBQUEsSUFDdEIscUJBQXFCO0FBQUEsRUFDdkI7QUFDRixDQUFDO0FBRUQsU0FBUyxNQUE4QjtBQUNyQyxTQUFPO0FBQUEsSUFDTDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixhQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFDRjs7O0FEcERBLE9BQU8saUJBQWlCO0FBR3hCLElBQU8saUJBQVFDLGNBQWE7QUFBQSxFQUN4QixNQUFNO0FBQUEsSUFDRixTQUFTO0FBQUEsTUFDTCxZQUFZO0FBQUEsSUFDaEI7QUFBQSxFQUNKO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUE7QUFBQTtBQUFBLEVBR1gsU0FBUztBQUFBLElBQ0wsR0FBRztBQUFBLElBQ0gsT0FBTztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsYUFBYTtBQUFBLFFBQ1QsS0FBSztBQUFBLFVBQ0QsRUFBRSxNQUFNLFFBQVEsTUFBTSxVQUFVO0FBQUEsVUFDaEMsRUFBRSxNQUFNLGNBQWMsTUFBTSxtQkFBbUI7QUFBQSxRQUNuRDtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsYUFBYTtBQUFBO0FBQUE7QUFBQSxJQUlULFFBQVE7QUFBQSxNQUNKLFVBQVU7QUFBQSxJQUNkO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixXQUFXO0FBQUEsSUFDZjtBQUFBLElBQ0EsYUFBYTtBQUFBLE1BQ1QsRUFBRSxNQUFNLFVBQVUsTUFBTSxxQ0FBcUM7QUFBQSxJQUNqRTtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAicmVxdWlyZSIsICJkZWZpbmVDb25maWciXQp9Cg==

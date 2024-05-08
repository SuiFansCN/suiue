/// <reference types="vitest" />
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";
import dts from "vite-plugin-dts";
// import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            rollupTypes: false,

            outDir: "./lib/types",
            
            // include: [
            //     "./src",
            // ]
        }),
        // chunkSplitPlugin({
        //     strategy: "unbundle",
        // })
    ],
    test: {
        environment: "jsdom",
        include: ["src/**/**.test.ts"],
        globals: true,
        // globalSetup
    },
    build: {
        minify: false,
        rollupOptions: {
            external: [
                // !!! 重要，否则在库内定义的 ref 会被 vite 打包进去，导致在使用库的项目中出现多个 vue 实例
                "vue",
            ],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
            input: ["src/exports.ts"]
        },
        // watch: {
        //     clearScreen: true,
        //     include: ["src/**"]
        // },
        outDir: "./lib",
        lib: {
            entry: resolve(__dirname, "src/exports.ts"),
            name: "suiue",
            formats: ["umd", "es"],
            // fileName: (format) => `index.${format}.js`,
        },
        sourcemap: true,

    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        }
    }
})


/// <reference types="vitest" />
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            // outDir: "./lib/types",
            // include: [
            //     "./src",
            // ]
        }),
    ],
    test: {
        environment: "happy-dom",
        include: ["tests/**"],
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
        watch: {
            clearScreen: true,
            include: ["src/**"]
        },
        outDir: "./lib",
        lib: {
            entry: resolve(__dirname, "src/exports.ts"),
            name: "suiue",
            formats: ["cjs", "es", "umd"],
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


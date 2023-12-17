/// <reference types="vitest" />
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: "happy-dom",
        include: ["tests/**"],
    },
    build: {
        outDir: "./dist",
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "vue-sui-dapp-kit",
            formats: ["cjs", "es", "umd"],
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './lib'),

            // for demo test
            "@@": resolve(__dirname, './demo'),
            "vue-sui-dapp-kit": "./lib/index.ts",
            "vue-sui-dapp-kit/*": resolve(__dirname, './lib')
        }
    }
})


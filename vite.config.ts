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
            outDir: "./dist/types",
            include: [
                "./lib",
            ]
        }),
    ],
    test: {
        environment: "happy-dom",
        include: ["tests/**"],
    },
    build: {
        rollupOptions: {
            // treeshake: false,
            external: [
                "vue",
                "pinia",
                "@mysten/sui.js",
            ],

        },
        watch: {
            clearScreen: true,
            include: ["lib/**"]
        },
        outDir: "./dist",
        lib: {
            entry: resolve(__dirname, "lib/index.ts"),
            name: "vue-sui-dapp-kit",
            formats: ["cjs", "es", "umd"],
            fileName: (format) => `index.${format}.js`,
        },
        sourcemap: true,

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


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
            outDir: "./lib/types",
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
            include: ["src/**"]
        },
        outDir: "./lib",
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "suiue",
            formats: ["cjs", "es", "umd"],
            fileName: (format) => `index.${format}.js`,
        },
        sourcemap: true,

    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        }
    }
})


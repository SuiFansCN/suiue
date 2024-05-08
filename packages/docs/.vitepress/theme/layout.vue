<script setup>
import DefaultTheme from 'vitepress/theme'
import { SuiueProvider, NConnectButton } from "@suifans/suiue"
import { NConfigProvider, darkTheme, lightTheme } from "naive-ui"
import { useData } from "vitepress"
const { Layout } = DefaultTheme

const { isDark } = useData()
</script>

<template>
    <n-config-provider :theme="isDark ? darkTheme : lightTheme">
        <suiue-provider>
            <Layout>
                <template #nav-bar-content-after>
                    <span style="margin-left: 16px;"><n-connect-button style="margin-left: 16px;" /></span>
                </template>
            </Layout>
        </suiue-provider>
    </n-config-provider>

</template>
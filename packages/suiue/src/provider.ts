import { inject, provide } from "vue";

import type { SuiueProviderConfig } from "@/components/SuiueProvider.vue";
import type { WalletState } from "@/context/walletState.ts";
import type { WalletActions } from "@/context/walletActions.ts";
import type { WalletQuery } from "@/context/walletQuery";
import { ProviderNotExistsError } from "@/errors.ts";

export const PROVIDER_MAP = {
    "PROVIDERS": () => [] as string[],

    // provide when SuiueProvider.vue created.
    "PROVIDER": () => "" as string,
    "PROVIDER_CONFIG": () => { return {} as SuiueProviderConfig},
    "WALLET_STATE": () => { return {} as WalletState },
    "WALLET_ACTIONS": () => { return {} as WalletActions },
    "WALLET_QUERY": () => { return {} as WalletQuery },
};

export function useProvider<T extends keyof typeof PROVIDER_MAP>(key: T) {
    let rst = inject<ReturnType<typeof PROVIDER_MAP[T]>>(key);
    if (!rst) {
        throw new ProviderNotExistsError()
    }
    return rst
}

export function setProvider<T extends keyof typeof PROVIDER_MAP>(key: T, value: ReturnType<typeof PROVIDER_MAP[T]>) {
    return provide<ReturnType<typeof PROVIDER_MAP[T]>>(key, value);
}


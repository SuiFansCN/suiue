import {describe, test} from "vitest";
import {mount} from "@vue/test-utils";

import SuiueProvider from "../src/components/SuiueProvider.vue";

describe("test wallet-provider-features", () => {

    test("test provider mount", () => {
        const comp = mount(SuiueProvider, {
            props: {
                config: {
                    autoConnect: "enable",
                }
            }
        })

    })


})
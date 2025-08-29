// @ts-check

import antfu from '@antfu/eslint-config'

export default antfu({
    type: 'lib',
    stylistic: {
        indent: 4,
        semi: false,
        quotes: 'single',
    },
    typescript: true,
    jsonc: true,
    yaml: false,
    vue: true,
    rules: {
        'antfu/curly': 'error',
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/if-newline': 'error',
        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'error',
    },

})

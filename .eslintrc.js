module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    //extends: [
    //    'prettier',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    //    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    //],
    parserOptions: {
        ecmaVersion: 2023,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
        experimentalDecorators: true,
    },
    rules: {
        "@typescript-eslint/camelcase": 0
    }
};

module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2023,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
        experimentalDecorators: true,
    },
    rules: {
        "@typescript-eslint/camelcase": 0
    }
};

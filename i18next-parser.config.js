module.exports = {
    input: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
    ],
    locales: ['ko', 'en', 'ja'],
    output: 'src/screens/Localize/locales/$LOCALE/$NAMESPACE.json',
};

// next.config.js
const { i18n } = require('./next-i18next.config.js');

module.exports = {
    i18n,
    reactStrictMode: true, // if true: This causes double rendering in development // if false: This will stop the double rendering
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

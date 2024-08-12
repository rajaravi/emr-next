// next.config.js
const { i18n } = require('./next-i18next.config.js');

module.exports = {
    i18n,
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    // Add other Next.js configurations here if needed
};

// postcss.config.js
module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
  ],
}

// OU cette syntaxe :

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
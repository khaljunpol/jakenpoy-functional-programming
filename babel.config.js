module.exports = {
  presets: [
    ["@babel/env"]
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-transform-typescript"],
    ["@babel/plugin-transform-modules-commonjs"]  // THIS FIXES SPINE js IMPORT FROM PIXIJS WARNING wooohooooO
  ]
};
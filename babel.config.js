module.exports = {
  presets: ["@babel/env", "@babel/typescript", "@babel/react"],
  plugins: [
    "@babel/transform-runtime",
    "@babel/proposal-class-properties",
    "@babel/proposal-nullish-coalescing-operator",
    "@babel/proposal-optional-chaining",
  ],
}

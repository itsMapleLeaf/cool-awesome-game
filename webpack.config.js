// @ts-check
const merge = require("webpack-merge")
const { join } = require("path")

/** @type {import('webpack').Configuration} */
const baseConfig = {
  output: {
    path: join(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        include: join(__dirname, "src"),
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  performance: {
    maxAssetSize: Infinity,
    maxEntrypointSize: Infinity,
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
}

const clientConfig = merge(baseConfig, {
  entry: "./src/client/index.tsx",
  output: {
    filename: "client.js",
  },
})

const serverConfig = merge(baseConfig, {
  entry: "./src/server/index.ts",
  output: {
    filename: "server.js",
  },
})

module.exports = [clientConfig, serverConfig]

// @ts-check
const merge = require("webpack-merge")
const { join } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

/** @type {import('webpack').Configuration} */
const baseConfig = {
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
  stats: "normal",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
}

const clientConfig = merge(baseConfig, {
  entry: "./src/client/index.tsx",
  output: {
    path: join(__dirname, "build/client"),
    filename: "client.js",
    publicPath: "/",
  },
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/client/index.html" })],
  devServer: {
    historyApiFallback: true,
  },
})

const serverConfig = merge(baseConfig, {
  entry: "./src/server/index.ts",
  output: {
    path: join(__dirname, "build"),
    filename: "server.js",
    libraryTarget: "commonjs",
  },
  target: "node",
  externals: ["ws"],
})

module.exports = [clientConfig, serverConfig]

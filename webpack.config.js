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
  stats: "minimal",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
}

const clientConfig = merge(baseConfig, {
  entry: "./src/client/index.tsx",
  output: {
    path: join(__dirname, "build/client"),
    filename: "client.js",
  },
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/client/index.html" })],
  devServer: {
    contentBase: join(__dirname, "build/client"),
  },
})

const serverConfig = merge(baseConfig, {
  entry: "./src/server/index.ts",
  output: {
    path: join(__dirname, "build"),
    filename: "server.js",
    publicPath: "/",
    libraryTarget: "commonjs",
  },
  target: "node",
  externals: ["ws"],
})

module.exports = [clientConfig, serverConfig]

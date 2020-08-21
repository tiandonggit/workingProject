const path = require("path");
const vConsolePlugin = require("vconsole-webpack-plugin");
module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "./" : "./",
  // publicPath: "./",
  outputDir: "dist",
  devServer: {
    proxy: {
      "/api": {
        target: "http://47.95.231.51:6060",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
    } else {
      config.plugins.push(
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      );
    }
  },
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("less").oneOf(type))
    );
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
};
function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/assets/css/cssCommon.less")]
    });
}

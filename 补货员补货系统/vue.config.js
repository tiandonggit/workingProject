const path = require("path");
const vConsolePlugin = require("vconsole-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "" : "./",
  // publicPath: "./",
  assetsDir: "static",
  outputDir: "sssm_supply",
  lintOnSave: false, // 是否开启编译时是否不符合eslint提示
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    port:8081,
    proxy: {
      "/": {
        target: "https://yzh.quickhealmall.com/api",
        ws: false,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/": ""
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      const plugins = [];
      // plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       warnings: false,
      //       compress: {
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ['console.log']//移除console
      //       }
      //     },
      //     sourceMap: false,
      //     parallel: true
      //   })
      // );
      //gzip压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,//超过10k就压缩
          minRatio: 0.8
        })
      );

      config.plugins = [
        ...config.plugins,
        ...plugins
      ];

      //优化打包chunk-vendors.js文件体积过大
      let optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20480, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              }
            }
          }
        }
      };
      Object.assign(config, {
        optimization
      });

      config.plugins.push(
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      );
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
    config.optimization.minimize(true);
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("less").oneOf(type))
    );
    // 图片压缩
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true
      })
      .end();
  },
  css: {
    extract: true, //使用css分离插件
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

const path = require("path")
const webpack = require('webpack')
const vConsolePlugin = require("vconsole-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin
//import httpConfig from "../../utils/httpConfig";
//const httpConfig = path.resolve(__dirname, "./src/utils/httpConfig.js");
module.exports = {
  //  publicPath: process.env.NODE_ENV === "production" ? "h5/" : "/h5",
  publicPath: "./",
  assetsDir: "static",
  outputDir: "dist",
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  lintOnSave: false,
  // //服务
  devServer: {
    disableHostCheck: true,
    // proxy: {
    //   "/api": {
    //     target: "http://47.95.231.51:6060",
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api": ""
    //     }
    //   }
    // }
  },
  configureWebpack: config => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "windows.jQuery":"jquery"
      })
    )
    if (process.env.NODE_ENV === "production") {
      const plugins = []
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ["console.log"] //移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      //gzip压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240, //超过10k就压缩
          minRatio: 0.8
        })
      )
      plugins.push(
        new BundleAnalyzerPlugin({
          analyzerPort: 8888,
          reportFilename: "report.html",
          defaultSizes: "parsed",
          openAnalyzer: true,
          generateStatsFile: false,
          statsFilename: "stats.json",
          statsOptions: null,
          logLevel: "info" // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
        })
      )
      config.plugins = [...config.plugins, ...plugins]
      // config.plugins.push(
      //   new vConsolePlugin({
      //     filter: [],
      //     enable: true
      //   })
      // );
      //优化打包chunk-vendors.js文件体积过大
      let optimization = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20480, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1]
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`
              }
            }
          }
        }
      }
      Object.assign(config, {
        optimization
      })
    } else {
      config.plugins.push(
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      )
    }
  },
  //全局CSS预处理--less
  chainWebpack: config => {
    config.plugins.delete("prefetch")
    const types = ["vue-modules", "vue", "normal-modules", "normal"]
    types.forEach(type =>
      addStyleResource(config.module.rule("less").oneOf(type))
    )
    //eslint配置
    // config.module
    //   .rule("eslint")
    //   .use("eslint-loader")
    //   .loader("eslint-loader")
    //   .tap(options => {
    //     options.fix = true;
    //     return options;
    //   });
    // 图片压缩
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true,
        //压缩JPEG图像
        mozjpeg: {progressive: true, quality: 65},
        //压缩PNG图像
        optipng: {enabled: false},
        //压缩PNG图像
        pngquant: {quality: "65-90", speed: 4},
        //压缩GIF图像
        gifsicle: {interlaced: false}
      })
      .end()
  },
  css: {
    extract: true, //使用css分离插件
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}

//全局样式文件路径
function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/assets/css/cssCommon.less")]
    })
}

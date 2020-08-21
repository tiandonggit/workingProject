const path = require("path");
const vConsolePlugin = require("vconsole-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
//import httpConfig from "../../utils/httpConfig";
//const httpConfig = path.resolve(__dirname, "./src/utils/httpConfig.js");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/healthZSR",
  // publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  assetsDir: "static",
  outputDir: "nutrition_prescribe",
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  lintOnSave: false,
  // //服务
  devServer: {
    disableHostCheck: true,
    port: 8081,
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
      const plugins = [];
      // plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       warnings: false,
      //       compress: {
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ["console.log"] //移除console
      //       }
      //     },
      //     sourceMap: false,
      //     parallel: true
      //   })
      // );
      //gzip压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240, //超过10k就压缩
          minRatio: 0.8
        })
      );
      plugins.push(
        new BundleAnalyzerPlugin({
          //  可以是`server`，`static`或`disabled`。
          //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
          //  在“静态”模式下，会生成带有报告的单个HTML文件。
          //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
          // analyzerMode: "server",
          // //  将在“服务器”模式下使用的主机启动HTTP服务器。
          // analyzerHost: "127.0.0.1",
          // //  将在“服务器”模式下使用的端口启动HTTP服务器。
          analyzerPort: 8888,
          //  路径捆绑，将在`static`模式下生成的报告文件。
          //  相对于捆绑输出目录。
          reportFilename: "report.html",
          //  模块大小默认显示在报告中。
          //  应该是`stat`，`parsed`或者`gzip`中的一个。
          //  有关更多信息，请参见“定义”一节。
          defaultSizes: "parsed",
          //  在默认浏览器中自动打开报告
          openAnalyzer: true,
          //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
          generateStatsFile: false,
          //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
          //  相对于捆绑输出目录。
          statsFilename: "stats.json",
          //  stats.toJson（）方法的选项。
          //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
          //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
          statsOptions: null,
          logLevel: "info" // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
        })
      );
      config.plugins = [...config.plugins, ...plugins];
      config.plugins.push(
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      );
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
                )[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`;
              }
            }
          }
        }
      };
      Object.assign(config, {
        optimization
      });
    } else {
      config.plugins.push(
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      );
    }
  },
  //全局CSS预处理--less
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.optimization.minimize(true);
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("less").oneOf(type))
    );


    // 开发环境cdn配置 减少包体积
    if (process.env.NODE_ENV !== "production") {
      config.optimization.splitChunks({
        chunks: "all"
      });

      config.externals({
        vue: "Vue",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        vant: "vant"
      });

      const cdn = {
        css: ["//cdn.jsdelivr.net/npm/vant@2.0.5/lib/index.css"],
        js: [
          "//cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js",
          "//cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js",
          "//cdn.bootcss.com/vuex/3.0.1/vuex.min.js",
          "//cdn.jsdelivr.net/npm/vant@2.0.5/lib/vant.min.js"
        ]
      };

      // html中添加cdn
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
    }


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
    // config.module
    //   .rule("images")
    //   .use("image-webpack-loader")
    //   .loader("image-webpack-loader")
    //   .options({
    //     bypassOnDebug: true,
    //     //压缩JPEG图像
    //     mozjpeg: { progressive: true, quality: 65 },
    //     //压缩PNG图像
    //     optipng: { enabled: false },
    //     //压缩PNG图像
    //     pngquant: { quality: "65-90", speed: 4 },
    //     //压缩GIF图像
    //     gifsicle: { interlaced: false }
    //   })
    //   .end();
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

//全局样式文件路径
function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/assets/css/cssCommon.less")]
    });
}

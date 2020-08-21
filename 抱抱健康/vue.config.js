const path = require("path");
const vConsolePlugin = require("vconsole-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const WebpackBuildNotifierPlugin = require("webpack-build-notifier"); //编译提示器插件
const LazyCompilePlugin = require("lazy-compile-webpack-plugin");
const outputDir = "health";
const stats = {
  // fallback value for stats options when an option is not defined (has precedence over local webpack defaults)
  all: undefined,

  // Add asset Information
  assets: true,

  // Sort assets by a field
  // You can reverse the sort with `!field`.
  assetsSort: "chunks",

  // Add build date and time information
  builtAt: true,

  // Add information about cached (not built) modules
  cached: true,

  // Show cached assets (setting this to `false` only shows emitted files)
  cachedAssets: true,

  // Add children information
  children: false,

  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: false,

  // Add namedChunkGroups information
  chunkGroups: false,

  // Add built modules information to chunk information
  chunkModules: true,

  // Add the origins of chunks and chunk merging info
  chunkOrigins: true,

  // Sort the chunks by a field
  // You can reverse the sort with `!field`. Default is `id`.
  chunksSort: "field",

  // Context directory for request shortening

  // `webpack --colors` equivalent
  colors: true,

  // Display the distance from the entry point for each module
  depth: false,

  // Display the entry points with the corresponding bundles
  entrypoints: false,

  // Add --env information
  env: false,

  // Add errors
  errors: true,

  // Add details to errors (like resolving log)
  errorDetails: true,

  // Add the hash of the compilation
  hash: false,

  // Set the maximum number of modules to be shown
  maxModules: 15,

  // Add built modules information
  modules: false,

  // Sort the modules by a field
  // You can reverse the sort with `!field`. Default is `id`.
  modulesSort: "field",

  // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
  moduleTrace: true,

  // Show performance hint when file size exceeds `performance.maxAssetSize`
  performance: false,

  // Show the exports of the modules
  providedExports: false,

  // Add public path information
  publicPath: true,

  // Add information about the reasons why modules are included
  reasons: true,

  // Add the source code of modules
  source: false,

  // Add timing information
  timings: true,

  // Show which exports of a module are used
  usedExports: false,

  // Add webpack version information
  version: false,

  // Add warnings
  warnings: true
};
const Timestamp = new Date().getTime();
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/healthZSR",
  // publicPath: "./",
  assetsDir: "static",
  outputDir: outputDir,
  lintOnSave: false, // 是否开启编译时是否不符合eslint提示
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    compress: true,
    disableHostCheck: true,
    stats: stats,
    port: 8081,
    https: false,
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
      //       cache: true,
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
      // gzip压缩
      // plugins.push(
      //   new CompressionWebpackPlugin({
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: productionGzipExtensions,
      //     threshold: 10240,//超过10k就压缩
      //     minRatio: 0.8
      //   })
      // );
      //
      // config.plugins = [
      //   ...config.plugins,
      //   ...plugins
      // ];
      //
      // //优化打包chunk-vendors.js文件体积过大
      // let optimization = {
      //   runtimeChunk: 'single',
      //   splitChunks: {
      //     chunks: 'all',
      //     maxInitialRequests: Infinity,
      //     minSize: 20480, // 依赖包超过20000bit将被单独打包
      //     cacheGroups: {
      //       vendor: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name(module) {
      //           // get the name. E.g. node_modules/packageName/not/this/part.js
      //           // or node_modules/packageName
      //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
      //           // npm package names are URL-safe, but some servers don't like @ symbols
      //           return `npm.${packageName.replace('@', '')}`;
      //         }
      //       }
      //     }
      //   }
      // };
      // Object.assign(config, {
      //   optimization
      // });

      config.plugins.push(
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      );
    } else {
      // config.plugins.push(
      //   new WebpackBuildNotifierPlugin({
      //     title: "编译提示器",
      //     logo: path.resolve("./img/favicon.png"),
      //     suppressSuccess: true
      //   })
      //   // new LazyCompilePlugin()
      // );

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
        css: ["//cdn.jsdelivr.net/npm/vant@2.4.0/lib/index.css"],
        js: [
          "//cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js",
          "//cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js",
          "//cdn.bootcss.com/vuex/3.0.1/vuex.min.js",
          "//cdn.jsdelivr.net/npm/vant@2.4.0/lib/vant.min.js"
        ]
      };

      // html中添加cdn
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
    }
  },
  css: {
    extract: true, //使用css分离插件
    sourceMap: false,
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
  // configureWebpack: {
  //   output: {
  //     // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
  //     chunkFilename: `static/js/[name].[hash].${Timestamp}.js`,
  //     filename: `static/js/[name].[hash].${Timestamp}.js`,
  //   }
  // }
};

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/assets/css/cssCommon.less")]
    });
}

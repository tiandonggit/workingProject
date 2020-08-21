const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/yhz_zzbl_pc",
  assetsDir: "static",
  outputDir: 'yhz_zzbl_pc',
  lintOnSave: false, // 是否开启编译时是否不符合eslint提示
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    compress: true,
    disableHostCheck: true,
    port: 5566,
    https: false,
    // proxy: {
    //   // "/": {
    //   //   target: "https://yzh.quickhealmall.com/api",
    //   //   ws: false,
    //   //   changeOrigin: true,
    //   //   secure: false,
    //   //   pathRewrite: {
    //   //     "^/": ""
    //   //   }
    //   // }
    // }
  },
  configureWebpack: config => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    );
    if (process.env.NODE_ENV === "production") {
      const plugins = [];
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            cache: true,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']//移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      // gzip压缩
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

    }
  },
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.optimization.minimize(true);
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("less").oneOf(type))
    );

    // 开发环境cdn配置 减少包体积
    // if (process.env.NODE_ENV !== "production") {
    //   config.optimization.splitChunks({
    //     chunks: "all"
    //   });
    //
    //   config.externals({
    //     vue: "Vue",
    //     vuex: "Vuex",
    //     "vue-router": "VueRouter",
    //     "element-ui": "ElementUI"
    //   });
    //
    //   const cdn = {
    //     css: ["//unpkg.com/element-ui/lib/theme-chalk/index.css"],
    //     js: [
    //       "//cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js",
    //       "//cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js",
    //       "//cdn.bootcss.com/vuex/3.1.2/vuex.min.js",
    //       "//cdn.bootcss.com/element-ui/2.13.0/index.js"
    //     ]
    //   };
    //
    //   // html中添加cdn
    //   config.plugin("html").tap(args => {
    //     args[0].cdn = cdn;
    //     return args;
    //   });
    // }
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
    sourceMap: false,
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
      patterns: [path.resolve(__dirname, "./src/assets/style/cssCommon.less")]
    });
}

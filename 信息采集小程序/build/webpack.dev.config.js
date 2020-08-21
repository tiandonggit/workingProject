const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const autoprefixer = require('autoprefixer')
const ip = require('ip').address();
const {VueLoaderPlugin} = require('vue-loader')
const postcss = require('../postcss.config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{from: /.*/, to: '/index.html'}],
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: ip,
    port: +process.env.PORT || 8080,
    open: true, // 自动打开浏览器
    overlay: {warnings: false, errors: true}, // 展示全屏报错
    publicPath: '/',
    proxy: {},
    quiet: true, // for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [{
        loader: 'vue-style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: postcss.plugins,
          // plugins: [
          //   autoprefixer,
          // ],
        }
      }, {
        loader: 'less-loader',
      },
      {
        loader: 'style-resources-loader',
        options: {
          // 全局样式文件路径
          patterns: path.resolve(__dirname, '../src/assets/css/cssCommon.less')
        }
      }
      ],
    }],
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // 开启 HMR 的时候使用该插件会显示模块的相对路径
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
  ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = +process.env.PORT || 8080
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`辽宁医汇智--应用程序正在运行: http://${ip}:${port}`],
        },
        onErrors: undefined,
      }))

      resolve(devWebpackConfig)
    }
  })
})

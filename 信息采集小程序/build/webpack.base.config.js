const path = require('path')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
var vConsolePlugin = require('vconsole-webpack-plugin');
const httpConfig = require('../src/utils/httpConfig')
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: path.resolve(__dirname, '../src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    filename: '[name].js',
    publicPath: './',

  },
  module: {
    rules: [
      // eslint
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [path.resolve(__dirname, '../src')],
      //   options: {
      //     formatter: eslintFriendlyFormatter,
      //     emitWarning: true,
      //     fix: true
      //   },
      // },
      // vue
      {
        test: /\.vue$/,
        use: [{
          loader: 'thread-loader',
        }, {
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false,
            },
          },
        }],
      },
      // ts
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'thread-loader',
        }, {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }, {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            happyPackMode: true,
          },
        }],
      },
      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')],
      },
      // img res
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          imit: 100 * 1024,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]'),
        },
      },
      // media res
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'media/[name].[hash:7].[ext]'),
        },
      },
      // font res
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  plugins: [
    new vConsolePlugin({
        filter: [],  // 需要过滤的入口文件
        enable: httpConfig.VDebug // 发布代码前记得改回 false
    }),
],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
    },
  },
  node: {
    // 避免 webpack 注入不必要的 setImmediate polyfill 因为 Vue 已经将其包含在内
    setImmediate: false,
  },
}

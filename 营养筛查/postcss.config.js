module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport": {
      viewportWidth: 375,
      unitPrecision: 3, //指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位
      viewportUnit: "vw", //指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [
        //指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
        ".ignore",
        ".hairlines",
        "van-icon",
        "van-radio",
        "van-checkbox"
      ],
      mediaQuery: true // 允许在媒体查询中转换`px`
    }
  }
};

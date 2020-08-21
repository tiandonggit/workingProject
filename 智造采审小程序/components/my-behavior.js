// module.exports = Behavior({
//   behaviors: [],
//   properties: {
//     myBehaviorProperty2: {
//       type: String
//     }
//   },
//   data: {
//     myBehaviorData2: '这是myBehavior2内的数据'
//   },
//   attached: function () { },
//   methods: {
//     myBehaviorMethod2: function () {
//       console.log('这是执行myBehavior内引入的myBehavior2中的方法')
//       this.setData({
//         myBehaviorData2:"1111111111111111111"
//     });
//     }
//   }
// })

let SmallFourBeh = Behavior({
  properties: {
    name: String,
    type: String
  },
    data: {
    myBehaviorData2: '这是myBehavior2内的数据',
    stateBack:0, // 1 本页列表搜索返回到本页列表，0 返回上一页
  },
    methods: {
      stateBackOne: function () {
        console.log("stateBackOne")
      this.setData({
        stateBack:1
    });
    console.log("修改后"+this.data.stateBack)
  },
    stateBackZero: function () {
      console.log("stateBackZero")
      this.setData({
        stateBack:0
    });
    }
  }
})
export { SmallFourBeh }

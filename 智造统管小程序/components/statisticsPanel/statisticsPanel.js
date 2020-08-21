// 首页面板组件
Component({
  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached: function () {
      console.log('attached emit')
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    shaicha:{
      type:Object,
      value: {
        shaichashu:'0',
        shaichakaidanshu: '0',
        goumailv: '0',
        goumaidanshu: '0',
        zongyingxiaoe: '0',
      }
    },
    yingyangtuijian:{
      type:Object,
      value:{
        tuijianshu:'0',
        goumailv: '0',
        goumaidanshu:'0',
        zongyingxiaoe: '0',
      }
    },
    tuijianchanpin: {
      type: Object,
      value: {
        kaidanshu: '0',
        goumailv: '0',
        goumaidanshu: '0',
        zongyingxiaoe: '0',
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

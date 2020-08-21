// components/titleBar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar:"",
    CustomBar:"", //头部导航高度
    headerH:"",//胶囊布局信息
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: [Boolean, String],
      default: false// true 开启渐变样式   false  关闭渐变样式，纯色样式
    }, 
    isBack: {
      type: [Boolean, String],
      default: false   //true开启左侧返回
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log("attached");
      //重置返回状态
    
      var that = this;

  wx.getSystemInfo({
    success: e => {
      let headerH = wx.getMenuButtonBoundingClientRect()
      if(headerH){
        console.log("计算手机导航栏高度"+ e.statusBarHeight)
        console.log(typeof headerH)
        console.log('胶囊布局信息：' + JSON.stringify(headerH))
that.setData({
StatusBar: e.statusBarHeight,
CustomBar:headerH.bottom +headerH.top - e.statusBarHeight+2,
headerH:wx.getMenuButtonBoundingClientRect()
});
      }else{
        that.setData({
          CustomBar:e.statusBarHeight + 52
        });
      }
    },
  })
    },
  },

  methods: {
    /**
         * 左侧返回
         */
        _isBack(e){
          // wx.navigateBack({
          //   delta: 1
          // });
          wx.redirectTo({
            url: "../registerIndex/registerIndex"
          })



          console.log("_isBack");
         
           let detail=0;
          let myEventOption = {
            bubbles: false, //事件是否冒泡
            composed: false, //事件是否可以穿越组件边界
            capturePhase: false //事件是否拥有捕获阶段
        } // 触发事件的选项
         this.triggerEvent('isBack', detail, myEventOption)
        },
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
     
})
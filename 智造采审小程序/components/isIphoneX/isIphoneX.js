// components/isIphoneX/isIphoneX.js
Component({
  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached: function() {
      var that = this;
      //iphonrx 适配
      wx.getSystemInfo({      
        success: function(res) {
          console.log(res.model);           
          if (res.model === 'iPhone X') {
            console.log("45654");                
            that.setData({                        
              isIphoneX: true                  
            })           
          } else {
            console.log("1111111111111"); 
            that.setData({                  
              isIphoneX: false                  
            })
          }      
        }
      })
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    pension: {
      type: [Boolean, String],
      default: false //true 开启底部悬浮   false关闭悬浮
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: false, //iphoneX适配
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
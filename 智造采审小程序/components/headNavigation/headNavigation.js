// components/component-tag-name.js
const app = getApp()
Component({
  /**
   * 组件所在页面生命周期
   */
  pageLifetimes: {
    /**
     * 组件的属性列表
     */
    show() {

      // 页面被展示
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "",
    },
    select: {
      type: String || Number,
      value: 0
    },
    data: {
      type: Array,
      value: [],
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    },
    bg: {
      type: String,
      value: "#FFFFFF"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 头部导航栏的高度
    statusBarHeight: app.globalData.statusBarHeight,
    left: 0,
    width: 0
  },
  ready() {
    console.log(this.data.statusBarHeight)
    if (this.data.title) return;
    //设置底下线的状态
    var that = this
    const query = wx.createSelectorQuery().in(that)
    query.select(".select").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      that.setData({
        width: res[0].width
      });
      that.setData({
        left: res[0].left
      });
    })
  },
  /**
   * 监听数据字段的变化
   */
  observers: {
    select(val) {
      if (this.data.title) return;
      //监听状态值改变样式进行改变
      var that = this;
      let query = wx.createSelectorQuery().in(that);
      query.select("#label" + that.data.select).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function(res) {
        //设置底下线的状态
        that.setData({
          width: res[0].width,
          left: res[0].left
        });
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    select(e) {
      var that = this;
      //点击选项事件
      if (!e.target.id || e.target.id == "label" + that.data.select) return;
      that.setData({
        select: e.target.id.slice(5)
      });
      var myEventDetail = {
        select: that.data.select
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('select', myEventDetail, myEventOption)
    },
    backHome: function() {
      wx.reLaunch({
        url: '../index/index',
      })
    },
    back() {
      console.log("点击返回")
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
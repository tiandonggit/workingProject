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
    data: {
      type: Array,
      value: [],
    },
    select: {
      type: String || Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 0,
    left: 0
  },
  ready() {
    var that = this
    const query = wx.createSelectorQuery().in(that)
    query.select(".select").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function (res) {
      // console.log('打印demo的元素的信息', res);
      //设置选中背景的状态
      that.setData({ width: res[0].width+32 });
      that.setData({ left: res[0].left});
    })
  },
  /**
   * 监听数据字段的变化
   */
  observers: {
    select(val) {
        // console.log(val);
        var that = this;
        let query = wx.createSelectorQuery().in(that);
        query.select("#label" + that.data.select).boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function (res) {
          //设置底下线的状态
          that.setData({
            width: res[0].width + 32,
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
      if (!e.target.id || e.target.id == "label"+that.data.select) return;
      that.setData({
        select: e.target.id.slice(5)
      });
      var myEventDetail = { select: that.data.select } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('select', myEventDetail, myEventOption)
    }
  }
})

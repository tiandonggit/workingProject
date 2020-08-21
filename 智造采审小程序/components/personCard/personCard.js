// components/personCard/personCard.js
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
      value: []
    },
    height: {
      type: Number || String,
      value: 0
    },
    isLoading: { //是否正在加载
      type: Boolean,
      value: false
    },
    loadMore: { //是否启动滚动加载
      type: Boolean,
      value: true
    },
    isShowNoMoreGoods: { //是否显示没有更多了
      type: Boolean,
      value: false
    },
    label: {
      type: Number || String,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 监听数据字段的变化
   */
  observers: {
    isLoading(val) {
      console.log(val);
    }
  },
  ready() {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    select(e) {
      // console.log("点击了选项", e.currentTarget);
      var myEventDetail = {
        select: e.currentTarget.id
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('select', myEventDetail, myEventOption)

    },
    //滚动到底部触发
    scrollToLower: function (event) {
      var that = this;
      console.log(event);
      if (that.data.loadMore) {
        // that.loadMoreGoods();
        //触发加载方法
        var myEventDetail = { select: that.data.select } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('selectPageModel', myEventDetail, myEventOption)
      } else {
        that.setData({
          isShowNoMoreGoods: true,//显示没有更多数据
        })
        console.log("没有更多的数据了");
      }
    },
    scroll(e) {
      var that = this;
      // console.log("滚动", e); 
      if (e.detail.scrollTop <= 10) {
        //开启下拉刷新
        if (that.data.scrollDown) return
        
        that.setData({
          scrollDown: true
        });
        console.log("scrollDown设置为true", that.data.scrollDown);
      } else {
        if (!that.data.scrollDown) return
        
        that.setData({
          scrollDown: false
        });
        console.log("scrollDown设置为false", that.data.scrollDown);
      }
      if (e.detail.scrollHeight - e.detail.scrollTop - that.data.height * that.data.rpx <= 10) { //滚动的高度
        //开启下拉刷新
        if (that.data.scrollTop) return
        
        that.setData({
          scrollTop: true
        });
        console.log("scrollTop设置为true", that.data.scrollDown);
      } else {
        if (!that.data.scrollTop) return
        
        that.setData({
          scrollTop: false
        });
        console.log("scrollTop设置为false", that.data.scrollDown);
      }
      // 

    },
    touchmove: function(e) { //开始拖拽  
      var that = this;
      // console.log(that.data.pullDowms)
      if (that.data.pullDowms == false || (that.data.scrollDown || that.data.scrollTop)) return;
      var num = that.data.num
      var touchDotY = that.data.touchDotY
      var rpx = that.data.rpx;
      // console.log(that.data.num);
      if (num === 0) {
        //第一次拖拽的话将y轴坐标放进去
        // console.log("第一次",e.touches[0].pageY);
        that.setData({
          touchDotY: e.touches[0].pageY
        });
        num++
        that.setData({
          num: num
        });
      } else {
        if (e.touches[0].pageY > touchDotY && (e.touches[0].pageY - touchDotY) / rpx < 100) {
          console.log((e.touches[0].pageY - touchDotY) / rpx - 100);
          // if (that.data.pullDowm) return;
          that.setData({
            pullDowmText: "下拉即可刷新...",
            pullDowm: true,
            nature: "transition-duration: 0ms; transform: translate3d(0px, " + ((e.touches[0].pageY - touchDotY) / rpx - 100).toString() + "rpx, 0px);"
          })
        } else if (e.touches[0].pageY > touchDotY && (e.touches[0].pageY - touchDotY) / rpx >= 100) {
          // if (!that.data.pullDowm) return;
          that.setData({
            nature: "transition-duration: 0ms; transform: translate3d(0px, " + ((e.touches[0].pageY - touchDotY) / rpx / 5).toString() + "rpx, 0px);",
            pullDowmText: "释放即可刷新...",
            pullDowm: false
          })
        }

      }
     
    },
    // 触摸结束事件
    touchEnd: function(e) {
      // console.log("jieshule");
      var that = this;
      if (that.data.pullDowms == false) return;

      // console.log(that.data.pullDowm);
      if (that.data.pullDowm) {
        that.setData({
          pullDowmText: "下拉即可刷新...",
          nature: "transition-duration: 300ms; transform: translate3d(0px, -100rpx, 0px);",
          num: 0,
          touchDotY: 0
        })
      } else {
        that.setData({
          pullDowmText: "加载中",
          nature: "transition-duration: 0ms; transform: translate3d(0px, 0rpx, 0px);",
          num: 0,
          touchDotY: 0,
        })
        var myEventDetail = {} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('touchDown', myEventDetail, myEventOption);
      }


    }
  }
})
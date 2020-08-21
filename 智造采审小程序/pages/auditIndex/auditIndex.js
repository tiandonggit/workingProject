// pages/auditIndex/auditIndex.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js"
// import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    userType: null, //用户的权限 
    // id: 3,//用户id
    // userType: 0, //用户的权限0:产品专员 1：运营商 2：医助
    statusBarHeight: app.globalData.statusBarHeight, // 头部导航栏的高度
    select: 0, //自定义标题选中哪个
    label: 0, //医助或运营商选中那个
    labels: [ //选项卡
      "运营商",
      "医助"
    ],
    title: [ //自定义标题选项
      "待审核",
      "已审核"
    ],
    objData: [ //卡片数据
      // {
      //   cityid: "373822400996970497",
      //   createtime: "2020-03-21 09:37",
      //   id: "1",
      //   img: "tutututututu",
      //   name: "businesser1",
      //   phone: "15771859205",
      //   provid: "372910274732232705",
      //   referencename: "reference1",
      //   uuid: ""
      // },
      // {
      //   cityid: "373822400996970497",
      //   createtime: "2020-03-21 09:38",
      //   id: "2",
      //   img: "",
      //   name: "businesser2",
      //   phone: "15771859205",
      //   provid: "372910274732232705",
      //   referencename: "reference2",
      //   uuid: "ef9bed6edacc4e55a914a50cb7ca969c"
      // }
    ],
    page: 1, //分页请求第几页
    limit: 15, //每页请求几条数据
    valueName: "", //搜索的姓名
    loadMore: true, //是否启动滚动加载
    isLoading: false, //是否正在加载
    isShowNoMoreGoods: false, //是否显示没有更多了
    height: 0 //卡片默认高度,需要传递显示区域高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("用户信息", app.globalData);
    this.setData({
      id: app.globalData.id,
      // id: 3,
      userType: app.globalData.userType
    })
    //获取待审核
    if (this.data.userType == 1) {
      this.setData({
        label: 1
      });
    }
    
    this.selectPageModel(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 750;
      },
    })
    var that = this;
    // console.log("ready");
    const query = wx.createSelectorQuery()
    query.select(".main_scroll").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      console.log(res[0].height);
      that.setData({
        height: res[0].height / rpx
      })
      //设置滚动区域的高度
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉触底");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 用户点击切换标签卡
   */
  onSelect(e) {
    console.log(e.detail, "点击返回的");
    var that = this;

    if(that.data.userType == 1) {
      this.setData({
        objData: [],
        valueName: "",
        select: e.detail.select,
        label: 1
      });
    } else {
      this.setData({
        objData: [],
        valueName: "",
        select: e.detail.select,
        label: 0
      });
    }
    
    this.selectPageModel(1);
  },

  /**
   * 搜索栏清空调用方法
   */
  onClear() {
    var that = this;
    that.setData({
      valueName: ""
    })
    this.selectPageModel(1);
  },
  /**
   * 搜索列表
   */
  selectPageModel(page) {
    var that = this;
    var url =
      that.data.userType == 0 //权限产品专员
      ?
      that.data.select == 0 //选中的是待审核的话
      ?
      that.data.label == 0 //判断选中的是运营商的话
      ?
      "/RBusinessProviderController/selectPageModel" //产品专员的待审核的运营商列表
      :
      "/RAssistantController/selectPageModel" //产品专员的待审核的医助列表(不是运营商)
      :
      that.data.label == 0 //是已审核判断选中的是运营商的话
      ?
      "/RBusinessProviderController/selectApprovedPageModel" //产品专员的已审核的运营商列表
      :
      "/RAssistantController/selectApprovedPageModel" //产品专员的已审核的医助列表
      :
      that.data.select == 0 //权限运营商 判断是待审核么
      ?
      "/RAssistantController/selectPageModelByProvider" //是待审核的话 运营商的未审核的医助列表
      :
      "/RAssistantController/selectApprovedPageModelByProvider" //不是待审核的话 运营商的已审核的医助列表
    if (page == 1) {
      that.setData({
        page: 1,
        loadMore: true,
        isLoading: false,
        isShowNoMoreGoods: false
      });
    }
    var data = {
      page: that.data.page,
      limit: that.data.limit
    };
    //判断是什么身份
    if (that.data.userType == 0) {
      data.productId = that.data.id;
    } else {
      data.providerId = that.data.id;
    }
    if (that.data.valueName) {
      if (that.data.label == 0) {
        data.providerName = that.data.valueName;
      } else {
        data.assistantName = that.data.valueName;
      }
    }

    //显示正在加载动画
    // that.setData({
    //   isLoading: true,
    // })
    
    fly.request({
        method: 'GET',
        url: httpConfig.serviceHost + url,
        // url: "http://192.168.1.161:82/yhz_collect/" + url,
        body: data
      })
      .then((res) => {
        console.log("刷新了",res);
        if (that.data.page == 1) {
          //第一页
          that.setData({
            objData: res.data.data,
            loadMore: false, //不启用滚动加载
            isLoading: false, //结束加载动画
          })
        } else if (res.data.data.length == 0 && that.data.page != 1) {
          that.setData({
            loadMore: false, //不启用滚动加载
            isLoading: false, //结束加载动画
            isShowNoMoreGoods: true, //显示没有更多数据
          })
        } else if (res.data.data.length > 0 && res.data.data.length < that.data.limit) {
          that.setData({
            objData: that.data.objData.concat(res.data.data),
            page: that.data.page + 1,
            loadMore: false,
            isLoading: false,
            isShowNoMoreGoods: true, //显示没有更多数据
          })
        } else if (res.data.data.length >= that.data.limit) {
          that.setData({
            objData: that.data.objData.concat(res.data.data),
            page: that.data.page + 1,
            loadMore: true,
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        // Toast(error);
        console.log(error);
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
      })
  },

  /**
   * 用户点击标签卡
   */
  onSelectLabel(e) {
    this.setData({})
    console.log(e.detail, "点击返回的");
    // console.log(this.data.select, "页面保存的值");
    this.setData({
      objData: [],
      label: e.detail.select,
      valueName: ""
    })
    this.selectPageModel(1);
  },

  /**
   * 用户点击搜索
   */
  onSearch(e) {
    this.setData({
      objData: [],
      valueName: this.selectName
    })
    console.log(e.detail, "搜索返回的");
    this.setData({
      valueName: e.detail
    })
    this.selectPageModel(1);
    // console.log(this.data.select, "页面保存的值");
  },

  /**
   * 搜索栏值变化
   */
  onChange(e) {
    var that = this;
    var str;
    str = e.detail.replace(/[^\u4E00-\u9FA5]/g, '');
    str
    that.setData({ selectName: str});
  },

  /**
   * 用户点击卡片
   */
  onSelectCard(e) {
    console.log(e.detail, "点击返回的");
    // console.log(this.data.select, "页面保存的值");
    //跳转信息详情页
    wx.navigateTo({
      url: "../detailsPage/detailsPage?type=" + this.data.select + "&label=" + this.data.label + "&id=" + e.detail.select
    })
  }

})
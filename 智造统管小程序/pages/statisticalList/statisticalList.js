// pages/statisticalList/statisticalList.js
import {
  serviceBBJKHost
} from "../../utils/httpConfig.js";
import fly from "./../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0, //页面高度
    type: 1, //页面类型: 1:智能柜 2:经验套餐方案 3:康复方案 4:消息详情
    id: "", //医生id
    topText: "", //顶部描述信息
    bottomText: "", //底部描述信息
    apiText: "", //接口名称
    doctorInfo: {}, //医生信息
    mainList: [
      //   {
      //   id: 1
      // }, {
      //   id: 2
      // }, {
      //   id: 3
      // }, {
      //   id: 4
      // }, {
      //   id: 5
      // }, {
      //   id: 6
      // }
    ], //智能柜列表
    patientMain: {}, //筛查的患者信息
    productList: [
      //   {
      //   "specificationId": "458453866518812714",
      //   "kcal": "",
      //   "quantity": 1,
      //   "goodsId": "458453786684430377",
      //   "jiage": "1",
      //   "bili": "",
      //   "topImg": "http://pfks-oss-center.oss-cn-beijing.aliyuncs.com/6D2E7F3520F641A786B2C49311C62456.image/jpeg",
      //   "productStore": "24",
      //   "productName": "多维牛磺酸饮品",
      //   "specificationName": "100ml/袋"
      // }
    ], //推荐产品列表
    mainListLength: 0,
    limit: 20, //默认每页查询数量
    page: 1, //当前页数
    lastPage: false,
    // 历史开单数据
    activeName: "6",
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setScrollHeight();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 初始化
   */
  init(options) {
    let that = this;
    that.setData({
      type: options.type ? options.type : "4",
    })
    //根据页面类型显示不同的标题
    let title = "";
    let topText = "";
    let bottomText = "";
    let apiText = "";
    switch (that.data.type) {
      case "1":
        title = "智能柜";
        topText = "已绑定智能柜";
        bottomText = "医生暂未绑定智能柜";
        apiText = "Device";
        break;
      case "2":
        title = "经验套餐方案";
        topText = "经验套餐方案";
        bottomText = "医生暂无经验套餐方案";
        apiText = "Jingyan";
        break;
      case "3":
        title = "康复任务";
        topText = "康复任务";
        bottomText = "医生暂无康复任务模板";
        apiText = "Kangfu"
        break;
      case "4":
        title = "消息详情";
        topText = "筛查信息";
        break;
      case "6":
        title = "历史开单";
        break;
      case "7":
        title = "历史开单"
        break;
      case "8":
        title = "历史开单";
        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    let doctorInfo = wx.getStorageSync("doctor");
    //将当前登录人信息存入至data中
    that.setData({
      topText: topText,
      bottomText: bottomText,
      doctorInfo: doctorInfo,
      id: doctorInfo.id,
      apiText: apiText
    })

    that.getBaseMain();

  },

  /**
   * 设置滚动部分页面高度
   */
  setScrollHeight() {
    let rpx;
    let that = this;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 750;
      },
    })
    const query = wx.createSelectorQuery()
    query.select(".body").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function (res) {
      that.setData({
        scrollHeight: res[0].height / rpx
      })
      //设置滚动区域的高度
    })
  },

  /**
   * 监听滚动到底部
   */
  scrolltolower(e) {
    console.log("滚动到底部", e);
    if (!this.data.lastPage && this.data.type < 4) {
      this.getMainList();
    }else if(!this.data.lastPage && this.data.type >=6 ) {
      this.getOrderList(this.data.type);
    }
  },

  /**
   * 公众数据获取
   */
  getBaseMain() {
    if (this.data.type == "4") {
      this.getPatientMainAndProductList();
    } else if (this.data.type == "6" || this.data.type == "7" || this.data.type == "8") {
      console.log("历史开单：", this.data.type);
      this.setData({
        activeName: this.data.type
      })
      this.getOrderList(this.data.type);
      if (this.data.type == "7") {
        this.setData({
          orderList: []
        })
      }
    } else {
      this.getMainList();
    }
  },

  /**
   * 获取列表信息
   */
  getMainList() {
    let that = this;
    fly.request({
        method: 'GET',
        url: '/RDoctorDeviceController/select' + that.data.apiText,
        body: {
          id: that.data.id,
          page: that.data.page,
          limit: that.data.limit
        },
        headers: {
          // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
        }
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {

          //存入相应信息
          if (res.data.data) {
            let list = that.data.mainList;
            let page = that.data.page;
            list = list.concat(res.data.data.list);
            page++;
            that.setData({
              mainList: list,
              page: page,
              mainListLength: res.data.data.total
            });
            if (that.data.mainList.length == res.data.data.total) {
              that.setData({
                lastPage: true
              });
            }
          } else {
            console.log("无相关统计信息");
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch((error) => {
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
        console.log(error)
      })
  },

  /**
   * 查询消息详情
   */
  getPatientMainAndProductList() {
    let that = this;
    fly.request({
        method: 'GET',
        url: '/NNutritionPrescribePatientController/selectPatientKey',
        body: {
          id: that.data.id
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {

          //存入相应信息
          if (res.data.data) {
            that.setData({
              patientMain: res.data.data,
              productList: res.data.data.goods
            });
          } else {
            console.log("无相关统计信息");
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch((error) => {
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
        console.log(error)
      })
  },

  // 历史开单数
  onChangeTab(event) {
    this.setData({
      page: 1,
      lastPage: false,
      orderList: [],
      type: event.currentTarget.dataset.num
    })
    this.getOrderList(this.data.type);

  },

  // 获取历史开单数
  getOrderList(type) {
    let url = "";
    let params = {
      page: this.data.page,
      limit: this.data.limit,
      doctorid: this.data.id,
    }
    if (type == '8') {
      url = "/ROrderController/selectPageZyOrder";
    } else {
      url = "/ROrderController/selectPageOrder";
      params.ordersource = type == '6' ? 1 : type == '7' ? 2 : ""
    }
    console.log('params: ', params);
    let that = this;
    fly.request({
        method: 'GET',
        url: url,
        body: params,
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {

          //存入相应信息
          if (res.data.data) {
            let list = that.data.orderList;
            let page = that.data.page;
            list = list.concat(res.data.data);
            page++;
            that.setData({
              orderList: list,
              page: page,
              mainListLength: res.data.total
            });
            if (that.data.orderList.length == res.data.total) {
              that.setData({
                lastPage: true
              });
            }
            console.log('lastPage: ', this.data.lastPage);
          } else {
            console.log("无相关统计信息");
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch((error) => {
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
        console.log(error)
      })
  }

})
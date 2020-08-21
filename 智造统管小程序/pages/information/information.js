// pages/information/information.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "./../../utils/request.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面高度整体:
    height: '',
    //消息数量:
    num: 0,
    //显示条数:
    num_show: 0,
    //消息列表:
    list: [],
    //每页显示的行数：
    limit: 10,
    //页码（从1开始）：
    page: 1,
    //用于数组的追加和暂存:
    allProject: [],
    //当前用户id:
    id: "",
  },

  //触底加载
  scrolltolower(e) {
    console.log("滚动到底部", e);
    if (this.data.num == this.data.num_show) {
      return false;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    that.setData({
      page: that.data.page + 1
    })
    // getproinfo(this.data.pagesize, this.data.p, that);
    this.selectInfo();
    wx.hideLoading();
  },
  //跳转至消息详情
  statistics(key) {
    if (key.currentTarget.dataset['type'] == "5") {
      return false;
    }
    let item = this.data.list[key.currentTarget.dataset['index']];
    let doctorInfo = {
      id: item.id,
      name: item.name,
      phone: item.phone,
      vxheadurl: item.vxurl,
      hospitalname: item.hospitalname,
      dictext: item.zhicheng,
      depname: item.keshi
    };
    wx.setStorageSync("doctor", doctorInfo)
    wx.navigateTo({
      url: '../statisticalList/statisticalList?type=4',
    })
  },
  //查询消息
  selectInfo() {
    var that = this;
    fly.request({
        method: 'GET',
        url: 'RDoctorController/tongzhi',
        body: {
          id: this.data.id,
          limit: this.data.limit,
          page: this.data.page
          // id: "516591830100480015"
        }
      })
      .then((res) => {
        var resData = res.data.data;
        var resLength = res.data.data.length;
        //循环将结果集追加到数组后面
        for (var i = 0; i < resLength; i++) {
          that.data.allProject.push(resData[i]);
        }
        that.setData({
          list: that.data.allProject,
          num: res.data.total,
          num_show: that.data.num_show + res.data.data.length
        });
      })
      .catch((error) => {
        console.log('查询失败,', error);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      id: wx.getStorageSync("userid")
    })
    this.selectInfo()
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

  }
})
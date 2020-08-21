// pages/PermissionApplicationSuccess/PermissionApplicationSuccess.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: "医助"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userType == 3) {
      this.setData({
        userType: "总管理员"
      });
    }else if (app.globalData.userType == 1) {
      this.setData({
        userType: "运营商"
      });
    }else if (app.globalData.userType == 0) {
      this.setData({
        userType: "产品专员"
      });
    }
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

  },

  //跳转另一个小程序
  login() {
    console.log("login");
    wx.navigateToMiniProgram({
      appId: "wx5fef7d079d816927",//要打开的小程序 appId
      path: "pages/index/index",//打开的页面路径，如果为空则打开首页
      extraData: {
        foo: "bar"//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据
      },
      //envVersion: 'develop',    //开发版
      //envVersion: 'trial',          //体验版
      // envVersion: 'release',     //正式版
      envVersion: "release", //要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
      success(res) {
        console.log("跳转成功");
        // wx.showLoading({
        //   title: '加载中',
        //   mask: true
        // })
      },
      fail(res) {
        console.log("跳转失败");
        console.log(res);
      }
    });
  }
});

// pages/PermissionApplication/PermissionApplication.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js"
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getUserInfo();
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
    this.getUserInfo();
   console.log("onShow")

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
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
  getUserInfo: function() {
    //已经授权，可以直接调用 getUserInfo 获取头像昵称
    var that = this;
    wx.getUserInfo({
      success: function(resData) {
            wx.login({
                success: res => {
                  if (res.code) {
                    console.log("---------------"+res.code)
            //  console.log("getuserinfo", res);
        var codeData = resData;
        //验证用户code是否过期(不用)
        //that.checkSession()
        //发起网络请求获取用户权限
        that.askForLogin(res.code,codeData);
                  }
                }
              })
      },
      fail: function(err) {
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 2000
        })
        console.log(err);
      }
    });
  },
   //验证用户身份
   askForLogin(code,codeData) {
     console.log(code)
    console.log("askForLogin")
    //发起网络请求获取用户权限
    var that = this;
    wx.request({
      method: 'POST',
      header: {
        "content-type":"application/x-www-form-urlencoded"
      },
      url: httpConfig.serviceHost + '/RUnionidBindUserController/askForLogin',
      data: {
        code: code,
        iv:codeData.iv,
        encryptedData: codeData.encryptedData
      },
      success(res) {
        // console.log(res.data);
        if (res.data.success) {
          console.log(res.data.data.page)//用户权限信息
          console.log("用户权限信息", res.data.data); //用户权限信息
          // app.globalData.avatarUrl = res.data.data.avatarUrl;
          // app.globalData.openId = res.data.data.openId;
          // app.globalData.page = res.data.data.page;
          // app.globalData.id = res.data.data.id;
          // app.globalData.unionid = res.data.data.unionid;
          // app.globalData.userType = res.data.data.userType !== undefined ? res.data.data.userType : null;
          if (res.data.data.page == 0) {
            console.log("未注册,跳转到注册页面2")
            app.globalData.openId = res.data.data.openId;
            app.globalData.unionid = res.data.data.unionid;
            app.globalData.avatarUrl = res.data.data.avatarUrl;
            //未注册,跳转到注册页面
            wx.reLaunch({
              url: '/pages/registerIndex/registerIndex'
            })
          } else if (res.data.data.page == 1) {
            console.log("待审核,跳转到待审核页面")
            //待审核,跳转到待审核页面
            
          } else if (res.data.data.page == 4) {
            console.log("医助,跳转到医助展示的页面")
            app.globalData.id = res.data.data.id;
            // app.globalData.unionid = res.data.data.unionid;
            app.globalData.userType = res.data.data.userType !== undefined ? res.data.data.userType : null;
            //医助,跳转到医助展示的页面
            wx.reLaunch({
              url: '/pages/PermissionApplicationSuccess/PermissionApplicationSuccess'
            })
          } else if (res.data.data.page == 2 || 3) {
            console.log("跳转到产品专员和运营商首页")
            app.globalData.id = res.data.data.id;
            // app.globalData.unionid = res.data.data.unionid;
            app.globalData.userType = res.data.data.userType !== undefined ? res.data.data.userType : null;
            //跳转到产品专员和运营商首页
            wx.reLaunch({
              url: '/pages/auditIndex/auditIndex'
            })
          }
          
          // wx.reLaunch({
          //   url: '/pages/auditIndex/auditIndex'
          // })
        } else {
          if(res.data.code == 5) {
            //code过期 调用回调重新访问
            that.getUserInfo();
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          
            console.log("用户权限信息获取失败", res.message)
          }
          
        }
      },
      fail(error) {
        // wx.showToast({
        //   title: error,
        //   icon: 'none',
        //   duration: 2000
        // })
        // console.log(error);
      // wx.showToast({
      //   title: error,
      //   icon: 'none',
      //   duration: 2000
      // })
      }
    })
  },
})
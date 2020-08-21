// pages/home/home.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("launch");
    this.height();
    // 查看用户是否授权
    this.getSetting();

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
  getSetting: function() {
    //调用微信公开接口查询用户授权信息
    var that = this;
    wx.getSetting({
      success(res) {

        console.log("授权信息", res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.getUserInfo();
          // 先获取临时登录令牌
          // that.logina();
        } else {
          // that.globalData.beforePage = true;
          //没有授权跳转到授权页面
          console.log("没有授权");
          wx.redirectTo({
            url: "../registerIndex/registerIndex"
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: err.errMsg,
          icon: 'none',
          duration: 2000
        })
        console.log("授权失败", err);
      }
    })
  },
  logina: function() {
    // // console.log("登录");
    // var that = this;
    // // 登录获取临时登录令牌
    // wx.login({
    //   success(res) {
    //     console.log("微信登录",res);
    //     if (res.code) {
    //       // that.globalData.code = res.code;

    //       //获取用户信息
    //       that.getUserInfo();
    //     } else {
    //       wx.showToast({
    //         title: res.data.errMsg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       // Toast.fail('登录失败！' + res.errMsg);
    //       console.log('登录失败！' + res.data.errMsg)
    //     }
    //   },
    //   fail(err) {
    //     wx.showToast({
    //       title: err.errMsg,
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     console.log("wxlogin失败", err);
    //   }
    // })
  },
  getUserInfo: function() {
    //已经授权，可以直接调用 getUserInfo 获取头像昵称
    var that = this;
    wx.getUserInfo({
      success: function(resData) {
        wx.login({
          success: res => {
            if (res.code) {
              console.log("---------------" + res.code)
              //  console.log("getuserinfo", res);
              var codeData = resData;
              //验证用户code是否过期(不用)
              //that.checkSession()
              //发起网络请求获取用户权限
              that.askForLogin(res.code, codeData);
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
  checkSession: function() {
    // //验证用户code是否过期
    // var that = this;
    // wx.checkSession({
    //   success() {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     that.askForLogin();
    //   },
    //   fail() {
    //     // session_key 已经失效，需要重新执行登录流程
    //     that.login();
    //   }
    // })
  },
  askForLogin: function(code, codeData) {
    console.log("askForLogin")
    //发起网络请求获取用户权限
    var that = this;
    wx.request({
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      url: httpConfig.serviceHost + '/RUnionidBindUserController/askForLogin',
      data: {
        code: code,
        iv: codeData.iv,
        encryptedData: codeData.encryptedData
      },
      success(res) {
        // console.log(res.data);
        if (res.data.success) {
          console.log(res.data.success)
          //获取权限信息成功
          console.log("用户权限信息", res.data.data); //用户权限信息
          app.globalData.avatarUrl = res.data.data.avatarUrl ? res.data.data.avatarUrl : "";
          app.globalData.openId = res.data.data.openId ? res.data.data.openId : "";
          app.globalData.page = res.data.data.page ? res.data.data.page : "";
          app.globalData.id = res.data.data.id ? res.data.data.id : "";
          app.globalData.unionid = res.data.data.unionid ? res.data.data.unionid : "";
          app.globalData.userType = res.data.data.userType !== undefined ? res.data.data.userType : null;
          console.log(res.data.data.page)
          // console.log(that.globalData.beforePage,"可以进入审核页么")
          // if (that.globalData.page != 2 || that.globalData.page != 3 ) {
          //   that.globalData.beforePage = true;
          // }
          if (res.data.data.page == 0) {
            console.log("未注册,跳转到注册页面-首页·全局入口")
            //未注册,跳转到注册页面
            // wx.navigateTo({
            //   url: '/pages/registerIndex/registerIndex'
            // })
            wx.reLaunch({
              url: '/pages/registerIndex/registerIndex'
            })
          } else if (res.data.data.page == 1) {
            console.log("待审核,跳转到待审核页面-首页全局入口")
            //待审核,跳转到待审核页面
            wx.reLaunch({
              url: '/pages/PermissionApplication/PermissionApplication'
            })
          } else if (res.data.data.page == 4) {
            console.log("医助,跳转到医助展示的页面-首页全局入口")
            //医助,跳转到医助展示的页面
            wx.reLaunch({
              url: '/pages/PermissionApplicationSuccess/PermissionApplicationSuccess'
            })
          } else if (res.data.data.page == 2 || res.data.data.page == 3) {
            console.log("跳转到产品专员和运营商首页-首页全局入口5")
            //跳转到产品专员和运营商首页
            // console.log(that.globalData.beforePage);
            // if(that.globalData.beforePage == true) {
            // that.globalData.beforePage = false;
            // that.onLoad();
            wx.redirectTo({
              url: '/pages/auditIndex/auditIndex',
              success: function() {
                console.log("成功后的回调")
              }, //成功后的回调；

              fail: function() {
                console.log("失败后的回调")
              }, //失败后的回调；
              complete: function() {
                console.log("结束后的回调(成功，失败都会执行)")
              } //结束后的回调(成功，失败都会执行)
            })
            // }

          }

          // wx.reLaunch({
          //   url: '/pages/auditIndex/auditIndex'
          // })
        } else {
          if (res.data.code == 5) {
            //code过期 调用回调重新访问
            that.getUserInfo();
          } else {
            wx.showToast({
              title: res.data.message || res.errMsg,
              icon: 'none',
              duration: 2000
            })

            console.log("用户权限信息获取失败", res)
          }

        }
      },
      fail(error) {
        wx.showToast({
          title: error.errMsg,
          icon: 'none',
          duration: 2000
        })
        console.log(error);
        // wx.showToast({
        //   title: error,
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  height: function() {
    //获取标题栏高度
    const {
      model,
      system,
      statusBarHeight
    } = wx.getSystemInfoSync();
    var headHeight;
    if (/iphone\s{0,}x/i.test(model)) {
      headHeight = 88;
    } else if (system.indexOf('Android') !== -1) {
      headHeight = 68;
    } else {
      headHeight = 64;
    }
    app.globalData.headerHeight = headHeight;
    app.globalData.statusBarHeight = statusBarHeight;
  },

})
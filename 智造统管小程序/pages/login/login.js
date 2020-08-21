// pages/index/index.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "./../../utils/request.js";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  //跳转信息登记页
  start: function () {
  },
  //授权成功后的登录接口
  loginWx: function (code, iv, encryptedData) {
    var that = this;
    fly.request({
      method: 'POST',
      url: 'RUnionidBindUserController/statisticsForLogin',
      body: {
        'code': code,
        'encryptedData': encryptedData,
        'iv': iv
      },
    })
    .then((res) => {
      if (res.data.data.status=='1'){
        // 缓存获取到用户的 userid及是否登记过
        wx.setStorageSync("userid", res.data.data.record.id)
        wx.setStorageSync("unionid", res.data.data.record.unionid)
        wx.setStorageSync("userType", res.data.data.record.type)
        wx.setStorageSync("userName", res.data.data.record.name)
        wx.setStorageSync("userTel", res.data.data.record.phone)
        Toast.success('登录成功');
        let assistantInfo = {
          id: wx.getStorageSync("userid"),
          name: wx.getStorageSync("userName"),
          phone: wx.getStorageSync("userTel"),
          img: wx.getStorageSync("imgUrl")
        };


        wx.setStorageSync("medicalhelp", assistantInfo);
        wx.redirectTo({
          url: '../home/home',
        })
        //判断进入哪页  2:进入医助页(myDoctor);其他的进入medicalHelp页
        // if (res.data.data.record.type == '2') {
        //   wx.redirectTo({
        //     url: '../myDoctor/myDoctor',
        //   })
        // } else {
        //   wx.redirectTo({
        //     url: '../medicalHelp/medicalHelp',
        //   })
        // }
      }else{
        Toast('此号码暂无权限使用');
      }
    })
    .catch((error) => {
      Toast.fail('登录失败,' + error);
    });
  },
  //授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      // console.log("允许授权", e.detail.userInfo);
      //用户按了允许授权按钮
      var that = this;
      that.setData({
        authorization: true,   //确定用户点击了允许授权按钮
      })
      //调用微信的 wx.login 接口，从而获取code
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: resInfo => {
              console.log('resInfo===', resInfo);
              let avatarUrl = JSON.parse(resInfo.rawData);
              wx.setStorageSync("imgUrl", avatarUrl.avatarUrl);
              //获取用户code值后调取登录接口
              that.loginWx(res.code, resInfo.iv, resInfo.encryptedData);
            }
          })
        }
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  //查看是否授权
  shouquan: function () {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        // console.log(res.authSetting['scope.userInfo'])
        //{scope.userInfo:true}授权为true
        if (res.authSetting['scope.userInfo']) {
          console.log("用户已授权");
          //调用微信的 wx.login 接口，从而获取code
          wx.login({
            success: res => {
              wx.getUserInfo({
                success: resInfo=>{
                  console.log(resInfo);
                  console.log(res);
                  wx.setStorageSync("imgUrl", resInfo.rawData.avatarUrl);
                  //获取用户code值后调取登录接口
                  that.loginWx(res.code, resInfo.iv, resInfo.encryptedData);
                }
              })
            }
          });
        } else {
          // 用户没有授权
          console.log("用户没有授权");
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.shouquan();
  }
})
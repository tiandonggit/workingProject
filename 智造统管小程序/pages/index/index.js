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
        if (res.data.data.status == '1') {
          // 缓存获取到用户的 userid及是否登记过
          wx.setStorageSync("userid", res.data.data.record.id)
          wx.setStorageSync("userType", res.data.data.record.type)
          wx.setStorageSync("userName", res.data.data.record.name)
          wx.setStorageSync("userTel", res.data.data.record.phone)
          let assistantInfo = {
            id: wx.getStorageSync("userid"),
            name: wx.getStorageSync("userName"),
            phone: wx.getStorageSync("userTel"),
            img: wx.getStorageSync("imgUrl")
          };


          wx.setStorageSync("medicalhelp", assistantInfo);
          Toast.success('登录成功');
          wx.redirectTo({
            url: '../home/home',
          })
          //判断进入哪页  2:进入医助页(myDoctor);其他的进入medicalHelp页
          // if (res.data.data.record.type=='2'){
          //   wx.redirectTo({
          //     url: '../myDoctor/myDoctor',
          //   })
          // }else{
          //   wx.redirectTo({
          //     url: '../medicalHelp/medicalHelp',
          //   })
          // }
        } else {
          Toast('此号码暂无权限使用');
        }
      })
      .catch((error) => {
        Toast.fail('登录失败,' + error);
      });
  },
  //查看是否授权
  shouquan: function () {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        // console.log(res)
        // console.log(res.authSetting['scope.userInfo'])
        //{scope.userInfo:true}授权为true
        if (res.authSetting['scope.userInfo']) {
          console.log("用户已授权");
          //调用微信的 wx.login 接口，从而获取code
          wx.login({
            success: res => {
              wx.getUserInfo({
                success: resInfo => {
                  console.log(resInfo.rawData);
                  let avatarUrl = JSON.parse(resInfo.rawData);
                  wx.setStorageSync("imgUrl", avatarUrl.avatarUrl);
                  //获取用户code值后调取登录接口
                  that.loginWx(res.code, resInfo.iv, resInfo.encryptedData);
                }
              })
            }
          });
        } else {
          // 用户没有授权
          console.log("用户没有授权");
          wx.redirectTo({
            url: '../login/login',
          })
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
    // console.log("显示");
    // backgroundAudioManager.play();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    // console.log("隐藏");
    // backgroundAudioManager.stop();
    // backgroundAudioManager.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log("卸载");
    // backgroundAudioManager.stop();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})

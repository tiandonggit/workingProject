// pages/generalizedQrCode/generalizedQrCode.js
import {serviceBBJKHost} from "../../utils/httpConfig.js";
import fly from "./../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",//医助id
    assistantInfo:{}, //医助信息
    qrCode:"" //二维码地址
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
  init(option){
    let that = this;
    let assistantInfo = wx.getStorageSync("medicalhelp");
    //存入相应信息
    that.setData({
      assistantInfo: assistantInfo,
      id: assistantInfo.id
    });
    that.getQrCode();
  },

  /**
   * 获取推广二维码地址
   */
  getQrCode(){
    let that = this;
    fly.request({
      method: 'GET',
      url: serviceBBJKHost+'/RAssistantWechatQrcodeController/getRassQrCode',
      body: {
        id: that.data.id
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
            that.setData({
              qrCode: "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+res.data.data.wechatticket
            });
          } else {
            console.log("二维码信息不存在");
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          console.log(error)
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
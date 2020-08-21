// pages/detailsPage/detailsPage.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objData: {
      name: "",
      phone: "",
      requestRight: "",
      referencer: "",
      province: "",
      city: "",
      bindTime: "",
      reason: "",
      checkerRight: "",
      checkUserId: "",
      checkStatus: "1",
      checkTime: "",
      checkUser: "",
      uuid: "",
      id: "",
      async_close: false
    },
    show: false, //遮罩层开关
    reason: "", //驳回原因
    type: null, //审核还是待审核
    label: null, //运营商还是医助
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData);
    console.log(options);
    this.setData({
      type: options.type,
      label: options.label,
      id: options.id
    });
    this.select();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // const pages = getCurrentPages();//获取页面栈
    // const beforePage = pages[pages.length - 2];  //前一个页面
    // //前一个页面刷新
    // beforePage.selectPageModel(1);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 查询审核详情
   */
  select: function() {
    var that = this;
    //判断请求地址
    var url =
      that.data.type == 0 //待审核 
      ?
      that.data.label == 0 //运营商
      ?
      "/RBusinessProviderController/selectUnapprovedProvider" //运营商
      :
      "/RAssistantController/selectUnapprovedAssistant" //医助
      :
      that.data.label == 0 //运营商 已审核
      ?
      "/RBusinessProviderController/selectApprovedProvider" //运营商
      :
      "/RAssistantController/selectApprovedAssistant" //医助
    var data = {}
    if (that.data.label == 0) {
      data.providerId = that.data.id
    } else {
      data.assistantId = that.data.id
    }
    fly.request({
        method: 'GET',
        url: httpConfig.serviceHost + url,
        // url: "http://192.168.1.161:82/yhz_collect/" + url,
        body: data
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          that.setData({
            objData: res.data.data
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          console.log(res.data.message);
        }
        // that.setData({
        //   objData: this.data.objData.concat(res.data.data)
        // });
      })
      .catch((error) => {
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
        console.log(error);
        // wx.showToast({
        //   title: error,
        //   icon: 'none',
        //   duration: 2000
        // })
      })

  },

  /**
   * 用户点击通过按钮执行事件
   */
  onSubmit() {
    var that = this;
    console.log("通过");
    // this.setData({ show: true });
    Dialog.confirm({
        message: '确认通过此申请？',
        asyncClose: true,
        confirmButtonColor: "#FFF",
        cancelButtonColor: "#333"
      })
      .then(() => {
        console.log("执行了");
        that.onCheckUserPower(0);

        // setTimeout(() => {
        //   Dialog.close();
        // }, 1000);
      })
      .catch(() => {
        Dialog.close();
      });
  },

  /**
   * 用户点击驳回按钮执行事件
   */
  onReject() {
    console.log("点击驳回");
    var that = this;
    that.setData({
      show: true
    });
  },

  /**
   * 用户点击驳回取消按钮执行事件
   */
  onCancel() {
    // wx.navigateTo({
    //   url: '/pages/auditIndex/auditIndex'
    // })
    this.setData({
      show: false
    });
  },

  /**
   * 获取textArea里的值
   */
  bindTextAreaBlur(e) {
    var that = this;
    that.setData({
      reason: e.detail.value
    })
  },

  /**
   * 用户点击驳回确认按钮执行事件
   */
  onSubmitReason() {
    var that = this;
    console.log(that.data.reason);
    if (!that.data.reason) {
      wx.showToast({
        title: "请输入驳回原因",
        icon: 'none',
        duration: 2000
      })
      console.log("输入驳回原因")

      that.setData({
        show: true
      })
      return;
    }
    that.onCheckUserPower(1);
  },

  /**
   * 访问权限审核接口
   */
  onCheckUserPower(checkResult) {
    var that = this;
    // console.log(checkResult)
    if (checkResult !== 0 && !that.data.reason) return;
    console.log("通过", checkResult)
    var data = {
      checkResult: checkResult,
      refuseReason: that.data.reason,
      checkUserId: app.globalData.id ? app.globalData.id : 3,
      userId: that.data.id,
      uuid: that.data.objData.uuid ? that.data.objData.uuid : ""
    }
    var url = "/RUnionidBindUserController/checkUserPower";
    fly.request({
        method: 'POST',
        url: httpConfig.serviceHost + url,
        body: data
      })
      .then((res) => {
        Dialog.close();
        that.setData({
          show: false,
          type: 1,
        });
        if (res.data.success) {
          
          console.log("审核完成");
          
          that.select();
          
        } else {
          
          
          if (res.data.code == 1) {
            console.log(res.data.message, "审核无效，其他人已完成审核");
            Dialog.alert({
              message: res.data.message,
              asyncClose: false,
              confirmButtonColor: "#FFF",
              cancelButtonColor: "#333"
            })
              .then(() => {
                
                console.log("执行了确定");
                that.select();

              })
              .catch(() => {
                
                console.log("执行了异常");
                that.select();

              });
          } else {
            console.log(res.data.message, "账号停用");
            Dialog.alert({
              message: res.data.message,
              asyncClose: false,
              confirmButtonColor: "#FFF",
              cancelButtonColor: "#333"
            })
              .then(() => {
                
                console.log("执行了确定,跳转到注册页");
                wx.reLaunch({
                  url: '/pages/registerIndex/registerIndex'
                })
              })
              .catch(() => {
                that.setData({
                  type: 1
                });
                console.log("执行了异常");
                wx.reLaunch({
                  url: '/pages/registerIndex/registerIndex'
                })
              });
          }
          
          // wx.showToast({
          //   title: res.data.message,
          //   icon: 'none',
          //   duration: 2000,
          //   complete(e) {


          //     that.select();
          //   }
          // })
        }

        const pages = getCurrentPages(); //获取页面栈
        const beforePage = pages[pages.length - 2]; //前一个页面
        //前一个页面刷新
        beforePage.selectPageModel(1);
      })
      .catch((error) => {
        console.log(error)
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
      })
  },

  /**
   * 用户点击电话拨号
   */
  onPhone() {
    wx.showActionSheet({
      itemList: ['400-090-9975'],
      success: function(res) {
        console.log(res) //当点击400-090-9975就相当于点击了
        wx.makePhoneCall({
          phoneNumber: '400-090-9975',
          success: function() {
            console.log("拨打电话成功！")
          },
          fail: function() {
            console.log("拨打电话失败！")
            wx.showToast({
              title: "拨打电话失败！",
              icon: 'none',
              duration: 2000
            })
          }
        })
        if (!res.cancel) {
          wx.showToast({
            title: res.tapIndex,
            icon: 'none',
            duration: 2000
          })
          console.log(res.tapIndex) //console出了下标
        }
      }
    });

  }
})
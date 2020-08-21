const util = require("../../utils/util");
const app = getApp();
// import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import fly from "./../../utils/request.js";

// 实例化API核心类
const qqmapsdk = app.globalData.qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: "",
    poi: {
      latitude: "",
      longitude: ""
    },
    address: {
      positionproname: "",
      positioncityname: "",
      positionaddress: ""
    },
    addressName: "",
    time: "",
    timer: "",
    timer2: "", // 用来每个一段时间自动刷新一次定位
    canClick: true,
    withOutPermission: false,
    dakaText: '打卡',
    show: false, // 打卡记录popup
    dialogShow: false, // 开启定位提示弹窗
    historyList: [], // 打卡历史记录
    page: 1, // 打卡历史记录分页参数
    limit: 20, // 打卡历史记录分页参数
    lastPage: false
  },

  getAddress(e) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       *
       location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
       */
      // 成功后的回调
      success: function (res) {
        // console.log("res: ", res);
        that.setData({
          addressName: res.result.address
        });
        var res = res.result;
        var mks = [];
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: "../../images/zcxj/myPosition.png", // 图标路径
          width: 21,
          height: 28
        });
        that.setData({ // 设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          },
          address: {
            positionproname: res.ad_info.province,
            positioncityname: res.ad_info.city,
            positionaddress: res.address
          }
        });
      },
      // 定位失败回调, 如用户点击了取消授权, 在这里做业务处理
      fail: function (error) {
        console.error("定位失败", error);
        that.setData({
          withOutPermission: true,
          dakaText: '无法打卡'
        })
        that.setData({
          show: false,
          dialogShow: true
        })
        // Dialog.alert({
        //   message: '请先确保开启手机系统定位服务并且允许“微信”App的定位权限，以获取精准的定位信息。',
        //   theme: 'round-button',
        //   confirmButtonText: '知道了'
        // }).then(() => {
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // });
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  getTime: function () {
    let that = this;
    let time = that.data.time;
    that.setData({
      timer: setInterval(function () {
        time = util.formatTime(new Date());
        that.setData({
          time: time.substr(-8)
        });
        if (time == 0) {
          // 页面跳转后，要把定时器清空掉，免得浪费性能
          clearInterval(that.data.timer);
        }
      }, 1000)
    });
  },

  /**
   * 重新定位
   */
  rePosition: function () {
    this.getAddress();
  },

  /**
   * 打卡确认弹窗
   */
  checkIn: function () {
    if (!this.data.canClick) {
      return false;
    }
    this.setData({
      canClick: false,
      withOutPermission: true,
      dakaText: '无法打卡'
    });
    this.realyCheckIn();
    setTimeout(() => {
      this.setData({
        canClick: true,
        withOutPermission: false,
        dakaText: '打卡'
      });
    }, 5000)
  },
  /**
   * 打卡业务逻辑
   */
  realyCheckIn: function () {
    wx.vibrateLong();
    console.log("定位信息：", this.data.poi, this.data.address);

    fly.request({
        method: 'POST',
        url: '/RRemarkRecordController/insertOrUpdate',
        body: {
          userid: wx.getStorageSync("userid"),
          unionid: wx.getStorageSync("unionid"),
          positionxid: this.data.poi.latitude,
          positionyid: this.data.poi.longitude,
          positionproname: this.data.address.positionproname,
          positioncityname: this.data.address.positioncityname,
          positionaddress: this.data.address.positionaddress
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data) {} else {}
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
   * 关闭打卡记录popup
   */
  onClose() {
    this.setData({
      show: false
    });
  },

  /**
   * 开启定位弹窗关闭
   */
  dialogClose() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 开启打卡记录popup
   */
  openPopup() {
    this.setData({
      show: true,
      page: 1,
      lastPage: false,
      historyList: []
    })
    this.getRemarkRecord();
  },

  getRemarkRecord() {
    fly.request({
        method: 'GET',
        url: '/RRemarkRecordController/remaarkRecord',
        body: {
          userid: wx.getStorageSync("userid"),
          unionid: wx.getStorageSync("unionid"),
          limit: this.data.limit,
          page: this.data.page
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data) {
            let list = this.data.historyList;
            let page = this.data.page;
            list = list.concat(res.data.data);
            page++;
            this.setData({
              historyList: list,
              page: page,
              num: res.data.total
            });
            if (this.data.historyList.length == res.data.total) {
              this.setData({
                lastPage: true
              });
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
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
   * 打卡记录分页加载
   */
  scrolltolower(e) {
    if(!this.data.lastPage) {
      this.getRemarkRecord();
    }
    console.log("scrolltolower emit");
    // wx.showLoading({
    //   title: '加载中...',
    // });
    // request method
    // wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime();
    this.getAddress();
    this.setData({
      canClick: true, // 允许用户点击，防止多次提交
      timer2: setInterval(() => {
        this.getAddress();
      }, 20000) // 每20秒刷新一次定位
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.timer2);
  }
});
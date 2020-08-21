// pages/info/info.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js";
import * as watch from "../../utils/watch.js";

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: "",
    StatusBar: "",
    CustomBar: "", //头部导航高度
    isIphoneX: false, //iphoneX适配
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    // index: 99,
    phone: "", //手机号
    veifyCode: "", //验证码
    provid: "", //省份ID
    parentId: "", //省父级ID，关联市
    cityid: "", //城市ID
    name: "", //姓名
    userType: '', //权限角色
    referencename: "", // 推荐人
    referenceId: '', // 推荐人id
    cityName: "", //城市名
    cityId: "", //城市ID
    provinceName: "", //省名
    provinceId: "", //省ID
    selectData: [{
        role: "申请权限类型",
        id: 0
      },
      {
        role: "产品专员",
        id: 1
      },
      {
        role: "运营商",
        id: 2
      },
      {
        role: "医助",
        id: 3
      },
      {
        role: "总管",
        id: 4
      }

    ], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    localImg: "",
    content: "获取验证码",
    totalTime: 60,
    canClick: true, // 添加canClick
    verificationNumer: "",
    loadingToast: true,
    colorState: "#0069FF",
    phoneNum: "",
    passWord: "",
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    isHide: false,
    isLogin: true,
    title: "",
    pShow: true, // 省份选择是否显示
    cShow: true, // 城市选择是否显示
    rShow: true, // 推荐人选择是否显示
  },

  watch: {
    userType: function(newVal, oldVal) {
      console.log('watch userType ===', newVal)
      if (newVal == 3) {
        this.setData({
          pShow: false,
          cShow: false,
          rShow: false,
          index: Number(newVal) + 1,
        })
      } else if (newVal == 0 && newVal != '') {
        this.setData({
          pShow: true,
          cShow: true,
          rShow: false,
          index: Number(newVal) + 1,
        })
      } else {
        this.setData({
          pShow: true,
          cShow: true,
          rShow: true,
          index: newVal ? Number(newVal) + 1 : 0,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    watch.setWatcher(this);
    //input 点击切换省份或者城市后，input清空 解决办法
    console.log("wx.getStorageSync('userType')---" + wx.getStorageSync("userType"));
    if (wx.getStorageSync("userType") && (wx.getStorageSync("userType") == 0 || wx.getStorageSync("userType") == 1 || wx.getStorageSync("userType") == 2 || wx.getStorageSync("userType") == 3)) {
      this.setData({
        index: wx.getStorageSync("userType") + 1,
        userType: wx.getStorageSync("userType"),
      });
    } else {
      this.setData({
        index: 0
      });
    }
    this.setData({
      name: wx.getStorageSync("name"),
      // cityName:wx.getStorageSync('cityName'),
      referencename: wx.getStorageSync("referencename"),
      referenceId: wx.getStorageSync("referenceId"),
      phone: wx.getStorageSync("phone"),
      veifyCode: wx.getStorageSync("veifyCode"),
      provinceName: wx.getStorageSync("provinceName"),
      // cityId:wx.getStorageSync('cityId'),
      provid: wx.getStorageSync("provinceId"),
      parentId: wx.getStorageSync("parentId")
    });

    //获取索引
    if (options.cityName != "" && options.cityName != undefined) {
      wx.setStorageSync("cityName!", options.cityName);
      this.setData({
        cityName: options.cityName
      });
    }
    if (options.cityId != "" && options.cityId != undefined) {
      wx.setStorageSync("cityId", this.data.cityId);
      this.setData({
        cityId: options.cityId
      });
    }

    console.log(this.data.cityName);
    console.log(this.data.cityId);


    //省返回后，需要清除市
    console.log("父级-" + options.parentId);
    if (options.parentId != "" && options.parentId != undefined) {
      wx.setStorageSync("parentId", options.parentId);
      this.setData({
        parentId: options.parentId,
        cityName: ""
      });
    }

    if (options.provinceName != "" && options.provinceName != undefined) {
      wx.setStorageSync("provinceName", options.provinceName);
      this.setData({
        provinceName: options.provinceName,
        cityName: ""
      });
    }
    if (options.provinceId != "" && options.provinceId != undefined) {
      console.log("options.provinceId");
      wx.setStorageSync("provinceId", options.provinceId);
      this.setData({
        provid: options.provinceId
      });
    }

    console.log(this.data.provinceName);
    console.log(this.data.provid);
    //获取全局
    console.log(app.globalData);
    console.log(JSON.stringify(app.globalData));
    console.log(app.globalData.avatarUrl);


    var that = this;
    that.red();
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        //{scope.userInfo:true}授权为true
        if (res.authSetting["scope.userInfo"]) {
          //用户已授权
          //关闭授权页面
          that.setData({
            isHide: false
            // login: true
          });

          wx.getUserInfo({
            success: function(res) {
              console.log(res.code);
              //调用微信的 wx.login 接口，从而获取code
              // wx.login({
              //   success: res => {
              //     console.log(res.code)
              //     fly.request({
              //       method: 'GET',
              //       url: httpConfig.serviceHost +'/RDoctorJkmpimgController/getOpenIdByCode',
              //       body: {
              //         code: res.code,
              //       }
              //     })
              //     .then((res) => {
              //       if (res.data.success) {
              //         wx.setStorageSync("openid",res.data.data)
              //         that.comeBack(res.data.data)
              //       } else {
              //         wx.showToast({
              //           title: res.data.message,
              //           icon: 'none',
              //           duration: 2000
              //         })
              //       }
              //     })
              //     .catch((error) => {
              //       wx.showToast({
              //         title: error,
              //         icon: 'none',
              //         duration: 2000
              //       })
              //     })
              //   }
              // });
            }
          });
          // that.titleBGAuthorize(1)
          // that.setData({
          //   login: true
          // });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            // login: false,
            isHide: true
          });
          // that.titleBGAuthorize(0)
        }
      }
    });
  },

  /**
   * 提交信息
   */
  submitInfo: function() {
    // console.log(app.globalData.openId.length);
    // console.log(app.globalData.unionid.length);
    var that = this;
    if (app.globalData.unionid.length <= 1 || app.globalData.unionid == undefined || app.globalData.unionid == null) {
      wx.showToast({
        title: "当前网络不佳，请重新登录",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (app.globalData.openId.length <= 1 || app.globalData.openId == undefined || app.globalData.openId == null) {
      wx.showToast({
        title: "当前网络不佳，请重新登录",
        icon: "none",
        duration: 2000
      });
      return;
    }

    //输入框显示
    if (this.data.name.length === 0) {
      wx.showToast({
        title: "请输入名字",
        icon: "none",
        duration: 2000
      });
      return;
    }
    console.log(this.chinese(this.data.name));
    if (!this.chinese(this.data.name)) {
      wx.showToast({
        title: "真实姓名只能是汉字",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (this.data.userType.length === 0) {
      wx.showToast({
        title: "请选择权限类型",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (this.data.provinceName.length === 0 && this.data.userType != 3) {
      wx.showToast({
        title: "请选择省份",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (this.data.cityName.length === 0 && this.data.userType != 3) {
      wx.showToast({
        title: "请选择城市",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (this.data.phone.length === 0) {
      // Toast('请输入手机号')
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
        duration: 2000
      });
      return;
    } else {
      const str = this.data.phone;
      var regu = /^1[34578]\d{9}$/;
      var re = new RegExp(regu);
      if (!re.test(str)) {
        wx.showToast({
          title: "手机号格式不正确",
          icon: "none",
          duration: 2000
        });
        return;
      }
    }
    if (this.data.veifyCode.length === 0) {
      wx.showToast({
        title: "请输入验证码",
        icon: "none",
        duration: 2000
      });
      return;
    }

    console.log(app.globalData.openId.length);
    console.log(app.globalData.unionid.length);

    wx.requestSubscribeMessage({
      tmplIds: ["ZLiTaji7MImTyUKkiwfE61AyCMt6JcHtUHQtx_2HzbM", "ZLiTaji7MImTyUKkiwfE6weP_fwMdV3uBqkX3NjI6l0"],
      success(res) {
        console.log("wx.requestSubscribeMessage");
        console.log(res);
        if (res.ZLiTaji7MImTyUKkiwfE61AyCMt6JcHtUHQtx_2HzbM === "accept") {
          let params = {
            openId: app.globalData.openId,
            phone: that.data.phone,
            veifyCode: that.data.veifyCode,
            userType: that.data.userType,
            provid: that.data.provid, //省份ID
            cityid: that.data.cityId, //城市ID
            name: that.data.name,
            // referencename: that.data.referencename,
            referenceId: that.data.referenceId,
            unionid: app.globalData.unionid,
            wechatImgUrl: app.globalData.avatarUrl
          }
          // 如果申请的是总管 清空省 市 推荐人参数
          if (that.data.userType == 3) {
            delete params.provid;
            delete params.cityid;
            delete params.referenceId;
          }
          if (that.data.userType == 1) {
            delete params.referenceId;
          }
          fly.request({
            method: "post",
            url: httpConfig.serviceHost + "/RUnionidBindUserController/commitRegister",
            body: params
          }).then((res) => {
            if (res.data.success) {
              if (res.data.code == "0") {
                wx.redirectTo({
                  url: "../PermissionApplication/PermissionApplication"
                });
              }
            } else {
              if (res.data.code == "1") {
                wx.showToast({
                  title: "验证码错误",
                  icon: "none",
                  duration: 2000
                });
              } else if (res.data.code == "2") {
                wx.showToast({
                  title: "此账号已存在，请更换手机号码",
                  icon: "none",
                  duration: 2000
                });
              }
            }
          }).catch((error) => {
            wx.showToast({
              title: error,
              icon: "none",
              duration: 2000
            });
            console.log(error);
          });
        } else if (res.ZLiTaji7MImTyUKkiwfE61AyCMt6JcHtUHQtx_2HzbM === "reject") {
          // 用户历史操作有设置了拒绝 or 关闭了订阅消息的主（总）开关，导致无法推送
          fly.request({
            method: "post",
            url: httpConfig.serviceHost + "/RUnionidBindUserController/commitRegister",
            body: {
              openId: app.globalData.openId,
              phone: that.data.phone,
              veifyCode: that.data.veifyCode,
              userType: that.data.userType,
              provid: that.data.provid, //省份ID
              cityid: that.data.cityId, //城市ID
              name: that.data.name,
              referencename: that.data.referencename,
              unionid: app.globalData.unionid,
              wechatImgUrl: app.globalData.avatarUrl
            }
          }).then((res) => {
            if (res.data.success) {
              if (res.data.code == "0") {
                wx.redirectTo({
                  url: "../PermissionApplication/PermissionApplication"
                });
              }
            } else {
              if (res.data.code == "1") {
                wx.showToast({
                  title: "验证码错误",
                  icon: "none",
                  duration: 2000
                });
              } else if (res.data.code == "2") {
                wx.showToast({
                  title: "此账号已存在，请更换手机号码",
                  icon: "none",
                  duration: 2000
                });
              }
            }
          }).catch((error) => {
            wx.showToast({
              title: error,
              icon: "none",
              duration: 2000
            });
            console.log(error);
          });
        } else {
          wx.showToast({
            title: "授权订阅消息有误",
            icon: "none"
          });
        }

      }
    });
  },

  // 获取验证码
  verificationNum(e) {
    //判断测试体验号
    var that = this;
    //体验账号
    if (this.data.phoneNum == 13082498861) {
      console.log("判断测试体验号4");
      wx.showToast({
        title: "获取验证码成功",
        icon: "success",
        duration: 2000
      });

      that.setData({
        verificationNumer: 111111
      });
      var openid = wx.getStorageSync("openid");
    } else {
      if (this.data.phone.length === 0) {
        // Toast('请输入手机号')
        wx.showToast({
          title: "请输入手机号",
          icon: "none",
          duration: 2000
        });
        return;
      } else {
        const str = this.data.phone;
        var regu = /^1[34578]\d{9}$/;
        var re = new RegExp(regu);
        if (!re.test(str)) {
          wx.showToast({
            title: "请输入正确手机号",
            icon: "none",
            duration: 2000
          });
          return;
        }
      }
      if (!this.data.canClick) return; // 改动的是这两行代码
      var that = this;
      var canClick = this.data.canClick;
      var content = this.data.canClick;
      var totalTime = this.data.totalTime;
      var colorState = this.data.colorState;
      that.setData({
        canClick: false,
        content: this.data.totalTime + "s",
        colorState: "#999999"
      });

      fly.request({
        method: "get",
        url: httpConfig.serviceHost + "/RUnionidBindUserController/sendVerificationCode",
        body: {
          phoneNum: this.data.phone
        },
        headers: {
          // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
        }
      }).then((res) => {

      }).catch((error) => {
        wx.showToast({
          title: error,
          icon: "none",
          duration: 2000
        });
        console.log(error);
      });
      const clock = setInterval(() => {
        // eslint-disable-next-line no-plusplus
        totalTime--;
        that.setData({
          content: totalTime + "s",
          totalTime: totalTime
        });
        if (this.data.totalTime < 0) {
          clearInterval(clock);
          that.setData({
            content: "获取验证码",
            canClick: true,
            totalTime: 60,
            colorState: "#0069FF"
          });
        }
      }, 1000);
    }


  },
  //监听输入的账号
  userNameInp: function(e) {
    this.data.phoneNum = e.detail.value;
  },
  //监听输入的密码
  usePasswordInp: function(e) {
    this.data.verificationNumer = e.detail.value;
    if (e.detail.value.length === 6) {
      // wx.showToast({
      //   title: "error",
      //   icon: 'none',
      //   duration: 2000
      // })
      var openid = wx.getStorageSync("openid");
      fly.request({
        method: "post",
        url: httpConfig.serviceHost + "/RDoctorController/jkmpLogin",
        body: {
          loginPhoneNum: this.data.phoneNum,
          verifyCode: this.data.verificationNumer,
          openId: openid
        }
      }).then((res) => {
        if (res.data.success) {
          // if (res.data.data.checkStatus == 1) {
          if (res.data.code == 2) {
            wx.showToast({
              title: "您的账号未注册，请前去抱抱健康公众号进行注册",
              icon: "none",
              duration: 2000
            });
          } else if (res.data.data.checkStatus == 0 || res.data.data.checkStatus == 2 || res.data.data.checkStatus == 3) {
            wx.redirectTo({
              url: "../imperfect/imperfect"
            });
          } else if (res.data.data.checkStatus == 1) {
            this.setData({
              doctorId: res.data.data.doctorId,
              doctorName: res.data.data.doctorName,
              positionName: res.data.data.positionName,
              departmentName: res.data.data.departmentName,
              hospitalName: res.data.data.hospitalName,
              porf: res.data.data.prof,
              spec: res.data.data.spec,
              jkmpImgUrl: res.data.data.jkmpImgUrl,
              localImg: res.data.data.jkmpImgUrl
            });
            wx.setStorageSync("departmentName", res.data.data.departmentName);
            wx.setStorageSync("positionName", res.data.data.positionName);
            wx.setStorageSync("doctorName", res.data.data.doctorName);
            wx.setStorageSync("checkStatus", res.data.data.checkStatus);
            wx.setStorageSync("headImg", res.data.data.headImg);
            wx.setStorageSync("qrCode", res.data.data.qrCode);
            wx.setStorageSync("doctorId", res.data.data.doctorId);
            wx.setStorageSync("hospitalName", res.data.data.hospitalName);
            wx.setStorageSync("prof", res.data.data.prof);
            wx.setStorageSync("spec", res.data.data.spec);
            wx.setStorageSync("jkmpImgUrl", res.data.data.jkmpImgUrl);
            wx.setStorageSync("code", res.data.code);
            if (wx.getStorageInfoSync("zhuancode")) {
              wx.removeStorageSync("zhuancode");
            }
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }).catch((error) => {
        wx.showToast({
          title: error,
          icon: "none",
          duration: 2000
        });
      });
    }

  },
  // 头部背景颜色
  titleBGAuthorize(state) {
    // 授权页面
    if (state === 0) {
      wx.setNavigationBarTitle({
        title: ""
      });
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#0E86FE"
        // animation: {
        //   duration: 400,
        //   timingFunc: 'easeIn'
        // }
      });
    }
    if (state === 1) {
      // 登录页面
      wx.setNavigationBarTitle({
        title: "登录"
      });
      wx.setNavigationBarColor({
        frontColor: "#fff",
        backgroundColor: "#0E86FE"
        // animation: {
        //   duration: 400,
        //   timingFunc: 'easeIn'
        // }
      });
    }
  },
  //授权按钮
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      app.getSetting();
      console.log("app", app.globalData);
      console.log("app---2", app.globalData.openId);
      console.log(JSON.stringify(app.globalData));

      wx.getUserInfo({
        success: function(res) {
          app.getSetting();
          console.log(JSON.stringify(app.globalData));
          console.log(app.globalData.avatarUrl);

          // //调用微信的 wx.login 接口，从而获取code
          // wx.login({
          //   success: res => {
          //     fly.request({
          //       method: 'GET',
          //       url: httpConfig.serviceHost +'/RDoctorJkmpimgController/getOpenIdByCode',
          //       body: {
          //         code: res.code,
          //       }
          //     })
          //     .then((res) => {
          //       if (res.data.success) {
          //         wx.setStorageSync("openid",res.data.data)
          //         that.comeBack(res.data.data)
          //       } else {
          //         wx.showToast({
          //           title: res.data.message,
          //           icon: 'none',
          //           duration: 2000
          //         })
          //       }
          //     })
          //     .catch((error) => {
          //       wx.showToast({
          //         title: error,
          //         icon: 'none',
          //         duration: 2000
          //       })
          //     })
          //   }

          // });


        }
      });
      console.log("用户的信息如下：");
      wx.setStorageSync("userInfo", e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      // this.titleBGAuthorize(1)
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: "警告",
        content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
        showCancel: false,
        confirmText: "返回授权",
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log("用户点击了“返回授权”");
          }
        }
      });
    }
  },

  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show,
      userType: Index - 1
    });
    //0：产品专员 1：运营商 2 医助 3 总管理员
    console.log("下拉---" + this.data.userType);
    wx.setStorageSync("userType", this.data.userType);
    console.log(wx.getStorageSync("userType"));
  },

  //修改全局背景颜色
  red() {
    var background = "#000";
    this.setData({
      background: background
    });
    app.globalData.background = background; //实现全局变量的修改，此时app.globalData.background的值为"#F4A7B9"
  },

  //跳转选择省
  provinceSelect() {
    //input 点击切换省份或者城市后，input清空 解决办法
    wx.setStorageSync("name", this.data.name);
    wx.setStorageSync("userType", this.data.userType);
    wx.setStorageSync("cityName", this.data.cityName);
    // wx.setStorageSync("cityId", this.data.cityId);
    // wx.setStorageSync("provinceId", this.data.provinceId);
    wx.setStorageSync("referencename", this.data.referencename);
    wx.setStorageSync("phone", this.data.phone);
    wx.setStorageSync("veifyCode", this.data.veifyCode);

    wx.redirectTo({
      url: "../provinceSelect/provinceSelect"
    });
  },

  // 跳转选择市
  citySelect() {
    //input 点击切换省份或者城市后，input清空 解决办法
    wx.setStorageSync("name", this.data.name);
    wx.setStorageSync("userType", this.data.userType);
    wx.setStorageSync("provinceName", this.data.provinceName);
    // wx.setStorageSync("provinceId", this.data.provinceId);
    // wx.setStorageSync("cityId", this.data.cityId);
    wx.setStorageSync("referencename", this.data.referencename);
    wx.setStorageSync("phone", this.data.phone);
    wx.setStorageSync("veifyCode", this.data.veifyCode);

    console.log(this.data.parentId);
    if (this.data.parentId.length === 0) {
      // Toast('请输入手机号')
      wx.showToast({
        title: "请选择省份",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.redirectTo({
      url: "../citySelect/citySelect?parentId=" + this.data.parentId
    });
  },
  //获取名字
  name(e) {
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    });
  },
  //获取推荐人
  // referencename(e) {
  //   console.log(e.detail.value.length);
  //   this.setData({
  //     referencename: e.detail.value
  //   });
  // },
  //手机号
  phone(e) {
    console.log(e.detail.value);
    this.setData({
      phone: e.detail.value
    });
  },
  //验证码
  veifyCode(e) {
    console.log(e.detail.value);
    this.setData({
      veifyCode: e.detail.value
    });
  },
  //验证汉字
  chinese(text) {
    console.log(text);
    var reg = /^[\u4E00-\u9FA5]+$/;
    if (reg.test(text)) {
      return true;
    } else {
      return false;
    }
  },
  // 跳转推荐人选择
  recommenderSelect() {
    console.log('this.data.userType===11111', this.data.userType);
    if (this.data.userType == "") {
      wx.showToast({
        title: "请选择申请的权限类型",
        icon: "none",
        duration: 2000
      });
      return false;
    }
    let userType = this.data.userType;
    wx.redirectTo({
      url: `../recommenderSelect/recommenderSelect?userType=${userType}`
    });
  }
});
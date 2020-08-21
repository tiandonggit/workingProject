// pages/home/home.js
import fly from "./../../utils/request.js";
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
import {serviceHost} from "../../utils/httpConfig.js";

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    updateTime: "2020-09-09 19:00",
    show: false, // 弹出层状态
    placeSelectShow: false, // 地区选择弹出层
    areaChoose: "1", //地区选择方式(1:全部地区;2:部分地区)
    columns: [], //部分地区滚轮列表
    operator_list: [], //测试运营商列表 暂时无用 黏的 懒得删
    operator_list1: [], //测试运营商列表 暂时无用 黏的 懒得删
    someAreas: {}, //部分地区选择结果
    navH: "", //导航栏高度
    userType: 0, //  0：产品专员 1：运营商 2 医助 3：总管理员 5：智配柜
    userId: "",
    titleName: "", // 顶部name
    titleAddress: "", // 地址
    phone: "18588886666", // 手机号
    titleText: "", //医院 产品专员 运营商 医助
    timeSelectText: "本月数据",
    placeSelectText: "全部地区",
    radio: "7", // 时间单选项
    // 总管理员面板
    doctor_number: 0, // 平台医生数
    patient_number: 0, // 平台患者数
    hospital_number: 0, // 平台医院数
    gui_number: 0, // 智配柜数
    zhuanyuan_number: 0, // 产品专员数
    yunxingshang_number: 0, // 运营商数
    yizhu_number: 0, // 医助数
    // 产品专员面板
    guanlian_doctor_number: 0, // 关联医生数
    guanlian_patient_number: 0, // 关联患者数
    xiaji_yunyingshang_number: 0, // 下级运营商数
    xiaji_yizhu_number: 0, // 下级医助数
    // 运营商面板
    y_guanlian_doctor_number: 0, // 关联医生数
    y_guanlian_patient_number: 0, // 关联患者数
    y_gui_number: 0, // 智配柜数
    y_yizhu_number: 0, // 医助数
    // 医助面板
    yz_tuiguang_doctor_number: 0, // 医助推广医生数
    yz_guanlian_patient_number: 0, // 医助下医生关联患者数

    // 医助表格数据
    docDistribution: [],

    // 筛查统计
    shaicha: {
      shaichashu: "0",
      shaichakaidanshu: "0",
      goumailv: "0",
      goumaidanshu: "0",
      zongyingxiaoe: "0"
    },
    // 营养推荐统计
    yingyangtuijian: {
      tuijianshu: "0",
      goumailv: "0",
      goumaidanshu: "0",
      zongyingxiaoe: "0"
    },
    // 推荐产品统计
    tuijianchanpin: {
      kaidanshu: "0",
      goumailv: "0",
      goumaidanshu: "0",
      zongyingxiaoe: "0"
    },
    staticsAllData: {}, // map直接返回的统计数据 key为 0 1 2 7 分别对应总数据 一个月 二个月 和近七天
    listType:'' // 列表类型 同userType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let selectMessage = JSON.parse(JSON.stringify(wx.getStorageSync("selected")));
    let userType = wx.getStorageSync("userType") || "";
    this.setData({
      userId: selectMessage.userId,
      listType:options.userType || '',
      titleName: selectMessage.name || "",
      titleAddress: selectMessage.address || "",
      phone: selectMessage.phone || "",
      titleText: options.userType == "0" ? "产品专员" : options.userType == "1" ? "运营商" : options.userType == "2" ? "医助" : options.userType == "4" ? "医院" : options.userType == "5" ? "智配柜" : "" // 0：产品专员 1：运营商 2 医助 3：总管理员
    });

    this.selectCity();
    // swiper设置高度
    this.setData({
      navH: app.globalData.navHeight,
      navH1: app.globalData.statusBarHeight
    });
    switch (this.data.listType) {
      case '0':
        this.getChanPinZhuanYuanData();
        break;
      case '1':
        this.getYunYingShangData();
        break;
      case '2':
        this.getYiZhuData();
        this.getDocDistribution();
        break;
      case '3':
        this.getZongGuanData();
        break;
      default:
        console.log("userType error");
    }
  },

  /**
   * 查询省市
   */
  selectCity: function () {
    var that = this;
    fly.request({
      method: "GET",
      url: "https://lnyhz.quickhealmall.com/pfks_answerlottery/SysDictionaryController/selectCity"
    }).then((res) => {
      let arr = {
        id: "",
        type: "CITY",
        code: "",
        text: "全部",
        value: "2"
      };
      res.data.data[0]["citylist"].unshift(arr);
      let area = {
        provID: res.data.data[0].code,
        cityID: ""
      };
      that.setData({
        someAreas: area,
        citys: res.data.data,
        columns: [{
          values: res.data.data,
          className: "column1"
        },
          {
            values: res.data.data[0]["citylist"],
            className: "column2"
          }
        ]
      });
    }).catch((error) => {
      console.log("查询失败," + error);
    });
  },

  /**
   * 切换日期筛选,后续根据类型不同实现不同业务需求
   */
  onChange(event) {
    this.setData({
      radio: event.currentTarget.dataset.cap,
      timeSelectText: event.currentTarget.dataset.value,
      show: false
    });
    // 如果是总管理员 切换radio 更新接口 (统计数据 接口统一返回)
    if (this.data.userType == 3) {
      this.getZongGuanData();
    } else {
      let staticsData = this.data.staticsAllData || {};
      let shaicha = {};
      let yingyangtuijian = {};
      let tuijianchanpin = {};
      if (Object.keys(staticsData).length) {
        staticsData = staticsData[this.data.radio];
        shaicha = {
          shaichashu: staticsData.saichashu,
          shaichakaidanshu: staticsData.saichakaidanshu,
          goumailv: staticsData.saichagoumailv,
          goumaidanshu: staticsData.saichagoumaishu,
          zongyingxiaoe: staticsData.saichazongxiaoshouzongshu
        };
        yingyangtuijian = {
          tuijianshu: staticsData.fangankaidan,
          goumailv: staticsData.fangangoumailv,
          goumaidanshu: staticsData.fangangoumai,
          zongyingxiaoe: staticsData.fanganzongxiaoshouzongshu
        };
        tuijianchanpin = {
          kaidanshu: staticsData.tuijiankaidan,
          goumailv: staticsData.tuijiangoumailv,
          goumaidanshu: staticsData.tuijiangoumaishu,
          zongyingxiaoe: staticsData.tuijianzongxiaoshouzongshu
        };
      }
      this.setData({
        tuijianchanpin: tuijianchanpin,
        yingyangtuijian: yingyangtuijian,
        shaicha: shaicha
      });
    }
  },

  /**
   * 关闭弹出层
   */
  onClose() {
    this.setData({
      show: false,
      placeSelectShow: false
    });
  },

  /**
   * 数据统计区间弹出层
   */
  selectTimePop() {
    this.setData({
      show: true
    });
  },

  /**
   * 地区选择弹出层
   */
  selectAreaPop() {
    this.setData({
      placeSelectShow: true
    });
  },

  /**
   * 选择全部地区还是部分地区
   */
  selectArea(e) {
    if (e.currentTarget.dataset.index == 1) {
      this.setData({
        someAreas: {
          provID: "",
          cityID: "",
          areaChoose: e.currentTarget.dataset.index,
          placeSelectText: "全部地区"
        }
      });
    }
    this.setData({
      areaChoose: e.currentTarget.dataset.index
    });
  },

  /**
   * 重置地区选择
   */
  reset() {
    this.setData({
      someAreas: {
        provID: "",
        cityID: "",
        placeSelectText: "全部地区"
      },
      areaChoose: "1"
    });
  },

  /**
   * 确认按钮触发搜索
   */
  find() {
    this.onClose();
    this.getZongGuanData();
  },

  /**
   * 地区选择回调
   */
  onPlaceChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    try {
      if (value[0].citylist.length && value[0].citylist[0].text != "全部") {
        let arr = {
          id: "",
          type: "CITY",
          code: "",
          text: "全部",
          value: "2"
        };
        value[0].citylist.unshift(arr);
      }
    } catch (e) {
      console.log(e);
    }
    picker.setColumnValues(1, value[0].citylist);

    if (index == "0") {
      value[1] = value[0].citylist[0];
    }
    console.log("value====", value);
    let area = {
      provID: value.length && value[0].code || "",
      cityID: value.length == 2 && value[1] && value[1].code || ""
    };
    let placeSelectText = (value.length && value[0].text || "") + (" ") + (value.length == 2 && value[1] && value[1].text || "");
    this.setData({
      someAreas: area,
      placeSelectText: placeSelectText
    });
    console.log("someAreas===", this.data.someAreas);
  },

  /**
   * 医助打卡定位
   */
  goLocation() {

  },

  /**
   * 医助消息列表
   */
  goMessageList() {
    wx.navigateTo({
      url: "../information/information"
    });
  },
  /**
   * 医助推广二维码
   */
  goCode() {
    wx.navigateTo({
      url: "../generalizedQrCode/generalizedQrCode"
    });
  },
  /**
   * 不同身份首页面板跳转
   * **/
  panelLink(e) {
    let type = e.currentTarget.dataset.index;
    // 如果是总管理员 跳转adminLevelList 根据type区分列表类型
    if (this.data.userType == 3) {
      wx.navigateTo({
        url: `../adminLevelList/adminLevelList?type=${type}`
      });
    } else {
      if (this.data.userType == 1 && e.currentTarget.dataset.usertype) {
        wx.navigateTo({
          url: `../adminLevelList/adminLevelList?type=${6}`
        });
      } else {
        wx.navigateTo({
          url: `../levelList/levelList?type=${type}&userType=${this.data.listType}`
        });
      }
    }
  },
  // 返回上一页
  back() {
    wx.navigateBack();
  },

  /**
   * 跳转到统计页
   */
  openViewProductList(event) {
    wx.navigateTo({
      url: "../statistics/statistics?type=4" + "&status=" + event.currentTarget.dataset.cap
    });
  },

  /**
   * 获取运营商统计数据
   */
  getYunYingShangData() {
    fly.request({
      method: "get",
      url: serviceHost + "/RBusinessProviderController/businessProviderStaticsInfo",
      body: {
        userId: this.data.userId
      }
    }).then(res => {
      if (res.data.success && res.data.data) {
        let staticsData = res.data.data.staticsData || {};
        let shaicha = {};
        let yingyangtuijian = {};
        let tuijianchanpin = {};
        if (Object.keys(staticsData).length) {
          staticsData = staticsData[7];
          console.log("staticsData===", staticsData);
          shaicha = {
            shaichashu: staticsData.saichashu,
            shaichakaidanshu: staticsData.saichakaidanshu,
            goumailv: staticsData.saichagoumailv,
            goumaidanshu: staticsData.saichagoumaishu,
            zongyingxiaoe: staticsData.saichazongxiaoshouzongshu
          };
          yingyangtuijian = {
            tuijianshu: staticsData.fangankaidan,
            goumailv: staticsData.fangangoumailv,
            goumaidanshu: staticsData.fangangoumai,
            zongyingxiaoe: staticsData.fanganzongxiaoshouzongshu
          };
          tuijianchanpin = {
            kaidanshu: staticsData.tuijiankaidan,
            goumailv: staticsData.tuijiangoumailv,
            goumaidanshu: staticsData.tuijiangoumaishu,
            zongyingxiaoe: staticsData.tuijianzongxiaoshouzongshu
          };
        }
        this.setData({
          updateTime: res.data.data.date || "",
          staticsAllData: res.data.data.staticsData,
          tuijianchanpin: tuijianchanpin,
          yingyangtuijian: yingyangtuijian,
          shaicha: shaicha,
          y_guanlian_patient_number: res.data.data.patientNum,
          y_guanlian_doctor_number: res.data.data.doctorNum,
          y_gui_number: res.data.data.deviceNum,
          xiaji_yizhu_number: res.data.data.assistantNum
        });
        console.log("this.data.shaicha", this.data.shaicha);
      } else {
        wx.showToast({
          title: res.data.message || "操作失败",
          icon: "none",
          duration: 2000
        });
      }
    }).catch(e => {
      console.log(e);
    });
  },

  /**
   * 获取医助统计数据
   */
  getYiZhuData() {
    fly.request({
      method: "get",
      url: serviceHost + "/RDoctorController/selectMapById",
      body: {
        id: this.data.userId
      }
    }).then(res => {
      if (res.data.success && res.data.data) {
        console.log("yizhuData====", res.data.data);
        let staticsData = res.data.data || {};
        let shaicha = {};
        let yingyangtuijian = {};
        let tuijianchanpin = {};
        if (Object.keys(staticsData).length) {
          staticsData = staticsData[7];
          shaicha = {
            shaichashu: staticsData.saichashu,
            shaichakaidanshu: staticsData.saichakaidanshu,
            goumailv: staticsData.saichagoumailv,
            goumaidanshu: staticsData.saichagoumaishu,
            zongyingxiaoe: staticsData.saichazongxiaoshouzongshu
          };
          yingyangtuijian = {
            tuijianshu: staticsData.fangankaidan,
            goumailv: staticsData.fangangoumailv,
            goumaidanshu: staticsData.fangangoumai,
            zongyingxiaoe: staticsData.fanganzongxiaoshouzongshu
          };
          tuijianchanpin = {
            kaidanshu: staticsData.tuijiankaidan,
            goumailv: staticsData.tuijiangoumailv,
            goumaidanshu: staticsData.tuijiangoumaishu,
            zongyingxiaoe: staticsData.tuijianzongxiaoshouzongshu
          };
        }
        this.setData({
          updateTime: res.data.data["date"] || "",
          staticsAllData: staticsData,
          tuijianchanpin: tuijianchanpin,
          yingyangtuijian: yingyangtuijian,
          shaicha: shaicha,
          yz_tuiguang_doctor_number: res.data.data[0].tuiguangyishengshu || 0,
          yz_guanlian_patient_number: res.data.data[0].guanlianhuanzheshu || 0
        });
      } else {
        wx.showToast({
          title: res.data.message || "操作失败",
          icon: "none",
          duration: 2000
        });
      }
    }).catch(e => {
      console.log(e);
    });
  },

  /**
   * 获取产品专员统计数据
   */
  getChanPinZhuanYuanData() {
    fly.request({
      method: "get",
      url: serviceHost + "/RProductCommissionerController/productCommissionerStaticsInfo",
      body: {
        userId: this.data.userId
      }
    }).then(res => {
      if (res.data.success && res.data.data) {
        let staticsData = res.data.data.staticsData || {};
        let shaicha = {};
        let yingyangtuijian = {};
        let tuijianchanpin = {};
        if (Object.keys(staticsData).length) {
          staticsData = staticsData[7];
          shaicha = {
            shaichashu: staticsData.saichashu,
            shaichakaidanshu: staticsData.saichakaidanshu,
            goumailv: staticsData.saichagoumailv,
            goumaidanshu: staticsData.saichagoumaishu,
            zongyingxiaoe: staticsData.saichazongxiaoshouzongshu
          };
          yingyangtuijian = {
            tuijianshu: staticsData.fangankaidan,
            goumailv: staticsData.fangangoumailv,
            goumaidanshu: staticsData.fangangoumai,
            zongyingxiaoe: staticsData.fanganzongxiaoshouzongshu
          };
          tuijianchanpin = {
            kaidanshu: staticsData.tuijiankaidan,
            goumailv: staticsData.tuijiangoumailv,
            goumaidanshu: staticsData.tuijiangoumaishu,
            zongyingxiaoe: staticsData.tuijianzongxiaoshouzongshu
          };
        }
        this.setData({
          updateTime: res.data.data.date || "",
          staticsAllData: res.data.data.staticsData,
          tuijianchanpin: tuijianchanpin,
          yingyangtuijian: yingyangtuijian,
          shaicha: shaicha,
          guanlian_doctor_number: res.data.data.patientNum,
          guanlian_patient_number: res.data.data.doctorNum,
          xiaji_yunyingshang_number: res.data.data.bussinessNum,
          xiaji_yizhu_number: res.data.data.assistantNum
        });
      } else {
        wx.showToast({
          title: res.data.message || "操作失败",
          icon: "none",
          duration: 2000
        });
      }
    }).catch(e => {
      console.log(e);
    });
  },

  /**
   * 获取总管统计数据
   */
  getZongGuanData() {
    let params = {
      mounthType: this.data.radio == 7 ? 0 : this.data.radio,
      provincecode: this.data.someAreas.provID || "",
      citycode: this.data.someAreas.cityID || ""
    };
    if (!params.provincecode) {
      delete params.provincecode;
    }
    if (!params.citycode) {
      delete params.citycode;
    }
    fly.request({
      method: "get",
      url: serviceHost + "/RManagerController/queryAllInformation",
      body: params
    }).then(res => {
      if (res.data.success && res.data.data) {
        let shaicha = {};
        let yingyangtuijian = {};
        let tuijianchanpin = {};
        shaicha = {
          shaichashu: res.data.data.nutritionPrescribePatientCount,
          shaichakaidanshu: res.data.data.nutritionPrescribePatientOrderCount,
          goumailv: res.data.data.nutritionPrescribePatientPurchaseRate,
          goumaidanshu: res.data.data.nutritionPrescribePatientPurchaseRate,
          zongyingxiaoe: (res.data.data.nutritionPrescribePatientOrderPriceTotal / 100).toFixed(2) || 0
        };
        yingyangtuijian = {
          tuijianshu: res.data.data.nutritionRecommendationsOrderCount,
          goumailv: res.data.data.paymentNutritionRecommendationsOrderPurchaseRate,
          goumaidanshu: res.data.data.paymentNutritionRecommendationsOrderCount,
          zongyingxiaoe: (res.data.data.paymentNutritionRecommendationsOrderPriceTotal / 100).toFixed(0) || 0
        };
        tuijianchanpin = {
          kaidanshu: res.data.data.proprietaryProductsOrderCount,
          goumailv: res.data.data.paymentProprietaryProductsOrderPurchaseRate,
          goumaidanshu: res.data.data.paymentProprietaryProductsOrderCount,
          zongyingxiaoe: (res.data.data.paymentProprietaryProductsOrderPriceTotal / 100).toFixed(0) || 0
        };
        this.setData({
          updateTime: res.data.data.date || "",
          tuijianchanpin: tuijianchanpin,
          yingyangtuijian: yingyangtuijian,
          shaicha: shaicha,
          doctor_number: res.data.data.doctorCount || 0,
          patient_number: res.data.data.patientCount || 0,
          hospital_number: res.data.data.hospitalCount || 0,
          gui_number: res.data.data.deviceCount || 0,
          zhuanyuan_number: res.data.data.productCommissionerCount || 0,
          yunxingshang_number: res.data.data.businessProviderCount || 0,
          yizhu_number: res.data.data.assistantCount || 0
        });
      } else {
        wx.showToast({
          title: res.data.message || "操作失败",
          icon: "none",
          duration: 2000
        });
      }
    }).catch(e => {
      console.log(e);
    });
  },
  /**
   * 医助下医生分布
   */
  getDocDistribution() {
    let that = this;
    fly.request({
      method: "GET",
      url: "/RDoctorController/fenbu",
      body: {
        id: this.data.userId,
        type: that.data.radio
      }
    }).then((res) => {
      console.log(res);
      if (res.data.success) {
        //存入相应信息
        if (res.data.data) {
          that.setData({
            docDistribution: res.data.data
          });
        } else {
          console.log("无相关统计信息");
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        });
        console.log(error);
      }
    }).catch((error) => {
      wx.showToast({
        title: error,
        icon: "none",
        duration: 2000
      });
      console.log(error);
    });
  }
});

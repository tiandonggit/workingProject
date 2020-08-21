// pages/medicalHelp/medicalHelp.js

var httpConfig = require("../../utils/httpConfig.js");
import fly from "./../../utils/request.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '', //导航栏高度
    navH1: '', //导航栏高度
    height: '', //医助列表高度
    top: 0, //医助列表距顶高度
    num: 0, //医助数量
    num_show: 0, //显示条数
    input: '', //输入框内容
    list: [], //测试医生列表
    hos_list: [], //测试医院列表
    hos_list1: [], //测试医院列表
    pos_list: [], //测试职员列表
    pos_list1: [], //测试职员列表
    inputValue: "", //input输入框值
    showClear: false, //删除展示隐藏
    other_list: [{
      name: '无康复任务',
      choose: false,
    }, {
      name: '未绑定智能柜',
      choose: false,
    }, {
      name: '无营养方案',
      choose: false,
    }, ], //测试其他列表
    other_list1: [{
      name: '无康复任务',
      choose: false,
    }, {
      name: '未绑定智能柜',
      choose: false,
    }, {
      name: '无营养方案',
      choose: false,
    }, ], //测试其他列表初始值
    hos_choose: '', //测试医生被选中
    pos_choose: '', //测试职员被选中
    other_choose: '', //测试其他被选中
    // type: 0, //展示哪张图片(0:没有绑定的医助;1:未查到此人)
    downArrow: true,
    //每页显示的行数：
    limit: 20,
    //页码（从1开始）：
    page: 1,
    //用于数组的追加和暂存
    allProject: [],
    id: "", //当前用户id

    areaChoose: "1", //地区选择方式(1:全部地区;2:部分地区)

    show: false,
    showArea: false,
    selectedArea: "", // 选择的地区
    selectedAreaID: {
      provID: "",
      cityID: ""
    }, //部分地区选择ID
    userType: 4, // 身份类型 0：产品专员 1：运营商 2 医助 3：总管理员 4:医院
    type: 1, // 列表类型 1.医院-医生 2.医院-智配柜 3.产品专员 4.运营商 5.医助,
    titleName: "", // 顶部name
    titleAddress: "", // 地址
    titleText: "", //医院 产品专员 运营商 医助
    subTitle: "",
    columns: [], //部分地区滚轮列表

    hospitalId: ""
  },
  clearInput() {
    this.setData({
      inputValue: "",
      input: "",
      showClear: false,
      page: 1,
      allProject: [],
      num: 0,
      num_show: 0
    });
    this.selectDoctor();
  },
  // 返回上一页
  back() {
    wx.navigateBack();
  },
  //跳转至消息页面
  information() {
    wx.navigateTo({
      url: '../information/information',
    })
  },
  //跳转至统计页面
  statistics() {
    wx.navigateTo({
      url: '../statistics/statistics?type=2',
    })
  },
  //跳转至医生信息页
  go(key) {
    wx.setStorageSync("doctor", this.data.list[key.currentTarget.dataset['index']])
    wx.navigateTo({
      url: '../statistics/statistics?type=3',
    })
  },
  //触底加载
  scrolltolower(e) {
    console.log("滚动到底部", e);
    if (this.data.lastPage) {
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    // getproinfo(this.data.pagesize, this.data.p, that);
    switch (this.data.type) {
      case "1":
        this.getDoctorList();
        break;
      case "2":
        this.getDeviceList();
        break;
      case "3":
        this.getBussinesserList();
        break;
      case "4":
        this.getDoctorAssistantList();
        break;
      case "5":
        this.selectDoctor();
        break;
    }
    wx.hideLoading();
  },
  //医院选择点击
  hosSelect(key) {
    let choose = "hos_list[" + key.currentTarget.dataset['index'] + "].choose";
    let choosed = this.data.hos_list[key.currentTarget.dataset['index']].choose;
    this.setData({
      [choose]: !choosed
    })
    // 查询此次点击的医院是否在已选中中,若有择清除,没有就增加
    if (this.data.hos_choose.includes("," + this.data.hos_list[key.currentTarget.dataset['index']].id)) {
      let needDelete = "," + this.data.hos_list[key.currentTarget.dataset['index']].id;
      this.setData({
        hos_choose: this.data.hos_choose.replace(needDelete, "")
      })
    } else {
      this.setData({
        hos_choose: this.data.hos_choose + ',' + this.data.hos_list[key.currentTarget.dataset['index']].id
      })
    }
  },
  //职称选择点击
  posSelect(key) {
    let choose = "pos_list[" + key.currentTarget.dataset['index'] + "].choose";
    let choosed = this.data.pos_list[key.currentTarget.dataset['index']].choose;
    this.setData({
      [choose]: !choosed
    })
    // 查询此次点击的职称是否在已选中中,若有择清除,没有就增加
    if (this.data.pos_choose.includes("," + this.data.pos_list[key.currentTarget.dataset['index']].code)) {
      let needDelete = "," + this.data.pos_list[key.currentTarget.dataset['index']].code;
      this.setData({
        pos_choose: this.data.pos_choose.replace(needDelete, "")
      })
    } else {
      this.setData({
        pos_choose: this.data.pos_choose + ',' + this.data.pos_list[key.currentTarget.dataset['index']].code
      })
    }
  },
  //其他选择点击
  otherSelect(key) {
    let choose = "other_list[" + key.currentTarget.dataset['index'] + "].choose";
    let choosed = this.data.other_list[key.currentTarget.dataset['index']].choose;
    this.setData({
      [choose]: !choosed
    })
    // 查询此次点击的其他类别是否在已选中中,若有择清除,没有就增加
    if (this.data.other_choose.includes("," + key.currentTarget.dataset['index'])) {
      let needDelete = "," + key.currentTarget.dataset['index'];
      this.setData({
        other_choose: this.data.other_choose.replace(needDelete, "")
      })
    } else {
      this.setData({
        other_choose: this.data.other_choose + ',' + key.currentTarget.dataset['index']
      })
    }
  },
  //医院下拉收起
  clicked() {
    this.setData({
      downArrow: !this.data.downArrow
    });
  },
  //右侧栏展开
  showPopup() {
    this.setData({
      show: true
    });
  },
  //右侧栏展开
  showPopupArea() {
    this.selectCity();
    this.setData({
      showArea: true
    });
  },
  //右侧栏收起
  onClose() {
    this.setData({
      show: false,
      showArea: false
    });
  },
  //重置按钮
  reset() {
    let hos = JSON.stringify(this.data.hos_list1);
    let pos = JSON.stringify(this.data.pos_list1);
    let other = JSON.stringify(this.data.other_list1);
    this.setData({
      hos_list: JSON.parse(hos),
      pos_list: JSON.parse(pos),
      other_list: JSON.parse(other),
      hos_choose: '',
      pos_choose: '',
      other_choose: '',
    })
  },
    /**
   * 重置地区选择
   */
  resetArea() {
    this.setData({
      selectedAreaID:{
        provID: "",
        cityID: "",
        placeSelectText:'全部地区'
      },
      areaChoose: "1"
    });
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
    let area = {
      provID: value.length && value[0].code || "",
      cityID: value.length == 2 && value[1] && value[1].code || ""
    };
    let placeSelectText = (value.length && value[0].text || "") + (" ") + (value.length == 2 && value[1] && value[1].text || "");
    this.setData({
      selectedAreaID: area,
      placeSelectText: placeSelectText
    });
    console.log("selectedAreaID: ", this.data.selectedAreaID);
  },

  //确定按钮
  find() {
    this.onClose();
    this.setData({
      page: 1,
      list: [],
      lastPage: false,
      num: 0,
      num_show: 0
    });
    this.data.type == 1 && this.getDoctorList();
    this.data.type == 2 && this.getDeviceList();
    this.data.type == 3 && this.getBussinesserList();
    this.data.type == 4 && this.getDoctorAssistantList();
    this.data.type == 5 && this.selectDoctor();
  },
  //查询医生列表
  selectDoctor() {
    let bodys = {};
    bodys.page = this.data.page;
    bodys.limit = this.data.limit;
    bodys.id = this.data.id;
    bodys.name = this.data.input;
    bodys.userType = this.data.userType;

    if (this.data.selectedAreaID.provID) {
      bodys.provID = this.data.selectedAreaID.provID
      if (this.data.selectedAreaID.cityID) {
        bodys.cityID = this.data.selectedAreaID.cityID
      }
    }

    if (this.data.hos_choose) {
      bodys.hospitalId = this.data.hos_choose.substr(1);
    }

    if (this.data.pos_choose) {
      bodys.positionCode = this.data.pos_choose.substr(1);
    }
    if (this.data.other_choose.includes(",0")) {
      bodys.renwu = 1
    }
    if (this.data.other_choose.includes(",1")) {
      bodys.zhinenggui = 1
    }
    if (this.data.other_choose.includes(",2")) {
      bodys.chufang = 1
    }
    var that = this;
    fly.request({
        method: 'GET',
        url: '/RDoctorController/selectByAcId',
        body: bodys
      })
      .then((res) => {
        var resData = res.data.data;
        var resLength = res.data.data.length;
        let page = this.data.page;
        page++;
        //循环将结果集追加到数组后面
        for (var i = 0; i < resLength; i++) {
          that.data.list.push(resData[i]);
        }
        that.setData({
          list: that.data.list,
          num: res.data.total,
          page: page,
        });
        if (this.data.list.length == res.data.total) {
          this.setData({
            lastPage: true
          });
        }
      })
      .catch((error) => {
        console.log('查询失败,', error);
      });
  },
  //查询医院列表
  queryHospital() {
    var that = this;
    fly.request({
        method: 'GET',
        url: '/RDoctorController/selectHospitalByAcId',
        body: {
          id: this.data.id,
          // id: "462336663138471937"
        }
      })
      .then((res) => {
        that.setData({
          hos_list: res.data.data,
          hos_list1: JSON.parse(JSON.stringify(res.data.data)),
        })
      })
      .catch((error) => {
        console.log('查询失败,', error);
      });
  },
  //查询职称列表
  queryPosition() {
    var that = this;
    fly.request({
        method: 'GET',
        url: '/SysDictionaryController/selectZhicheng',
        body: {
          id: this.data.id,
          // id: "462336663138471937"
        }
      })
      .then((res) => {
        that.setData({
          pos_list: res.data.data,
          pos_list1: JSON.parse(JSON.stringify(res.data.data)),
        })
      })
      .catch((error) => {
        console.log('查询失败,', error);
      });
  },
  // 实时获取input的数据值
  diseaseNameInput: function (e) {
    this.setData({
      input: e.detail.value
    })
    if (this.data.input) {
      this.setData({
        showClear: true
      })
    } else {
      this.setData({
        showClear: false
      })
    }
  },
  //搜索方法
  confirm: function (e) {
    this.setData({
      page: 1,
      list: [],
      lastPage: false,
      num: 0,
      num_show: 0
    });
    this.data.type == 1 && this.getDoctorList();
    this.data.type == 2 && this.getDeviceList();
    this.data.type == 3 && this.getBussinesserList();
    this.data.type == 4 && this.getDoctorAssistantList();
    this.data.type == 5 && this.selectDoctor();
  },

  //查询省市
  selectCity: function () {
    var that = this;
    fly.request({
        method: 'GET',
        url: 'https://lnyhz.quickhealmall.com/pfks_answerlottery/SysDictionaryController/selectCity'
      })
      .then((res) => {
        let arr = {
          id: "",
          type: "CITY",
          code: "",
          text: "全部",
          value: "2"
        }
        res.data.data[0]['citylist'].unshift(arr);
        let area = {
          provID: res.data.data[0].code,
          cityID: ''
        }
        that.setData({
          selectedAreaID: area,
          citys: res.data.data,
          columns: [{
              values: res.data.data,
              className: 'column1'
            },
            {
              values: res.data.data[0]['citylist'],
              className: 'column2',
            }
          ],
        })

        console.log('this.data.columns: ', this.data.columns);
      })
      .catch((error) => {
        console.log('查询失败,' + error);
      });
  },

  /**
   * 选择全部地区还是部分地区
   */
  selectArea(e) {
    if(e.currentTarget.dataset.index == 1) {
      this.setData({
        selectedAreaID:{
          provID: "",
          cityID: "",
          areaChoose: e.currentTarget.dataset.index,
          placeSelectText:'全部地区'
        },
      })
    }
    this.setData({
      areaChoose: e.currentTarget.dataset.index
    });
  },

  //监听地区滚轮变化改变值
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log('value====', value);
    try {
      if (value[0].citylist.length && value[0].citylist[0].text != "全部") {
        let arr = {
          id: "",
          type: "CITY",
          code: "",
          text: "全部",
          value: "2"
        }
        value[0].citylist.unshift(arr);
      }
    } catch (e) {
      console.log(e)
    }
    picker.setColumnValues(1, value[0].citylist);
    // console.log(event);
    // console.log(index);
    // console.log(value);
    if (index == '0') {
      // console.log(value);
      value[1] = value[0].citylist[0];
      // console.log(value);
    }
    let area = {
      provID: value.length && value[0].code || '',
      cityID: value.length == 2 && value[1].code || ''
    }
    this.setData({
      selectedAreaID: area
    })
  },

  // 地区选择器确定
  onConfirm(event) {
    this.onClose();
    this.setData({
      page: 1,
      list: [],
      lastPage: false,
      num: 0,
      num_show: 0
    });
    let {
      value
    } = event.detail;
    let area = {
      provID: value.length && value[0].code || '',
      cityID: value.length == 2 && value[1].code || ''
    }
    this.setData({
      selectedArea: value[0].text + "-" + value[1].text,
      selectedAreaID: area
    })
    this.data.type == 1 && this.getDoctorList();
    this.data.type == 2 && this.getDeviceList();
    this.data.type == 3 && this.getBussinesserList();
    this.data.type == 4 && this.getDoctorAssistantList();
    this.data.type == 5 && this.selectDoctor();
  },

  // 查看医生详情
  openDoctorDetails(key) {
    wx.setStorageSync("doctor", this.data.list[key.currentTarget.dataset['index']])
    wx.navigateTo({
      url: '../statistics/statistics?type=3',
    })
  },

  // 查看下级列表
  openLevelList(event) {
    let item = this.data.list[event.currentTarget.dataset['index']];
    let par = {
      userId: item.userId || item.id || "",
      name: item.bname || item.name || "",
      phone: item.pnone || item.phone || "",
      address: (item.provname || item.provName || item.prov || "") + "-" + (item.cityaname || item.cityName || item.city || "")
    }
    wx.setStorageSync("selected", par);
    wx.navigateTo({
      url: "../levelList/levelList?type=" + event.currentTarget.dataset.cap + "&userType=" + event.currentTarget.dataset.usertype
    })
  },
  // 跳转统计信息
  openStatisticalHome(event) {
    let item = this.data.list[event.currentTarget.dataset['index']]
    let par = {
      userId: item.id || item.userId || "",
      name: item.name || item.bname || "",
      phone: item.pnone || "",
      address:  (item.provname || item.provName || item.prov || "") + "-" + (item.cityaname || item.cityName || item.city || "")
    }
    let type = event.currentTarget.dataset.usertype;
    if(this.data.type == 2) {
      par.name = item.devicename || "",
      par.phone = item.devicecode || ""
    }
    wx.setStorageSync("selected", par)
    wx.navigateTo({
      url: `../statisticalHome/statisticalHome?userType=${type}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options: ', options);
    this.setData({
      type: options.type ? options.type : "1",
    })
    if (options.userType) {
      this.setData({
        userType: options.userType,
        titleName: wx.getStorageSync("selected").name || "",
        titleAddress: wx.getStorageSync("selected").address || "",
        hospitalId: options.hospitalId || "",
        id: wx.getStorageSync("selected").userId
      })

      this.setData({
        titleText: options.userType == '0' ? "产品专员" : options.userType == '1' ? "运营商" : options.userType == '2' ? "医助" : options.userType == '4' ? "医院" : "", // 0：产品专员 1：运营商 2 医助 3：总管理员
      })
    } else {
      let userType = wx.getStorageSync("userType");
      this.setData({
        userType: userType,
        titleName: wx.getStorageSync("userName") || "",
        titleAddress: wx.getStorageSync("userAddress") || "",
        id: wx.getStorageSync("userid") || ""
      })
      this.setData({
        titleText: userType == '0' ? "产品专员" : userType == '1' ? "运营商" : userType == '2' ? "医助" : userType == '4' ? "医院" : "", // 0：产品专员 1：运营商 2 医助 3：总管理员,
      })
    }
    let subTitle = "";
    switch (this.data.type) {
      case "1":
        subTitle = "医生";
        this.getDoctorList();
        break;
      case "2":
        subTitle = "智配柜";
        this.getDeviceList();
        break;
      case "3":
        subTitle = "运营商";
        this.getBussinesserList();
        break;
      case "4":
        subTitle = "医助";
        this.getDoctorAssistantList();
        break;
      case "5":
        subTitle = "医生";
        this.queryHospital();
        this.queryPosition();
        this.selectDoctor();
        break;
    }
    this.setData({
      subTitle: subTitle,
    })
    this.setData({
      navH: app.globalData.navHeight,
      navH1: app.globalData.statusBarHeight,
    })
    // this.queryHospital();
    // this.queryPosition();
    // this.selectDoctor();
    // this.selectCity();
  },

  // 获取智配柜列表
  getDeviceList() {
    fly.request({
        method: 'GET',
        url: '/MDeviceController/selectPageDevice',
        body: {
          page: this.data.page,
          limit: this.data.limit,
          provinceid: this.data.selectedAreaID.provID,
          cityid: this.data.selectedAreaID.cityID,
          rhospitalid: this.data.hospitalId,
          bussinessid: ""
        }
      })
      .then((res) => {
        if (res.data.success) {
          let list = this.data.list;
          let page = this.data.page;
          list = list.concat(res.data.data);
          page++;
          this.setData({
            list: list,
            page: page,
            num: res.data.total
          });
          if (this.data.list.length == res.data.total) {
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

      })
      .catch((error) => {
        console.log('查询失败,', error);
      });
  },

  // 获取医生列表
  getDoctorList() {
    fly.request({
        method: 'GET',
        url: '/RDoctorController/selectByHoDoc',
        body: {
          page: this.data.page,
          limit: this.data.limit,
          hospitalId: wx.getStorageSync("selected").userId,
          name: this.data.input,
          bussinessid: this.data.hospitalId,
          provinceid: this.data.selectedAreaID.provID,
          cityid: this.data.selectedAreaID.cityID,
        }
      })
      .then((res) => {
        if (res.data.success) {
          let list = this.data.list;
          let page = this.data.page;
          list = list.concat(res.data.data);
          page++;
          this.setData({
            list: list,
            page: page,
            num: res.data.total
          });
          if (this.data.list.length == res.data.total) {
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

      })
      .catch((error) => {
        console.log('查询失败,', error);
      });
  },

  // 获取产品专员或运营商下医助列表
  getDoctorAssistantList() {
    //运营商
    let bodys = {};
    bodys.page = this.data.page;
    bodys.limit = this.data.limit;
    this.data.selectedAreaID.provID && (bodys.provID = this.data.selectedAreaID.provID)
    this.data.selectedAreaID.cityID && (bodys.cityID = this.data.selectedAreaID.cityID);
    this.data.input && (bodys.name = this.data.input);
    bodys.type = this.data.userType == 0 ? 0 : this.data.userType == 1 ? 1 : "";
    bodys.id = this.data.id || "";

    var that = this;
    fly.request({
        method: 'GET',
        url: '/RAssistantController/selectRAssistantList',
        body: bodys
      })
      .then((res) => {
        // console.log(res.data.data);

        var resData = res.data.data;
        var resLength = res.data.data.length;
        //循环将结果集追加到数组后面
        for (var i = 0; i < resLength; i++) {
          that.data.list.push(resData[i]);
        }
        that.setData({
          list: that.data.list,
          num: res.data.total,
          num_show: that.data.num_show + res.data.data.length
        });
        if (that.data.list.length == res.data.data.total) {
          that.setData({
            lastPage: true
          });
        }
      })
      .catch((error) => {
        wx.showToast({
          title: "查询失败",
          icon: 'none',
          duration: 2000
        })
      });
  },

  // 获取产品专员下运营商列表
  getBussinesserList() {
    let params = {
      page: this.data.page,
      limit: this.data.limit,
      producterId: this.data.id,
      name: this.data.input,
    }
    if (this.data.selectedAreaID.provID) {
      params.provid = this.data.selectedAreaID.provID;
      if (this.data.selectedAreaID.cityID) {
        params.cityid = this.data.selectedAreaID.cityID
      }
    }
    fly.request({
        method: 'GET',
        url: '/RBpPcRelationController/bussinesserList',
        body: params
      })
      .then((res) => {
        // console.log(res.data.data);
        var resData = res.data.data;
        let page = this.data.page;
        page++;
        var resLength = res.data.data.length;
        //循环将结果集追加到数组后面
        for (var i = 0; i < resLength; i++) {
          this.data.list.push(resData[i]);
        }
        this.setData({
          list: this.data.list,
          num: res.data.total,
          page: page,
          num_show: this.data.num_show + res.data.data.length
        });
        if (this.data.list.length == res.data.total) {
          this.setData({
            lastPage: true
          });
        }
      })
      .catch((error) => {
        wx.showToast({
          title: "查询失败",
          icon: 'none',
          duration: 2000
        })
        console.log('查询失败,' + error);
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.createSelectorQuery().select('#list').boundingClientRect(function (rect) {
      console.log(rect.top) // 节点的上边界坐标

      that.setData({
        top: rect.top,
      })
    }).exec();
    setTimeout(() => {
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - that.data.top
      })
    }, 1000)
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
    console.log("123");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/medicalHelp/medicalHelp.js

var httpConfig = require("../../utils/httpConfig.js");
import fly from "./../../utils/request.js";
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '', //导航栏高度
    navH1: '', //导航栏高度
    height: '', //医助列表高度
    input: '', //input输入框的值
    top: 0, //医助列表距顶高度
    num: 0, //医助数量
    num_show: 0, //显示条数
    citys: [], //查询总省市
    list: [], //测试列表
    type: 0, //展示哪张图片(0:没有绑定的医助;1:未查到此人)
    inputValue: "", //input输入框值
    showClear: false, //删除展示隐藏
    operator_list: [], //测试运营商列表
    operator_list1: [], //测试运营商列表
    operator_choose: '', //测试运营商被选中  
    show: false, //侧拉栏展示隐藏
    downArrow: true, //运营商上拉下拉展示
    operator_type: "", //是否为运营商(1"是;0:不是)
    areaChoose: '1', //地区选择方式(1:全部地区;2:部分地区)
    columns: [], //部分地区滚轮列表
    //每页显示的行数：
    limit: 20,
    //页码（从1开始）：
    page: 1,
    //用于数组的追加和暂存
    allProject: [],
    someAreas: {} //部分地区选择结果
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
    this.selectMedicalHelpList();
  },
  //跳转至医生信息页
  go(key) {
    wx.setStorageSync("medicalhelp", this.data.list[key.currentTarget.dataset['index']])
    console.log(wx.getStorageSync("medicalhelp"));
    wx.navigateTo({
      url: '../statistics/statistics?type=1',
    })
  },
  //触底加载
  scrolltolower(e) {
    console.log("滚动到底部", e);
    if (this.data.num == this.data.num_show) {
      return false;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    that.setData({
      page: that.data.page + 1
    })
    this.selectMedicalHelpList()
    wx.hideLoading();
  },

  scrolltoupper(e) {

  },
  //查询省市
  selectCity: function() {
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
          someAreas: area,
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

        // console.log(res.data.data);
      })
      .catch((error) => {
        console.log('查询失败,' + error);
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
      someAreas: area
    })
  },
  //选择全部地区还是部分地区
  selectArea(key) {
    this.setData({
      areaChoose: key.currentTarget.dataset['index']
    })
  },
  //运营商选择
  select(key) {
    // //判断之前是否有选择
    // if (this.data.operator_choose) {
    //   let cancel = "operator_list[" + this.data.operator_choose + "].choose";
    //   this.setData({
    //     [cancel]: false,
    //   })
    // }
    let choose = "operator_list[" + key.currentTarget.dataset['index'] + "].choose";
    let choosed = this.data.operator_list[key.currentTarget.dataset['index']].choose;
    this.setData({
      [choose]: !choosed
    })
    // 
    if (this.data.operator_choose.includes("," + this.data.operator_list[key.currentTarget.dataset['index']].id)) {
      let needDelete = "," + this.data.operator_list[key.currentTarget.dataset['index']].id;
      this.setData({
        operator_choose: this.data.operator_choose.replace(needDelete, "")
      })
    } else {
      this.setData({
        operator_choose: this.data.operator_choose + ',' + this.data.operator_list[key.currentTarget.dataset['index']].id
      })
    }
  },
  //下拉框点击展示收起
  clicked() {
    this.setData({
      downArrow: !this.data.downArrow
    });
  },
  //右边栏打开
  showPopup() {
    this.setData({
      show: true
    });
  },
  //右边栏收起
  onClose() {
    this.setData({
      show: false
    });
  },
  //重置按钮
  reset() {
    let operator = JSON.stringify(this.data.operator_list1);
    this.setData({
      operator_list: JSON.parse(operator),
      operator_choose: '',
      areaChoose: '1'
    })
  },
  //搜索方法
  confirm: function(e) {
    this.setData({
      page: 1,
      allProject: [],
      num: 0,
      num_show: 0
    })
    this.selectMedicalHelpList();
  },
  //确认按钮触发搜索
  find() {
    this.onClose();
    this.setData({
      page: 1,
      allProject: [],
      num: 0,
      num_show: 0
    })
    this.selectMedicalHelpList()
  },
  // 实时获取input的数据值
  diseaseNameInput: function(e) {
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
  //查询运营商
  queryOperators(id) {
    var that = this;
    fly.request({
        method: 'GET',
        url: '/RBusinessProviderController/selectListByPCId',
        body: {
          id: id
        }
      })
      .then((res) => {
        this.setData({
          operator_list: res.data.data,
          operator_list1: JSON.parse(JSON.stringify(res.data.data)),
        })
      })
      .catch((error) => {
        console.log('查询失败,' + error);
      });
  },
  //点击查询医生列表
  chooseDoctor(key) {
    wx.navigateTo({
      url: '../doctorList/doctorList?id=' + this.data.list[key.currentTarget.dataset['index']].id + "&name=" + this.data.list[key.currentTarget.dataset['index']].name + "&phone=" + this.data.list[key.currentTarget.dataset['index']].phone,
    })
  },
  //查询医助列表
  selectMedicalHelpList() {
    let bodys = {};
    if (wx.getStorageSync("userType") == '0') {
      //产品专员
      bodys.page = this.data.page;
      bodys.limit = this.data.limit;
      if (this.data.areaChoose == '2') {
        bodys.provID = this.data.someAreas.provID;
        if (this.data.someAreas.cityID) {
          bodys.cityID = this.data.someAreas.cityID;
        }
      }
      if (this.data.operator_choose) {
        bodys.rbId = this.data.operator_choose.substr(1);
      }
      bodys.name = this.data.input;
      bodys.type = 0;
      bodys.id = wx.getStorageSync("userid")
    } else {
      //运营商
      bodys.page = this.data.page;
      bodys.limit = this.data.limit;
      if (this.data.areaChoose == '2') {
        bodys.provID = this.data.someAreas.provID;
        if (this.data.someAreas.cityID) {
          bodys.cityID = this.data.someAreas.cityID;
        }
      }
      bodys.name = this.data.input;
      bodys.type = 1;
      bodys.id = wx.getStorageSync("userid")
    }

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
          that.data.allProject.push(resData[i]);
        }
        that.setData({
          list: that.data.allProject,
          num: res.data.total,
          num_show: that.data.num_show + res.data.data.length
        });
        if (res.data.data.length == '0') {
          if (that.data.input || that.data.operator_choose || (that.data.someAreas && that.data.areaChoose == 2)) {
            that.setData({
              type: 1
            })
          } else {
            that.setData({
              type: 0
            })
          }
        }
      })
      .catch((error) => {
        Toast.fail('查询失败,' + error);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.selectCity();
    if (wx.getStorageSync("userType") == '0') {
      this.queryOperators(wx.getStorageSync("userid"));
    }
    this.selectMedicalHelpList();
    // swiper设置高度
    var that = this;
    that.setData({
      navH: app.globalData.navHeight,
      navH1: app.globalData.statusBarHeight,
      operator_type: wx.getStorageSync("userType")
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.createSelectorQuery().select('#list').boundingClientRect(function(rect) {
      // console.log(rect.top)     // 节点的上边界坐标

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

  }
})
// pages/doctorList/doctorList.js
var httpConfig = require("../../utils/httpConfig.js");
import fly from "./../../utils/request.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',                  //医生列表高度
    top: 0,                      //医生列表距顶高度
    navH1: '',                   //导航栏高度
    id:"",                        //医助id
    name:'',                  //医助姓名
    tel: '',           //医助电话
    list: [
      
    ],                     //测试列表
    hos_list: [
      
    ],          //测试医院列表
    hos_list1: [
      
    ],          //测试医院列表
    pos_list: [
      
    ],            //测试职员列表
    pos_list1: [
      
    ],            //测试职员列表
    other_list: [
      {
        name: '无康复任务',
        choose: false,
      }, {
        name: '未绑定智能柜',
        choose: false,
      }, {
        name: '无营养方案',
        choose: false,
      },
    ],          //测试其他列表
    other_list1: [
      {
        name: '无康复任务',
        choose: false,
      }, {
        name: '未绑定智能柜',
        choose: false,
      }, {
        name: '无营养方案',
        choose: false,
      },
    ],          //测试其他列表初始值
    hos_choose: '',         //测试医生被选中  
    pos_choose: '',         //测试职员被选中  
    other_choose: '',       //测试其他被选中 
    show: false,
    downArrow: true,
    //每页显示的行数：
    limit: 20,
    //页码（从1开始）：
    page: 1,
    //用于数组的追加和暂存
    allProject: [],
    //总数据数
    num:0,
    //已显示条数
    num_show:0
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
    if(this.data.num==this.data.num_show){
      return false;
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    that.setData({
      page: that.data.page + 1
    })
    // getproinfo(this.data.pagesize, this.data.p, that);
    this.selectDoctor();
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
    this.setData({ downArrow: !this.data.downArrow });
  },
  //右侧栏展开
  showPopup() {
    this.setData({ show: true });
  },
  //右侧栏收起
  onClose() {
    this.setData({ show: false });
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
  //确定按钮
  find(){
    this.onClose();
    this.setData({
      page:1,
      allProject: [],
      num: 0,
      num_show: 0
    });
    this.selectDoctor();
  },
  //查询医生列表
  selectDoctor(){
    let bodys = {};
    bodys.page = this.data.page;
    bodys.limit = this.data.limit;
    bodys.id = this.data.id;
    bodys.name = "";
    if (this.data.hos_choose) {
      bodys.hospitalId = this.data.hos_choose.substr(1);
    }

    if (this.data.pos_choose) {
      bodys.positionCode = this.data.pos_choose.substr(1);
    }
    if (this.data.other_choose.includes(",0")){
      bodys.renwu=1
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
        //循环将结果集追加到数组后面
        for (var i = 0; i < resLength; i++) {
          that.data.allProject.push(resData[i]);
        }
        that.setData({
          list: that.data.allProject,
          num:res.data.total,
          num_show: that.data.num_show + res.data.data.length
        });
      })
      .catch((error) => {
        console.log('查询失败,' , error);
      });
  },
  //查询医院列表
  queryHospital(){
    var that = this;
    fly.request({
      method: 'GET',
      url: '/RDoctorController/selectHospitalByAcId',
      body: {
        id: this.data.id,
        // id:"462336663138471937"
      }
    })
      .then((res) => {
        that.setData({
          hos_list:res.data.data,
          hos_list1:JSON.parse(JSON.stringify(res.data.data)),
        })
      })
      .catch((error) => {
        console.log('查询失败,' , error);
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH1: app.globalData.statusBarHeight,
      id: options.id,
      name: options.name,
      tel: options.phone
    })
    this.queryHospital();
    this.queryPosition();
    this.selectDoctor();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.createSelectorQuery().select('#list').boundingClientRect(function (rect) {
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
console.log(13);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
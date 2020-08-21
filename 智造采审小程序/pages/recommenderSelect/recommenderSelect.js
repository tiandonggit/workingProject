// 推荐人选择列表
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js";

const app = getApp();
Page({
  data: {
    imgUrl: 'http://pfks-oss-center.oss-cn-beijing.aliyuncs.com/075244A9DC1949029E638FD0630C378B.jpg', // 测试用
    searchvalue: "",
    height: 100, // scroll-view的高度(动态计算)
    page: 1,
    limit: 15,
    total_num: 0, // list总数
    top: 0, // list距离顶部的高度
    userType: '',
    list: [],
    isFind:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userType: Number(options.userType)
    })
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    wx.createSelectorQuery().select("#list").boundingClientRect(function(rect) {
      that.setData({
        top: rect.top
      });
    }).exec();
    setTimeout(() => {
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - that.data.top
      });
    }, 1000);
  },


  /**
   * 搜索框搜索事件
   * **/
  onSearch() {
    let that = this;
    setTimeout(()=>{
      that.setData({
        page: 1,
        list: []
      })
      console.log('searchvalue===', that.data.searchvalue)
      that.getList();
    },100)
  },

  /*监听搜索输入框的值*/
  onChange(event) {
    this.setData({
      searchvalue: event.detail
    })
  },

  /**
   * 搜索框取消事件
   **/
  onCancel() {
    console.log("onCancel emit");
  },

  /**
   * scroll-view 滑到底部加载
   * **/
  scrolltolower() {
    if (this.data.list.length < this.data.total_num) {
      this.getList();
    }
  },

  /**
   * 获取推荐人列表 userType:1 接口返回的产品专员列表  userType:2 接口返回的是运营商列表
   */
  getList() {
    this.setData({
      isFind:true
    })
    let params = {
      commitType: this.data.userType,
      name: this.data.searchvalue,
      limit: 20,
      page: this.data.page
    }
    fly.request({
      method: "get",
      url: httpConfig.serviceHost + "/RUnionidBindUserController/referenceList",
      body: params
    }).then(res => {
      if (res.data.success) {
        let list = res.data.data || [];
        let total_num = res.data.total;
        let page = this.data.page++;
        if (this.data.list.length) {
          list = this.data.list.concat(list);
        }
        this.setData({
          list: list,
          page: page,
          total_num: total_num
        })
      }
    }).catch(e => {
      console.log(e)
    })
  },

  /**
   * 推荐人select 保存推荐人id和name
   * **/
  selectRecommender(e) {
    wx.setStorageSync("referencename", e.currentTarget.dataset.name);
    wx.setStorageSync("referenceId", e.currentTarget.dataset.id);
    wx.redirectTo({
      url: "../registerIndex/registerIndex"
    });
  }
});
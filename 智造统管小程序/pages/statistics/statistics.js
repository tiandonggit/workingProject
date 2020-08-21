// pages/statistics/statistics.js
import httpConfig from "../../utils/httpConfig.js";
import fly from "./../../utils/request.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //弹出层状态
    radio: '2', //时间单选项
    type: 1, //页面类型 1:医助信息综合统计(产品专员登录);2:医助信息展示(医助登录);3医生信息页;4医助产品销量统计;5医生产品销售统计
    status:1, //产品销售统计类型:1:智能柜 2:自营
    id: "", //通用id
    scrollHeight:0,
    mainInfo: {
      "1": {
        "goumaihuanzheshu": 0,
        "fugouhuanzheshu": 0,
        "saichagoumaishu": 0,
        "tuijiankaidan": 0,
        "saichagoumailv": 0.0,
        "saichashu": 0,
        "fangangoumailv": 0.0,
        "tuijianzongxiaoshouzongshu": 0,
        "guanlianhuanzheshu": 0,
        "saichakaidanshu": 0,
        "fanganzongxiaoshouzongshu": 0,
        "fangangoumai": 0,
        "tuijiangoumailv": 0.0,
        "fangankaidan": 0,
        "tuijiangoumaishu": 0,
        "tuiguangyishengshu": 0,
        "saichazongxiaoshouzongshu": 0
      },
      "2": {
        "goumaihuanzheshu": 0,
        "fugouhuanzheshu": 0,
        "saichagoumaishu": 0,
        "tuijiankaidan": 0,
        "saichagoumailv": 0.0,
        "saichashu": 0,
        "fangangoumailv": 0.0,
        "tuijianzongxiaoshouzongshu": 0,
        "guanlianhuanzheshu": 0,
        "saichakaidanshu": 0,
        "fanganzongxiaoshouzongshu": 0,
        "fangangoumai": 0,
        "tuijiangoumailv": 0.0,
        "fangankaidan": 0,
        "tuijiangoumaishu": 0,
        "tuiguangyishengshu": 0,
        "saichazongxiaoshouzongshu": 0
      },
      "7": {
        "goumaihuanzheshu": 0,
        "fugouhuanzheshu": 0,
        "saichagoumaishu": 0,
        "tuijiankaidan": 0,
        "saichagoumailv": 0.0,
        "saichashu": 0,
        "fangangoumailv": 0.0,
        "tuijianzongxiaoshouzongshu": 0,
        "guanlianhuanzheshu": 0,
        "saichakaidanshu": 0,
        "fanganzongxiaoshouzongshu": 0,
        "fangangoumai": 0,
        "tuijiangoumailv": 0.0,
        "fangankaidan": 0,
        "tuijiangoumaishu": 0,
        "tuiguangyishengshu": 0,
        "saichazongxiaoshouzongshu": 0
      }
    },//医助和医生信息,
    docDistribution:[],//医助的医生身份
    productList: [
      // { id: 1, goodname: "营养蛋白复合粉(均衡型)", num: 123 }, 
      // { id: 1, goodname: "营养蛋白复合粉(支链氨基酸)", num: 200 }
    ] //产品销量统计
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setScrollHeight();
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
   * 初始化相关信息
   */
  init(options) {
    let that = this;
    //将当前登录人信息存入至data中
    that.setData({
      type: options.type ? options.type : "1",
      status: options.status ? options.status : "1"
    })
    //根据页面类型显示不同的标题
    //-标题
    let title = "";
    //-通用id
    let id = "";
    //-医生信息
    let doctorInfo = {
      // id: "475060241277521923",
      // name: "王洪洲周那个周",
      // phone: "15998141599",
      // vxheadurl: "http://thirdwx.qlogo.cn/mmopen/Ribb10RZkiclWzTwtecvrTMZ8aCrTHR5XP7Yd0dLbP4ybnyHmj2icFfD6wW9lvR4Wk9xVKcEBa7tK0gI6WyvusYneibnJL88wXibo/132",
      // hospitalname: "中国医科大学附属盛京医院",
      // dictext: "主任医师",
      // depname: "消化内科"
    };
    //-医助信息
    let assistantInfo = {
      // id:1,
      // name:"恬冬咚那个咚",
      // phone:"15541257453",
      // img:""
    };

    //wx.setStorageSync("medicalhelp",assistantInfo);
    //wx.setStorageSync("doctor", doctorInfo);

    switch (that.data.type) {
      case "1":
        title = "综合统计";
        assistantInfo = wx.getStorageSync("medicalhelp");
        id = assistantInfo.id;

        break;
      case "2":
        title = "综合统计";
        assistantInfo = wx.getStorageSync("medicalhelp");
        id = assistantInfo.id;

        break;
      case "3":
        title = "医生信息";
        doctorInfo = wx.getStorageSync("doctor");
        id = doctorInfo.id;

        break;
      case "4":
        title = that.data.status == 1?"智能柜产品":"自营产品";
        assistantInfo = wx.getStorageSync("medicalhelp");
        id = assistantInfo.id;

        break;
      case "5":
        title = that.data.status == 1 ? "智能柜产品" : "自营产品";
        doctorInfo = wx.getStorageSync("doctor");
        id = doctorInfo.id;

        break;
      default:
        title = ""
    }
    wx.setNavigationBarTitle({
      title: title
    })
    //存入相应信息
    that.setData({
      assistantInfo: assistantInfo,
      doctorInfo: doctorInfo,
      id: id
    });
    that.getBaseMain();
  },

  /**
   * 跳转到医生列表页面
   */
  openViewDoctorList() {
    wx.navigateTo({
      url: '../doctorList/doctorList?id=' + this.data.assistantInfo.id + "&name=" + this.data.assistantInfo.name + "&phone=" + this.data.assistantInfo.phone,
    })
  },

  /**
   * 跳转到统计页
   */
  openViewProductList(event) {
    wx.navigateTo({
      url: "../statistics/statistics?type=" + (this.data.type == 3 ? 5 : 4) + "&status=" + event.currentTarget.dataset.cap
    })
  },

  /**
   * 医生跳转至其它列表页
   */
  openOtherList(event){
    wx.navigateTo({
      url: "../statisticalList/statisticalList?type=" + event.currentTarget.dataset.cap
    })
  },

  /**
   * 展示弹出层
   */
  showPopup() {
    this.setData({
      show: true
    });
  },

  /**
   * 关闭弹出层
   */
  onClose() {
    this.setData({
      show: false
    });
  },

  /**
 * 设置滚动部分页面高度
 */
  setScrollHeight() {
    let rpx;
    let that = this;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 750;
      },
    })
    const query = wx.createSelectorQuery()
    query.select(".body").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function (res) {
      that.setData({
        scrollHeight: res[0].height / rpx
      })
      //设置滚动区域的高度
    })
  },

  /**
   * 切换日期筛选
   */
  onChange(event) {
    this.setData({
      radio: event.currentTarget.dataset.cap,
      show:false
    });
    if(this.data.type == 4 || this.data.type == 5){
      this.getProductorMain();
    }else if(this.data.type == 1 || this.data.type == 2){
       this.getDocDistribution();
    }
  },

  /**
   * 公共查询统计信息
   */
  getBaseMain() {
    let type = this.data.type;
    if (type == 1 || type == 2 || type == 3) {
      if(type == 1 || type == 2){
        this.getDocDistribution();
      }
      this.getAssistantMainAndDoctorMain();
    } else if (type == 4 || type == 5) {
      this.getProductorMain();
    }
  },

  /**
   * 查询医助和医生统计信息
   */
  getAssistantMainAndDoctorMain() {
    let that = this;
    fly.request({
        method: 'GET',
        url: '/RDoctorController/selectMapById',
        body: {
          id: that.data.id
        },
        headers: {
          // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
        }
      })
      .then((res) => {
        console.log(res);
        if(res.data.success){
          //存入相应信息
          if(res.data.data){
            that.setData({
              mainInfo: res.data.data
            });
          }else{
              console.log("无相关统计信息");
          }
        }else{
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
  },

  /**
   * 医助下医生分布
   */
  getDocDistribution() {
    let that = this;
    fly.request({
      method: 'GET',
      url: '/RDoctorController/fenbu',
      body: {
        id: that.data.id,
        type: that.data.radio
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
              docDistribution: res.data.data
            });
          } else {
            console.log("无相关统计信息");
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
  },



  /**
   * 获取产品销量统计信息
   */
  getProductorMain() {
    let that = this;
    fly.request({
      method: 'GET',
      url: '/RAssistantController/selectR' + (that.data.type == 4 ? 'Assistant' :'doctor')+'SaleNumById',
      body: {
        id: that.data.id,
        type:that.data.radio,
        status:that.data.status
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
              productList: res.data.data
            });
          } else {
            console.log("无相关统计信息");
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
  },








})
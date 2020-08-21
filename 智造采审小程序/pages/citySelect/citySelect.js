// pages/demo/demo.js
// let City = require('../../utils/allcity.js');
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js"
Page({

  data: {
    parentId:"",//省父级ID，关联市
    isIphoneX:false,//iphoneX适配
    city: [],
    config: {
      horizontal:true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 48, // 搜索条高度
      suctionTop: true, // 是否开启标题吸顶
      IndexesTitle:"城市选择"// 索引标题
    },
    selectCity:"选择城市",//选中城市
    list: [],
    rightArr: [], // 右侧字母展示
    jumpNum: '', //跳转到那个字母
    myCityName: '请选择', // 默认我的城市
    topGroup: [], // 内容高度数据
    pos: {
        isTop: false,
        y: 0,
        oldIndex: -1
    },
    listIndex: 0,
    moveDistance: 0,
    IndexesTitle:""
  },
  onLoad(options) {
    this.setData({
      parentId:options.parentId
     })

    var that = this;
    //iphonrx 适配
    wx.getSystemInfo({
           success: function (res) {
       console.log(res.model)
                if (res.model === 'iPhone X') {
       console.log("45654")
                       that.setData({
                               isIphoneX: true
                       })
                }else{
              console.log("1111111111111")
                  that.setData({
                           isIphoneX: false
                         })
          }
              }
     })

    fly.request({
      method: 'get',
      url: httpConfig.serviceHost+'/SysDictionaryController/selectCities?parentId='+this.data.parentId,
      body: {
       
      },
      headers: {
        // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
      }
    })
    .then((res) => {
          // console.log(res)
          // console.log(JSON.stringify(res.data.data));

 var abc=["A"]
 var cityData=[]
 console.log(res.data.data.length)
 console.log(res.data.data[0].capital)
 for(var i=0;i<abc.length;i++)
 {
   var obj = {};
   obj.title=abc[i]
    obj.item=[];
  for(var k=0; k<res.data.data.length; k++ ){
   // console.log(res.data.data.length)
   //if(res.data.data[k].Capital_==obj.title){
     obj.item.push({
       capital:res.data.data[k].Capital_,
       id:res.data.data[k].id,
       code:res.data.data[k].Code_,
       name:res.data.data[k].Text_
     })
  // }
 
  }

cityData.push(obj);
}


// var abc=["A"]
// var cityData=[]
// console.log(res.data.data.length)
// console.log(res.data.data[0].capital)
// //for(var i=0;i<abc.length;i++)
// //{
//   var obj = {};
//   obj.title=abc[i]
//    obj.item=[];
//  for(var k=0; k<res.data.data.length; k++ ){
//   // console.log(res.data.data.length)
//   //if(res.data.data[k].Capital_==obj.title){
//     obj.item.push({
//       capital:res.data.data[k].Capital_,
//       id:res.data.data[k].id,
//       code:res.data.data[k].Code_,
//       name:res.data.data[k].Text_
//     })
//  // }

// // }

// cityData.push(obj);
// }


this.setData({
  city: cityData
})
 this.resetRight(cityData)
// console.log(JSON.stringify(cityData))
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
  bindtap(e) {
    console.log(e.detail);
    console.log(e.detail.name);
    console.log(e.detail.code);
    wx.redirectTo({
      url: "../registerIndex/registerIndex?cityName="+e.detail.name+"&cityId="+e.detail.code
    })
  },
//列表
  /**
         * 数据重新渲染
         */
        resetRight(data) {
          console.log(data)
          let rightArr = []
          // if (this.data.myCity) {
          //     this.data.data.unshift({
          //         title: '我的定位',
          //         type: 'me',
          //         item: [{
          //             name: '点击获取我的位置',
          //             key: '我的定位'
          //         }]
          //     })
          // }
          for (let i in data) {
              rightArr.push(data[i].title.substr(0, 1));
          }
          this.setData({
              list: data,
              rightArr
          }, () => {
              if (data.length != 0) {
                  this.queryMultipleNodes();
              }
          })
      },
      // getCity() {
      //   wx.getLocation({
      //     type: 'wgs84',
      //     success: function (res) {
      //       this.latitude = res.latitude;
      //       this.longitude = res.longitude;
      //       // console.log(res)
      //     }
      //   })
      // },
      /**
       * 右侧字母点击事件
       */
      jumpMt(e) {
          console.log(e.currentTarget.dataset.id)
          let jumpNum = e.currentTarget.dataset.id;
          this.setData({
              jumpNum,
          });
      },
      /**
       * 列表点击事件
       */
      detailMt(e) {
          console.log("列表点击----"+JSON.stringify(e.currentTarget.dataset.detail))
          let detail = e.currentTarget.dataset.detail;
          wx.navigateTo({
            url: "../registerIndex/registerIndex?cityName="+detail.name+"&cityId="+detail.code
          })

      },
      // 获取搜索输入内容
      input(e) {
          this.value = e.detail.value;
          console.log(e.detail.value);
          this._search();
      },
      // 基础搜索功能
      searchMt() {
          console.log("searchMt")
          this._search();
      },
      /**
       * 搜索相关逻辑实现
       */
      _search() {
          let data = this.data.city;
          console.log(this.data.data)
          let newData = [];
          for (let i = 0; i < data.length; i++) {
              let itemArr = [];
              for (let j = 0; j < data[i].item.length; j++) {
                  if (data[i].item[j].name.indexOf(this.value) > -1) {
                      let itemJson = {};
                      for (let k in data[i].item[j]) {
                          itemJson[k] = data[i].item[j][k];
                      }
                      itemArr.push(itemJson);
                  }
              }
              if (itemArr.length === 0) {
                  continue;
              }
              newData.push({
                  title: data[i].title,
                  type: data[i].type ? data[i].type : "",
                  item: itemArr
              })
          }
          this.resetRight(newData);
      },
      // 城市定位
      locationMt() {
          // TODO 暂时没有实现 定位自己的城市，需要引入第三方api
      },
      /**
       * 监听滚动
       */
      scroll(e) {
          let top = e.detail.scrollTop
          let index = this.currentIndex(top)
          let list = this.data.topGroup
          let distance = top - list[this.data.listIndex]
          let num = -(list[this.data.listIndex + 1] - top - 40)
          // 渲染滚动索引
          if (index !== this.data.listIndex) {
              // console.log(index)
              this.setData({
                  // 'pos.oldIndex': index,
                  listIndex: index,
                  moveDistance: 40,
              })
              // 如果监听到 index 的变化 ，一定要return ，否则吸顶会先变化文字后运动，会闪烁
              return
          }
          if (num < 0) num = 0
          if (num !== this.data.moveDistance) {
              this.setData({
                  moveDistance: num,
              })
          }
      },
      /**
       * 获取当前滚动索引
       */
      currentIndex(y) {
          // console.log(y)
          let listHeight = this.data.topGroup
          for (let i = 0; i < listHeight.length; i++) {
              let height1 = listHeight[i]
              let height2 = listHeight[i + 1]
              if (!height2 || (y >= height1 && y < height2)) {
                  return i
              }
          }
          return 0
      },
      /**
       * 获取节点信息
       */
      queryMultipleNodes() {
        let self = this 
          const query = wx.createSelectorQuery().in(this);
          query.selectAll('.fixed-title-hock').boundingClientRect((res) => {
              res.forEach(function(rect) {
                  rect.top // 节点的上边界坐标
              })
          }).exec((e) => {
              let arr = []
              e[0].forEach((rect) => {
                  let num = 0
                  if (rect.top !== 0) {
                    num = rect.top - (self.data.config.search ? self.data.config.searchHeight : 0)
                  }
                  arr.push(num)
              })
              this.setData({
                  topGroup: arr
              })
          })
      }


})
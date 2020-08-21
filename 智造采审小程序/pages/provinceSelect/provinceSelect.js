// pages/demo/demo.js
// let City = require('../../utils/allcity.js');
var httpConfig = require("../../utils/httpConfig.js");
import fly from "../../utils/request.js"
Page({

  data: {
    isIphoneX:false,//iphoneX适配
    city: [],
    config: {
      horizontal:true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 45, // 搜索条高度
      suctionTop: true, // 是否开启标题吸顶
      IndexesTitle:"省份选择"// 索引标题
    }
  },
  onLoad() {
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
      url: httpConfig.serviceHost+'/SysDictionaryController/selectProvinces',
      body: {
       
      },
      headers: {
        // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
      }
    })
    .then((res) => {
          // console.log(res)
          // console.log(JSON.stringify(res.data.data));


var abc=["A","B","F","G","H","J","L","N","Q","S","T","X","Y","Z"]
var cityData=[]
console.log(res.data.data.length)
console.log(res.data.data[0].capital)
for(var i=0;i<abc.length;i++)
{
  var obj = {};
  obj.title=abc[i]
  //  obj.title=String.fromCharCode((65+i));
  //  console.log(obj.title)
   obj.item=[];
 for(var k=0; k<res.data.data.length; k++ ){
  // console.log(res.data.data.length)
  if(res.data.data[k].Capital_==abc[i]){
    obj.item.push({
      Capital_:res.data.data[k].Capital_,
      id:res.data.data[k].id,
      code:res.data.data[k].Code_,
      name:res.data.data[k].Text_,
      parentId:res.data.data[k].Id_
    })
  }

 }

// console.log(String.fromCharCode((65+i)));
// cityData.push({"title":String.fromCharCode((65+i))});
   
cityData.push(obj);
}

this.setData({
  city: cityData
})

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
    console.log(e.detail.code)
    wx.redirectTo({
      url: "../registerIndex/registerIndex?provinceName="+e.detail.name+"&provinceId="+e.detail.code+"&parentId="+e.detail.parentId
    })
  },

})
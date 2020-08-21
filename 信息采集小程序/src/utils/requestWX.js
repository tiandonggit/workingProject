// var Fly=require("../utils/wx.js") //wx.js is your downloaded code
import Fly from 'flyio/dist/npm/wx'
// import config from '../utils/httpConfig'
import httpConfig from '@/utils/httpConfig'

const fly = new Fly() // Create an instance of Fly

const host = httpConfig.serviceHost
// Add interceptors
fly.config.timeout = 10 * 1000

fly.config.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}
fly.interceptors.request.use((config, promise) => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // Add custom headers
  // if (config.method === 'post') {
  //   config.data = this.$qs.stringify(config.data)
  // }
  return config
})
fly.interceptors.response.use(
  (response, promise) => {
    if (typeof (response.data) === 'string' && response.data != '') {
      response.data = JSON.parse(response.data)
    }

    if (response.data.code === 'C501') {}
    wx.hideLoading()

    // response.data=Mock.mock(response.data)
    // Do something with response data .
    // Just return the data field of response
  },
  (err, promise) => {
    // Do something with response error
    // promise.resolve("ssss")

    wx.hideLoading()

    if (err.status == 0) {
      return '网络连接异常'
    } else if (err.status === 1) {
      return '网络连接超时'
    } else if (err.status === 401) {
      return '用户未登录'
    }
    if (err.response.data.message) {
      return err.response.data.message
    }
    return '请求数据失败,请稍后再试'


    // wx.showToast({
    //   title:'网络不流畅，请稍后再试！',
    //   icon:'none',
    // });
  }

)
// Set the base url
fly.config.baseURL = host

export default fly

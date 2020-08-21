// 服务地址
const serviceHost =
  process.env.NODE_ENV === 'development'
    ? 'https://yhz.quickhealmall.com/api' // 测试服api地址  https://bbjk.quickhealmall.com/api/
    : 'https://yhz.quickhealmall.com/api' // 正式服api地址   https://yhz.quickhealmall.com/api/
// // 便于使用多个域名11111111111111
// const globalServiceHost = {
//   mockServiceHost: `${serviceHost.substring(0, serviceHost.length - 5)}/ygtapi` // 药柜api接口
// }
const servicePort = '8080' // 8080
const serviceName = '' // FishFamily
const chenID = ''
// 移动端调试控制台  true开启，false关闭，web，小程序通用
const VDebug = true
const httpConfig = {
  VDebug,
  serviceHost,
  servicePort,
  serviceName,
  chenID
}
module.exports = httpConfig

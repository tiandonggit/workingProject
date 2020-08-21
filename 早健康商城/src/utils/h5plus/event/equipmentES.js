
//     页面:验证环境
// 开发者:王海洋

const equipmentES = {
  plus: false,
  stream: false,
  wechat: false,
  android: false,
  iphone: false,
  ipad: false,
  version: ""
};
let ua = navigator.userAgent;
// plus
let plus = ua.match(/Html5Plus/i);
// stream
let stream = ua.match(/StreamApp/i);
// wechat
let wechat = ua.match(/(MicroMessenger)\/([\d.]+)/i);
// android
let android = ua.match(/(Android);?[\s/]+([\d.]+)?/);
// iphone
let iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
// ipad
let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

if (plus) {
    equipmentES.plus = true;
}

if (stream) {
    equipmentES.stream = true;
}

if (wechat) {
    equipmentES.wechat = true;
}

export default equipmentES
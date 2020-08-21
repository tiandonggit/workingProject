// const serviceHost = "http://192.168.0.173:8082";
// const serviceHost = "http://192.168.0.182:8080";
const serviceHost =
  process.env.NODE_ENV === "development"
    ? "https://channel.quickhealmall.com/api/"// IMhttps://yzh.quickhealmall.com/api/
    // ? "http://192.168.1.158:6001/api/"
    : "https://bbjk.quickhealmall.com/api/";
//便于使用多个域名
const globalServiceHost = {
  mailServiceHost: "https://yzh.365zjk.net/prescriptionapi",
  fullServiceHost: serviceHost.substring(0, serviceHost.length - 5), //小智助手socket地址
  stewardServiceHost: serviceHost.substring(0, serviceHost.length - 5), //客服socket地址
  selfMachineHost: serviceHost.substring(0, serviceHost.length - 5) + "/ygtapi", //药柜api
  nutritionUrl: serviceHost.substring(0, serviceHost.length - 5)+ "/nutrition_prescribe/#/" //营养工作站项目地址
};
const servicePort = "8080"; // 8080
const serviceName = ""; // FishFamily
const chenID = "";
export { serviceHost, servicePort, serviceName, chenID, globalServiceHost };

const serviceHost =
  process.env.NODE_ENV === "development"
    ? // ? "https://channel.quickhealmall.com/api/" //测试服api地址
      "https://channel.quickhealmall.com/api/" //测试服api地址
    : "https://bbjk.quickhealmall.com/api/"; //正式服api地址
    // : "https://yhz.quickhealmall.com/api/"; //正式服api地址
//便于使用多个域名
const globalServiceHost = {
  mockServiceHost: serviceHost.substring(0, serviceHost.length - 5) + "/ygtapi", //药柜api接口
  serveHost: serviceHost.substring(0, serviceHost.length - 5),
  projectName1: process.env.NODE_ENV === "development" ? "/healthHP" : "/health",
  projectName2 : process.env.NODE_ENV === "development" ? "/healthTD" : "/health"
};
const servicePort = "8080"; // 8080
const serviceName = ""; // FishFamily
const chenID = "";

export { serviceHost, servicePort, serviceName, chenID, globalServiceHost };

// https://im.quickhealmall.com/im_web  正式服地址
const serviceHost =
  process.env.NODE_ENV === "development"
    ? "http://192.168.1.13/im_web/"
    : "https://im.quickhealmall.com/im_web/";

//便于使用多个域名
const globalServiceHost = {
  // 测试服地址
  fileDiskServiceHost: "http://192.168.1.13/im_fileserver/",
  fileDiskSocketHost: "ws://192.168.1.13/im_fileserver_websocket",
  // 正式服地址
  // fileDiskServiceHost: "https://im.quickhealmall.com/im_fileserver/",
  // fileDiskSocketHost: "wss://im.quickhealmall.com/im_fileserver_websocket",
};
const servicePort = "8080";
const serviceName = ""; // FishFamily
const chenID = "";
export { serviceHost, servicePort, serviceName, chenID, globalServiceHost };

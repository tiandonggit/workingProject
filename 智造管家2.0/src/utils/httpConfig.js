const serviceHost =
  process.env.NODE_ENV === "development"
    ? "https://im.quickhealmall.com/im_web"
    : "https://im.quickhealmall.com/im_web";

//便于使用多个域名
const globalServiceHost = {};
const servicePort = "8080";
const serviceName = ""; // FishFamily
const chenID = "";
export { serviceHost, servicePort, serviceName, chenID, globalServiceHost };

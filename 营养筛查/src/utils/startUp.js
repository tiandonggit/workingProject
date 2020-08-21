import store from "../store/store";
import http from "./request";

let patientIdPromise = null;

let patientId = () => {
  return new Promise((resolve, reject) => {
    http
      .request({
        method: "get",
        url: "/RPatientController/selectByPrimaryS",
        body: {}
      })
      .then(res => {
        if (res.data.success && res.data.data) {
          console.log("cunzhi")

          store.commit("Patient/patientMessage", res.data.data);
          store.commit("Patient/isDoc", false);
          resolve(res);
        } else {
          store.commit("Patient/patientMessage", {});
          store.commit("Patient/isDoc", true);
          console.log("获取患者信息接口报错");
          resolve(res);
        }
      })
      .catch(e => {
        console.log(e);
        resolve();
      });
  })
}
patientIdPromise = patientId();
export default patientIdPromise

import store from "../store/index";
import http from "./request";

let patientIdPromise = null;
let doctorInfo = null;

// 项目初始化清空选择过的地址
localStorage.removeItem('productGo');
let patientId = () =>
  new Promise((resolve, reject) => {
    http
      .request({
        method: "get",
        url: "/RPatientController/selectByPrimaryS",
        body: {}
      })
      .then(res => {
        if (res.data.success && res.data.data) {
          store.commit("PatientIM/patientMessage", res.data.data);
          resolve();
        } else {
          console.log("获取患者信息接口报错");
          reject();
        }
      })
      .catch(e => {
        console.log(e);
        reject();
      });
  });

let doctorProimse = () =>
  new Promise((resolve, reject) => {
    http
      .request({
        method: "get",
        url: "/RDoctorController/selectDoctor",
        body: {}
      })
      .then(res => {
        if (res.data.success && res.data.data) {
          store.commit("DoctorIM/doctorMessage", res.data.data);
          resolve();
        } else {
          console.log("获取医生信息接口报错");
          reject();
        }
      })
      .catch(e => {
        console.log(e);
        reject();
      });
  });

patientIdPromise = patientId();
doctorInfo = doctorProimse();

export let _Vue;
export default {
  install(Vue) {
    if (this.installed && _Vue === Vue) return;
    this.installed = true;
    _Vue = Vue;
    _Vue.prototype.NOTICE = true;
    _Vue.mixin({
      created: function () {
        //  if (this.NOTICE)
      },
      mounted() {
      },
      methods: {
        test: function () {
          console.log("mixin test");
        }
      }
    });
    //2-4位中文名（魏雪源）
    _Vue.prototype.TestCname = value => {
      if (/^[\u4E00-\u9FA5]{2,6}$/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证手机号码（魏雪源）
    _Vue.prototype.TestPhone = value => {
      if (/^1[0-9]{10}$/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证六位数字验证码（魏雪源）
    _Vue.prototype.TestTestCode = value => {
      if (/^\d{6}$/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证年龄 （刘硕）
    _Vue.prototype.Uage = value => {
      if (/^[0-9]{1,3}$/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证性别 只验证男女 （刘硕）
    _Vue.prototype.Usex = value => {
      if (/男|女/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证汉字 20字 （刘硕）
    _Vue.prototype.Tcharacters = value => {
      if (/^[\u0391-\uFFE5A-Za-z]{1,20}$/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证特殊字符 （刘硕）
    _Vue.prototype.isEmojiCharacter = value => {
      if (value) {
        let reg = new RegExp("[~#^$@%&!?%*]", "g");
        if (value.match(reg)) {
          return true;
        }
        for (let i = 0; i < value.length; i++) {
          let hs = value.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
            if (value.length > 1) {
              let ls = value.charCodeAt(i + 1);
              let uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
              if (0x1d000 <= uc && uc <= 0x1f77f) {
                return true;
              }
            }
          } else if (value.length > 1) {
            let lsa = value.charCodeAt(i + 1);
            if (lsa == 0x20e3) {
              return true;
            }
          } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
              return true;
            } else if (0x2b05 <= hs && hs <= 0x2b07) {
              return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
              return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
              return true;
            } else if (
              hs == 0xa9 ||
              hs == 0xae ||
              hs == 0x303d ||
              hs == 0x3030 ||
              hs == 0x2b55 ||
              hs == 0x2b1c ||
              hs == 0x2b1b ||
              hs == 0x2b50
            ) {
              return true;
            }
          }
        }
      }
    };
    //debugs （丛新）
    _Vue.prototype.$debuggs = (value1, value2) => {
      if (value1 == 1) {
        alert(value2);
      } else if (value1 == 2) {
        console.log(value2);
      }
    };

    /**
     * 身份证验证
     * @params idNumber**/
    _Vue.prototype.idNumberVerification = s => {
      let vcity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };

      let province = s.substr(0, 2);
      //进行开头2位数的匹配
      if (vcity[province] == undefined) {
        return false;
      }
      //获取位数
      let len = s.length;

      if (len == "15") {
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        let year = s.substring(6, 8); //年
        let month = s.substring(8, 10); //月
        let day = s.substring(10, 12); //日
        let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        if (
          temp_date.getYear() != parseFloat(year) ||
          temp_date.getMonth() != parseFloat(month) - 1 ||
          temp_date.getDate() != parseFloat(day)
        ) {
          return false;
        } else {
          return true;
        }
      }

      if (len == "18") {
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        let year = s.substring(6, 10); //年
        let month = s.substring(10, 12); //月
        let day = s.substring(12, 14); //日
        let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (
          temp_date.getFullYear() != parseFloat(year) ||
          temp_date.getMonth() != parseFloat(month) - 1 ||
          temp_date.getDate() != parseFloat(day)
        ) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    };
    /**
     *@desc 身份证获取生日
     * @params
     *@author suoxh
     *@date 2019/07/17
     */
    _Vue.prototype.$testIDgetBirthday = idCard => {
      let birthday = "";
      if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
          birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
          birthday = idCard.substr(6, 8);
        }

        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
      }

      return birthday;
    };
    /**
     *@desc 检测表情
     * @params
     *@author suoxh
     *@date 2019/07/17
     */
    _Vue.prototype.$testEmoji = value => {
      let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
      if (reg2.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    /**
     *@desc 获取url参数
     *@params paramName 参数字段 有则返回该参数,无则不返回
     *@author houpai
     *@date 2019/07/05 09:15:02
     */
    _Vue.prototype.$getUrlParam = paramName => {
      let href = window.location.href;
      let url = decodeURI(href);
      let idx = url.indexOf("?");
      let params = url.substring(idx + 1);
      if (params) {
        params = params.split("&");
        for (let i = 0; i < params.length; i += 1) {
          let param = params[i].split("=");
          if (param[0] === paramName) {
            // 完善获取url参数的逻辑
            let pArr = [];
            for (let k = 1, len = param.length; k < len; k++) {
              pArr.push(param[k]);
            }
            let p = pArr.join("=");
            let idx1 = p.indexOf("#");
            if (idx1 !== -1) {
              p = p.substring(0, idx1);
            }
            return p;
          }
        }
      }
    };

    /**
     *@desc 是否为json串
     *@author houpai
     *@params str
     *@date 2019/07/29 09:15:56
     */
    _Vue.prototype.$isJsonString = str => {
      console.log(str);
      try {
        if (typeof JSON.parse(str) == "object") {
          console.log("str===json????");
          return true;
        }
      } catch (e) {
        console.log(e);
      }
      return false;
    };

    /**
     *@desc 生成唯一uuid 标识
     *@author houpai
     *@date 2019/07/15 13:08:20
     */
    _Vue.prototype.$uuid = () => {
      return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };
    /**
     * author houpai
     * 判断数组对象中是否存在某个对象
     * @param arr 数组对象
     * @param origin(String)要匹配的某个字段
     * @param value 要匹配的字段值
     * @return {index: number, value}
     * */
    _Vue.prototype.$hasValueFromArray = (arr, origin, value) => {
      if (!Array.isArray) {
        //Polyfill
        Array.isArray = function (arg) {
          return Object.prototype.toString.call(arg) === "[object Array]";
        };
      }
      if (!Array.isArray(arr)) {
        throw new Error("arr 不是一个数组");
      } else {
        let flag = false; //没有匹配
        let temp = {};
        let index = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][origin] === value) {
            flag = true;
            temp = arr[i];
            index = i;
            break;
          }
        }
        if (!flag) {
          temp = null;
        }
        return {index: index, value: temp};
      }
    };

    /**
     *@desc 数组对象去重
     *@param arr 数组对象
     *@param origin(String)要去重的某个字段
     *@author houpai
     *@date 2019/07/18 15:03:48
     */
    _Vue.prototype.$objectArrNorepeat = (arr, name) => {
      let hash = {};
      return arr.reduce(function (item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
      }, []);
    };
    /**
     *@desc 时间格式化
     *@param timestamp 10位时间戳
     *@author houpai
     *@date 2019/07/23 16:58:52
     */
    _Vue.prototype.$timestampToTime = timestamp => {
      let formatedTime = "";
      let formatTime = "";
      let date = new Date(timestamp * 1000);
      let y = date.getFullYear();
      let ty = new Date().getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      formatTime =
        y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      let timeS = formatTime;
      let todayT = ""; //
      let yestodayT = "";
      let tYear = ty + "-" + "01" + "-" + "01" + " " + "00" + ":" + "00" + ":" + "00";
      let tYearTimeStamp = new Date(
        tYear
          .replace(/[年月]/g, "-")
          .replace(/[日]/, "")
          .replace(/-/g, "/")
      ).getTime();
      let timeSS = timeS
        .replace(/[年月]/g, "-")
        .replace(/[日]/, "")
        .replace(/-/g, "/");
      let timeCha = new Date().getTime() - new Date(timeSS).getTime() - 1000;
      timeS = timeS.slice(-8);
      todayT =
        new Date().getHours() * 60 * 60 * 1000 +
        new Date().getMinutes() * 60 * 1000 +
        new Date().getSeconds() * 1000;
      yestodayT = todayT + 24 * 60 * 60 * 1000;
      // if (timeCha > yestodayT) {
      //   formatedTime = formatTime.slice(0, 10);
      // }
      // if (timeCha > todayT && timeCha < yestodayT) {
      //   formatedTime = timeS.slice(0, 2) > 12 ? '昨天 下午' + (timeS.slice(0, 2) === 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '昨天 上午' + timeS.slice(0, 5);
      // }
      if (timeCha < todayT) {
        formatedTime = formatTime.slice(11, 16);
        // formatedTime = timeS.slice(0, 2) >= 12 ? '下午' + (timeS.slice(0, 2) === 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '上午' + timeS.slice(0, 5);
      } else if (timestamp < tYearTimeStamp) {
        formatedTime = formatTime.slice(0, 10);
      } else {
        formatedTime = formatTime.slice(5, 11);
      }
      return formatedTime;
    };

    /**
     *@desc  IM聊天时间
     * (1）当天显示时间为“时、分”当天前一天显示“昨天、时、分”
     *      昨天以前显示“月、日、时、分”超过当年显示“年、月、日、时、分”
     *（2）医患对话间隔10分钟双方未聊天，再次聊天显示时间
     *@params timestamp, index infoList
     *@author houpai
     *@date 2019/08/08 10:46:20
     */
    _Vue.prototype.$chatIMFormatTimeStamp = (timestamp, index, infoList) => {
      let formatedTime = "";
      let formatTime = "";
      let date = new Date(timestamp);
      let y = date.getFullYear();
      let ty = new Date().getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      formatTime =
        y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      let tYear = ty + "-" + "01" + "-" + "01" + " " + "00" + ":" + "00" + ":" + "00";
      let tYearTimeStamp = new Date(
        tYear
          .replace(/[年月]/g, "-")
          .replace(/[日]/, "")
          .replace(/-/g, "/")
      ).getTime();
      let timeS = formatTime;
      let todayT = ""; //
      let yestodayT = "";
      let timeSS = timeS
        .replace(/[年月]/g, "-")
        .replace(/[日]/, "")
        .replace(/-/g, "/");
      let timeCha = new Date().getTime() - new Date(timeSS).getTime() - 1000;
      timeS = timeS.slice(-8);
      todayT =
        new Date().getHours() * 60 * 60 * 1000 +
        new Date().getMinutes() * 60 * 1000 +
        new Date().getSeconds() * 1000;
      yestodayT = todayT + 24 * 60 * 60 * 1000;
      // 如果是第一条聊天数据,不展示时间,否则跟上一天聊天记录对比时间差,如果超过10min 才显示
      if (index === 0) {
        // 往年时间的话 返回"年、月、日、时、分"
        if (timeCha < todayT) {
          formatedTime = formatTime.slice(11, 16);
        } else if (timeCha > todayT && timeCha < yestodayT) {
          formatedTime = "昨天 " + formatTime.slice(11, 16);
        } else {
          formatedTime = formatTime.slice(5, 16);
        }
        if (timestamp < tYearTimeStamp) {
          formatedTime = formatTime;
        }
      } else {
        if (timestamp - infoList[index - 1].sendTime < 1000 * 60 * 10) {
          return false;
        }
        // 往年时间的话 返回"年、月、日、时、分"
        if (timeCha < todayT) {
          formatedTime = formatTime.slice(11, 16);
        } else if (timeCha > todayT && timeCha < yestodayT) {
          formatedTime = "昨天 " + formatTime.slice(11, 16);
        } else {
          formatedTime = formatTime.slice(5, 16);
        }
        if (timestamp < tYearTimeStamp) {
          formatedTime = formatTime;
        }
      }
      return formatedTime;
    };

    /**
     *@desc 函数截流，直到函数请求停止并超过时间间隔才会执行。执行环境如果不定义则为window
     *@author houpai
     *@date 2019/08/28 11:12:35
     */
    _Vue.prototype.$throttle = (method, context) => {
      clearTimeout(method.tId);
      method.tId = setTimeout(function () {
        method.call(context);
      }, 300);
    };


    /**
     *@desc base64转为blob对象
     *@params dataurl base64
     *@author houpai
     *@date 2020/01/15 14:25:16
     */
    _Vue.prototype.$dataURLtoBlob = (dataurl) => {
      var arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type: mime});
    };


    /**
     *@desc 数组对象根据某属性排序,配合原生sort使用
     *@author houpai
     *@param rev true表示升序排列，false降序排序
     *@date 2020/01/17 09:34:39
     */
    _Vue.prototype.$compareBy = (prop, rev) => {
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = (rev) ? 1 : -1;
      }
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return rev * -1;
        } else if (val1 > val2) {
          return rev * 1;
        } else {
          return 0;
        }
      };
    };

    /**
     *@desc 检查是否为浏览器环境
     *@return true为browser环境, false为node环境
     *@author houpai
     *@date 2020/02/14 09:34:45
     */
    _Vue.prototype.$isBrowser = () => ![typeof window, typeof document].includes("undefined");

    /**
     *@desc 判断手机系统类型
     *@author houpai
     *@date 2020/02/14 09:36:27
     */
    _Vue.prototype.$getMobileType = () => {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; // g
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
      if (isAndroid) {
        return "Android";
      }
      if (isIOS) {
        return "IOS";
      }
    };

    /**
     *@desc 判断是不是微信和qq浏览器
     *@return  browserType '' -> 都不是 1 -> qq 2 -> wx 3 -> 都可以
     *@author houpai
     *@date 2020/02/14 09:39:12
     */
    _Vue.prototype.$isWxorQqBrowser = () => {
      let url = navigator.userAgent.toLowerCase();
      let browserType = "";
      if (url.indexOf("15b202 qq") > -1) {
        //单独判断QQ内置浏览器
        // alert('QQ APP 内置浏览器，做你想做的操作')
        browserType = 1;
      }
      if (url.indexOf("micromessenger") > -1) {
        //单独判断微信内置浏览器
        // alert('微信内置浏览器，做你想做的操作')
        browserType = 2;
      }
      if (url.indexOf("15b202") > -1) {
        //判断微信内置浏览器，QQ内置浏览器
        // alert('QQ和微信内置浏览器，做你想做的操作')
        browserType = 2;
      }
      return browserType;
    };

    /**
     *@desc url转换blob
     *@return callBack
     *@author houpai
     *@date 2020/02/14 09:39:12
     */
    _Vue.prototype.$urlToBlob = (the_url, callback) => {
      let xhr = new XMLHttpRequest();
      xhr.open("get", the_url, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          if (callback) {
            callback(this.response);
          }
        }
      };
      xhr.send();
    };

    /**
     *@desc blob转换base64
     *@return callBack
     *@author houpai
     *@date 2020/02/14 09:39:12
     */
    _Vue.prototype.$blobToBase64 = (blob_data, callback) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (callback) {
          callback(e.target.result);
        }
      };
      reader.readAsDataURL(blob_data);
    };
  }
};


/**
 * 工具函数整理备用,由于以下工具类有事件监听,
 * 所以使用场景由具体业务需求来决定,并未挂载在vue原型上
 * **/


// 判断手机开屏/息屏
// document.addEventListener('visibilitychange', () => {
//   console.log(document.visibilityState)
//   if (document.visibilityState === 'hidden') {
//     console.log('息屏时间')
//   } else if (document.visibilityState === 'visible' && vm.hidden) {
//     console.log('开屏时间')
//   }
// })


// 监听浏览器联网状态
// window.addEventListener("offline", function(e) {alert("offline");})
// window.addEventListener("online", function(e) {alert("online");})
//
// if(window.navigator.onLine==true){
//   alert("已连接")
// }else{
//   alert("未连接")
// }


// 检测手机是否横屏 部分浏览器(pc端浏览器window.orientation已废弃,在移动端浏览器上可以使用)已删除window.orientation属性,使用的时候注意一下
// window.addEventListener('resize', () => {
//   if (window.orientation === 180 || window.orientation === 0) {
//     // 正常方向或屏幕旋转180度
//     console.log('竖屏')
//   }
//   if (window.orientation === 90 || window.orientation === -90) {
//     // 屏幕顺时钟旋转90度或屏幕逆时针旋转90度
//     console.log('横屏')
//   }
// })






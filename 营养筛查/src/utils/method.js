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
      if (/^[\u4E00-\u9FA5]{2,4}$/.test(value)) {
        return true;
      } else {
        return false;
      }
    };
    //验证手机号码（魏雪源）
    _Vue.prototype.TestPhone = value => {
      if (/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
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
        var reg = new RegExp("[~#^$@%&!?%*]", "g");
        if (value.match(reg)) {
          return true;
        }
        for (var i = 0; i < value.length; i++) {
          var hs = value.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
            if (value.length > 1) {
              var ls = value.charCodeAt(i + 1);
              var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
              if (0x1d000 <= uc && uc <= 0x1f77f) {
                return true;
              }
            }
          } else if (value.length > 1) {
            var lsa = value.charCodeAt(i + 1);
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
     *@desc 时间戳转标椎时间格式
     *@timestamp
     *@author houpai
     *@date 2019/10/21 17:35:28
     */
    _Vue.prototype.$formatDate = timestamp => {
      let date = new Date(timestamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let m1 = date.getMinutes();
      let s = date.getSeconds();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s;
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
     *@desc 数组对象去重
     *@param arr 数组对象
     *@param name 要去重的某个字段
     *@author houpai
     *@date 2020/04/10 09:23:11
     */
    _Vue.prototype.$objectArrNorepeat = (arr, name) => {
      let hash = {};
      return arr.reduce(function (item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
      }, []);
    };
  }
};

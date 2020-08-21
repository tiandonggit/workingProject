//兼容微信缓存
//存储数据
/* eslint-disable */
function setItem(key, value) {// eslint-disable-line
  try {
    const res = wx.getSystemInfoSync(); // eslint-disable-line no-empty
    if (typeof res == "object") {
      try {
        wx.setStorageSync(key, value); // eslint-disable-line no-empty
      } catch (e) {}
    }
  } catch (e) {
    window.localStorage.setItem(key, value);
  }
}

//读取数据
function getItem(key) {
  try {
    const res = wx.getSystemInfoSync(); // eslint-disable-line no-empty
    if (typeof res == "object") {
      try {
        const value = wx.getStorageSync(key); // eslint-disable-line no-empty
        if (value) {
          // Do something with return value

          return value;
        }
      } catch (e) {
        // Do something when catch error
      }
    }
  } catch (e) {
    return window.localStorage.getItem(key);
  }
}

//删除指定数据
function removeItem(key) {
  try {
    const res = wx.getStorageInfoSync(); // eslint-disable-line no-empty
    if (typeof res == "object") {
      try {
        wx.removeStorageSync(key); // eslint-disable-line no-empty
      } catch (e) {
        // Do something when catch error
      }
    }
  } catch (e) {
    window.localStorage.removeItem(key);
  }
}

//删除所有数据
function clear() {
  try {
    const res = wx.getStorageInfoSync(); // eslint-disable-line no-empty
    if (typeof res == "object") {
      try {
        wx.clearStorageSync(); // eslint-disable-line no-empty
      } catch (e) {
        // Do something when catch error
      }
    }
  } catch (e) {
    window.localStorage.clear();
  }
}

//vue注册方法函数（跳转，缓存）
export let _Vue;
// import router from './router'
// router.beforeEach((to, from, next) => {
//   console.log("222222")
//   next()
// })
export default {
  install(Vue) {
    if (this.installed && _Vue === Vue) return;
    this.installed = true;
    _Vue = Vue;
    _Vue.prototype.NOTICE = true;
    const _localStorage = {
      setItem,
      getItem,
      removeItem,
      clear
    };
    //兼容web端浏览器·
    _Vue.mixin({
      created: function() {
        //if (this.NOTICE)
        // try {
        //   const res = wx.getStorageInfoSync()
        // } catch (e) {
        //vuex不分模块

        // window.addEventListener('beforeunload', e => {
        //           window.sessionStorage.setItem("store", JSON.stringify(this.$store.state))
        //           this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
        //          // sessionStorage.removeItem("store")
        //         });
        //        // }
        //         window.addEventListener('unload', e => {
        //          window.sessionStorage.setItem("store", JSON.stringify(this.$store.state))
        //          this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
        //         });

        window.addEventListener("beforeunload", e => {
          this.$store.commit("Patient/Patient");
          this.$store.commit("Doctor/Doctor");

        });
      },
      mounted() {
        //   this.setItem()
      },
      methods: {
        setItem: function() {
          //  console.log(JSON.stringify(this.$store.state.login));
          //   window.sessionStorage.setItem("store", JSON.stringify(this.$store.state.login))
        },
        b() {}
      }
    });
    (Vue.prototype.wx = (a, b, c) => {
      try {
        const res = wx.getSystemInfoSync();
        console.log(res);
        if (typeof res == "object") {
        }
      } catch (e) {
        // Do something when catch error
      }
    }),
      Object.defineProperty(_Vue.prototype, "$localStorage", {
        get() {
          return _localStorage;
        }
      });
  }
};
/* eslint-enable */

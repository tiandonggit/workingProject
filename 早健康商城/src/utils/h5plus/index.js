// 页面:h5plus入口
  // 开发者:王海洋
import equipmentES from "./event/equipmentES";
import typeData from "./typeData/typeData";
import _plusReady from "./event/plusReady";
import _networkinfo from "./event/networkinfo";
// import _appBack from "./event/appBack";
const h5plus = {};
let _Vue;
h5plus.install = Vue => {
  if (_Vue === Vue) return;
  _Vue = Vue;
  _Vue.mixin({
    beforeCreate() {
      if (equipmentES.plus) {
        let _options = this.$options;
        _plusReady.plusReady(
          function() {
            if (typeData.TypeFunction(_options.plusReady)) {
              _options.plusReady.call(this);
            }
          }.bind(this)
        );
      }
    }
  });
  _Vue.prototype.plusReady = _plusReady.plusReady;
  _Vue.prototype.equipmentES = equipmentES;
  _Vue.prototype.$networkinfo = _networkinfo;
  // _Vue.prototype.$appBack = _appBack;
  Vue.prototype.$h5plus = {
    //电话号码合法性检查
    // telNumberCheck: tel => {
    //   var pattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    //   return pattern.test(tel);
    // }
  };

  if (typeof window !== "undefined" && window._Vue) {
    window._Vue.use(h5plus);
  }
};

export default h5plus;

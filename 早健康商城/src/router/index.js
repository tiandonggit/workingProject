import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
// const Index = () =>
//   import(/* webpackChunkName: "Index" */ "../pages/Home/Index");
//首页
const MallHome = () =>
  import(/* webpackChunkName: "Home" */ "../pages/Home/MallHome");
const Searches = () =>
  import(/* webpackChunkName: "Search" */ "../pages/Home/Searches");
const SearchCity = () =>
  import(/* webpackChunkName: "SearchCity" */ "../pages/Home/SearchCity");
const SearchCityT = () =>
  import(/* webpackChunkName: "SearchCityT" */ "../pages/Home/SearchCityT");
const Recovery = () =>
  import(/* webpackChunkName: "Recovery" */ "../pages/Recovery/Recovery");
const SearchesP = () =>
  import(/* webpackChunkName: "SearchesP" */ "../pages/Home/SearchesP");
const Particular = () =>
  import(/* webpackChunkName: "Particular" */ "../pages/Product/Particular");
// 购物车
const shoppingCar = () =>
  import(
    /* webpackChunkName: "shoppingCar" */ "../pages/shoppingCar/shoppingCar"
  );
// 登录注册相关
const login = () =>
  import(/* webpackChunkName: "login" */ "../pages/loginRegistered/login");
const setPwd = () =>
  import(/* webpackChunkName: "setPwd" */ "../pages/loginRegistered/setPwd");
const forgetPwd = () =>
  import(
    /* webpackChunkName: "forgetPwd" */ "../pages/loginRegistered/forgetPwd"
  );
const bindingPhone = () =>
  import(
    /* webpackChunkName: "bindingPhone" */ "../pages/loginRegistered/bindingPhone"
  );
const agreementDetails = () =>
  import(
    /* webpackChunkName: "agreementDetails" */ "../pages/loginRegistered/agreementDetails"
  );
// 个人中心相关
const personalCenter = () =>
  import(
    /* webpackChunkName: "personalCenter" */ "../pages/personalCenter/personalCenter"
  );
const systemSettings = () =>
  import(
    /* webpackChunkName: "systemSettings" */ "../pages/personalCenter/systemSettings"
  );
const accountSafety = () =>
  import(
    /* webpackChunkName: "accountSafety" */ "../pages/personalCenter/accountSafety"
  );
const personInfo = () =>
  import(
    /* webpackChunkName: "personInfo" */ "../pages/personalCenter/personInfo"
  );
const changePwd = () =>
  import(
    /* webpackChunkName: "changePwd" */ "../pages/personalCenter/changePwd"
  );
const changePwd2 = () =>
  import(
    /* webpackChunkName: "changePwd2" */ "../pages/personalCenter/changePwd2"
  );
const changePhoneNumber = () =>
  import(
    /* webpackChunkName: "changePhoneNumber" */ "../pages/personalCenter/changePhoneNumber"
  );
const problem = () =>
  import(/* webpackChunkName: "problem" */ "../pages/personalCenter/problem");
const problemAnswer = () =>
  import(
    /* webpackChunkName: "problemAnswer" */ "../pages/personalCenter/problemAnswer"
  );
const addressList = () =>
  import(
    /* webpackChunkName: "addressList" */ "../pages/personalCenter/addressList"
  );
const addAddress = () =>
  import(
    /* webpackChunkName: "addAddress" */ "../pages/personalCenter/addAddress"
  );
const confirmAddress = () =>
  import(
    /* webpackChunkName: "confirmAddress" */ "../pages/personalCenter/confirmAddress"
  );
const about = () =>
  import(
    /* webpackChunkName: "about" */ "../pages/personalCenter/about"
  );
// 订单相关
const submitOrder = () =>
  import(/* webpackChunkName: "submitOrder" */ "../pages/order/submitOrder");
const payWay = () =>
  import(/* webpackChunkName: "payWay" */ "../pages/order/payWay");
const paySuccess = () =>
  import(/* webpackChunkName: "paySuccess" */ "../pages/order/paySuccess");
const receipt = () =>
  import(/* webpackChunkName: "receipt" */ "../pages/order/receipt");
const myOrder = () =>
  import(/* webpackChunkName: "myOrder" */ "../pages/order/myOrder");
const orderDetails = () =>
  import(/* webpackChunkName: "orderDetails" */ "../pages/order/orderDetails");
const Home = () =>
  import(/* webpackChunkName: "orderDetails" */ "../pages/Home");
// 分类
const category = () =>
  import(/* webpackChunkName: "category" */ "../pages/category/category");
Vue.use(Router);
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: "/",
    //   name: "Index",
    //   component: Index
    // },
    {
      path: "/Home",
      name: "Home",
      component: Home
    },
    {
      path: "/",
      name: "MallHome",
      component: MallHome
    },
    {
      path: "/shoppingCar/shoppingCar",
      name: "shoppingCar",
      component: shoppingCar
    },
    {
      path: "/personalCenter/personalCenter",
      name: "personalCenter",
      component: personalCenter
    },
    {
      path: "/loginRegistered/setPwd",
      name: "setPwd",
      component: setPwd
    },
    {
      path: "/loginRegistered/forgetPwd",
      name: "forgetPwd",
      component: forgetPwd
    },
    {
      path: "/loginRegistered/bindingPhone",
      name: "bindingPhone",
      component: bindingPhone
    },
    {
      path: "/loginRegistered/agreementDetails",
      name: "agreementDetails",
      component: agreementDetails
    },
    {
      path: "/personalCenter/systemSettings",
      name: "systemSettings",
      component: systemSettings
    },
    {
      path: "/personalCenter/accountSafety",
      name: "accountSafety",
      component: accountSafety
    },
    {
      path: "/personalCenter/personInfo",
      name: "personInfo",
      component: personInfo
    },
    {
      path: "/personalCenter/changePwd",
      name: "changePwd",
      component: changePwd
    },
    {
      path: "/personalCenter/changePwd2",
      name: "changePwd2",
      component: changePwd2
    },
    {
      path: "/personalCenter/changePhoneNumber",
      name: "changePhoneNumber",
      component: changePhoneNumber
    },
    {
      path: "/personalCenter/problem",
      name: "problem",
      component: problem
    },
    {
      path: "/personalCenter/problemAnswer",
      name: "problemAnswer",
      component: problemAnswer
    },
    {
      path: "/personalCenter/addressList",
      name: "addressList",
      component: addressList
    },
    {
      path: "/personalCenter/addAddress",
      name: "addAddress",
      component: addAddress
    },
    {
      path: "/personalCenter/confirmAddress",
      name: "confirmAddress",
      component: confirmAddress
    },
    {
      path: "/personalCenter/about",
      name: "about",
      component: about
    },
    {
      path: "/loginRegistered/login",
      name: "login",
      component: login
    },
    {
      path: "/order/submitOrder",
      name: "submitOrder",
      component: submitOrder
    },
    {
      path: "/order/payWay",
      name: "payWay",
      component: payWay
    },
    {
      path: "/order/paySuccess",
      name: "paySuccess",
      component: paySuccess
    },
    {
      path: "/order/receipt",
      name: "receipt",
      component: receipt
    },
    {
      path: "/order/myOrder",
      name: "myOrder",
      component: myOrder
    },
    {
      path: "/order/orderDetails",
      name: "orderDetails",
      component: orderDetails
    },
    {
      path: "/Searches",
      name: "Searches",
      component: Searches
    },
    {
      path: "/SearchCity",
      name: "SearchCity",
      component: SearchCity
    },
    {
      path: "/SearchCityT",
      name: "SearchCityT",
      component: SearchCityT
    },
    {
      path: "/Recovery",
      name: "Recovery",
      component: Recovery
    },
    {
      path: "/SearchesP",
      name: "SearchesP",
      component: SearchesP
    },
    {
      path: "/Particular",
      name: "Particular",
      component: Particular
    },
    {
      path: "/category/category",
      name: "category",
      component: category
    }
  ]
});

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.name === "MallHome") {
    store.commit("Home/trbbarActive", 0);
  } else if (to.name === "category") {
    store.commit("Home/trbbarActive", 1);
  } else if (to.name === "shoppingCar") {
    store.commit("Home/trbbarActive", 2);
  } else if (to.name === "personalCenter") {
    store.commit("Home/trbbarActive", 3);
  }
  next();
});
export default router;

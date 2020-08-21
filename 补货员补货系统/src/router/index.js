import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

const login = () =>
  import(/* webpackChunkName: "login" */ "../pages/login/login.vue");
const index = () =>
  import(/* webpackChunkName: "index" */ "../pages/home/index.vue");
const getGoods = () =>
  import(/* webpackChunkName: "getGoods" */ "../pages/goods/getGoods.vue");
const supplyGoods = () =>
  import(/* webpackChunkName: "index" */ "../pages/goods/supplyGoods.vue");
const machineSupplyGoods = () =>
  import(/* webpackChunkName: "index" */ "../pages/goods/machineSupplyGoods.vue");
const returnGoods = () =>
  import(/* webpackChunkName: "index" */ "../pages/goods/returnGoods.vue");
const getGoodsInventory = () =>
  import(/* webpackChunkName: "index" */ "../pages/goods/getGoodsInventory.vue");
const initiateReplenishment = () =>
  import(/* webpackChunkName: "index" */ "../pages/goods/initiateReplenishment.vue");

Vue.use(Router);
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    //关注公众号
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/index",
      name: "index",
      component: index
    },
    {
      path: "/getGoods",
      name: "getGoods",
      component: getGoods
    },
    {
      path: "/getGoodsInventory",
      name: "getGoodsInventory",
      component: getGoodsInventory
    },
    {
      path: "/supplyGoods",
      name: "supplyGoods",
      component: supplyGoods
    },
    {
      path: "/initiateReplenishment",
      name: "initiateReplenishment",
      component: initiateReplenishment
    },
    {
      path: "/machineSupplyGoods",
      name: "machineSupplyGoods",
      component: machineSupplyGoods
    },
    {
      path: "/returnGoods",
      name: "returnGoods",
      component: returnGoods
    },
    {
      path: "/",
      name: "login",
      component: login
    }
  ]
});

// 前置的路由处理，可用于系统初始化
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;

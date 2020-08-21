import Vue from "vue"
import store from "../store/index";
import VueRouter from "vue-router"
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style


Vue.use(VueRouter)

const routes = [
  {
    path: "/home",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../pages/Home.vue"),
    meta: {
      allowBack: false
    },
    children: [
      {
        path: "/",
        name: "chinaMap",
        component: () =>
          import(/* webpackChunkName: "map" */ "../components/map/chinaMap.vue"),
        meta: {
          allowBack: false
        }
      },
      {
        path: "/chinaMap",
        name: "chinaMap",
        component: () =>
          import(/* webpackChunkName: "map" */ "../components/map/chinaMap.vue"),
        meta: {
          allowBack: false
        }
      },
      {
        path: "/provinceMap",
        name: "provinceMap",
        component: () =>
          import(/* webpackChunkName: "map" */ "../components/map/provinceMap.vue"),
        meta: {
          allowBack: false
        }
      },
      {
        path: "/cityMap",
        name: "cityMap",
        component: () =>
          import(/* webpackChunkName: "map" */ "../components/map/cityMap.vue"),
        meta: {
          allowBack: false
        }
      },
    ],
  },
  {
    path: '*', // 重定向
    redirect: '/home'
  }
]

const router = new VueRouter({
  routes
})

// 前置的路由处理，可用于系统初始化
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
  let allowBack = false
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }
  if (!allowBack) {
    history.pushState(null, null, location.href)
  }
  store.commit("homeData/saveAllowBack", allowBack)

});
router.afterEach(() => {
  NProgress.done();
});

export default router

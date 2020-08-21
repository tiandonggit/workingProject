import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../page/login/login")
  },
  {
    path: "/home",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../page/home/home"),
    children: [
      {
        path: "/",
        redirect: "/im",
        component: () =>
          import(/* webpackChunkName: "im" */ "../page/home/im/im")
      },
      {
        path: "/im",
        name: "im",
        meta: {
          checked: "chat"
        },
        component: () =>
          import(/* webpackChunkName: "im" */ "../page/home/im/im"),
        children: [
          {
            path: "/",
            redirect: "/noChat",
            component: () =>
              import(/* webpackChunkName: "im" */ "../page/home/im/noChat/noChat")
          },
          {
            path: "/noChat",
            name: "noChat",
            meta: {
              checked: "chat"
            },
            component: () =>
              import(/* webpackChunkName: "im" */ "../page/home/im/noChat/noChat")
          },
          {
            path: "/singleChat",
            name: "singleChat",
            meta: {
              checked: "chat"
            },
            component: () =>
              import(/* webpackChunkName: "im" */ "../page/home/im/singleChat/singleChat")
          },
          {
            path: "/groupChat",
            name: "groupChat",
            meta: {
              checked: "chat"
            },
            component: () =>
              import(/* webpackChunkName: "im" */ "../page/home/im/groupChat/groupChat")
          }
        ]
      },
      {
        path: "/mailList",
        name: "mailList",
        meta: {
          checked: "mailList"
        },
        component: () =>
          import(/* webpackChunkName: "mailList" */ "../page/home/mailList/mailList"),
        children: [
          {
            path: "/",
            redirect: "/mailInfo",
            component: () =>
              import(/* webpackChunkName: "mailList" */ "../page/home/mailList/mailInfo/mailInfo")
          },
          {
            path: "/mailInfo",
            name: "mailInfo",
            meta: {
              checked: "mailList"
            },
            component: () =>
              import(/* webpackChunkName: "mailList" */ "../page/home/mailList/mailInfo/mailInfo")
          }
        ]
      },
      {
        path: "/fileDisk",
        name: "fileDisk",
        meta: {
          checked: "fileDisk"
        },
        component: () =>
          import(/* webpackChunkName: "fileDisk" */ "../page/home/fileDisk/fileDisk"),
        children: [
          {
            path: "/",
            redirect: "/personalFile",
            component: () =>
              import(/* webpackChunkName: "fileDisk" */ "../page/home/fileDisk/personalFile/personalFile")
          },
          {
            path: "/personalFile",
            name: "personalFile",
            meta: {
              checked: "fileDisk"
            },
            component: () =>
              import(/* webpackChunkName: "fileDisk" */ "../page/home/fileDisk/personalFile/personalFile")
          },
          {
            path: "/enterpriseFile",
            name: "enterpriseFile",
            meta: {
              checked: "fileDisk"
            },
            component: () =>
              import(/* webpackChunkName: "fileDisk" */ "../page/home/fileDisk/enterpriseFile/enterpriseFile")
          },
          {
            path: "/shareFile",
            meta: {
              checked: "fileDisk"
            },
            name: "shareFile",
            component: () =>
              import(/* webpackChunkName: "fileDisk" */ "../page/home/fileDisk/shareFile/shareFile")
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../page/login/login")
  },
  {
    path: "/404",
    name: "Page404",
    component: () =>
      import(/* webpackChunkName: "404" */ "../page/404/404")
  },
  // 404 page must be placed at the end !!!
  {
    path: "*",
    redirect: "/404"
  }
];

const router = new VueRouter({
  routes
});

// 登录权限判断
router.beforeEach((to, from, next) => {
  let serverToken = window.localStorage.getItem("serverToken") || "";
  let nickname = store.state.homeData.imSelectedInfo.nickname;
  let groupname = store.state.homeData.imSelectedInfo.groupname;
  if (to.path === "/login") {
    window.localStorage.removeItem("serverToken");
  } else if (to.path === "/singleChat") {
    if (nickname || groupname) {
      next();
    }else {
      next({path: "/noChat"});
    }
  } else if (to.path === "/groupChat") {
    if (nickname || groupname) {
      next();
    }else {
      next({path: "/noChat"});
    }
  } else if (to.path === "/noChat") {
    if(nickname){
      next({path: "/singleChat"});
    }
    if (groupname){
      next({path: "/groupChat"});
    }
  }

  if (!serverToken && to.path !== "/login") {
    next({path: "/login"});
  } else {
    next();
  }
});

export default router;

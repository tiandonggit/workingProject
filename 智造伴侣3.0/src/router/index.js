import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login/login")
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login/login")
  },
  {
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home/home"),
    children: [
      {
        path: "/",
        redirect: "/project",
        component: () => import(/* webpackChunkName: "project" */ "../views/Project/project")
      },
      {
        path: "/cloudDisk",
        name: "cloudDisk",
        meta: {
          checked: "cloudDisk"
        },
        component: () => import(/* webpackChunkName: "cloudDisk" */ "../views/CloudDisk/cloudDisk"),
        children: []
      },
      {
        path: "/approval",
        name: "approval",
        meta: {
          checked: "approval"
        },
        component: () => import(/* webpackChunkName: "approval" */ "../views/Approval/approval"),
        children: []
      },
      {
        path: "/project",
        name: "project",
        meta: {
          checked: "project"
        },
        component: () => import(/* webpackChunkName: "project" */ "../views/Project/project"),
        children: [
          {
            path: "/",
            redirect: "/board",
            component: () => import(/* webpackChunkName: "board" */ "../views/Project/board")
          },
          {
            path: "/board",
            name: "board",
            meta: {
              checked: "project",
              secondChecked: "board"
            },
            component: () => import(/* webpackChunkName: "board" */ "../views/Project/board"),
            children: []
          },
          {
            path: "/disk",
            name: "disk",
            meta: {
              checked: "project",
              secondChecked: "disk"
            },
            component: () => import(/* webpackChunkName: "disk" */ "../views/Project/disk"),
            children: []
          },
          {
            path: "/member",
            name: "member",
            meta: {
              checked: "project",
              secondChecked: "member"
            },
            component: () => import(/* webpackChunkName: "member" */ "../views/Project/member"),
            children: []
          },
          {
            path: "/memberDetails",
            name: "memberDetails",
            meta: {
              checked: "project",
              secondChecked: "member"
            },
            component: () => import(/* webpackChunkName: "memberDetails" */ "../views/Project/memberDetails"),
            children: []
          },
          {
            path: "/settings",
            name: "settings",
            meta: {
              checked: "project",
              secondChecked: "settings"
            },
            component: () => import(/* webpackChunkName: "settings" */ "../views/Project/settings"),
            children: []
          },
          {
            path: "/settingsField",
            name: "settingsField",
            meta: {
              checked: "project",
              secondChecked: "settings"
            },
            component: () => import(/* webpackChunkName: "settingsField" */ "../views/Project/settingsField"),
            children: []
          },
          {
            path: "/settingsTag",
            name: "settingsTag",
            meta: {
              checked: "project",
              secondChecked: "settings"
            },
            component: () => import(/* webpackChunkName: "settingsTag" */ "../views/Project/settingsTag"),
            children: []
          },
        ]
      },
      {
        path: "/mine",
        name: "mine",
        meta: {
          checked: "mine"
        },
        component: () => import(/* webpackChunkName: "mine" */ "../views/Mine/mine"),
        children: []
      }
    ]
  },
  {
    path: "/404",
    name: "Page404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404/404")
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
  if (to.path === "/login") {
    window.localStorage.removeItem("serverToken");
  }
  if (!serverToken && to.path !== "/login") {
    next({path: "/login"});
  } else {
    next();
  }
});

export default router;

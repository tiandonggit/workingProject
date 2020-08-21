<template>
  <div class="headerBar_page">
    <div class="logo_box">
      <img src="../../assets/image/logo.png" alt="">
      <span>智造办侣</span>
    </div>
    <ul class="bar_box">
      <li :class="[{'checked':checked === 'project'}]" @click.stop="routerLink('project','project')">
        <i class="icon-xiangmu1 iconfont"></i>
        <span>项目</span>
        <i class="icon-xiaosanjiaoup iconfont check_tip" v-if="checked === 'project'"></i>
      </li>
      <li :class="[{'checked':checked === 'cloudDisk'}]" @click.stop="routerLink('cloudDisk','cloudDisk')">
        <i class="icon-wenjian iconfont"></i>
        <span>文件</span>
        <i class="icon-xiaosanjiaoup iconfont check_tip" v-if="checked === 'cloudDisk'"></i>
      </li>
      <li :class="[{'checked':checked === 'approval'}]" @click.stop="routerLink('approval','approval')">
        <i class="icon-shenpi iconfont"></i>
        <span>审批</span>
        <i class="icon-xiaosanjiaoup iconfont check_tip" v-if="checked === 'approval'"></i>
      </li>
      <li :class="[{'checked':checked === 'mine'}]" @click.stop="routerLink('mine','mine')">
        <i class="icon-wode iconfont"></i>
        <span>我的</span>
        <i class="icon-xiaosanjiaoup iconfont check_tip" v-if="checked === 'mine'"></i>
      </li>
    </ul>
    <div class="admin_box">
      <el-dropdown trigger="click">
        <img :src="loginData.userMessage.headurl || ''" alt="">
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>

  import {mapState} from 'vuex';

  export default {
    name: "headerBar",
    watch: {
      $route: {
        handler(newValue, oldValue) {
          this.checked = this.$route.meta.checked || "";
        },
        deep: true,
        immediate: true
      }
    },
    computed:{
      ...mapState(["loginData" ])
    },
    data() {
      return {
        checked: "", // menu高亮
        dialogVisible: false // 退出登录弹窗
      };
    },
    methods: {
      /**
       * 路由跳转
       * **/
      routerLink(routerName, check) {
        if (this.checked === check) {
          return false;
        } else {
          this.$routerLink(routerName);
        }
      },

      closeDialog(val) {
        this.dialogVisible = val;
      },

      /**
       * 退出登录
       * **/
      logout() {
        window.localStorage.removeItem("serverToken");
        let checkedFileSpaceMessage = {
          fileSpaceName: "",
          fileSpaceId: "",
          filePermission: []
        };
        window.localStorage.removeItem('online');
        this.$store.commit("imData/saveChatList", []);
        this.$store.commit("homeData/imSelectedInfo", {});
        this.$store.commit("homeData/listSelectedInfo", {});
        this.$store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
        this.$routerLink("login");
      }
    },
    created() {
      this.checked = this.$route.meta.checked || "";
    }
  };
</script>

<style scoped lang="less">

  .headerBar_page {
    display: flex;
    width: 100%;
    height: 80px;

    .logo_box {
      display: flex;
      align-items: center;
      width: 306px;
      height: 100%;
      padding-left: 15px;
      background-color: @barBackgroundColor;

      img {
        display: block;
        width: 60px;
        height: 60px;
      }

      span {
        padding-left: 15px;
        font-size: 20px;
        font-weight: bold;
        color: @fontColorFFF;
      }
    }

    .bar_box {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      border-bottom: 1px solid @barBackgroundColor;
      padding-left: 40px;

      li.checked {

        i, span {
          color: @checkedHighLightColor;
        }
      }

      li {
        display: flex;
        position: relative;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        margin-right: 40px;
        color: @fontColor999;
        cursor: pointer;

        i.check_tip {
          color: @checkedHighLightColor;
          position: absolute;
          bottom: -11px;
          left: 5px;
          font-size: 20px;
        }

        i {
          font-size: 30px;
          color: @fontColor999;
          margin-bottom: 4px;
        }

        span {
          font-size: 14px;
          font-weight: 400;
          color: @fontColor999;
        }

      }
    }

    .admin_box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 15px;
      border-bottom: 1px solid @barBackgroundColor;

      img {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 8px;
      }
    }
  }
</style>

/**
*@desc bar组件
*@author houpai
*@date 2020/03/20 15:50:30
*/
<template>
  <div class="chatBar_page">
    <div class="top_box">
      <div class="user_avatar">
        <img :src="loginData.userMessage.headurl" alt="">
      </div>
      <ul class="menu_list">
        <li :class="[{'checked':checked === 'chat'}]" @click.stop="routerLink('im','chat')">
          <i class="iconfont icon-xiaoxi"></i>
          <span>会话</span>
        </li>
        <li :class="[{'checked':checked === 'mailList'}]" @click.stop="routerLink('mailList','mailList')">
          <i class="iconfont icon-tongxunlu"></i>
          <span>通讯录</span>
        </li>
        <li :class="[{'checked':checked === 'fileDisk'}]" @click.stop="routerLink('fileDisk','fileDisk')">
          <i class="iconfont icon-wenjian"></i>
          <span>文件</span>
        </li>
      </ul>
    </div>
    <div class="bottom_box">
      <div class="logout_btn" @click.stop="dialogVisible=true">
        退出
      </div>
    </div>
    <tips-dialog
        :dialogVisible="dialogVisible"
        @submitHandle="logout"
        :dialog-type="'makeSureLogout'"
        @closeDialog="closeDialog"
        v-if="dialogVisible"></tips-dialog>
  </div>
</template>

<script>

  import tipsDialog from "../tipsDialog/tipsDialog";
  import {mapState} from "vuex";

  export default {
    name: "chatBar",
    computed: {
      ...mapState(["homeData", "loginData"])
    },
    components: {
      tipsDialog
    },
    watch: {
      $route: {
        handler(newValue, oldValue) {
          this.checked = this.$route.meta.checked || "";
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        checked: "", // menu高亮
        dialogVisible: false // 退出登录弹窗
      };
    },
    methods: {
      /**
       *
       * **/
      routerLink(routerName,check,) {
        if(this.checked === check) {
          return false
        }else {
          this.$routerLink(routerName)
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
        this.$store.commit("imData/saveChatList", []);
        this.$store.commit("homeData/imSelectedInfo", {});
        this.$store.commit("homeData/listSelectedInfo", {});
        this.$routerLink("login");
      }
    },
    created() {
      this.checked = this.$route.meta.checked || "";
    }
  };
</script>

<style scoped lang="less">
  .chatBar_page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: @barBackgroundColor;
    width: 80px;
    height: 100%;
    overflow: hidden;
    padding: 20px 10px 10px 10px;

    .top_box {
      .user_avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 30px;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .menu_list {
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          cursor: pointer;
          margin-bottom: 30px;

          i {
            width: 30px;
            height: 30px;
            color: @menuIconColor;
            font-size: 30px;
            margin-bottom: 6px;
          }

          span {
            font-size: 14px;
            line-height: 18px;
            font-weight: 400;
            color: @menuIconColor;
          }
        }

        li.checked {
          i {
            color: @mainBackgroundColor;
            font-size: 30px;
            margin-bottom: 6px;
          }

          span {
            color: @mainBackgroundColor;
          }
        }
      }
    }

    .bottom_box {
      .logout_btn {
        width: 60px;
        height: 30px;
        border-radius: 10px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        background-color: @mainBackgroundColor;
        color: @barBackgroundColor;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>

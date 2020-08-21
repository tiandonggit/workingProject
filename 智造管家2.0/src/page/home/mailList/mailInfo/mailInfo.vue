<template>
  <div class="mailInfo_page">
    <div class="top"></div>
    <div class="container">
      <div class="single-box" v-if="homeData.listSelectedInfo.targetType == '0'">
        <div class="block-top">
          <div class="name">{{homeData.listSelectedInfo.nickname}}</div>
          <div class="img">
            <img :src="homeData.listSelectedInfo.headurl" alt />
          </div>
        </div>
        <p class="phone">
          手机号码：
          <span>{{homeData.listSelectedInfo.phone}}</span>
        </p>
        <div class="send-msg" @click.stop="sendMsgBtn">发消息</div>
      </div>
      <div class="group-box" v-if="homeData.listSelectedInfo.targetType == '1'">
        <img src="../../../../assets/images/group_head_big.png" alt />
        <p class="name">{{homeData.listSelectedInfo.groupname}}</p>
        <div class="send-msg" @click.stop="sendMsgBtn">发消息</div>
        <p class="delete" @click.stop="outGroup(homeData.listSelectedInfo.id)">从通讯录中删除</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "mailInfo",
  computed: {
    ...mapState(["homeData", "loginData", "imData"])
  },
  data() {
    return {};
  },
  methods: {
    sendMsgBtn() {
      this.$store.commit(
        "homeData/imSelectedInfo",
        this.homeData.listSelectedInfo
      );
      if (this.homeData.listSelectedInfo.targetType == "0") {
        let par = {
          targetType: 0,
          sessionId: this.homeData.listSelectedInfo.id,
          isActive: true,
          isShowSearch: true,
          unReadMessageCount: 0,
          chatList: [
            {
              noShow: true,
              id: "",
              sendTimestamp: new Date().getTime(),
              sendUserId: this.homeData.listSelectedInfo.id,
              sendUserName: this.homeData.listSelectedInfo.nickname,
              sendUserHeadUrl: this.homeData.listSelectedInfo.headurl,
              toUserId: this.loginData.userMessage.userid,
              toUserName: this.loginData.userMessage.nickname,
              toUserHeadUrl: this.loginData.userMessage.headurl,
              messageType: "1",
              isPlaying: false,
              isReaded: false,
              content: " "
            }
          ],
          id: this.homeData.listSelectedInfo.id,
          phone: this.homeData.listSelectedInfo.phone,
          username: this.homeData.listSelectedInfo.nickname,
          headurl: this.homeData.listSelectedInfo.headurl
        };
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
        if (chatListVuex.length == 0) {
          chatListVuex.unshift(par);
        } else {
          let num = 0;
          chatListVuex.forEach((v, e) => {
            if (this.homeData.listSelectedInfo.id == v.sessionId) {
              chatListVuex[e].isActive = true;
            } else {
              chatListVuex[e].isActive = false;
              num++;
            }
          });
          if (num == chatListVuex.length) {
            chatListVuex.unshift(par);
          }
        }
        this.$store.commit("imData/saveChatList", chatListVuex)

        this.$router.push({
          name: "singleChat"
        });
      } else if (this.homeData.listSelectedInfo.targetType == "1") {
        let par = {
          targetType: 1,
          sessionId: this.homeData.listSelectedInfo.id,
          isActive: true,
          isShowSearch: true,
          unReadMessageCount: 0,
          chatList: [
            {
              noShow: true,
              id: "",
              sendTimestamp: new Date().getTime(),
              sendUserId: this.homeData.listSelectedInfo.id,
              sendUserName: this.homeData.listSelectedInfo.nickname,
              sendUserHeadUrl: this.homeData.listSelectedInfo.headurl,
              toUserId: this.loginData.userMessage.userid,
              toUserName: this.loginData.userMessage.nickname,
              toUserHeadUrl: this.loginData.userMessage.headurl,
              messageType: "1",
              isPlaying: false,
              isReaded: false,
              content: " "
            }
          ],
          id: this.homeData.listSelectedInfo.id,
          phone: this.homeData.listSelectedInfo.phone,
          groupname: this.homeData.listSelectedInfo.groupname
        };
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList))
        if (chatListVuex.length == 0) {
          chatListVuex.unshift(par);
        } else {
          let num = 0;
          chatListVuex.forEach((v, e) => {
            if (this.homeData.listSelectedInfo.id == v.sessionId) {
              chatListVuex[e].isActive = true;
            } else {
              chatListVuex[e].isActive = false;
              num++;
            }
          });
          if (num == chatListVuex.length) {
            chatListVuex.unshift(par);
          }
        }
        this.$store.commit("imData/saveChatList", chatListVuex)
        this.$router.push({
          name: "groupChat"
        });
      }
    },
    outGroup(groupId) {
      this.$http
        .request({
          url: "/ImGroupUserController/getOutFromGroup",
          method: "post",
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          body: {
            groupid: groupId,
            sendMessageId: this.$uuid()
          }
        })
        .then(res => {
          this.btnLoading = false;
          if (res.data.success) {
            this.$message({
              message: "退出成功",
              type: "success"
            });
            this.imData.chatList.forEach((v, e) => {
              if(v.sessionId == groupId){
                this.imData.chatList.splice(e, 1);
              }
            })
            this.homeData.listSelectedInfo = {};
            this.$parent.$parent.getMailList();
          } else {
            this.$message.error(res.data.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped lang="less">
.mailInfo_page {
  width: 100%;
  height: 100%;

  .top {
    height: 55px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .container {
    .single-box {
      padding: 110px 88px 0;

      .block-top {
        padding: 30px 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .name {
          font-size: 24px;
          font-weight: 400;
          color: @titleColor;
          line-height: 24px;
        }

        .img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }

      .phone {
        margin: 30px 0 70px;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 18px;

        span {
          color: @titleColor;
        }
      }

      .send-msg {
        width: 111px;
      }
    }

    .group-box {
      padding-top: 140px;
      text-align: center;

      img {
        width: 120px;
        display: block;
        margin: 0 auto;
      }

      .name {
        margin: 30px 0 70px;
        font-size: 24px;
        font-weight: 400;
        color: @titleColor;
        line-height: 24px;
      }

      .send-msg {
        width: 126px;
      }

      .delete {
        margin-top: 225px;
        font-size: 14px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 14px;

        &:hover {
          color: @exitGroupFontColor;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }

    .send-msg {
      height: 36px;
      margin: 0 auto;
      background: linear-gradient(270deg, @beginColor 0%, @mainColor 100%);
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      text-align: center;
      font-weight: 400;
      color: @fontColorFFF;
      line-height: 36px;

      &:hover {
        background: rgba(1, 128, 255, 0.6);
      }
    }
  }
}
</style>

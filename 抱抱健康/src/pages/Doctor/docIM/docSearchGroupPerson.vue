/** *@desc 医生端IM小组添加删减人员列表 *@author liushuo *@date
2019年7月15日10:25:03 */
<template>
  <div id="docSearchGroupPerson">
    <common-header :share-disabled="true" :custom-title="''"></common-header>
    <div class="chatIMList_header">
      <van-search
        placeholder="请按医生姓名搜索"
        v-model="name"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      ></van-search>
    </div>
    <div class="content">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          @click="addPersion(index, item.state)"
          v-show="isResult"
        >
          <template slot="title">
            <div class="chat_lists_item">
              <div class="img_box">
                <img :src="item.url" alt />
              </div>
              <ul class="chat_message_box">
                <li class="name_box">
                  <span class="name">
                    {{ item.docName }}
                  </span>
                </li>
                <li class="unReadMessage_box">
                  <span class="unReadMessage_box_span">
                    <div class="unReadMessage_box_i">
                      <span>{{ item.hosName }}</span>
                      <span class="Department" style="margin-left: 10px">{{
                        item.depName
                      }}</span>
                    </div>
                  </span>
                </li>
              </ul>
            </div>
          </template>
          <template slot="right-icon" v-if="item.state == 1">
            <span class="span_box">已添加</span>
          </template>
        </van-cell>
        <div v-show="!isResult" class="searchResult">
          <img src="../../../assets/images/searchResult.png" alt />
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "docSearchGroupPerson",
  components: {
    commonHeader
  },
  data() {
    return {
      groupId: 0, //小组id 原默认0查所有好友
      name: "",
      list: [],
      loading: false,
      finished: false,
      page: 1,
      limit: 20,
      isResult: true,
      state: "", //状态
      fromType: "" //来源页
    };
  },
  computed: {
    //返回已选中的好友信息
    searchFriendList() {
      return this.$store.state.DoctorIM.searchFriendList;
    }
  },
  created() {
    this.groupId = this.$route.query.groupId;
    this.state = this.$route.query.res;
    this.fromType = this.$route.query.fromType;
    this.addFriendListMessage = this.$store.state.DoctorIM.addFriendList
      ? this.$store.state.DoctorIM.addFriendList
      : "";
  },
  methods: {
    //添加人员
    addPersion(index, state) {
      if (state == 1) {
        //已添加
        return;
      }

      let list = this.searchFriendList.slice();
      list.push(this.list[index]);

      if (this.state === "del") {
        this.list.splice(index, 1);
      }

      this.$store.commit("DoctorIM/saveSearchFriendList", list);
      this.$router.back();
    },
    //查询医生会话列表 更新数据
    chatList() {
      this.$http
        .request({
          method: "get",
          url: "/ImController/getDoctorSessionList",
          body: {
            limit: 999
          }
        })
        .then(res => {
          if (res.data.success && res.data) {
            this.$store.commit("DoctorIM/saveChatList", res.data.data);
            this.$router.push({
              name: "docChatIMDetail",
              query: {
                createType: "true"
              }
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    //查询好友(可以添加的好友)
    searchFriend() {
      this.$http
        .request({
          method: "get",
          url: "/ImGroupController/selectGroupUser",
          body: {
            id: this.groupId,
            name: this.name,
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          this.finished = true;
          if (res.data.success && res.data.data.length > 0) {
            this.list = this.list.concat(res.data.data);
            this.page++;
          } else {
            this.finished = true;
          }
        })
        .catch(e => {
          this.finished = true;
          Toast("加载失败，请检查网络连接");
        });
    },
    onLoad() {
      if (this.state === "add") {
        //添加 （创建、维护）
        this.searchAllFriend();
      } else if (this.state === "del") {
        // 加载状态结束
        this.loading = false;
        this.finished = true;
      } else if (this.state === "addDoc") {
        this.searchFriend();
      }
    },
    //查询所有好友
    searchAllFriend() {
      this.$http
        .request({
          method: "get",
          url: "/ImFriendController/selectFriend",
          body: {
            name: this.name,
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          if (res.data.success && res.data.data.length > 0) {
            this.list = this.list.concat(res.data.data);
            this.page++;
          } else {
            this.finished = true;
            // Toast(res.data.message);
          }
        })
        .catch(e => {
          this.finished = true;
          Toast("加载失败，请检查网络连接");
        });
    },
    //删除
    searchDelFriend() {
      for (let i = 0; i < this.addFriendListMessage.length; i++) {
        if (this.name === this.addFriendListMessage[i].docName) {
          this.list.push(this.addFriendListMessage[i]);
          this.addFriendListMessage.splice(i, 1);
        }
      }
    },
    onSearch() {
      this.page = 1;
      this.list = [];
      if (this.state === "add") {
        //添加 （创建、维护）
        //this.searchAllFriend();
        this.searchFriend();
      } else if (this.state === "del") {
        this.searchDelFriend();
      } else if (this.state === "addDoc") {
        //从维护过来
        this.searchFriend();
      }
    },
    onCancel() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="less">
#docSearchGroupPerson {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  //padding-top: 54px;
}
.chatIMList_header {
  position: fixed;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  width: 100vw;
  height: auto;
  background-color: #ffffff;
}
.content {
  position: absolute;
  width: 100%;
  height: auto;
  top: 8%;
}
.searchResult {
  width: 100%;
  .height(500);
  display: flex;
  justify-content: center;
  align-items: center;
}

#docSearchGroupPerson /deep/ .van-search__content {
  background-color: #fcf3ea;
}
#docSearchGroupPerson /deep/ .van-field__body {
  .lineHeight(24);
}

#docSearchGroupPerson /deep/ .van-field__left-icon {
  .lineHeight(24);
}
.img_box {
  .margin(0, 11, 0, 0);
  width: 51 / 375 * 100vw;
  .height(51);

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.chat_message_box {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;

  li {
    .lineHeight(28);
  }

  .name_box {
    .name {
      .fontSize(18);
    }

    .type {
      .fontSize(14);
      color: rgba(122, 179, 255, 1);
      .margin(0, 0, 0, 10);
    }

    .time {
      .fontSize(8);
      color: rgba(153, 153, 153, 1);
      float: right;
      .lineHeight(28);
    }
  }

  .unReadMessage_box {
    .fontSize(12);
    color: rgba(153, 153, 153, 1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .unReadMessage {
      width: 14px;
      height: 14px;
      background: rgba(233, 140, 46, 1);
      border-radius: 8px;
      line-height: 14px;
      text-align: center;
      color: #fff;
      font-size: 8px;
      float: right;
      margin: auto 0;
    }

    .unReadMessage_box_span {
      float: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .unReadMessage_box_i {
        display: inline-block;
        width: 62vw;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
.span_box {
  display: inline-block;
  .lineHeight(58);
}
.chat_lists_item {
  display: flex;
}
.chat_message_box {
  flex: 1;
}
</style>

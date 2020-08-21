/** *@desc 聊天添加删减人员搜索列表 *@author liushuo *@date
2019年7月15日10:25:03 */
<template>
  <div id="docSearchChatGroupPerson">
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
  name: "docSearchChatGroupPerson",
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
    addFriendListMessage() {
      return this.$store.state.DoctorIM.addFriendList;
    }
  },
  created() {
    this.groupId = this.$route.query.groupId;
    this.state = this.$route.query.res;
    this.fromType = this.$route.query.fromType;
  },
  methods: {
    //添加人员
    addPersion(index, state) {
      if (state == 1) {
        //已添加
        return;
      }
      if (this.state === "addSteam") {
        //群聊
        let arr = []; //id
        let list = this.addFriendListMessage.slice();
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i].docId);
        }
        if (arr.includes(this.list[index].docId)) {
          Toast("重复的成员");
        } else {
          list.push(this.list[index]);
          this.$store.commit("DoctorIM/saveAddFriendList", list);
          this.$router.back();
        }
      } else if (this.state === "addDoc") {
        //一对一 变 群聊
        let arr = []; //id
        let list = this.addFriendListMessage.slice();
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i].docId);
        }
        if (arr.includes(this.list[index].docId)) {
          Toast("重复的成员");
        } else {
          list.push(this.list[index]);
          this.$store.commit("DoctorIM/saveAddFriendList", list);
          this.$router.back();
        }
      }
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
    onLoad() {
      if (this.state === "addDoc") {
        //一对一单聊 添加医生
        this.searchAllFriend();
      } else if (this.state === "addSteam") {
        //群聊
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
    //搜索框搜索
    onSearch() {
      this.page = 1;
      this.list = [];
      if (this.state === "addDoc") {
        //一对一单聊 添加医生
        this.searchAllFriend();
      } else if (this.state === "addSteam") {
        //群聊
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
#docSearchChatGroupPerson {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
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

#docSearchChatGroupPerson /deep/ .van-search__content {
  background-color: #fcf3ea;
}
#docSearchChatGroupPerson /deep/ .van-field__body {
  .lineHeight(24);
}

#docSearchChatGroupPerson /deep/ .van-field__left-icon {
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
        width: 68vw;
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

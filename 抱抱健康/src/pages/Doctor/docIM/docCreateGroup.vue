/* * @Author: 田东 * @Date: 2020-01-09 10:38:39 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-09 10:40:45 * @name 创建医生小组 */
<template>
  <div id="docCreateGroup">
    <common-header
      :share-disabled="true"
      :custom-title="'医患沟通'"
    ></common-header>
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">创建医生小组</div>
      <div class="price header-right">
        <span @click="show = true">成员维护</span>
      </div>
    </div>

    <van-cell
      is-link
      :value="groupName"
      :to="{
        name: 'docChangeGroupName',
        query: { groupName: groupName, groupId: groupId }
      }"
      class="group"
    >
      <template slot="title">
        <span>小组名称</span>
      </template>
    </van-cell>

    <van-cell-group class="addGroup" v-if="!isVisible">
      <van-cell @click="addMember('add')">
        <template slot="title">
          <img src="../../../assets/images/icon_jiahao.png" alt="" />
          <span>添加分组成员</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="groupList" v-if="isVisible">
      <van-cell>
        <template slot="title">
          <i class="border_title"></i>
          <span>已添加成员</span>
        </template>
      </van-cell>
      <van-cell title>
        <template slot="title">
          <div
            class="chat_lists_item"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="img_box">
              <img :src="item.url" alt />
            </div>
            <ul class="chat_message_box">
              <li class="name_box">
                <p class="public-title">
                  {{ item.docName }}
                  <span class="office">
                    <span>{{ item.positionName }}</span>
                  </span>
                  <span class="department" style="margin-left: 10px">
                    {{ item.depName }}
                  </span>
                </p>
              </li>
              <li class="unReadMessage_box">
                <div class="unReadMessage_box_span">
                  <span class="unReadMessage_box_i">
                    {{ item.hosName }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-popup v-model="show" position="bottom" :style="{ height: 'auto' }">
      <van-cell>
        <template slot="title">
          <span class="addPerson" @click="personHandle('add')">添加人员</span>
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <span class="delPerson" @click="personHandle('del')">删减人员</span>
        </template>
      </van-cell>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "docCreateGroup",
  components: {
    commonHeader
  },
  data() {
    return {
      groupName: "",
      placeholder: "医生小组",
      isVisible: false,
      show: false,
      page: 1,
      groupId: "",
      limit: 999,
      list: []
    };
  },
  computed: {
    addFriendList() {
      return this.$store.state.DoctorIM.addFriendList;
    }
  },
  created() {
    this.groupId = this.$route.query.groupId ? this.$route.query.groupId : "";

    if (Object.keys(this.$route.query).length == 0) {
      this.chatGroup();
    }

    this.groupName = this.$store.state.DoctorIM.groupName
      ? this.$store.state.DoctorIM.groupName
      : "";

    if (this.groupId.length > 0) {
      this.getMember();
    }
  },
  beforeDestroy() {},
  methods: {
    //查询医生小组数量
    chatGroup() {
      this.$http
        .request({
          method: "get",
          url: "/ImGroupController/selectGroup",
          body: {
            name: "",
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            let num = res.data.data.length;
            num++;
            this.placeholder = "医生小组" + num;
            this.groupName = this.placeholder;
            // this.$store.commit("DoctorIM/saveGroupName", this.groupName);
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    //获取医生成员列表
    getMember() {
      this.$http
        .request({
          method: "get",
          url: "/ImGroupDoctorController/selectUser",
          body: {
            id: this.groupId,
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          this.finished = true;
          if (res.data.success) {
            this.list = res.data.data;
            this.isVisible = this.list.length === 0 ? false : true;
            this.$store.commit("DoctorIM/saveAddFriendList", this.list);
            this.page++;
          }
        })
        .catch(e => {
          this.finished = true;
          Toast("加载失败，请检查网络连接");
        });
    },
    onClickLeft() {
      // Dialog.confirm({
      //   message: "是否保存该医生小组"
      // })
      //   .then(() => {
      this.save();
      // })
      // .catch(() => {
      //   this.$router.push({
      //     name: "docChatIMList"
      //   });
      // });
      // this.$store.commit("DoctorIM/clearAddFriendList");
      // this.$store.commit("DoctorIM/clearGroupName");
      // this.$router.push({
      //   name: "docChatIMList"
      // });
    },
    save() {
      this.$store.commit("DoctorIM/clearAddFriendList");
      this.$store.commit("DoctorIM/clearGroupName");
      this.$router.push({
        name: "docChatIMList"
      });
    },
    addMember() {
      this.groupName = this.groupName ? this.groupName : this.placeholder;
      this.$store.commit("DoctorIM/saveGroupName", this.groupName);
      this.$router.push({
        name: "docAddGroupPerson",
        query: {
          res: "add",
          name: this.groupName,
          fromType: "create",
          id: this.groupId
        }
      });
    },
    personHandle(val) {
      this.$store.commit("DoctorIM/saveGroupName", this.groupName);
      this.$router.push({
        name: "docAddGroupPerson",
        query: {
          res: val,
          name: this.groupName,
          fromType: "create",
          id: this.groupId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}

#docCreateGroup {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: @backgroundColor;

  .header_box {
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100vw;
    height: auto;
    background: @backgroundColor;

    .header-left {
      float: left;
      .width(100);
      .height(44);
      .lineHeight(44);
      .padding(0, 0, 0, 10);

      .back-icon {
        .fontSize(20);
        font-weight: 600;
        color: @titleColor;
      }
    }

    .header-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      .fontSize(18);
      width: 0;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 400;
      color: @titleColor;
      .lineHeight(44);
    }

    .header-right {
      text-align: right;
      .width(100);
      .padding(0, 12, 0, 0);
      color: @mainColor;
      .fontSize(16);
      font-weight: 500;
      .lineHeight(16);
    }
  }

  .group {
    .width(351);
    margin: 0 auto;
    .padding(10, 12, 10, 12);
    .borderRadius(10, 10, 0, 0);
    overflow: hidden;

    .van-cell__title {
      .padding(0, 0, 0, 14);
      background: url("../../../assets/images/icon_zhu.png") 0 center no-repeat;
      background-size: 1.07vw;

      span {
        .fontSize(16);
        color: @titleColor;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
      }
    }

    .van-cell__value {
      span {
        .fontSize(16);
        color: @descriptionColor;
      }
    }
  }

  .addGroup {
    .width(351);
    margin: 0 auto;
    .borderRadius(0, 0, 10, 10);
    overflow: hidden;

    .van-cell__title {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        .width(20);
        .margin(0, 10, 0, 0);
      }

      span {
        .fontSize(16);
        color: @descriptionColor;
      }
    }
  }
}

.groupInput {
  border: 0;
}

.addPerson,
.delPerson {
  text-align: center;
  width: 100%;
  display: inline-block;
  .fontSize(16);
}

.groupList {
  .width(351);
  margin: 0 auto;
  background: @backgroundColor;
  .borderRadius(10, 10, 10, 10);

  .van-cell {
    background: @backgroundColorT;
    // .borderRadius(0, 0, 10, 10);
    .padding(15, 10, 15, 10);
    overflow: hidden;

    &:first-child {
      .borderRadius(0, 0, 10, 10);

      .van-cell__title {
        .padding(0, 0, 0, 14);
        background: url("../../../assets/images/icon_zhu.png") 0 center
          no-repeat;
        background-size: 1.07vw;

        span {
          .fontSize(16);
          color: @titleColor;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
        }
      }
    }

    &:last-child {
      .borderRadius(10, 10, 10, 10);
    }
  }

  .chat_lists_item {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    .padding(0, 0, 15, 0);
    .margin(0, 0, 15, 0);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:last-child {
      margin: 0;
      padding: 0;
      border-bottom: none;
    }

    .img_box {
      .margin(0, 11, 0, 0);
      .width(60);
      .height(60);
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
      }
    }

    .chat_message_box {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 0;
      .margin(0, 10, 0, 10);

      li {
        .lineHeight(28);
      }

      .name_box {
        padding: 0 !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .unReadMessage_box {
        .fontSize(12);
        color: @subtitleColor;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .unReadMessage_box_span {
          float: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          .unReadMessage_box_i {
            .fontSize(14);
            line-height: 4.8vw;
            display: inline-block;
            width: 66vw;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>

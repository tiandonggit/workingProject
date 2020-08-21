/* * @Author: 田东 * @Date: 2020-01-10 09:30:36 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-10 09:30:36 * @name 医疗小组 编辑*/
<template>
  <div id="docSelectGroup">
    <common-header
      :share-disabled="true"
      :custom-title="'医患沟通'"
    ></common-header>
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">医疗小组</div>
      <div class="price header-right" v-if="isVisible">
        <span @click="show = true">编辑</span>
      </div>
    </div>

    <van-cell
      is-link
      value=""
      :to="{
        name: 'docChangeGroupName',
        query: { groupName: groupName, groupId: groupId }
      }"
      class="group-name"
    >
      <template slot="title">
        <span>{{ groupName }}</span>
      </template>
    </van-cell>
    <!-- <van-cell value="" class="group-member">
      <template slot="title">
        <span>已添加成员</span>
      </template>
    </van-cell> -->

    <van-cell-group class="groupList" v-if="isVisible">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell title="" v-for="(item, index) in list" :key="index">
          <template slot="title">
            <div class="chat_lists_item">
              <div class="img_box">
                <img :src="item.url" alt="" />
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
      </van-list>
    </van-cell-group>

    <van-popup v-model="show" position="bottom" :style="{ height: 'auto' }">
      <van-cell>
        <template slot="title">
          <span class="addPerson" @click="personHandle('addDoc')"
            >添加人员</span
          >
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
  name: "docSelectGroup",
  components: {
    commonHeader
  },
  data() {
    return {
      groupId: "", //小组id
      friendName: "", //好友名称
      getData: false, //请求数据的标识，保证只请求一次
      groupName: "",
      placeholder: "",
      isVisible: true,
      show: false,
      loading: false,
      finished: false,
      page: 1,
      limit: 20,
      list: []
    };
  },
  computed: {
    addFriendList() {
      return this.$store.state.DoctorIM.addFriendList;
    },
    getGroupNum() {
      return this.$store.state.DoctorIM.groupNum;
    },
    getFromType() {
      return this.$store.state.DoctorIM.fromType;
    }
  },
  created() {
    this.groupId = this.$route.query.gid;
    this.groupName = this.$store.state.DoctorIM.groupName
      ? this.$store.state.DoctorIM.groupName
      : "";
  },
  methods: {
    createGroup() {
      let name;
      let arr = [];
      for (let i = 0; i < this.list.length; i++) {
        arr.push(this.list[i].docId);
      }
      this.groupName === ""
        ? (name = this.placeholder)
        : (name = this.groupName);
      this.$http
        .request({
          method: "post",
          url: "/ImGroupController/updateGroupUserS",
          body: {
            name: this.groupName,
            id: this.groupId,
            list: arr.toString()
          }
        })
        .then(res => {
          if (res.data.total == 1) {
            Toast("已有相同的小组名称");
            return;
          }
          if (res.data.success) {
            this.$store.commit("DoctorIM/saveFromType", "");
            this.$store.commit("DoctorIM/clearAddFriendList");
            this.$router.back();
          } else if (res.data.code === "0001") {
            Toast(res.data.message);
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    onLoad() {
      this.selectGroup();
    },
    //查询小组成员
    selectGroup() {
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
      this.$store.commit("DoctorIM/clearAddFriendList");
      this.$store.commit("DoctorIM/clearGroupName");
      this.$router.back();
    },
    onClickRight() {},
    //跳转搜索
    personHandle(val) {
      this.$router.push({
        name: "docAddGroupPerson",
        query: {
          res: val,
          id: this.groupId,
          fromType: "selectGroup"
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
#docSelectGroup {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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

  .group-name,
  .group-member {
    .width(351);
    margin: 0 auto;
    .padding(11, 10, 11, 10);

    /deep/ .van-cell__title {
      span {
        .fontSize(16);
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: @titleColor;
        .lineHeight(24);
      }
    }

    /deep/ .van-cell__value {
      span {
        .fontSize(16);
        font-weight: 400;
        color: @descriptionColor;
        .lineHeight(24);
      }
    }
  }

  .group-name {
    .borderRadius(10, 10, 0, 0);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .group-member {
    .borderRadius(0, 0, 10, 10);
  }

  .groupList {
    .width(351);
    margin: 0 auto;
    background: @backgroundColor;

    /deep/ .van-cell {
      background: @backgroundColorT;
      // .borderRadius(0, 0, 10, 10);
      .padding(14, 10, 14, 10);
      // overflow: hidden;

      &:nth-last-of-type(3) {
        .borderRadius(0, 0, 10, 10);
        overflow: hidden;
      }
    }

    .chat_lists_item {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;

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

        li {
          .lineHeight(28);
        }

        .name_box {
          padding: 0 !important;
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
}

.addPerson,
.delPerson {
  text-align: center;
  .fontSize(16);
  width: 100%;
  display: inline-block;
}
</style>

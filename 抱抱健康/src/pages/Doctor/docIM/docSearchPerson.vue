/* * @Author: 田东 * @Date: 2020-01-07 15:03:10 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-07 15:04:23 * @name im 搜索聊天列表 */
<template>
  <div id="docSearchPerson">
    <common-header :share-disabled="true" :custom-title="''"></common-header>
    <div class="chatIMList_header">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
        placeholder="搜索二人会话名称"
        v-model="chatName"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      ></van-search>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishedText"
      :immediate-check="isCheck"
      @load="onLoad"
    >
      <div class="result">
        <van-cell v-for="(item, index) in list" :key="index">
          <template slot="title">
            <div class="chat_lists_item" @click="chatDetail(item.imsessionid)">
              <div class="img_box">
                <img :src="item.vxheadurl" alt />
              </div>
              <ul class="chat_message_box">
                <li>
                  <span class="name">{{ item.patientname }}</span>
                </li>
                <li>
                  <span class="illness">{{ item.illnessname }}</span>
                </li>
              </ul>
            </div>
          </template>
        </van-cell>
      </div>
    </van-list>
    <div v-show="isNoResult" class="noResult">
      <img src="../../../assets/images/no_articles.png" alt="" />
      <p class="top">无结果</p>
      <p class="again">
        未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
      </p>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "docSearchPerson",
  components: {
    commonHeader
  },
  data() {
    return {
      chatName: "",
      list: [],
      loading: false,
      finished: false,
      finishedText: "没有更多了",
      page: 1,
      isCheck: false,
      limit: 999,
      isNoResult: false
    };
  },
  methods: {
    //查询医生会话列表
    chatList() {
      this.$http
        .request({
          method: "get",
          url: "/ImController/searchMyPatientListByName",
          body: {
            name: this.chatName
          }
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          this.finished = true; //因为没有分页 page 参数 所以只能手动结束，传时间参数lastMessageTime空 结果为空
          if (res.data.success) {
            this.isNoResult = false;
            if (res.data.data.length == 0) {
              this.list = res.data.data;
              this.finishedText = "";
              this.isNoResult = true;
              return;
            }
            this.list = res.data.data;
            this.finishedText = "没有更多了";
          } else {
            this.list = [];
            this.finishedText = "";
            this.isNoResult = true;
          }
        })
        .catch(e => {
          this.finished = true;
          // Toast("获取数据失败1");
        });
    },
    chatDetail(id) {
      this.$store.commit("DoctorIM/setSessionid", id);
      this.$store.commit("DoctorIM/setSessionType", 0);
      this.$router.push({
        name: "docChatIMDetail"
      });
    },
    onLoad() {
      this.chatList();
    },
    headerBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    },
    onSearch() {
      this.chatList();
    },
    onCancel() {
      this.$router.back();
    },

    // 重新输入
    inputAgain() {
      this.chatName = "";
      this.isNoResult = false;
      let search = document.getElementsByClassName("van-field__control")[0];
      search.focus();
    }
  },

  created() {
    this.$nextTick(() => {
      try {
        let search = document.getElementsByClassName("van-field__control")[0];
        search.focus();
      } catch (e) {
        console.log(e);
      }
    });
  }
};
</script>

<style scoped lang="less">
#docSearchPerson {
  display: flex;
  flex-direction: column;
  // width: 100%;
  height: 100%;
  background: @backgroundColor;
  .padding(0, 12, 0, 12);

  .result {
    .margin(44, 0, 0, 0);

    /deep/ .van-cell {
      .margin(0, 0, 15, 0);
      .padding(15, 8, 15, 8);
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;
    }
  }
}

.chatIMList_header {
  position: fixed;
  -webkit-box-align: center;
  -ms-flex-align: center;
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
    .height(44);
    .lineHeight(44);
    .padding(0, 0, 0, 10);

    .back-icon {
      .fontSize(20);
      font-weight: 600;
      color: @titleColor;
    }
  }

  /deep/.van-search {
    .padding(5, 0, 5, 8);
    background: @backgroundColor !important;

    .van-search__content {
      background-color: @backgroundColorT;
      .borderRadius(6, 6, 6, 6);
    }

    .van-search__action {
      .padding(0, 12, 0, 12);
      .fontSize(16);
    }

    .van-icon-search,
    .van-field__control {
      .fontSize(16);
      .lineHeight(24);
    }

    .van-field__body,
    .van-field__left-icon {
      .lineHeight(24);
    }
  }
}

.img_box {
  .margin(0, 11, 0, 0);
  .width(60);
  .height(60);

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.span_box {
  display: inline-block;
  .lineHeight(48);
}

.chat_lists_item {
  display: flex;
}

.chat_message_box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .name {
    .fontSize(18);
    font-weight: 400;
    color: @titleColor;
    .lineHeight(20);
  }

  .illness {
    .fontSize(14);
    font-weight: 400;
    color: @subtitleColor;
    .lineHeight(16);
  }
}
</style>

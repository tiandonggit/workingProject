/** *@desc 患者端医疗团队搜索页 *@author houpai *@date 2019/07/16 13:06:49 */
<template>
  <div class="doctorTeamSearch_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医疗团队列表'"></common-header>
    <div class="search_header_box">
      <div class="search_header">
        <div class="header-div header-left" @click="$router.go(-1)">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        <van-search placeholder="搜索群组"
                    @input="isSearch=false"
                    v-model="groupName"
                    @search="chatGroup"></van-search>
      </div>
    </div>

    <van-list v-model="loading"
              v-if="groupList.length && isSearch"
              :finished="finished"
              finished-text="没有更多了"
              @load="">
      <van-cell v-for="(item, index) in groupList"
                :key="index"
                class="chatGroup_list_box">
        <template slot="title">
          <div class="chat_lists_item"
               :class="[{'noBorderRadiusBottom':index === 0,'withBorderRadius':index === groupList.length - 1}]"
               @click="gotoChatDetail(item)">
            <div class="content_box"
                 :class="[{'noBorderBottom':index === groupList.length - 1,'borderRadiusFirst':index === 0}]">
              <div class="img_box">
                <img src="../../../assets/images/default.png" alt=""/>
              </div>
              <div class="span_box">{{ item.sessionname }}</div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>

    <div v-if="!groupList.length && isSearch" class="noResult">
      <img src="../../../assets/images/no_articles.png" alt=""/>
      <p class="top">无结果</p>
      <p class="again">
        未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
      </p>
    </div>
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"></van-loading>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header"
  import Vue from "vue"
  import {Toast} from "vant"
  import {mapState} from "vuex"

  Vue.use(Toast)
  export default {
    name: "doctorTeamSearch",
    components: {
      commonHeader
    },
    data() {
      return {
        groupName: "",
        groupList: [],
        loading: false,
        finished: true,
        page: 1,
        limit: 999,
        isSearch:false,
      }
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    methods: {
      inputAgain() {
        this.groupName = ""
        this.$nextTick(() => {
          try {
            let searchInput = document.getElementsByClassName(
              "van-field__control"
            )[0]
            searchInput.focus()
          } catch (e) {
            console.log(e)
          }
        })
      },
      /**
       * 获取群聊列表**/
      chatGroup() {
        this.isSearch = true;
        this.loading = true
        let searchObj = {
          searchName: this.groupName,
          limit: this.limit
        }
        this.$http
          .request({
            method: "get",
            url: "/ImController/getPatientSessionListGroupChat",
            body: searchObj
          })
          .then(res => {
            this.loading = false
            if (res.data.success) {
              this.groupList = res.data.data ? res.data.data : []
            } else {
              console.log("患者群聊接口报错")
            }
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      },

      /**
       * 查看聊天详情**/
      gotoChatDetail(item) {
        let sessionMessage = JSON.parse(
          JSON.stringify(this.PatientIM.sessionMessage)
        )
        sessionMessage.sessionId = item.id
        sessionMessage.sessionType = item.sessiontype
        this.$store.commit("PatientIM/sessionMessage", sessionMessage)
        this.$router.push({
          path: "chatIMDetail",
          query: {
            sessionName: item.sessionname
          }
        })
      }
      // searchGroup() {
      //   this.page = 1;
      //   this.chatGroup();
      // },
      // onLoad() {
      //   this.chatGroup();
      // },
    },
    created() {
      this.chatGroup()
    }
  }
</script>

<style scoped lang="less">

  .doctorTeamSearch_page {
    .padding(54, 12, 0, 12);
    box-sizing: border-box;

    /deep/ .van-list .van-cell {
      width: auto;
      background: none;
      padding: 0 !important;
    }

    /deep/ .van-cell:not(:last-child)::after {
      display: none;
    }

    .chatGroup_list_box.noBorderRadiusBottom {
      .borderRadius(0, 0, 0, 0);
    }

    .chatGroup_list_box {

      .chat_lists_item.noBorderRadiusBottom {
        .borderRadius(10, 10, 0, 0);
      }

      .chat_lists_item.withBorderRadius {
        .borderRadius(0, 0, 10, 10);
      }

      .chat_lists_item {
        background-color: #fff;
        .padding(0, 10, 0, 10);
        .margin(0, 0, 0, 32);


        .noBorderBottom.content_box {
          border-bottom: none;
        }

        .content_box {
          display: flex;
          align-items: center;
          .height(90);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          width: 100%;

          .img_box {
            .width(60);
            .height(60);
            .margin(0, 17, 0, 0);

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          .span_box {
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .fontSize(18);
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }


</style>

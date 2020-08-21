/** *@desc 医患聊天搜索 *@author houpai *@date 2019/07/18 11:58:04 */
<template>
  <div class="chatIMListSearch_page">
    <common-header
        :share-disabled="true"
        :custom-title="'搜索结果'"
    ></common-header>
    <div class="search_header_box">
      <div class="search_header">
        <div class="header-div header-left" @click="$router.go(-1)">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        <van-search placeholder="请输入用户姓名"
                    @input="isSearch=false"
                    v-model="chatName"
                    @search="getChatList"></van-search>
      </div>
    </div>
    <ul class="chatList_list_box" v-if="chatList.length && isSearch">
      <li class="chat_lists_item"
          :class="[{'borderRadiusFirst':index === 0,'noBorder':index === chatList.length - 1}]"
          v-for="(item, index) in chatList"
          @click.stop="routerLink(item)"
          :key="index">
        <div class="img_box">
          <img :src="item.vxheadurl" alt=""/>
        </div>
        <ul class="chat_message_box">
          <li class="name_box">
            <span class="name">
              {{ item.doctorname }}
              <span class="type">
                医生
              </span>
            </span>
          </li>
          <li class="unReadMessage_box">
            <span class="unReadMessage_box_span">
              <i class="unReadMessage_box_i">
                {{ item.hospitalname }}
                <b class="Department" style="margin-left: 10px">{{
                  item.positionname
                }}</b>
              </i>
            </span>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="!chatList.length && isSearch" class="noResult">
      <img src="../../../assets/images/no_articles.png" alt=""/>
      <p class="top">无结果</p>
      <p class="again">
        未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
      </p>
    </div>

    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"
    ></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header"

  export default {
    name: "chatIMListSearch",
    components: {
      commonHeader
    },
    data() {
      return {
        chatName: "", // 搜索名
        chatList: "", // 聊天列表
        loading: false, // loading
        isSearch:false,// 是否已经查询过 用于区分缺醒提示
      }
    },
    methods: {
      inputAgain() {
        this.chatName = ""
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
       *获取医患者聊天列表**/
      getChatList() {
        this.isSearch = true;
        this.loading = true
        let body = {}
        if (this.chatName) {
          body.name = this.chatName
        }
        this.$http
          .request({
            method: "get",
            url: "/ImController/searchMyDoctorListByName",
            body: body
          })
          .then(res => {
            this.loading = false
            if (res.data.success && res.data.data) {
              this.chatList = res.data.data
            } else {
              console.log("搜索医患者聊天接口报错")
            }
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      },

      /**
       * 发起会话
       * @params item **/
      routerLink(item) {
        let sessionMessage = {
          sessionId: item.imsessionid,
          sessionType: 0,
          doctorId: item.doctorid
        }
        this.$store.commit("PatientIM/sessionMessage", sessionMessage)
        this.$router.push({
          path: "chatIMDetail",
          query: {}
        })
      }
    }
  }
</script>

<style scoped lang="less">


  .chatIMListSearch_page {
    .padding(0, 12, 0, 12);

    .search_box {
      display: flex;
      align-items: center;

      .van-cell {
        margin: 0 0 0 13px;
      }
    }

    .back_span {
      text-align: center;
      padding: 0 16px 0 0;
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .van-search {
      flex: 1;
    }

    .chatList_list_box {
      .padding(54, 0, 0, 0);
      .margin(0, 0, 0, 32);
      .borderRadius(0, 0, 10, 10);
      overflow: hidden;
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      li.chat_lists_item.noBorder {
        border-bottom: none;
      }

      li.chat_lists_item.borderRadiusFirst {
        .borderRadius(10, 10, 0, 0);
      }

      li.chat_lists_item {
        background: #fff;
        .padding(15, 12, 15, 12);
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .img_box {
          .margin(0, 11, 0, 0);
          width: 60 / 375 * 100vw;
          position: relative;
          .height(60);

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          .unReadMessage {
            width: 18px;
            height: 18px;
            background: @mainColor;
            border-radius: 8px;
            line-height: 18px;
            text-align: center;
            color: #fff;
            font-size: 8px;
            position: absolute;
            right: 0;
            top: 0;
          }

        }

        .chat_message_box {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          li {
            .padding(6, 0, 6, 0);
          }

          .name_box {
            .name {
              display: flex;
              align-items: center;
              width: 100%;
              .fontSize(18);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
            }

            .type {
              .fontSize(14);
              .margin(0, 0, 0, 10);
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(226deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
              .borderRadius(4, 4, 4, 4);
              .lineHeight(18);
              .padding(0, 4, 0, 4);

            }
          }

          .unReadMessage_box {
            .fontSize(12);
            color: rgba(153, 153, 153, 1);
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
                display: inline-block;
                width: 98%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                .fontSize(14);
                font-weight: 400;
                color: rgba(102, 102, 102, 1);

                .Department {
                  color: rgba(153, 153, 153, 1);
                }
              }
            }
          }
        }
      }
    }
  }
</style>

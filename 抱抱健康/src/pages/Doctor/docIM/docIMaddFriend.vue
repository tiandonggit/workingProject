/* * @Author: 田东 * @Date: 2020-01-09 11:39:48 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-09 11:45:12 * @name 添加好友 */
<!---->
<template>
  <div id="addFriend">
    <common-header
        :share-disabled="true"
        :custom-title="'添加好友'"
    ></common-header>
    <div class="addFriend_header">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
          placeholder="请输入医生准确手机号码"
          v-model="searchText"
          show-action
          @search="onSearch"
          @cancel="onClickLeft()"
      ></van-search>
    </div>

    <div class="content">
      <div v-show="isFinding" class="noResult">
        <img src="../../../assets/images/no_articles.png" alt=""/>
        <p class="top">暂无此医生信息</p>
        <p class="again">
          未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
        </p>
      </div>
      <ul v-if="hasData">
        <li>
          <div class="left">
            <img :src="dataInfo.url" alt/>
          </div>
          <div class="right">
            <div class="rightOne">
              <p class="top">
                <span class="name">{{ dataInfo.docName }}</span>
                <span class="office">
                  <span>{{ dataInfo.positionName }}</span>
                </span>
              </p>
              <p class="department">{{ dataInfo.depName }}</p>
              <p class="bottom">
                <span class="hospital">{{ dataInfo.hosName }}</span>
              </p>
            </div>
            <div class="rightTwo">
              <div
                  class="btn"
                  :class="{ active: isActive }"
                  @click.stop="btnActive"
              >
                <span>{{ attention }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import {Dialog, Toast, Search} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";
  import noResultImg from "../../../assets/images/addFailed.png";

  Vue.use(Search);

  export default {
    name: "addFriend",
    data() {
      return {
        isActive: false,
        searchText: "",
        attention: "",
        noResultImg: noResultImg,

        docId: "",
        dataInfo: "",
        hasData: false, //是否有搜索结果
        isFinding: false
      };
    },
    components: {
      commonHeader
    },
    created() {
      let search = document.getElementsByClassName("van-field__control")[0];
      search.focus();
    },
    methods: {
      onSearch() {
        if (!this.TestPhone(this.searchText)) {
          Toast("请输入正确的11位手机数字号码");
          return;
        }

        this.$http
          .request({
            method: "get",
            url: "/RDoctorController/selectPhone",
            body: {
              phone: this.searchText
            }
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              if (res.data.data.length == 0) {
                this.dataInfo = "";
                this.isFinding = true;
                this.hasData = false;
                return;
              }
              this.dataInfo = res.data.data[0];
              let data = res.data.data[0];
              if (data.length == 0) {
                this.isFinding = true;
                this.hasData = false;
                return;
              }
              this.isFinding = false;
              this.hasData = true;
              this.docId = data.id;

              if (data.state == 1) {
                this.isActive = true;
                this.attention = "已添加";
              }
              if (data.state == 0) {
                this.isActive = false;
                this.attention = "添加";
              }
            }
          })
          .catch(e => {
            this.hasData = false;
            Toast("搜索数据失败");
          });
      },

      onClickLeft() {
        this.$router.push({name: "docChatIMList"});
      },

      // 重新输入
      inputAgain() {
        this.searchText = "";
        this.isFinding = false;
        let search = document.getElementsByClassName("van-field__control")[0];
        search.focus();
      },

      btnActive() {
        this.isActive != this.isActive;
        if (this.attention == "已添加") {
          return;
        }
        if (this.docId == this.$store.state.DoctorIM.doctorMessage.data.docId) {
          this.$router.push({
            name: "docCard"
          });
        }
        this.$http
          .request({
            method: "post",
            url: "/ImFriendController/insert",
            body: {
              rDoctorIdb: this.docId
            }
          })
          .then(res => {
            if (res.data.success && res.data) {
              Toast("添加成功！请在我的好友列表里查看");
              this.attention = "已添加";
              this.isActive = true;
              let isFromDocGroup = this.$route.query.isFromDocGroup || "";
              if (isFromDocGroup) {
                this.$router.go(-1);
              }
            }
          })
          .catch(e => {
            Toast("保存数据失败");
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  #addFriend {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: @backgroundColor;

    .addFriend_header {
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

      /deep/ .van-search {
        .padding(5, 0, 5, 8);
        background: @backgroundColor !important;

        .van-search__content {
          background-color: @backgroundColorT;
          .borderRadius(6, 6, 6, 6);
        }

        .van-field__body,
        .van-field__left-icon {
          .lineHeight(24);
        }

        .van-search__action {
          .padding(0, 12, 0, 12);
        }
      }
    }

    .content {
      width: 100%;
      height: 100%;
      margin-top: 11.7vw;

      ul {
        .width(351);
        margin: 0 auto;
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        background: @backgroundColorT;

        li {
          display: flex;
          .height(92);
          align-items: center;
          .padding(15, 10, 15, 10);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          justify-content: space-between;

          &:last-child {
            border-bottom: none;
          }

          .left {
            .width(60);
            .height(60);
            text-align: center;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .right {
            width: 80%;
            height: 100%;
            position: relative;

            .rightOne {
              .top {
                .fontSize(18);
                font-weight: 400;
                color: @titleColor;
                .lineHeight(18);
                display: flex;
                align-items: center;
                // margin: 0.7vw 0 1.1vw 0 !important;

                .name {
                  .fontSize(18);
                  font-weight: 400;
                  color: @titleColor;
                  .lineHeight(18);
                }

                .office {
                  display: inline-block;
                  // .height(20);
                  .borderRadius(4, 4, 4, 4);
                  .padding(3, 5, 1, 5);
                  background: @mainColor;
                  .fontSize(14);
                  font-weight: 400;
                  .lineHeight(20);
                  .margin(0, 0, 0, 10);

                  span {
                    color: @fontOne;
                  }
                }
              }

              .department {
                .margin(4, 0, 5, 0);
                color: @descriptionColor;
                .fontSize(14);
                .lineHeight(16);
              }

              .bottom {
                span {
                  .fontSize(14);
                  font-weight: 400;
                  color: @subtitleColor;
                  .lineHeight(16);
                  word-wrap: break-word;
                  .overflowline(1);
                }
              }
            }

            .rightTwo {
              position: absolute;
              right: 0;
              top: 4vw;

              .btn {
                .padding(6, 10, 4, 10);
                // .height(30);
                color: @fontOne;
                .fontSize(18);
                background-color: @mainColor;
                border-radius: 10px;
                font-family: PingFang-SC-Bold, PingFang-SC;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .active {
                background: @buzanColor;
              }
            }
          }
        }
      }
    }
  }
</style>

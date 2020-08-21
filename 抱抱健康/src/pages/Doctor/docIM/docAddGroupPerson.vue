/* * @Author: 田东 * @Date: 2020-01-10 10:35:48 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-10 10:41:57 @desc 医生端IM小组添加删减人员列表 */
<template>
  <div id="docAddGroupPerson">
    <common-header
        :share-disabled="true"
        :custom-title="'医患沟通'"
    ></common-header>
    <div class="search_box clearfix">
      <div class="header-div header-left" @click="back()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">{{ titleName }}</div>
      <div class="price header-right" @click.stop="addList">
        <span :class="{ disabled: this.result.length == 0 }">{{
          rightText
        }}</span>
      </div>
    </div>

    <div class="content" v-if="result.length !== 0">
      <div class="previewPerson">
        <ul>
          <li v-for="(item, index) in result" :key="index">
            <div class="img_box">
              <img :src="item.url" alt/>
            </div>
            <span>{{ item.docName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div :class="[result.length !== 0 ? 'activeResult' : 'resultStyle']">
      <van-checkbox-group v-model="result">
        <van-cell-group class="groupList">
          <van-list v-model="loading"
                    :finished="finished"
                    finished-text=""
                    @load="onLoad">
            <van-cell
                title
                v-for="(item, index) in list"
                :key="index"
                @click="toggle(index)"
                v-if="
                searchList(item.docId) &&
                  item.state != 1 &&
                  !addFriendList.includes(item.docId) &&
                  (state === 'add' ||
                    state === 'addDoc' ||
                    state === 'addSteam')
              "
            >
              <template slot="title">
                <div class="chat_lists_item">
                  <div class="img_box">
                    <img :src="item.url" alt/>
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
              <van-checkbox
                  :name="item"
                  :disabled="result.length >= modifyDoctorNum && !result.includes(item)"
                  ref="checkboxes"
                  slot="right-icon"
                  checked-color="#0069ff"
              />
            </van-cell>
            <van-cell
                title
                v-for="(item, index) in list"
                :key="index"
                @click="toggle(index)"
                v-if="state === 'del' && searchList(item.docId)"
            >
              <template slot="title">
                <div class="chat_lists_item">
                  <div class="img_box">
                    <img :src="item.url" alt/>
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
              <van-checkbox
                  :name="item"
                  ref="checkboxes"
                  slot="right-icon"
                  checked-color="#0069ff"
              />
            </van-cell>
          </van-list>
          <div v-if="!list.length" class="noFriendTips_box">
            <img src="../../../assets/images/add_tip.png" alt="">
            <p>您还未添加医生好友</p>
            <p class="add_btn" @click.stop="docIMaddFriend">立即添加</p>
          </div>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </div>
</template>

<script>
  import {Toast, Dialog, NavBar} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";
  import navbar from "../../../components/navbar/navbar";
  import {setTimeout} from "timers";
  import {mapState} from "vuex"

  export default {
    name: "docAddGroupPerson",
    components: {
      commonHeader,
      navbar
    },
    data() {
      return {
        chatName: "",
        titleName: "",
        id: "", //二人聊天id
        name: "", //聊天小组
        loading: false,
        finished: false,
        groupId: 0,
        groupName: "",
        isSearchBtn: false,
        placeholder: "请按医生姓名搜索",
        rightText: "添加(0)",
        list: [],
        result: [], //多选按钮
        page: 1,
        limit: 20,
        timeout: null,
        state: "add", //状态
        fromType: "", //来源
        doctorNum:0, // 医疗小组医生数量 不得超过12个
      };
    },
    computed: {
      // 可添加的医疗小组医生数
      modifyDoctorNum() {
        let queryDoctorNum = 12;
        return queryDoctorNum - Number(this.doctorNum);
      },
      //返回已选中的好友信息ID
      addFriendList() {
        let arr = [];
        let data = this.$store.state.DoctorIM.addFriendList;
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].docId);
        }
        return arr;
      },
      //返回已选中的好友信息
      searchFriendList() {
        return this.$store.state.DoctorIM.searchFriendList;
      },
      //返回已选中的好友信息
      addFriendListMessage() {
        return this.$store.state.DoctorIM.addFriendList;
      },
      ...mapState(["DoctorIM"])
    },
    watch: {
      result(n, o) {
        console.log('result=====', this.result);
        this.titleName = "小组人员添加";
        if (this.state === "add") {
          this.rightText = "添加(" + this.result.length + ")";
        } else if (this.state === "del") {
          this.rightText = "删减(" + this.result.length + ")";
          this.titleName = "小组人员删减";
        } else if (this.state === "addDoc") {
          this.rightText = "添加(" + this.result.length + ")";
        } else if (this.state === "addSteam") {
          this.rightText = "添加(" + this.result.length + ")";
        }
      }
    },
    created() {
      if(this.$route.query.doctorNum) {
        this.doctorNum = this.$route.query.doctorNum;
      }
      this.state = this.$route.query.res;
      this.id = this.$route.query.id;
      this.name = this.$route.query.name;
      this.fromType = this.$route.query.fromType;
      this.result = this.$store.state.DoctorIM.searchFriendList
        ? this.$store.state.DoctorIM.searchFriendList
        : [];
      this.groupName = this.$store.state.DoctorIM.groupName
        ? this.$store.state.DoctorIM.groupName
        : "";
    },
    methods: {
      searchList(id) {
        let flag = true;
        if (this.searchFriendList.length > 0) {
          this.searchFriendList.forEach(item => {
            if (item.docId == id) {
              flag = false;
            }
          });
        }
        return flag;
      },
      //跳转到详细搜索
      soTire() {
        this.$router.push({
          name: "docSearchGroupPerson",
          query: {
            groupId: this.id,
            res: this.state,
            fromType: this.fromType
          }
        });
      },
      getDocIds() {
        let docIds = "";
        for (let i = 0; i < this.result.length; i++) {
          docIds += this.result[i].docId + ",";
        }
        if (this.result.length > 0) {
          docIds = docIds.substr(0, docIds.length - 1);
        }
        return docIds;
      },
      saveDel(data) {
        this.$http
          .request({
            method: "post",
            url: "/ImGroupController/deleteGroupUser",
            body: {
              id: this.id,
              list: data
            }
          })
          .then(res => {
            if (res.data.success) {
              setTimeout(() => {
                this.$store.commit("DoctorIM/clearSearchFriendList");
                this.$router.back();
              }, 50);
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      //保存后新建小组
      saveCreate(data) {
        this.$http
          .request({
            method: "post",
            url: "/ImGroupController/insertGroup",
            body: {
              groupname: this.DoctorIM.docGroupVuex.docGroupName,
              list: data,
              grouplibel:this.DoctorIM.docGroupVuex.docGroupLevelId,

            }
          })
          .then(res => {
            if (res.data.success) {
              // this.$router.push({
              //   name: "docCreateGroup",
              //   query: {
              //     groupName: this.groupName,
              //     groupId: res.data.code
              //   }
              // });
              Toast('新建医疗小组成功');
              this.$router.push({
                path: "/docGroupDetail",
                query: {
                  gid:res.data.data || ''
                }
              });

            } else {
              Toast(res.data.message || '接口报错');
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      saveAdd(data) {
        this.$http
          .request({
            method: "post",
            url: "/ImGroupController/insertGroupUser",
            body: {
              id: this.id,
              list: data
            }
          })
          .then(res => {
            if (res.data.success) {
              setTimeout(() => {
                this.$router.back();
              }, 50);
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      //添加 或 删减
      addList() {
        if (this.result.length == 0) {
          return;
        }

        let res = this.addFriendListMessage.slice();
        this.$store.commit("DoctorIM/saveGroupName", this.groupName);
        if (this.state === "del") {
          //删除

          if (res.length === 0 && this.fromType === "selectGroup") {
            this.$store.commit("DoctorIM/saveFromType", this.fromType);
          }

          let docIds = this.getDocIds();
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.saveDel(docIds);
          }, 100);
        } else if (
          this.state === "add" ||
          (this.fromType === "selectGroup" && this.state === "addDoc")
        ) {
          let docIds = this.getDocIds();

          if (this.fromType === "create" && !this.id) {
            //新创建医生小组
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              Dialog.confirm({
                title: "",
                message: "确定要创建该医疗小组吗?"
              }).then(() => {
                this.saveCreate(docIds);
              }).catch(() => {
              });
            }, 100);
          } else {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.saveAdd(docIds);
            }, 100);
          }

          this.$store.commit("DoctorIM/clearSearchFriendList");
        }
      },
      //查询医生会话列表
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
      //查询好友(可以添加的好友) 需要小组id
      searchFriend() {
        this.$http
          .request({
            method: "get",
            url: "/ImGroupController/selectGroupUser",
            body: {
              id: this.id,
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
      //查询好友(all) 不需要小组id
      searchAllFriend() {
        this.$http
          .request({
            method: "get",
            url: "/ImFriendController/selectFriend",
            body: {
              page: this.page,
              limit: this.limit
            }
          })
          .then(res => {
            // 加载状态结束
            this.loading = false;
            this.finished = true;
            if (res.data.success) {
              if (res.data.data.length > 0) {
                this.list = this.list.concat(res.data.data);
                this.page++;
                console.log('list====', this.list);
              } else {
                Toast("暂无好友");
              }
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            this.finished = true;
            Toast("加载失败，请检查网络连接");
          });
      },
      //删除列表
      searchChangeFriend() {
        this.$http
          .request({
            method: "get",
            url: "/ImGroupDoctorController/selectUser",
            body: {
              id: this.id,
              page: this.page,
              limit: this.limit
            }
          })
          .then(res => {
            let list = [];
            // 加载状态结束
            this.loading = false;
            this.finished = true;
            if (res.data.success) {
              this.list = res.data.data;
              this.page++;
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
          this.rightText = "删减(" + this.result.length + ")";
          if (this.id) {
            this.searchChangeFriend();
          } else {
            // 加载状态结束
            this.loading = false;
          }
        } else if (this.state === "addDoc") {
          // 维护小组
          this.searchFriend();
        }
      },
      //多选
      toggle(index) {
        //刘硕添加，索小辉注掉
        // if (this.addFriendList.includes(this.list[index].docId)) {
        //   return;
        // }
        // this.$refs.checkboxes[index].toggle();
      },
      docIMaddFriend() {
        this.$router.push({
          path: "/docIMaddFriend",
          query: {
            isFromDocGroup: true
          }
        });
      },
      //返回上一页
      back() {
        this.$store.commit("DoctorIM/clearSearchFriendList");
        this.$router.back();
      }
    }
  };
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
  }

  #docAddGroupPerson {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: @backgroundColor;
    padding-top: 11.7vw;

    .disabled {
      opacity: 0.4;
    }

    .search_box {
      position: fixed;
      -webkit-box-align: center;
      -ms-flex-align: center;
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
        .height(44);
        .width(70);
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
        .width(70);
        text-align: right;
        .padding(0, 12, 0, 0);
      }
    }

    .zhanwei {
      .height(44);
    }

    .resultStyle,
    .activeResult {
      .groupList {
        .width(351);
        margin: 0 auto;
        background: @backgroundColor;

        .van-list {
          .borderRadius(10, 10, 10, 10);
          overflow: hidden;
        }

        .van-cell {
          background: @backgroundColorT;
          // .borderRadius(10, 10, 10, 10);
          .padding(14, 10, 14, 10);
          // overflow: hidden;
          position: relative;

          .van-checkbox {
            justify-content: flex-end;
            display: flex;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin-right: 4vw;
          }

          &:first-child {
            .borderRadius(10, 10, 0, 0);
            overflow: hidden;
          }

          &:nth-last-of-type(3) {
            /*<!--.borderRadius(0, 0, 10, 10);-->*/
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
    }

    .content {
      .width(351);
      margin: 0 auto;
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);
      .padding(14, 10, 14, 10);

      .previewPerson {
        width: 100%;

        ul {
          display: flex;
          flex-wrap: wrap;
        }

        ul li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: calc(100% / 7);

        }

        .img_box {
          .width(32);
          .height(32);
          border-radius: 50%;
          overflow: hidden;

          img {
            display: block;
            width: 100%;
          }
        }

        span {
          display: inline-block;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          .fontSize(14);
          font-weight: 400;
          color: @titleColor;
          .lineHeight(18);
          .padding(10, 0, 10, 0);


        }
      }

      .previewPerson ::-webkit-scrollbar {
        display: none !important;
      }
    }

    .noFriendTips_box {
      display: flex;
      align-items: center;
      flex-direction: column;

      img {
        display: block;
        .width(200);
        .height(200);
        .margin(74, 0, 30, 0);
      }

      p {
        .fontSize(18);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        text-align: center;
      }

      p.add_btn {
        color: rgba(0, 105, 255, 1);
        text-decoration: underline;
        .padding(20, 0, 0, 0);
      }
    }
  }
</style>

<template>
  <div class="mailList_page">
    <div class="list-block">
      <div class="search-box">
        <div class="search">
          <input v-model="searchText" placeholder="搜索" type="text" @change="getSearchList()" />
        </div>
      </div>
      <div class="list-box-flex">
        <el-scrollbar>
          <div class="serach-list" v-if="searchList.length > 0">
            <div
              class="menu-item"
              v-for="(item, index) in searchList"
              :key="index"
              :class="{active: item.isActive}"
            >
              <div class="list-box" @click.stop="lookInfo('0', item)">
                <div class="item">
                  <div class="left">
                    <img :src="item.headurl" alt />
                  </div>
                  <div class="middle">
                    <p class="name">{{item.nickname}}</p>
                    <p class="msg">{{item.phone}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="searchList.length === 0 && !isNoSearchResult" class="menu">
            <el-menu>
              <el-submenu index="1">
                <template slot="title">
                  <span>通讯录</span>
                  <span class="count">{{mailListData.userList.length}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item, index) in mailListData.userList"
                    :key="index"
                    :class="{active: item.isActive}"
                  >
                    <div class="list-box" @click.stop="lookInfo('0', item)">
                      <div class="item">
                        <div class="left">
                          <img :src="item.headurl" alt />
                        </div>
                        <div class="middle">
                          <p class="name">{{item.nickname}}</p>
                          <p class="msg">{{item.phone}}</p>
                        </div>
                      </div>
                    </div>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
          <div v-if="searchList.length === 0 && !isNoSearchResult" class="menu">
            <el-menu>
              <el-submenu index="1">
                <template slot="title">
                  <span>群聊</span>
                  <span class="count">{{mailListData.groupList.length}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item, index) in mailListData.groupList"
                    :key="index"
                    :class="{active: item.isActive}"
                  >
                    <div class="list-box" @click.stop="lookInfo('1', item)">
                      <div class="item">
                        <div class="left">
                          <img src="../../../assets/images/group_head_small.png" alt />
                        </div>
                        <div class="middle">
                          <p class="name">{{item.groupname}}</p>
                        </div>
                      </div>
                    </div>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="routerView_box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "mailList",
  computed: {
    ...mapState(["homeData", "mailListData"])
  },
  data() {
    return {
      searchText: "",
      searchList: [],
      listSingle: [],
      listGroup: [],
      isNoSearchResult: false
    };
  },
  methods: {
    getSearchList() {
      if (!this.searchText) {
        this.searchList = [];
        this.isNoSearchResult = false;
        return;
      }
      this.$http
        .request({
          url: "/ImUserController/selectUserByName",
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            name: this.searchText
          }
        })
        .then(res => {
          if (res.data.success) {
            this.searchList = res.data.data.userList;
            if (res.data.data.userList.length === 0) {
              this.isNoSearchResult = true;
            }
          } else {
            this.$message.error(res.data.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    lookInfo(targetType, item) {
      if (targetType === 1) {
        // 单聊
        this.listSingle.forEach((v, e) => {
          if (v.id === item.id) {
            this.listSingle[e].isActive = true;
          } else {
            this.listSingle[e].isActive = false;
          }
        });
      } else if (targetType === 2) {
        // 群聊
        this.listGroup.forEach((v, e) => {
          if (v.id === item.id) {
            this.listGroup[e].isActive = true;
          } else {
            this.listGroup[e].isActive = false;
          }
        });
      }
      // 当前选中聊天信息存入内存
      item.targetType = targetType;
      this.$store.commit("homeData/listSelectedInfo", item);
      this.$router.push({ name: "mailInfo" });
    }
  }
};
</script>

<style scoped lang="less">
.mailList_page {
  height: 100%;
  display: flex;
  position: relative;

  .list-block {
    width: 306px;
    height: 100%;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
    z-index: 1;
    display: flex;
    flex-direction: column;

    .search-box {
      width: 100%;
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;

      .search {
        width: 246px;
        height: 50px;
        background-color: @searchBackgroundColor;
        border-radius: 10px;
        padding: 15px 15px 15px 45px;
        background-image: url("../../../assets/images/icon_search.png");
        background-position: 15px 15px;
        background-repeat: no-repeat;
        background-size: 21px;

        input {
          width: 100%;
          border: none;
          outline: none;
          background: @searchBackgroundColor;
          font-size: 16px;
          font-weight: 400;
          color: @subTitleColor;
          line-height: 20px;
        }
      }
    }

    .list-box-flex {
      flex: 1;
      height: 0;
    }

    .menu {
      /deep/ .el-menu {
        border-right: none;

        .el-submenu__title {
          padding-left: 50px !important;

          span {
            font-size: 16px;
            font-weight: bold;
            color: @titleColor;
            line-height: 16px;
          }

          .count {
            float: right;
            font-size: 14px;
            font-weight: 400;
            color: @mainColor;
            line-height: 56px;
          }

          .el-submenu__icon-arrow {
            position: absolute;
            top: 50%;
            left: 20px;
            right: auto;
            margin-top: -9px;
            font-size: 18px;
            color: @descTitleColor;
          }
        }

        .el-menu-item-group__title {
          padding: 0;
        }

        .el-menu-item {
          height: 65px;
          padding: 0 30px !important;
        }
      }
    }

    .menu-item {
      height: 65px;
      padding: 0 30px;
    }

    .list-box {
      height: 65px;

      .item {
        height: 65px;
        display: flex;
        padding: 10px 0;
        cursor: pointer;
        position: relative;

        .left {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        .middle {
          flex: 1;
          width: 0;
          padding-left: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .name {
            font-size: 16px;
            font-weight: bold;
            color: @titleColor;
            line-height: 16px;
            margin-bottom: 6px;
            padding-top: 4px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .msg {
            font-size: 14px;
            font-weight: 400;
            color: @subTitleColor;
            line-height: 14px;
          }
        }
      }

      .active {
        background: rgba(0, 105, 255, 0.1);
      }
    }
  }

  .routerView_box {
    flex: 1;
    background-color: @mainBackgroundColor;
  }
}
</style>

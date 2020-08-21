<template>
  <div class="imBar_page">
    <ul class="chat_list">
      <el-scrollbar>
        <li v-for="(item, index) in imData.chatList"
            @click.stop="newMsg(item)"
            :key="item.chatList[item.chatList.length-1].id || index">
          <el-badge :value="item.unReadMessageCount"
                    :hidden="item.unReadMessageCount === 0"
                    :is-dot="item.unReadMessageCount > 9">
            <img
                :src="item.targetType == 1 ? require('../../assets/image/group_head_small.png') : item.headurl !== undefined ? item.headurl : item.chatList[0].sendUserHeadUrl"
                :class="[{'shaky':item.unReadMessageCount !== 0}]"
                alt=""
            >
          </el-badge>
        </li>
      </el-scrollbar>
    </ul>
    <ul class="action_box">
      <!-- <li>
        <i class="icon-liaotian- iconfont"
           :class="[{'checked':actionChecked === 'chat'}]"
           @click.stop="imActionInit('chat')"></i>
      </li> -->
      <li>
        <i class="icon-tongxunlu iconfont"
           :class="[{'checked':actionChecked === 'mailList'}]"
           @click.stop="imActionInit('mailList')"></i>
      </li>
      <li>
        <i class="icon-jiahao1 iconfont"
           :class="[{'checked':actionChecked === 'addGroupChat'}]"
           @click.stop="imActionInit('addGroupChat')"></i>
      </li>
      <li>
        <i class="icon-xiangzuo iconfont"
           :class="[{'checked':true}]"
           @click.stop="imActionInit('openDrawer')"></i>
      </li>
    </ul>
  </div>
</template>

<script>

  import {mapState} from "vuex";

  export default {
    name: "imBar",
    data() {
      return {
        actionChecked: ""
      };
    },
    computed: {
      ...mapState(["imData", "mailListData"])
    },
    methods: {
      newMsg(item){
        if(item.targetType == 1) {
          this.mailListData.groupList.forEach((v, e) => {
            if(item.sessionId === v.id) {
              item.groupname = v.groupname;
              item.id = item.sessionId;
            }
          });
        }else if (item.targetType == 0){
          this.mailListData.userList.forEach((v, e) => {
            if(item.sessionId === v.id) {
              item.nickname = v.nickname;
              item.phone = v.phone;
              item.id = item.sessionId;
            }
          });
        }
        // console.log('item: ', item);
        this.$store.commit("homeData/imSelectedInfo", item);
        this.$emit("lookNewMsg")
      },
      /**
       * 路由跳转,处理按钮高亮
       * **/
      imActionInit(actionType) {
        this.actionChecked = actionType;
        if (actionType === "openDrawer") {
          this.$emit("openDrawerShow");
        } else if (actionType === "mailList") {
          this.$emit("showMailListDialog");
        } else if (actionType === "addGroupChat") {
          this.$emit("showCreateGroupDialog", {position: "2"});
        } else {
          // 路由操作 ----
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .imBar_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 74px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: @mainBackgroundColor;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);

    .chat_list {
      flex: 1;
      height: 0;
      padding: 10px 0;
      width: 100%;

      li {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;

        img {
          display: block;
          width: 44px;
          height: 44px;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }

    .action_box {
      width: 100%;

      li {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;

        i {
          font-size: 34px;
          color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        i.checked {
          color: @barBackgroundColor;
        }
      }
    }
  }
</style>

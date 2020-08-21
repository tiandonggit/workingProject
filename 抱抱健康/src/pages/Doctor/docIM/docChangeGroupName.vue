/* * @Author: 田东 * @Date: 2020-01-09 11:09:22 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-09 11:13:03 * @name 小组名称 */
<template>
  <div id="docChangeGroupName">
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">小组名称</div>
      <div class="price header-right">
        <span @click="save()">保存</span>
      </div>
    </div>

    <div class="content">
      <van-cell-group>
        <van-field
          v-model="groupName"
          maxlength="11"
          placeholder="请输入小组名称(最多10个字)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";

export default {
  name: "docChangeGroupName",
  data() {
    return {
      groupName: "",
      groupId: ""
    };
  },
  created() {
    this.groupName = this.$route.query.groupName
      ? this.$route.query.groupName
      : "";
    this.groupId = this.$route.query.groupId ? this.$route.query.groupId : "";
  },
  watch: {
    groupName(n, o) {
      if (n.length > 10) {
        this.groupName = n.substr(0, 10);
        Toast("文字超过输入上限");
      }
    }
  },
  methods: {
    onClickLeft() {
      Dialog.confirm({
        message: "是否保存该小组名称",
        confirmButtonText: "保存"
      })
        .then(() => {
          this.saveFun();
        })
        .catch(() => {
          this.$router.back();
        });
    },
    saveFun() {
      if (this.groupName == "") {
        Toast("小组名称不能为空，请重新编辑");
        return;
      }
      if (this.groupId == "") {
        //只在createGroup会用
        this.$store.commit("DoctorIM/saveGroupName", this.groupName);
        this.$router.replace({
          name: "docCreateGroup",
          query: {
            groupName: this.groupName
          }
        });
        // this.$router.back();
        return;
      }
      this.saveName();
    },
    save() {
      this.saveFun();
    },
    saveName() {
      this.$http
        .request({
          method: "post",
          url: "/ImGroupController/updateGroupUserName",
          body: {
            id: this.groupId,
            name: this.groupName
          }
        })
        .then(res => {
          if (res.data.success && res.data.code === "0000") {
            this.$store.commit("DoctorIM/saveGroupName", this.groupName);
            this.$router.back();
          } else if (res.data.code === "0001") {
            Toast("小组名称已存在，请重新编辑");
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    }
  }
};
</script>

<style scoped lang="less">
#docChangeGroupName {
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

  .content {
    .width(351);
    margin: 0 auto;
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;
    color: @titleColor;

    /deep/ .van-field__control {
      .fontSize(16);
      font-weight: 400;
      color: @titleColor;
      .lineHeight(24);
    }
  }
}
</style>

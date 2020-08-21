/**
*@desc 创建医疗小组一级页(名称和医疗小组级别)
*@author houpai
*@date 2020/04/24 09:48:32
*/
<template>
  <div class="createDocGroupFirst_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医患沟通'"
        :header-show="true"
        :title="wxTitle"
    ></common-header>

    <div class="modifyDocGroupName">
      <van-field v-model="docGroupName"
                 placeholder="请编辑医疗小组名称" clearable/>
    </div>
    <div class="modifyDocGroupLevel">
      <h3>医疗小组等级选择</h3>
      <ul class="docGroupLevel_list">
        <li v-for="(item) in docGroupLevelList"
            :class="[{'checked': item.code === docGroupLevelId}]"
            :key="item.id"
            @click.stop="docGroupLevelId=item.code">
          {{item.text|| ""}}
        </li>
      </ul>
    </div>
    <div class="addMember_btn" @click.stop="$throttle(addMemberSubmit)">
      {{submitBtnText}}
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {Toast} from "vant";

  export default {
    name: "createDocGroupFirst",
    components: {
      commonHeader
    },
    computed: {
      submitBtnText() {
        let submitBtnText = "添加医疗小组成员";
        if (this.mode === "edit") {
          submitBtnText = "确认修改";
        }
        return submitBtnText;
      },
      wxTitle() {
        let wxTitle = "创建医疗小组";
        if (this.mode === "edit") {
          wxTitle = "医疗小组编辑";
        }
        return wxTitle;
      }
    },
    data() {
      return {
        docGroupName: "",
        docGroupLevelId: "",
        mode: "add",
        docGroupLevelList: [], // 医疗小组等级字典
        docGroupId: "" // 医疗小组id
      };
    },
    watch: {
      docGroupName(val, oldVal) {
        if (val.length > 10) {
          Toast("请编辑医疗小组名称1-10字");
          this.docGroupName = val.substring(0, 10);
        }
      }
    },
    methods: {
      /**
       * 添加小组成员
       * **/
      addMemberSubmit() {
        if (this.docGroupLevelId === "") {
          Toast("请选择医疗小组级别");
          return false;
        } else if (!this.docGroupName) {
          Toast("请编辑医疗小组名称");
          return false;
        } else {
          if (this.mode === "add") {
            this.testDocGroupName();
          } else {
            this.modifyDocGroupDetail();
            // this.testDocGroupName();
          }
        }
      },
      /**
       * 新建医疗小组的时候验证名称是否重复
       * **/
      testDocGroupName() {
        this.$http.request({
          url: "/ImGroupController/selectGroupName",
          method: "get",
          body: {
            name: this.docGroupName
          }
        }).then(res => {
          if (res.data.success) {
            if (res.data.code === "0000") {
              let docGroupParams = {
                docGroupName: this.docGroupName,
                docGroupLevelId: this.docGroupLevelId
              };
              this.$store.commit("DoctorIM/saveDocGroupVuex", docGroupParams);
              this.$store.commit("DoctorIM/clearAddFriendList");
              this.$router.push({
                name: "docAddGroupPerson",
                query: {
                  res: "add",
                  fromType: "create"
                }
              });
            } else if (res.data.code === "0001") {
              Toast("该医疗小组名称已存在,请重新编辑");
            } else {
              Toast("接口报错");
            }
          } else {
            Toast("接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 获取医疗小组登机字典
       * **/
      getDocGroupLevelList() {
        this.$http.request({
          url: "/SysDictionaryController/selectLibel",
          method: "get",
          body: {}
        }).then(res => {
          if (res.data.success) {
            this.docGroupLevelList = res.data.data || [];
          } else {
            Toast(res.data.message || "接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 查询医疗小组名称和级别
       * **/
      getDocGroupDetail() {
        this.$http.request({
          url: "/ImGroupController/selectByKey",
          method: "get",
          body: {
            id: this.docGroupId
          }
        }).then(res => {
          if (res.data.success) {
            this.docGroupName = res.data.data.groupname || "";
            this.docGroupLevelId = res.data.data.code || "";
          } else {
            Toast("接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 修改医疗小组名称和级别
       * **/
      modifyDocGroupDetail() {
        this.$http.request({
          url: "/ImGroupController/updateGroupUserName",
          method: "post",
          body: {
            id: this.docGroupId,
            groupname: this.docGroupName,
            grouplibel: this.docGroupLevelId
          }
        }).then(res => {
          if (res.data.success) {
            if (res.data.code === "0001" || res.data.data.code === '0001') {
              Toast("当前小组名已存在,请重新编辑");
              return false;
            } else if (res.data.code === "0000" || res.data.data.code === '0000') {
              Toast("修改成功");
              this.$router.go(-1);
            } else {
              Toast("接口报错");
            }
          } else {
            Toast(res.data.message || "接口报错");
          }
        });
      }
    },
    created() {
      if (this.$route.query.mode && this.$route.query.groupId) {
        this.mode = this.$route.query.mode;
        this.docGroupId = this.$route.query.groupId;
        this.getDocGroupDetail();
      }
      this.getDocGroupLevelList();
    }
  };
</script>

<style scoped lang="less">
  .createDocGroupFirst_page {

    .padding(60, 12, 12, 12);

    /deep/ .van-cell {
      padding: 10px;
      font-size: 18px;
    }

    /deep/ .van-field__body {
      height: 100% !important;
    }

    /deep/ .van-field__control {
      .fontSize(16);
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .modifyDocGroupName {
      overflow: hidden;
      .height(46);
      background-color: @backgroundColorff;
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 15, 0);
    }


    .modifyDocGroupLevel {
      overflow: hidden;
      background-color: @backgroundColorff;
      .borderRadius(10, 10, 10, 10);
      .padding(13, 0, 13, 0);

      h3 {
        .padding(0, 10, 13, 10);
        .fontSize(16);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }

      .docGroupLevel_list {
        .padding(14, 10, 0, 10);
        display: flex;
        flex-wrap: wrap;

        li {
          max-width: 100%;
          .height(31);
          .lineHeight(31);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .fontSize(16);
          font-weight: 400;
          .margin(0, 10, 15, 0);
          .padding(0, 10, 0, 10);
          .borderRadius(10, 10, 10, 10);
          color: rgba(153, 153, 153, 1);
          border: 1px solid rgba(153, 153, 153, 1);
        }

        li.checked {
          color: rgba(0, 105, 255, 1);
          border: 1px solid rgba(0, 105, 255, 1);
          background-color: rgba(0, 105, 255, 0.1);
        }
      }
    }

    .addMember_btn {
      .height(44);
      display: flex;
      justify-content: center;
      align-items: center;
      .borderRadius(10, 10, 10, 10);
      background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
      .fontSize(18);
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      .margin(15, 0, 0, 0);
    }
  }
</style>

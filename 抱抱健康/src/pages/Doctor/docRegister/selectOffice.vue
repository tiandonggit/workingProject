/*
 * @Author: 田东 
 * @Date: 2020-03-11 14:38:48 
 * @Last Modified by:   田东 
 * @Last Modified time: 2020-03-11 14:38:48 
 * @name 医生科室选择
 */
<template>
  <div id="selectOffice">
    <common-header
      :share-disabled="true"
      :custom-title="'选择科室'"
      :header-show="true"
      title="选择科室"
    ></common-header>
    <van-tree-select
      :items="items"
      :main-active-index="mainActiveIndex"
      :active-id="activeId"
      @navclick="onNavClick"
      @itemclick="onItemClick"
    />
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import { Toast } from "vant";

export default {
  data() {
    return {
      items: [],
      // 左侧高亮元素的index
      mainActiveIndex: 0,
      // 被选中元素的id
      activeId: 1,
      activeItem: ""
    };
  },
  components: {
    commonHeader
  },

  created() {
    let hospitalID = this.$store.state.DoctorInfoID.hospital.id;
    this.$http
      .request({
        method: "get",
        url: "/RDepartmentController/selectDepartment",
        body: {
          rhospitalid: hospitalID //hospitalID
        }
      })
      .then(res => {
        if (res.data.success) {
          this.items = res.data.data;
        } else {
          Toast(res.data.message);
        }
      })
      .catch(error => {
        Toast("刷新一下，或者检查网络连接");
      });
  },
  methods: {
    onNavClick(index) {
      this.mainActiveIndex = index;
    },
    onItemClick(data) {
      this.activeId = data.id;
      this.activeItem = data.text;
      //如果有三级
      if (data.children.length !== 0) {
        this.$router.push({
          name: "secondOffice",
          query: { items: JSON.stringify(data.children) }
        });
      } else {
        //二级

        this.$store.commit("DoctorInfoID/setOffice", {
          office: this.activeItem,
          id: this.activeId
        });

        this.$router.push({
          name: "infoID"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
// .van-tree-select__nav::-webkit-scrollbar,
// .van-tree-select__content::-webkit-scrollbar {
//   display: none;
// }

#selectOffice {
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: @backgroundColor;
  .padding(44, 12, 44, 12);
}

.van-tree-select {
  height: 100% !important;
  .margin(7, 0, 0, 0);

  // 清除激活状态边框
  .van-tree-select__nav-item {
    border: none;
    .fontSize(16);
    .padding(12, 0, 12, 10);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .lineHeight(20);
  }

  .van-tree-select__nav-item--active {
    color: @mainColor;
    background-color: @backgroundColor;
    font-weight: normal;
    border-bottom: none;
  }

  .van-tree-select__content {
    background-color: @backgroundColor;
  }

  .van-tree-select__nav {
    .fontSize(16);
    flex: 2;
    color: @titleColor;
    font-weight: normal;
    .borderRadius(10, 0, 0, 10);
  }

  .van-tree-select__item {
    .fontSize(16);
    color: @subtitleColor;
    font-weight: normal;
    .padding(12, 0, 12, 10);
    .lineHeight(20);
  }
}
</style>

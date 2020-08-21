/**
* @Description: 自定义字段组件
* @Author: 侯湃
* @Date: 2020/7/3
*/
<template>
  <div class="customFields_page">
    <div v-if="customFieldsType == '1' || customFieldsType == '2'" class="flex_box">
      <div class="input-box" @click.stop="$stopstop">
        <img src="../../../assets/image/icon-p-search.png" alt/>
        <input
            type="text"
            @click.stop="$stopstop"
            placeholder="搜索"
            v-model="searchText"/>
      </div>
      <ul class="value_list">
        <li v-for="(item,index) in customFieldsList"
            @click.stop="updateCustomFields(item)"
            v-if="item.search(searchText) != -1"
            :key="index">
          <span class="value_name">
            {{item || ""}}
          </span>
          <img
              v-if="isChecked(item)"
              src="../../../assets/image/selected.png"
              alt="">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    name: "customFields",
    props: {
      /**
       *@desc 自定义字段id
       */
      fieldId: {
        type: String,
        default() {
          return "";
        }
      },
      /**
       *@desc 自定义字段类型
       *@value 类型:0文本1单选2多选3日期
       */
      customFieldsType: {
        type: [String, Number],
        default() {
          return "1";
        }
      },
      customFieldsList: {
        type: Array,
        default() {
          return [];
        }
      },
      value: {
        type: [Date, Array, String],
        default() {
          return "";
        }
      }
    },
    data() {
      return {
        searchText: "",
        customFieldValue: [],
      };
    },
    methods: {
      /**
       * 搜索自定义字段
       * **/
      getSearchcustomFields() {
        if (!this.searchText) {
          this.fieldsList.forEach(item => {
            item.isShowSearch = true;
          });
          return false;
        } else {
          this.fieldsList.forEach(item => {
            item.isShowSearch = item.search(this.searchText) != -1;
          });
        }
      },
      /**
       * 更新自定义字段选值(单选/多选)
       * **/
      updateCustomFields(item) {
        let params = {
          id: this.fieldId,
          customFieldsType: this.customFieldsType
        };
        if (this.customFieldsType == "1") {
          params.value = [item];
          this.$emit("updateCustomFields", params);
        } else if (this.customFieldsType == "2") {
          if (this.customFieldValue.includes(item)) {
            let index = this.$getIndex(this.customFieldValue, item);
            if (index !== "undefined") {
              this.customFieldValue.splice(index, 1);
              params.value = this.customFieldValue;
            }
          } else {
            this.customFieldValue.push(item);
            params.value = this.customFieldValue;
          }
          this.$emit("updateCustomFields", params);
        }
      },
      /**
       * 自定义字段值是否被选中
       * **/
      isChecked(item) {
        let isChecked = this.customFieldValue.includes(item);
        return isChecked;
      }
    },
    created() {
      if (this.customFieldsType == "1" || this.customFieldsType == "2") {
        this.customFieldValue = this.value;
      }
    }
  };
</script>

<style scoped lang="less">
  .customFields_page {

    .flex_box {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    position: absolute;
    width: 180px;
    min-height: 100px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    bottom: 30px;
    left: 50px;
    z-index: 9999;
    overflow: hidden;

    .input-box {
      background: @mainBackgroundColor;
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      img {
        width: 21px;
        margin-right: 9px;
        margin-left: -6px;
      }

      input {
        flex: 1;
        width: 0;
        background: @mainBackgroundColor;
        font-size: 16px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 20px;
      }
    }

    .value_list {
      flex: 1;
      overflow-y: scroll;
      padding: 6px 8px;

      li {
        display: flex;
        padding: 6px 8px;
        align-items: center;
        justify-content: space-between;

        img.head {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        img {
          display: block;
          width: 20px;
          height: 20px;
        }

        .value_name {
          display: inline-block;
          padding: 0 6px;
          height: 24px;
          border-radius: 12px;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          background-color: #cfcfcf;
        }
      }
    }
  }
</style>

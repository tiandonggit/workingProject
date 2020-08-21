/**
* @Description: 任务添加自定义字段
* @Author: 侯湃
* @Date: 2020/6/23
*/
<template>
  <div class="addFields_page">
    <div class="input-box">
      <img src="../../../assets/image/icon-p-search.png" alt/>
      <input
          @click.stop="$stopstop"
          type="text"
          placeholder="搜索"
          v-model="searchText"
          @change="getSearchFields"/>
    </div>
    <ul class="fields_list">
      <li v-for="item in fidldsList"
          v-if="item.isShowSearch"
          @click.stop="fieldsUpadate(item)"
          :key="item.id">
        <span class="field_span" :style="setBgColor(item.type)">
          {{item.name || ""}}
        </span>
        <img v-if="fieldsIds.includes(item.id)" src="../../../assets/image/selected.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>

  import {projectSrv} from "../../../views/Project/project.service";

  export default {
    name: "addFields",
    props: {
      fieldsIds: {
        type: Array,
        default() {
          return [];
        }
      },
      projectId: {
        type: String,
        default() {
          return "";
        }
      }
    },
    data() {
      return {
        searchText: "",
        fidldsList: []
      };
    },
    methods: {
      /**
       * 更新任务标签
       * **/
      fieldsUpadate(fidldItem) {
        this.$emit("fieldsUpadate", fidldItem);
      },
      /**
       * 任务自定义字段搜索
       * **/
      getSearchFields() {
        if (!this.searchText) {
          this.fidldsList.forEach(item => {
            item.isShowSearch = true;
          });
          return false;
        } else {
          this.fidldsList.forEach(item => {
            item.isShowSearch = item.name.search(this.searchText) != -1;
          });
        }
      },
      /**
       * 获取自定义字段
       * **/
      getfidldsList() {
        let params = {
          doGroup: 0,
          projectId: this.projectId
        };
        projectSrv.getFields(params).then(response => {
          if (response.success) {
            let fidldsList = response.data || [];
            fidldsList.forEach(item => {
              item.isShowSearch = true;
            });
            this.fidldsList = fidldsList;
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 自定义字段背景色
       * **/
      setBgColor(type) {
        let bgColor = {};
        switch (type) {
          case 0:
            bgColor.background = "#aec945";
            break;
          case 1:
            bgColor.background = "#eb9658";
            break;
          case 2:
            bgColor.background = "#57c05d";
            break;
          case 3:
            bgColor.background = "#67a4dc";
            break;
          default:
            bgColor.background = "#cccccc";
        }
        return bgColor
      }
    },
    created() {
      this.getfidldsList();
    }
  };
</script>

<style scoped lang="less">
  .addFields_page {
    display: flex;
    flex-direction: column;
    position: absolute;
    min-width: 200px;
    min-height: 154px;
    max-height: 320px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    bottom: 30px;
    left: 90px;
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
      }

      input {
        flex: 1;
        width: 0;
        background: @mainBackgroundColor;
        font-size: 16px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 20px;
        margin-left: 10px;
      }
    }

    .fields_list {
      flex: 1;
      height: 0;
      overflow-y: scroll;
      padding: 10px 0;

      li {
        display: flex;
        padding: 6px 8px;
        align-items: center;
        justify-content: space-between;

        span {
          display: inline-block;
          /*min-width: 58px;*/
          height: 24px;
          border-radius: 12px;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
          font-weight: 400;
          color: @fontColorFFF;
          padding: 0 20px;
        }

        img {
          display: block;
          width: 18px;
          height: 18px;
        }
      }
    }
  }
</style>

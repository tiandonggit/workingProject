/**
* @Description: 标签选择组件
* @Author: 侯湃
* @Date: 2020/6/23
*/
<template>
  <div class="tagAdd_page">
    <div class="input-box">
      <img src="../../assets/image/icon-p-search.png" alt/>
      <input
          @click.stop="$stopstop"
          type="text"
          placeholder="搜索"
          v-model="searchText"
          @input="getSearchTag"/>
    </div>
    <ul class="tag_list">
      <li v-for="item in tagsList"
          v-if="item.isShowSearch"
          @click.stop="tagsUpadate(item)"
          :key="item.id">
        <span class="tag_span" :style="{backgroundColor:item.color}">
          {{item.name || ""}}
        </span>
        <img v-if="tagIds.includes(item.id)" src="../../assets/image/selected.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>

  import {projectSrv} from "../../views/Project/project.service";

  export default {
    name: "tagAdd",
    props: {
      tagIds: {
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
        tagsList: []
      };
    },
    methods: {
      /**
       * 更新任务标签
       * **/
      tagsUpadate(tagItem) {
        this.$emit("tagsUpadate", tagItem);
      },
      /**
       * 任务标签搜索
       * **/
      getSearchTag() {
        if (!this.searchText) {
          this.tagsList.forEach(item => {
            item.isShowSearch = true;
          });
          return false;
        } else {
          this.tagsList.forEach(item => {
            item.isShowSearch = item.name.search(this.searchText) != -1;
          });
        }
      },
      /**
       * 获取任务标签
       * **/
      getTagsList() {
        let params = {
          projectId:this.projectId,
          doGroup:0
        };
        projectSrv.selectTags(params).then(response => {
          if (response.success) {
            let tagsList = response.data || [];
            tagsList.forEach(item => {
              item.isShowSearch = true;
            });
            this.tagsList = tagsList;
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },
    created() {
      this.getTagsList();
    }
  };
</script>

<style scoped lang="less">
  .tagAdd_page {
    display: flex;
    flex-direction: column;
    position: absolute;
    min-width: 180px;
    min-height: 154px;
    max-height: 320px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    top: 30px;
    left: 4px;
    z-index: 9999;
    overflow: hidden;

    .input-box {
      background: @mainBackgroundColor;
      width: 100%;
      padding: 10px;
      display: flex;
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

    .tag_list {
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

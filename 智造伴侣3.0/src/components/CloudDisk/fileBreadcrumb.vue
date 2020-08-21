/**
* @Description: 网盘面包屑导航
* @Author: 侯湃
* @Date: 2020/6/15
*/
<template>
  <div class="fileBreadcrumb_page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
          v-for="(folder,index) in tagList"
          :class="[{'currentBreadcrumb':index === tagList.length - 1}]"
          :key="folder.folderId">
       <span @click.stop="breadcrumbChange(folder,index)">
          {{folder.folderName}}
       </span>
        <span class="search_result_tip" v-if="isAllSearch && searchText">
          <span class="separator">/</span>
          搜索 "<i>{{searchText}}</i>" 的结果
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "fileBreadcrumb",
    props: {
      tagList: {
        type: Array,
        default() {
          return [];
        }
      },
      isAllSearch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      searchText: {
        type: String,
        default() {
          return "";
        }
      }
    },
    data() {
      return {};
    },
    methods: {
      /**
       * 面包屑点击事件
       * **/
      breadcrumbChange(folder = {}, index = 0) {
        let params = {
          folderId: folder.folderId || "",
          index: index
        };
        if (index === this.tagList.length - 1 && !this.isAllSearch) return false;
        this.$emit("breadcrumbChange", params);
      }
    }
  };
</script>

<style scoped lang="less">
  .fileBreadcrumb_page {
    padding: 8px 0 0 0;

    /deep/ .el-breadcrumb__item {
      font-size: 14px;
      line-height: 18px;
      font-weight: bold;
      color: @mainFontColor;
    }

    /deep/ .currentBreadcrumb.el-breadcrumb__item {
      /deep/ .el-breadcrumb__inner {
        color: @barBackgroundColor;
      }

      /deep/ .search_result_tip {
        color: #606266 !important;

        i {
          color: @barBackgroundColor !important;
        }
      }

      /deep/ .separator {
        margin: 0 9px;
        font-weight: 700;
        color: #C0C4CC;
      }
    }

    /deep/ .el-breadcrumb__inner {
      span {
        cursor: pointer;
      }
    }
  }
</style>

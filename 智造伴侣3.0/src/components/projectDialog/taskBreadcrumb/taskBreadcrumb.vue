<template>
  <div class="taskBreadcrumb_page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
          v-for="(item,index) in breadcrumbList"
          :key="item.id">
       <span @click.stop="breadcrumbChange(item,index)">
          <i style="font-weight: bold" v-if="index === 0">父任务 </i>
          {{ item.name}}
       </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "taskBreadcrumb",
    props: {
      breadcrumbList: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      /**
       * 面包屑点击事件
       * **/
      breadcrumbChange(item = {}, index = 0) {
        let params = {
          id: item.id || "",
          index: index
        };
        this.$emit("breadcrumbChange", params);
      }
    }
  };
</script>

<style scoped lang="less">
  .taskBreadcrumb_page {
    padding: 0 0 10px 0;

    /deep/ .el-breadcrumb__item {
      font-size: 14px;
      line-height: 18px;
      font-weight: bold;
      color: @mainFontColor;
    }

    /deep/ .el-breadcrumb__separator {
      color: @titleColor!important;
    }

    /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__separator {
       display: inline-block;
    }

    /deep/ .el-breadcrumb__separator[class*=icon] {
      margin: 0 2px;
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
        color:@titleColor;
      }
    }

    /deep/ .el-breadcrumb__inner {
      span {
        cursor: pointer;
        font-size: 12px;
        color: @titleColor;
      }

      i {
        color: @titleColor;
        font-size: 14px;
      }
    }
  }
</style>

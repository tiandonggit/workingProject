/**
 *@desc 面包屑组件
 *@author houpai
 *@date 2019/12/05 08:52:35
 */
<template>
  <div class="breadcrumb_page">
    <ul>
      <li v-for="(item,index) in homeData.breadcrumb"
          @click="routerChange(item,index)"
          :class="[{'select':index === homeData.breadcrumb.length - 1 && index !== 0,'first':index ===  0,'firstSelect':index ===  0 && index === homeData.breadcrumb.length - 1}]"
          :key="index">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>

  import {mapState} from "vuex"

  export default {
    name: "breadcrumb",
    computed: {
      ...mapState(["homeData"]),
    },
    methods: {
      /**
       * 面包屑点击跳转路由
       * @params titleName 平台总览 省市地图名 其中省市地图名用作路由参数
       * @params index 用于同步vuex里的索引
       * **/
      routerChange(titleName, index) {
        let length = this.homeData.breadcrumb.length
        let breadcrumbArray = JSON.parse(JSON.stringify(this.homeData.breadcrumb))
        if (length === 3) {
          if (index === 1) {
            breadcrumbArray.pop()
            this.$store.commit("homeData/saveBreadcrumb", breadcrumbArray)
            this.$router.push({
              name: 'provinceMap',
              query: {
                provinceName: titleName
              }
            })
          } else if (index === 0) {
            breadcrumbArray.splice(1, 2)
            this.$store.commit("homeData/saveBreadcrumb", breadcrumbArray)
            this.$router.push({
              name: 'chinaMap'
            })
          }
        } else if (length === 2) {
          if (index === 0) {
            breadcrumbArray.pop()
            this.$store.commit("homeData/saveBreadcrumb", breadcrumbArray)
            this.$router.push({
              name: 'chinaMap'
            })
          }
        } else {
          let path = this.$route.path.replace(/\//g,'')
          if (path !== 'home') {
            this.$router.push({
              path: '/'
            })
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .breadcrumb_page {
    height: 45px;

    ul {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;

      .select {
        width: 209px;
        height: 100%;
        text-align: center;
        line-height: 45px;
        background: url("../../../assets/images/trapezoid3.png") no-repeat center;
        background-size: 100%;
      }

      .first {
        width: 209px;
        height: 100%;
        text-align: center;
        line-height: 45px;
        background: url("../../../assets/images/trapezoid1.png") no-repeat center;
        background-size: 100%;
      }

      .firstSelect {
        width: 209px;
        height: 100%;
        text-align: center;
        line-height: 45px;
        background: url("../../../assets/images/trapezoid2.png") no-repeat center;
        background-size: 100%;
      }

      li {
        width: 209px;
        height: 100%;
        text-align: center;
        line-height: 45px;
        background: url("../../../assets/images/trapezoid4.png") no-repeat center;
        background-size: 100%;
        font-size: 18px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
      }
    }
  }

</style>

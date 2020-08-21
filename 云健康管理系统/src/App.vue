<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  import {mapState} from "vuex"

  export default {
    computed: {
      ...mapState(["homeData"]),
    },
    watch:{
      /**
       * 地址栏输入formatHospitalData=true参数重置hospitalData**/
      $route(to, from) {
        let formatHospitalData = this.$route.query.formatHospitalData || false
        if(formatHospitalData) {
          window.clearInterval(window.timer)
          window.hospitalData = require('./resources/hospitalData/hospital');
          this.$store.commit("homeData/saveHospitalData", window.hospitalData)
          window.dataChangeTimer()
        }
      }
    },
    methods:{
      initBreadcrumbArray() {
        let breadcrumbArray = ['平台总览'];
        this.$store.commit("homeData/saveBreadcrumb", breadcrumbArray)
      }
    },
    mounted() {
      window.onpopstate = () => {
        if (!this.homeData.allowBack) {
          history.go(1)
        }
      }
      window.addEventListener('beforeunload', e => this.initBreadcrumbArray());
      this.$nextTick(() => {
        if(this.homeData.breadcrumb.length === 1) {
          this.$router.push({
            name: 'chinaMap'
          })
        }
      })
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.initBreadcrumbArray)
    }
  }
</script>

<style lang="less">
  #app {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: url("./assets/images/contentBackGround.png") no-repeat center;
    background-size: 100% 100%;
  }
</style>

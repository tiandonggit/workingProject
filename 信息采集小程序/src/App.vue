
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data() {
    return {
      isIphonex: false
    }
  },
  created() {
    // ios判定
    if (/iphone/gi.test(navigator.userAgent) && (screen.height >= 812 && screen.width === 375)) {
      this.isIphonex = true
    } else {
      this.isIphonex = false
    }
    if (this.isIphonex) {
      console.log('苹果')
      localStorage.setItem('myCat', 'Tom')
      console.log(this.$store.state.iphoneX)
      this.$store.commit('changeValue', true)
      console.log(this.$store.state.iphoneX)
    } else {
      console.log('安卓或ios x版本下')
    }
  },
  mounted() {
    // document.querySelector('body').setAttribute('style', 'background: #fffff')
    // ios判定
    if (/iphone/gi.test(navigator.userAgent) && (screen.height >= 812 && screen.width === 375)) {
      this.isIphonex = true
    } else {
      this.isIphonex = false
    }
    if (this.isIphonex) {
      console.log('苹果')
      console.log(this.$store.state.iphoneX)
      this.$store.commit('changeValue', true)
      console.log(this.$store.state.iphoneX)
    } else {
      console.log('安卓或ios x版本下')
    }
  }
})
</script>
<style>
html,body{
    width:100%;
    height:100%;
    background-color: #fff;
}

.kong{
  width: 100%;
  position: fixed;
  bottom:10px;
}
</style>

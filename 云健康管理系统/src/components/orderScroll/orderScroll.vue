/**
*@desc 医院订单滚动
*@author houpai
*@date 2019/12/05 13:45:48
*/
<template>
  <div id="box">
    <ul id="list1">
      <li v-for="(item,index) in orderList" :key="index">
        <p v-html="item"></p>
      </li>
    </ul>
    <ul id="list2"></ul>
    <!-- <vueSeamless :data="listData" class="seamless-warp">
       <ul class="item">
           <li v-for="(item,index) in listData" :key="index">
               <span class="title" v-text="item.title"></span><span class="date" v-text="item.date"></span>
           </li>
       </ul>
   </vueSeamless> -->
  </div>
</template>

<script>

  // import Vue from 'vue'
  // import scroll from 'vue-seamless-scroll'
  // Vue.use(scroll)
  // import vueSeamless from 'vue-seamless-scroll'

  export default {
    name: 'orderScroll',
    props: {
      orderList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        scrollMove: null
      }
    },
    methods: {
      scrollup(box, l1) {
        if (box.scrollTop >= l1.offsetHeight) {
          //滚动条距离顶部的值恰好等于list1的高度时，达到滚动临界点，此时将让scrollTop=0,让list1回到初始位置，实现无缝滚动
          box.scrollTop = 0
        } else {
          // box.scrollTop++
          let scrollTop = box.scrollTop + 1
          $('#box').scrollTop(scrollTop)
        }
      },
      init() {
        //   window.requestAnimationFrame(fn);
        let vm = this
        let box = document.getElementById("box")
        let l1 = document.getElementById("list1")
        let l2 = document.getElementById("list2")
        l2.innerHTML = l1.innerHTML //克隆list1的数据，使得list2和list1的数据一样
        vm.scrollMove = setInterval(() => {
          vm.scrollup(box, l1)
        }, 50) //数值越大，滚动速度越慢
        box.onmouseover = function () {
          clearInterval(vm.scrollMove)
        }
        box.onmouseout = function () {
          vm.scrollMove = setInterval(() => {
            vm.scrollup(box, l1)
          }, 50) //数值越大，滚动速度越慢
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    beforeDestroy() {
      clearInterval(this.scrollMove)
    }
  }
</script>

<style scoped lang="less">
  #box {
    width: 100%;
    height: 100%;
    overflow: hidden;

    #list1, #list2 {
      min-height: 100%;
    }

    li {
      width: 100%;
      text-align: center;
      padding: 10px 40px;
      font-size: 14px;
      font-weight: 400;
      color: #717E92;
      line-height: 25px;
    }
  }

  /*.seamless-warp {*/
  /*  height: 229px;*/
  /*  overflow: hidden;*/
  /*}*/
</style>
<style lang="less">
  #list1, #list2 {
    .orderPrice {
      color: red;
    }
  }
</style>

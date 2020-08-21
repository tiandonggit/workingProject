/**
*@desc 患者端IM跳转人工客服悬浮按钮
*@author houpai
*@date 2020/04/23 11:44:27
*/
<template>
  <div class="goSteward_page">
    <div class="drag"
         id="moveDiv"
         ref="moveDiv"
         @mousedown="down"
         @touchstart="down"
         @mousemove="move"
         @touchmove="move"
         @mouseup="end"
         @touchend="end"
    >
      <img src="../../../assets/images/chatIMDetail.png" alt="">
    </div>
  </div>
</template>

<script>

  // import {Toast} from "vant";

  export default {
    name: "goSteward",
    props: {},
    data() {
      return {
        flags: false,
        position: { x: 0, y: 0 },
        nx: "",
        ny: "",
        dx: "",
        dy: "",
        xPum: "",
        yPum: "",
      };
    },
    methods: {
      down() {
        this.flags = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.dx = moveDiv.offsetLeft;
        this.dy = moveDiv.offsetTop;
      },
      move() {
        if (this.flags) {
          var touch;
          if (event.touches) {
            touch = event.touches[0];
          } else {
            touch = event;
          }
          this.nx = touch.clientX - this.position.x;
          this.ny = touch.clientY - this.position.y;
          this.xPum = this.dx + this.nx;
          this.yPum = this.dy + this.ny;
          if(this.xPum<0) {
            this.xPum=0;
          }else if(this.xPum>document.documentElement.clientWidth - moveDiv.offsetWidth){
            this.xPum = document.documentElement.clientWidth - moveDiv.offsetWidth;
          }
          if(this.yPum<0) {
            this.yPum=0;
          }else if(this.yPum>document.documentElement.clientHeight- moveDiv.offsetHeight){
            this.yPum = document.documentElement.clientHeight - moveDiv.offsetHeight;
          }
          moveDiv.style.left = this.xPum + "px";
          moveDiv.style.top = this.yPum + "px";
          //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
          moveDiv.addEventListener(
            "touchmove",
            function() {
              event.preventDefault();
            },
            { passive: false }
          );
        }
      },
      //鼠标释放时候的函数
      end() {
        this.flags = false;
      },
      /**
       * 点击跳转到人工客服咨询
       * **/
      submitHandle() {
        this.$emit('goSteward');
      }
    }
  };
</script>

<style scoped lang="less">
  .goSteward_page {
    .drag {
      .width(66);
      .height(66);
      overflow: hidden;
      position: absolute;
      top: 60%;
      left: 78%;
      z-index: 10000;

      img {
        display: block;
        width: 100%;
        height: 100%;
        z-index: 9999;
      }
    }
  }
</style>
